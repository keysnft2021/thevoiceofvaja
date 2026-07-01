#!/usr/bin/env python3
"""
Comprehensive backend test for The Voice Of Vaja API
Tests all endpoints as specified in the review request
"""

import requests
import base64
import json
import sys
from typing import Dict, Any

# Base URL from environment
BASE_URL = "https://vaja-vocal-hub.preview.emergentagent.com/api"
ADMIN_PASSWORD = "vaja2025admin"
TIMEOUT = 20

# Test results tracking
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
        test_results["errors"].append(f"{name}: {details}")

def test_health():
    """Test 1: HEALTH / ROOT endpoints"""
    print("\n=== TEST 1: HEALTH / ROOT ===")
    
    try:
        # Test GET /api
        resp = requests.get(f"{BASE_URL}", timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok") and data.get("service") == "voice-of-vaja" and "time" in data:
                log_test("GET /api", True, f"Response: {data}")
            else:
                log_test("GET /api", False, f"Invalid response structure: {data}")
        else:
            log_test("GET /api", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("GET /api", False, f"Exception: {str(e)}")
    
    try:
        # Test GET /api/health
        resp = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("ok") and data.get("service") == "voice-of-vaja" and "time" in data:
                log_test("GET /api/health", True, f"Response: {data}")
            else:
                log_test("GET /api/health", False, f"Invalid response structure: {data}")
        else:
            log_test("GET /api/health", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("GET /api/health", False, f"Exception: {str(e)}")

def test_seed_and_content():
    """Test 2: SEED + PUBLIC CONTENT"""
    print("\n=== TEST 2: SEED + PUBLIC CONTENT ===")
    
    try:
        resp = requests.get(f"{BASE_URL}/content", timeout=TIMEOUT)
        if resp.status_code != 200:
            log_test("GET /api/content", False, f"Status {resp.status_code}: {resp.text}")
            return None
        
        data = resp.json()
        
        # Check all required keys exist
        required_keys = ["site", "timeline", "songs", "voiceProjects", "gallery", "testimonials", "collaborators", "collabHighlights"]
        missing_keys = [k for k in required_keys if k not in data]
        if missing_keys:
            log_test("GET /api/content - keys", False, f"Missing keys: {missing_keys}")
            return None
        else:
            log_test("GET /api/content - keys", True, "All required keys present")
        
        # Check collections are non-empty
        for key in ["timeline", "songs", "voiceProjects", "gallery", "testimonials", "collaborators", "collabHighlights"]:
            if not data[key] or len(data[key]) == 0:
                log_test(f"GET /api/content - {key} non-empty", False, f"{key} is empty")
            else:
                log_test(f"GET /api/content - {key} non-empty", True, f"{key} has {len(data[key])} items")
        
        # Check site structure
        site = data.get("site", {})
        required_site_keys = ["hero", "welcome", "about", "stats", "contact"]
        missing_site = [k for k in required_site_keys if k not in site]
        if missing_site:
            log_test("GET /api/content - site structure", False, f"Missing site keys: {missing_site}")
        else:
            log_test("GET /api/content - site structure", True, "All site keys present")
        
        # Check for _id leakage (should use 'id' not '_id')
        has_id_leak = False
        for key in ["timeline", "songs", "voiceProjects", "gallery", "testimonials", "collaborators", "collabHighlights"]:
            for item in data[key]:
                if "_id" in item:
                    has_id_leak = True
                    log_test(f"GET /api/content - no _id in {key}", False, f"Found _id in {key} item: {item}")
                    break
        if not has_id_leak:
            log_test("GET /api/content - no _id leakage", True, "All items use 'id' field")
        
        # Check for real song titles
        songs = data.get("songs", [])
        expected_titles = ["Lucid Dream", "Mahi Way", "Game On — Richo Rich", "Thanimai Athu Varama"]
        found_titles = [s.get("title") for s in songs]
        missing_titles = [t for t in expected_titles if t not in found_titles]
        if missing_titles:
            log_test("GET /api/content - real song titles", False, f"Missing titles: {missing_titles}")
        else:
            log_test("GET /api/content - real song titles", True, f"Found all expected titles")
        
        return data
    except Exception as e:
        log_test("GET /api/content", False, f"Exception: {str(e)}")
        return None

def test_admin_login():
    """Test 3: ADMIN LOGIN"""
    print("\n=== TEST 3: ADMIN LOGIN ===")
    
    try:
        # Test wrong password
        resp = requests.post(f"{BASE_URL}/admin/login", json={"password": "wrong"}, timeout=TIMEOUT)
        if resp.status_code == 401:
            data = resp.json()
            if "error" in data:
                log_test("POST /api/admin/login - wrong password", True, f"Correctly rejected: {data}")
            else:
                log_test("POST /api/admin/login - wrong password", False, f"Missing error field: {data}")
        else:
            log_test("POST /api/admin/login - wrong password", False, f"Expected 401, got {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("POST /api/admin/login - wrong password", False, f"Exception: {str(e)}")
    
    try:
        # Test correct password
        resp = requests.post(f"{BASE_URL}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and data.get("token") == ADMIN_PASSWORD:
                log_test("POST /api/admin/login - correct password", True, f"Login successful: {data}")
                return data.get("token")
            else:
                log_test("POST /api/admin/login - correct password", False, f"Invalid response: {data}")
                return None
        else:
            log_test("POST /api/admin/login - correct password", False, f"Status {resp.status_code}: {resp.text}")
            return None
    except Exception as e:
        log_test("POST /api/admin/login - correct password", False, f"Exception: {str(e)}")
        return None

def test_site_singleton(token: str):
    """Test 4: SITE SINGLETON"""
    print("\n=== TEST 4: SITE SINGLETON ===")
    
    try:
        # GET /api/site
        resp = requests.get(f"{BASE_URL}/site", timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if "_id" in data:
                log_test("GET /api/site - no _id", False, f"Found _id in response: {data.keys()}")
            else:
                log_test("GET /api/site - no _id", True, "Site object has no _id")
            
            original_eyebrow = data.get("hero", {}).get("eyebrow", "")
            log_test("GET /api/site", True, f"Retrieved site object")
        else:
            log_test("GET /api/site", False, f"Status {resp.status_code}: {resp.text}")
            return
    except Exception as e:
        log_test("GET /api/site", False, f"Exception: {str(e)}")
        return
    
    try:
        # PUT /api/site without token
        resp = requests.put(f"{BASE_URL}/site", json={"hero": {"eyebrow": "Test"}}, timeout=TIMEOUT)
        if resp.status_code == 401:
            log_test("PUT /api/site - no token", True, "Correctly rejected without token")
        else:
            log_test("PUT /api/site - no token", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("PUT /api/site - no token", False, f"Exception: {str(e)}")
    
    try:
        # PUT /api/site with token
        headers = {"x-admin-token": token}
        resp = requests.put(f"{BASE_URL}/site", json={"hero": {"eyebrow": "Testing eyebrow"}}, headers=headers, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success"):
                log_test("PUT /api/site - with token", True, "Update successful")
                
                # Verify the change
                resp2 = requests.get(f"{BASE_URL}/site", timeout=TIMEOUT)
                if resp2.status_code == 200:
                    data2 = resp2.json()
                    if data2.get("hero", {}).get("eyebrow") == "Testing eyebrow":
                        log_test("PUT /api/site - verify change", True, "Field updated correctly")
                    else:
                        log_test("PUT /api/site - verify change", False, f"Field not updated: {data2.get('hero', {}).get('eyebrow')}")
                
                # Restore original
                resp3 = requests.put(f"{BASE_URL}/site", json={"hero": {"eyebrow": "Music that Connects. Voices that Inspire."}}, headers=headers, timeout=TIMEOUT)
                if resp3.status_code == 200:
                    log_test("PUT /api/site - restore", True, "Restored original eyebrow")
                else:
                    log_test("PUT /api/site - restore", False, f"Failed to restore: {resp3.status_code}")
            else:
                log_test("PUT /api/site - with token", False, f"No success field: {data}")
        else:
            log_test("PUT /api/site - with token", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("PUT /api/site - with token", False, f"Exception: {str(e)}")

def test_collection_crud(collection: str, token: str, sample_data: Dict[str, Any]):
    """Test CRUD operations for a collection"""
    print(f"\n=== TEST COLLECTION: {collection} ===")
    
    created_id = None
    
    try:
        # GET /api/{collection}
        resp = requests.get(f"{BASE_URL}/{collection}", timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if "items" in data and isinstance(data["items"], list):
                log_test(f"GET /api/{collection}", True, f"Retrieved {len(data['items'])} items")
            else:
                log_test(f"GET /api/{collection}", False, f"Invalid response structure: {data}")
        else:
            log_test(f"GET /api/{collection}", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test(f"GET /api/{collection}", False, f"Exception: {str(e)}")
    
    try:
        # POST /api/{collection} without token
        resp = requests.post(f"{BASE_URL}/{collection}", json=sample_data, timeout=TIMEOUT)
        if resp.status_code == 401:
            log_test(f"POST /api/{collection} - no token", True, "Correctly rejected without token")
        else:
            log_test(f"POST /api/{collection} - no token", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test(f"POST /api/{collection} - no token", False, f"Exception: {str(e)}")
    
    try:
        # POST /api/{collection} with token
        headers = {"x-admin-token": token}
        resp = requests.post(f"{BASE_URL}/{collection}", json=sample_data, headers=headers, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and "item" in data and "id" in data["item"]:
                created_id = data["item"]["id"]
                if isinstance(created_id, str):
                    log_test(f"POST /api/{collection} - with token", True, f"Created item with id: {created_id}")
                else:
                    log_test(f"POST /api/{collection} - with token", False, f"ID is not a string: {type(created_id)}")
            else:
                log_test(f"POST /api/{collection} - with token", False, f"Invalid response: {data}")
        else:
            log_test(f"POST /api/{collection} - with token", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test(f"POST /api/{collection} - with token", False, f"Exception: {str(e)}")
    
    if created_id:
        try:
            # PUT /api/{collection}/{id} with token
            headers = {"x-admin-token": token}
            update_data = {"title": "Updated Title"} if "title" in sample_data else {"name": "Updated Name"}
            resp = requests.put(f"{BASE_URL}/{collection}/{created_id}", json=update_data, headers=headers, timeout=TIMEOUT)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success"):
                    log_test(f"PUT /api/{collection}/{{id}}", True, "Update successful")
                    
                    # Verify the change
                    resp2 = requests.get(f"{BASE_URL}/{collection}", timeout=TIMEOUT)
                    if resp2.status_code == 200:
                        items = resp2.json().get("items", [])
                        updated_item = next((i for i in items if i.get("id") == created_id), None)
                        if updated_item:
                            field_updated = updated_item.get("title") == "Updated Title" or updated_item.get("name") == "Updated Name"
                            if field_updated:
                                log_test(f"PUT /api/{collection}/{{id}} - verify", True, "Field updated correctly")
                            else:
                                log_test(f"PUT /api/{collection}/{{id}} - verify", False, f"Field not updated: {updated_item}")
                        else:
                            log_test(f"PUT /api/{collection}/{{id}} - verify", False, "Item not found after update")
                else:
                    log_test(f"PUT /api/{collection}/{{id}}", False, f"No success field: {data}")
            else:
                log_test(f"PUT /api/{collection}/{{id}}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test(f"PUT /api/{collection}/{{id}}", False, f"Exception: {str(e)}")
        
        try:
            # DELETE /api/{collection}/{id} with token
            headers = {"x-admin-token": token}
            resp = requests.delete(f"{BASE_URL}/{collection}/{created_id}", headers=headers, timeout=TIMEOUT)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success"):
                    log_test(f"DELETE /api/{collection}/{{id}}", True, "Delete successful")
                    
                    # Verify removal
                    resp2 = requests.get(f"{BASE_URL}/{collection}", timeout=TIMEOUT)
                    if resp2.status_code == 200:
                        items = resp2.json().get("items", [])
                        deleted_item = next((i for i in items if i.get("id") == created_id), None)
                        if not deleted_item:
                            log_test(f"DELETE /api/{collection}/{{id}} - verify", True, "Item removed correctly")
                        else:
                            log_test(f"DELETE /api/{collection}/{{id}} - verify", False, "Item still exists after delete")
                else:
                    log_test(f"DELETE /api/{collection}/{{id}}", False, f"No success field: {data}")
            else:
                log_test(f"DELETE /api/{collection}/{{id}}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test(f"DELETE /api/{collection}/{{id}}", False, f"Exception: {str(e)}")

def test_bookings(token: str):
    """Test 6: BOOKINGS"""
    print("\n=== TEST 6: BOOKINGS ===")
    
    created_id = None
    
    try:
        # POST /api/bookings public (valid)
        booking_data = {
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@example.com",
            "eventType": "Live Concert",
            "location": "Chennai",
            "message": "Looking to book for a corporate event in March"
        }
        resp = requests.post(f"{BASE_URL}/bookings", json=booking_data, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and "id" in data:
                created_id = data["id"]
                log_test("POST /api/bookings - valid", True, f"Created booking with id: {created_id}")
            else:
                log_test("POST /api/bookings - valid", False, f"Invalid response: {data}")
        else:
            log_test("POST /api/bookings - valid", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("POST /api/bookings - valid", False, f"Exception: {str(e)}")
    
    try:
        # POST /api/bookings missing required fields
        resp = requests.post(f"{BASE_URL}/bookings", json={"name": "Test"}, timeout=TIMEOUT)
        if resp.status_code == 400:
            log_test("POST /api/bookings - missing fields", True, "Correctly rejected incomplete data")
        else:
            log_test("POST /api/bookings - missing fields", False, f"Expected 400, got {resp.status_code}")
    except Exception as e:
        log_test("POST /api/bookings - missing fields", False, f"Exception: {str(e)}")
    
    try:
        # GET /api/bookings without token
        resp = requests.get(f"{BASE_URL}/bookings", timeout=TIMEOUT)
        if resp.status_code == 401:
            log_test("GET /api/bookings - no token", True, "Correctly rejected without token")
        else:
            log_test("GET /api/bookings - no token", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("GET /api/bookings - no token", False, f"Exception: {str(e)}")
    
    try:
        # GET /api/bookings with token
        headers = {"x-admin-token": token}
        resp = requests.get(f"{BASE_URL}/bookings", headers=headers, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if "items" in data:
                found_booking = any(b.get("id") == created_id for b in data["items"])
                if found_booking:
                    log_test("GET /api/bookings - with token", True, f"Retrieved bookings including created one")
                else:
                    log_test("GET /api/bookings - with token", False, f"Created booking not found in list")
            else:
                log_test("GET /api/bookings - with token", False, f"Invalid response: {data}")
        else:
            log_test("GET /api/bookings - with token", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("GET /api/bookings - with token", False, f"Exception: {str(e)}")
    
    if created_id:
        try:
            # PUT /api/bookings/{id} with token
            headers = {"x-admin-token": token}
            resp = requests.put(f"{BASE_URL}/bookings/{created_id}", json={"status": "contacted"}, headers=headers, timeout=TIMEOUT)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success"):
                    log_test("PUT /api/bookings/{id}", True, "Update successful")
                    
                    # Verify via GET
                    resp2 = requests.get(f"{BASE_URL}/bookings", headers=headers, timeout=TIMEOUT)
                    if resp2.status_code == 200:
                        items = resp2.json().get("items", [])
                        updated = next((b for b in items if b.get("id") == created_id), None)
                        if updated and updated.get("status") == "contacted":
                            log_test("PUT /api/bookings/{id} - verify", True, "Status updated correctly")
                        else:
                            log_test("PUT /api/bookings/{id} - verify", False, f"Status not updated: {updated}")
                else:
                    log_test("PUT /api/bookings/{id}", False, f"No success field: {data}")
            else:
                log_test("PUT /api/bookings/{id}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test("PUT /api/bookings/{id}", False, f"Exception: {str(e)}")
        
        try:
            # DELETE /api/bookings/{id} with token
            headers = {"x-admin-token": token}
            resp = requests.delete(f"{BASE_URL}/bookings/{created_id}", headers=headers, timeout=TIMEOUT)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success"):
                    log_test("DELETE /api/bookings/{id}", True, "Delete successful")
                    
                    # Verify removal
                    resp2 = requests.get(f"{BASE_URL}/bookings", headers=headers, timeout=TIMEOUT)
                    if resp2.status_code == 200:
                        items = resp2.json().get("items", [])
                        deleted = next((b for b in items if b.get("id") == created_id), None)
                        if not deleted:
                            log_test("DELETE /api/bookings/{id} - verify", True, "Booking removed correctly")
                        else:
                            log_test("DELETE /api/bookings/{id} - verify", False, "Booking still exists")
                else:
                    log_test("DELETE /api/bookings/{id}", False, f"No success field: {data}")
            else:
                log_test("DELETE /api/bookings/{id}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test("DELETE /api/bookings/{id}", False, f"Exception: {str(e)}")

def test_contact(token: str):
    """Test 7: CONTACT"""
    print("\n=== TEST 7: CONTACT ===")
    
    created_id = None
    
    try:
        # POST /api/contact public (valid)
        contact_data = {
            "name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "message": "I would like to collaborate on a music project"
        }
        resp = requests.post(f"{BASE_URL}/contact", json=contact_data, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and "id" in data:
                created_id = data["id"]
                log_test("POST /api/contact - valid", True, f"Created contact with id: {created_id}")
            else:
                log_test("POST /api/contact - valid", False, f"Invalid response: {data}")
        else:
            log_test("POST /api/contact - valid", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("POST /api/contact - valid", False, f"Exception: {str(e)}")
    
    try:
        # POST /api/contact missing message
        resp = requests.post(f"{BASE_URL}/contact", json={"name": "Test", "email": "test@test.com"}, timeout=TIMEOUT)
        if resp.status_code == 400:
            log_test("POST /api/contact - missing message", True, "Correctly rejected incomplete data")
        else:
            log_test("POST /api/contact - missing message", False, f"Expected 400, got {resp.status_code}")
    except Exception as e:
        log_test("POST /api/contact - missing message", False, f"Exception: {str(e)}")
    
    try:
        # GET /api/contact without token
        resp = requests.get(f"{BASE_URL}/contact", timeout=TIMEOUT)
        if resp.status_code == 401:
            log_test("GET /api/contact - no token", True, "Correctly rejected without token")
        else:
            log_test("GET /api/contact - no token", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("GET /api/contact - no token", False, f"Exception: {str(e)}")
    
    try:
        # GET /api/contact with token
        headers = {"x-admin-token": token}
        resp = requests.get(f"{BASE_URL}/contact", headers=headers, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if "items" in data:
                log_test("GET /api/contact - with token", True, f"Retrieved {len(data['items'])} contacts")
            else:
                log_test("GET /api/contact - with token", False, f"Invalid response: {data}")
        else:
            log_test("GET /api/contact - with token", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("GET /api/contact - with token", False, f"Exception: {str(e)}")
    
    if created_id:
        try:
            # DELETE /api/contact/{id} with token
            headers = {"x-admin-token": token}
            resp = requests.delete(f"{BASE_URL}/contact/{created_id}", headers=headers, timeout=TIMEOUT)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success"):
                    log_test("DELETE /api/contact/{id}", True, "Delete successful")
                    
                    # Verify removal
                    resp2 = requests.get(f"{BASE_URL}/contact", headers=headers, timeout=TIMEOUT)
                    if resp2.status_code == 200:
                        items = resp2.json().get("items", [])
                        deleted = next((c for c in items if c.get("id") == created_id), None)
                        if not deleted:
                            log_test("DELETE /api/contact/{id} - verify", True, "Contact removed correctly")
                        else:
                            log_test("DELETE /api/contact/{id} - verify", False, "Contact still exists")
                else:
                    log_test("DELETE /api/contact/{id}", False, f"No success field: {data}")
            else:
                log_test("DELETE /api/contact/{id}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test("DELETE /api/contact/{id}", False, f"Exception: {str(e)}")

def test_media_upload(token: str):
    """Test 8: MEDIA UPLOAD"""
    print("\n=== TEST 8: MEDIA UPLOAD ===")
    
    created_id = None
    
    try:
        # POST /api/media/upload without token
        resp = requests.post(f"{BASE_URL}/media/upload", json={"dataUrl": "test"}, timeout=TIMEOUT)
        if resp.status_code == 401:
            log_test("POST /api/media/upload - no token", True, "Correctly rejected without token")
        else:
            log_test("POST /api/media/upload - no token", False, f"Expected 401, got {resp.status_code}")
    except Exception as e:
        log_test("POST /api/media/upload - no token", False, f"Exception: {str(e)}")
    
    try:
        # Create a tiny PNG (1x1 red pixel)
        png_bytes = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==")
        data_url = f"data:image/png;base64,{base64.b64encode(png_bytes).decode()}"
        
        # POST /api/media/upload with token
        headers = {"x-admin-token": token}
        upload_data = {
            "dataUrl": data_url,
            "name": "test.png",
            "mime": "image/png"
        }
        resp = requests.post(f"{BASE_URL}/media/upload", json=upload_data, headers=headers, timeout=TIMEOUT)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and "id" in data and "url" in data:
                created_id = data["id"]
                media_url = data["url"]
                log_test("POST /api/media/upload - with token", True, f"Uploaded media with id: {created_id}, url: {media_url}")
            else:
                log_test("POST /api/media/upload - with token", False, f"Invalid response: {data}")
        else:
            log_test("POST /api/media/upload - with token", False, f"Status {resp.status_code}: {resp.text}")
    except Exception as e:
        log_test("POST /api/media/upload - with token", False, f"Exception: {str(e)}")
    
    if created_id:
        try:
            # GET /api/media/{id} (public)
            resp = requests.get(f"{BASE_URL}/media/{created_id}", timeout=TIMEOUT)
            if resp.status_code == 200:
                content_type = resp.headers.get("Content-Type", "")
                if "image/png" in content_type:
                    # Verify the bytes match
                    if len(resp.content) == len(png_bytes):
                        log_test("GET /api/media/{id}", True, f"Retrieved media with correct Content-Type and size")
                    else:
                        log_test("GET /api/media/{id}", False, f"Size mismatch: expected {len(png_bytes)}, got {len(resp.content)}")
                else:
                    log_test("GET /api/media/{id}", False, f"Wrong Content-Type: {content_type}")
            else:
                log_test("GET /api/media/{id}", False, f"Status {resp.status_code}: {resp.text}")
        except Exception as e:
            log_test("GET /api/media/{id}", False, f"Exception: {str(e)}")
    
    try:
        # GET /api/media/{unknown-id}
        resp = requests.get(f"{BASE_URL}/media/unknown-id-12345", timeout=TIMEOUT)
        if resp.status_code == 404:
            log_test("GET /api/media/{unknown-id}", True, "Correctly returned 404 for unknown ID")
        else:
            log_test("GET /api/media/{unknown-id}", False, f"Expected 404, got {resp.status_code}")
    except Exception as e:
        log_test("GET /api/media/{unknown-id}", False, f"Exception: {str(e)}")

def test_404():
    """Test 9: 404 / METHOD HANDLING"""
    print("\n=== TEST 9: 404 / METHOD HANDLING ===")
    
    try:
        resp = requests.get(f"{BASE_URL}/does-not-exist", timeout=TIMEOUT)
        if resp.status_code == 404:
            log_test("GET /api/does-not-exist", True, "Correctly returned 404")
        else:
            log_test("GET /api/does-not-exist", False, f"Expected 404, got {resp.status_code}")
    except Exception as e:
        log_test("GET /api/does-not-exist", False, f"Exception: {str(e)}")

def main():
    print("=" * 80)
    print("BACKEND TEST SUITE FOR THE VOICE OF VAJA")
    print(f"Base URL: {BASE_URL}")
    print("=" * 80)
    
    # Run all tests
    test_health()
    content_data = test_seed_and_content()
    token = test_admin_login()
    
    if token:
        test_site_singleton(token)
        
        # Test collections
        collections = {
            "songs": {"title": "Test Song", "role": "Test", "year": 2025, "language": "English", "genre": "Test"},
            "voice-projects": {"title": "Test Voice Project", "category": "Test", "language": "English", "desc": "Test description"},
            "timeline": {"order": 999, "year": "2025", "title": "Test Event", "desc": "Test description"},
            "gallery": {"src": "https://example.com/test.jpg", "tag": "Test", "span": ""},
            "testimonials": {"name": "Test Person", "role": "Test Role", "text": "Test testimonial", "stars": 5},
            "collaborators": {"name": "Test Collaborator"},
            "collab-highlights": {"title": "Test Collab", "sub": "Test Sub", "desc": "Test description"}
        }
        
        for coll, sample in collections.items():
            test_collection_crud(coll, token, sample)
        
        test_bookings(token)
        test_contact(token)
        test_media_upload(token)
    else:
        print("\n⚠️  Skipping admin-protected tests due to login failure")
    
    test_404()
    
    # Print summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"Total: {test_results['passed'] + test_results['failed']}")
    
    if test_results['errors']:
        print("\n❌ FAILED TESTS:")
        for error in test_results['errors']:
            print(f"  - {error}")
    
    print("=" * 80)
    
    # Exit with appropriate code
    sys.exit(0 if test_results['failed'] == 0 else 1)

if __name__ == "__main__":
    main()
