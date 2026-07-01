import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'voice_of_vaja'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vaja2025admin'

let cachedClient = null
async function getDb() {
  if (cachedClient) return cachedClient.db(dbName)
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client.db(dbName)
}

function json(data, init = {}) { return NextResponse.json(data, init) }

function isAdmin(request) {
  const token = request.headers.get('x-admin-token') || ''
  return token === ADMIN_PASSWORD
}

// ------------------------------------------------------------------
// SEED DATA (used only if collections are empty)
// ------------------------------------------------------------------
const SEED = {
  site: {
    _id: 'site',
    welcome: {
      title: 'THE VOICE OF VAJA',
      subtitle: 'Singer • Songwriter • Playback Singer • Voice & Dubbing Artist',
      question: 'What would you like to explore?',
      bgImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    hero: {
      eyebrow: 'Music that Connects. Voices that Inspire.',
      titleLine1: 'A soulful voice,',
      titleLine2: 'multi-lingual at heart.',
      intro: 'First-generation independent musician, live performer & voice artist — Vaja weaves originals, playback and voice projects across Tamil, English, Hindi, Telugu & Malayalam. Guitar tuned to 432 Hz, always.',
      image: 'https://images.unsplash.com/photo-1527261834078-9b37d35a4a32?crop=entropy&cs=srgb&fm=jpg&q=85',
      floatingLabel: 'Mahi Way × CSK',
      floatingRight: 'Available for 2025',
    },
    about: {
      title: 'A soulful, 432 Hz journey — spanning stages, studios and screens.',
      paragraph1: 'A first-generation independent musician from Chennai, Vaja began his musical journey with a college band at MCC (2007–09), took a mindful sabbatical, and returned to the live music scene in 2018 with a renewed vision.',
      paragraph2: 'A trained photography professional, Vaja’s eye for musical detailing and arrangement is unmistakable. His live acts are known for a soulful vibe and a wholesome, organic experience — his guitar is deliberately tuned to 432 Hz, keeping the room in a positive frequency.',
      languages: ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'],
    },
    stats: [
      { label: 'Years Performing', value: 15, suffix: '+' },
      { label: 'Songs Released', value: 6, suffix: '' },
      { label: 'Live Shows', value: 120, suffix: '+' },
      { label: 'Voice Projects', value: 40, suffix: '+' },
      { label: 'Collaborations', value: 25, suffix: '+' },
      { label: 'Languages Performed', value: 5, suffix: '' },
    ],
    contact: {
      phone: '+91 98409 68714',
      email: 'thevoiceofvaja@gmail.com',
      instagram: 'thevoiceofvaja',
      instagramUrl: 'https://www.instagram.com/thevoiceofvaja',
      youtubeUrl: '',
      spotifyUrl: '',
      location: 'Chennai, India',
    },
    seo: {
      title: 'The Voice Of Vaja — Singer, Songwriter, Voice & Dubbing Artist',
      description: 'Official website of Vaja — originals, playback, live performances, voice-overs & dubbing across Tamil, English, Hindi, Telugu, Malayalam.',
    },
  },
  timeline: [
    { id: uuidv4(), order: 1, year: '2007–09', title: 'MCC College Band', desc: 'Began his musical journey as part of a college band at Madras Christian College, Chennai.' },
    { id: uuidv4(), order: 2, year: '2018', title: 'Return to Live Music', desc: 'After a musical sabbatical, Vaja returns to the live music scene with a renewed soulful vision.' },
    { id: uuidv4(), order: 3, year: '2019', title: 'The Underground Battle', desc: 'Part of the winning band in The Underground Battle 2019 (Light Music category).' },
    { id: uuidv4(), order: 4, year: '2019', title: '“Lucid Dream” Released', desc: 'First single, produced by A.R. Rahman’s KM Conservatory in The Indie Earth’s Indie100 2019 — released by Vermilion Records, USA.' },
    { id: uuidv4(), order: 5, year: '2019', title: 'Crescendo, Music Academy', desc: 'Performed at Music Academy for the Crescendo 2019 event conducted by Pioneer Suresh.' },
    { id: uuidv4(), order: 6, year: '2023', title: 'WOW Awards Asia', desc: 'Live act at WOW Awards Asia 2023, Jio Convention Centre, Mumbai.' },
    { id: uuidv4(), order: 7, year: '2024', title: '“Mahi Way” × Chennai Super Kings', desc: 'Official collaboration with CSK — a tribute song for M.S. Dhoni, featured on official CSK channels.' },
    { id: uuidv4(), order: 8, year: '2025', title: 'EP In Production', desc: 'A new EP is currently under production. Playback singing pursuits actively underway.' },
  ],
  songs: [
    { id: uuidv4(), title: 'Lucid Dream', role: 'Original • Singer / Songwriter', year: 2019, language: 'English', genre: 'Original', desc: 'First single, produced by A.R. Rahman’s KM Conservatory as part of The Indie Earth’s Indie100 2019. Released by Vermilion Records, USA.', image: 'https://images.pexels.com/photos/7802300/pexels-photo-7802300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tag: 'Vermilion Records, USA', audioUrl: '', videoUrl: '', streamUrl: '' },
    { id: uuidv4(), title: 'Mahi Way', role: 'Tribute • Chennai Super Kings', year: 2024, language: 'Hindi / Tamil', genre: 'Tribute', desc: 'An official collaboration with the Chennai Super Kings — a tribute song for M.S. Dhoni. Featured on the official CSK Instagram & YouTube channel.', image: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'CSK × Vaja', audioUrl: '', videoUrl: 'https://www.youtube.com/watch?v=', streamUrl: '' },
    { id: uuidv4(), title: 'Game On — Richo Rich', role: 'Playback / Featured', year: 2023, language: 'Tamil', genre: 'Film', desc: 'Featured vocalist for the Tamil release of “Game On — Richo Rich”.', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Playback', audioUrl: '', videoUrl: '', streamUrl: '' },
    { id: uuidv4(), title: 'Game On — Un Mooche', role: 'Playback / Featured', year: 2023, language: 'Tamil', genre: 'Film', desc: 'Featured vocalist for “Un Mooche” from the Game On series.', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Playback', audioUrl: '', videoUrl: '', streamUrl: '' },
    { id: uuidv4(), title: 'Thanimai Athu Varama', role: 'Original • Singer', year: 2022, language: 'Tamil', genre: 'Original', desc: 'An intimate Tamil original that captures solitude, longing and hope.', image: 'https://images.pexels.com/photos/7901950/pexels-photo-7901950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tag: 'Original', audioUrl: '', videoUrl: '', streamUrl: '' },
    { id: uuidv4(), title: 'EA — Ice Water Sports Arena', role: 'Commissioned Anthem', year: 2023, language: 'English', genre: 'Anthem', desc: 'A commissioned anthem crafted for the EA — Ice Water Sports Arena property.', image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Commissioned', audioUrl: '', videoUrl: '', streamUrl: '' },
  ],
  voiceProjects: [
    { id: uuidv4(), title: 'Corporate Brand Film', category: 'Corporate', language: 'English', desc: 'A warm, authoritative brand narration for a leading Indian corporate.', image: 'https://images.pexels.com/photos/7901950/pexels-photo-7901950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', audioUrl: '' },
    { id: uuidv4(), title: 'Cinematic Character Voice', category: 'Character', language: 'Tamil', desc: 'A distinctive character voice for a short film — recorded in-studio, Chennai.', image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?crop=entropy&cs=srgb&fm=jpg&q=85', audioUrl: '' },
    { id: uuidv4(), title: 'Multilingual TVC', category: 'Commercial', language: 'Multi', desc: 'National television commercial voiced in Tamil, Hindi and English.', image: 'https://images.pexels.com/photos/7802300/pexels-photo-7802300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', audioUrl: '' },
    { id: uuidv4(), title: 'OTT Series Dubbing', category: 'Dubbing', language: 'Tamil', desc: 'Full-length dubbing engagement for a streaming series (Tamil track).', image: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=srgb&fm=jpg&q=85', audioUrl: '' },
    { id: uuidv4(), title: 'Radio Jingle Pack', category: 'Commercial', language: 'English', desc: 'A vibrant jingle pack for a lifestyle FM property.', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=srgb&fm=jpg&q=85', audioUrl: '' },
    { id: uuidv4(), title: 'Explainer Voice Over', category: 'Corporate', language: 'English', desc: 'Product explainer for a SaaS launch — crisp, clear, on-brand.', image: 'https://images.pexels.com/photos/7901950/pexels-photo-7901950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', audioUrl: '' },
  ],
  gallery: [
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1527261834078-9b37d35a4a32?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Live', span: 'row-span-2' },
    { id: uuidv4(), src: 'https://images.pexels.com/photos/7802300/pexels-photo-7802300.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tag: 'Studio', span: '' },
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Concert', span: '' },
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Stage', span: 'col-span-2' },
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Portrait', span: '' },
    { id: uuidv4(), src: 'https://images.pexels.com/photos/7901950/pexels-photo-7901950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', tag: 'Session', span: '' },
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Live', span: '' },
    { id: uuidv4(), src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&q=85', tag: 'Performance', span: '' },
  ],
  testimonials: [
    { id: uuidv4(), name: 'Suresh Kumar', role: 'Event Curator, Music Academy Chennai', text: 'Vaja’s command over multiple languages and his sense of stage-craft makes him a rare artist to book. His Crescendo performance stayed with the audience long after the lights went down.', stars: 5 },
    { id: uuidv4(), name: 'Priya R.', role: 'Brand Manager, National TVC', text: 'Warm, versatile and lightning-fast in studio. Vaja delivered our multilingual TVC in a single session with three distinct emotional tones. Absolute professional.', stars: 5 },
    { id: uuidv4(), name: 'Karthik V.', role: 'Producer, Independent Films', text: 'He grasps tunes and character briefs at exceptional speed — a director’s dream. His voice carries a specific soul that lifts every project he touches.', stars: 5 },
    { id: uuidv4(), name: 'Ananya S.', role: 'Wedding & Corporate Curator', text: 'We book Vaja for our premium curations — his acoustic set genuinely elevates the room. Guests still ask for the artist afterwards.', stars: 5 },
  ],
  collaborators: [
    { id: uuidv4(), name: 'Chennai Super Kings' }, { id: uuidv4(), name: 'Vermilion Records, USA' }, { id: uuidv4(), name: 'KM Conservatory (A.R. Rahman)' },
    { id: uuidv4(), name: 'The Indie Earth' }, { id: uuidv4(), name: 'WOW Awards Asia' }, { id: uuidv4(), name: 'Jio Convention Centre' },
    { id: uuidv4(), name: 'Music Academy, Chennai' }, { id: uuidv4(), name: 'Pioneer Suresh' }, { id: uuidv4(), name: 'EA — Ice Water Sports Arena' },
    { id: uuidv4(), name: 'Radio City' }, { id: uuidv4(), name: 'Sun Music' }, { id: uuidv4(), name: 'Zee Tamil' },
  ],
  collabHighlights: [
    { id: uuidv4(), title: 'Chennai Super Kings', sub: 'Official Tribute — “Mahi Way”', desc: 'Collaborated on the tribute song for MSD, featured on CSK’s official Instagram and YouTube channels.' },
    { id: uuidv4(), title: 'Vermilion Records, USA', sub: 'Indie100 2019 — “Lucid Dream”', desc: 'First single released internationally, produced under A.R. Rahman’s KM Conservatory.' },
    { id: uuidv4(), title: 'WOW Awards Asia 2023', sub: 'Live Act — Jio Convention Centre', desc: 'Featured live performance at one of Asia’s largest experiential marketing awards.' },
  ],
}

async function ensureSeed(db) {
  const site = await db.collection('site').findOne({ _id: 'site' })
  if (!site) await db.collection('site').insertOne(SEED.site)
  // Each collection: only seed if empty
  const seedMap = [
    ['timeline', SEED.timeline],
    ['songs', SEED.songs],
    ['voiceProjects', SEED.voiceProjects],
    ['gallery', SEED.gallery],
    ['testimonials', SEED.testimonials],
    ['collaborators', SEED.collaborators],
    ['collabHighlights', SEED.collabHighlights],
  ]
  for (const [name, docs] of seedMap) {
    const count = await db.collection(name).countDocuments()
    if (count === 0) await db.collection(name).insertMany(docs)
  }
}

async function getContent(db) {
  await ensureSeed(db)
  const [site, timeline, songs, voiceProjects, gallery, testimonials, collaborators, collabHighlights] = await Promise.all([
    db.collection('site').findOne({ _id: 'site' }, { projection: { _id: 0 } }),
    db.collection('timeline').find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray(),
    db.collection('songs').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection('voiceProjects').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection('gallery').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection('testimonials').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection('collaborators').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection('collabHighlights').find({}, { projection: { _id: 0 } }).toArray(),
  ])
  return { site, timeline, songs, voiceProjects, gallery, testimonials, collaborators, collabHighlights }
}

const COLL_MAP = {
  songs: 'songs',
  'voice-projects': 'voiceProjects',
  timeline: 'timeline',
  gallery: 'gallery',
  testimonials: 'testimonials',
  collaborators: 'collaborators',
  'collab-highlights': 'collabHighlights',
}

async function handler(request, ctx) {
  const params = await ctx?.params
  const parts = params?.path || []
  const path = parts.join('/')
  const method = request.method

  try {
    if (path === '' || path === 'health') {
      return json({ ok: true, service: 'voice-of-vaja', time: new Date().toISOString() })
    }

    const db = await getDb()

    // ---------- ADMIN LOGIN ----------
    if (path === 'admin/login' && method === 'POST') {
      const body = await request.json()
      if (body.password === ADMIN_PASSWORD) {
        return json({ success: true, token: ADMIN_PASSWORD })
      }
      return json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ---------- PUBLIC CONTENT ----------
    if (path === 'content' && method === 'GET') {
      const content = await getContent(db)
      return json(content)
    }

    // ---------- SITE SINGLETON ----------
    if (path === 'site' && method === 'GET') {
      await ensureSeed(db)
      const site = await db.collection('site').findOne({ _id: 'site' }, { projection: { _id: 0 } })
      return json(site)
    }
    if (path === 'site' && method === 'PUT') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      const body = await request.json()
      delete body._id
      // Deep-merge nested objects so partial updates don't wipe other keys.
      const flat = {}
      for (const [k, v] of Object.entries(body)) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          for (const [kk, vv] of Object.entries(v)) flat[`${k}.${kk}`] = vv
        } else {
          flat[k] = v
        }
      }
      await db.collection('site').updateOne({ _id: 'site' }, { $set: flat }, { upsert: true })
      return json({ success: true })
    }

    // ---------- COLLECTIONS CRUD ----------
    // GET  /api/{collection}
    // POST /api/{collection} (admin) create
    // PUT  /api/{collection}/{id} (admin) update
    // DEL  /api/{collection}/{id} (admin) delete
    if (parts[0] && COLL_MAP[parts[0]]) {
      const col = db.collection(COLL_MAP[parts[0]])
      const id = parts[1]

      if (method === 'GET' && !id) {
        const items = await col.find({}, { projection: { _id: 0 } }).sort({ order: 1, _id: 1 }).toArray()
        return json({ items })
      }
      if (method === 'POST' && !id) {
        if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
        const body = await request.json()
        const doc = { id: uuidv4(), ...body }
        await col.insertOne(doc)
        const clean = { ...doc }; delete clean._id
        return json({ success: true, item: clean })
      }
      if (method === 'PUT' && id) {
        if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
        const body = await request.json()
        delete body._id
        await col.updateOne({ id }, { $set: body })
        return json({ success: true })
      }
      if (method === 'DELETE' && id) {
        if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
        await col.deleteOne({ id })
        return json({ success: true })
      }
    }

    // ---------- BOOKINGS ----------
    if (path === 'bookings' && method === 'POST') {
      const body = await request.json()
      const required = ['name', 'email', 'eventType']
      for (const f of required) if (!body[f]) return json({ error: `Missing field: ${f}` }, { status: 400 })
      const doc = {
        id: uuidv4(),
        name: body.name, company: body.company || '', email: body.email, phone: body.phone || '',
        eventType: body.eventType, date: body.date || '', location: body.location || '',
        budget: body.budget || '', message: body.message || '',
        createdAt: new Date().toISOString(), status: 'new',
      }
      await db.collection('bookings').insertOne(doc)
      return json({ success: true, id: doc.id })
    }
    if (path === 'bookings' && method === 'GET') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      const items = await db.collection('bookings').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray()
      return json({ items })
    }
    if (parts[0] === 'bookings' && parts[1] && method === 'PUT') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      const body = await request.json()
      await db.collection('bookings').updateOne({ id: parts[1] }, { $set: body })
      return json({ success: true })
    }
    if (parts[0] === 'bookings' && parts[1] && method === 'DELETE') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      await db.collection('bookings').deleteOne({ id: parts[1] })
      return json({ success: true })
    }

    // ---------- CONTACT ----------
    if (path === 'contact' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.email || !body.message) {
        return json({ error: 'Name, email, and message are required' }, { status: 400 })
      }
      const doc = { id: uuidv4(), name: body.name, email: body.email, subject: body.subject || '', message: body.message, createdAt: new Date().toISOString() }
      await db.collection('contacts').insertOne(doc)
      return json({ success: true, id: doc.id })
    }
    if (path === 'contact' && method === 'GET') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      const items = await db.collection('contacts').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(500).toArray()
      return json({ items })
    }
    if (parts[0] === 'contact' && parts[1] && method === 'DELETE') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      await db.collection('contacts').deleteOne({ id: parts[1] })
      return json({ success: true })
    }

    // ---------- MEDIA UPLOAD (base64 -> stored, returns data URL) ----------
    // For MVP we store as data URL directly in Mongo `media` collection
    if (path === 'media/upload' && method === 'POST') {
      if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 })
      const body = await request.json()
      if (!body.dataUrl) return json({ error: 'dataUrl required' }, { status: 400 })
      const doc = { id: uuidv4(), dataUrl: body.dataUrl, name: body.name || 'file', mime: body.mime || '', createdAt: new Date().toISOString() }
      await db.collection('media').insertOne(doc)
      return json({ success: true, id: doc.id, url: `/api/media/${doc.id}` })
    }
    if (parts[0] === 'media' && parts[1] && method === 'GET') {
      const item = await db.collection('media').findOne({ id: parts[1] })
      if (!item) return json({ error: 'Not found' }, { status: 404 })
      // Return the dataUrl as redirect / raw
      const m = item.dataUrl.match(/^data:(.*?);base64,(.*)$/)
      if (!m) return new NextResponse('Invalid', { status: 400 })
      const buf = Buffer.from(m[2], 'base64')
      return new NextResponse(buf, { status: 200, headers: { 'Content-Type': m[1], 'Cache-Control': 'public, max-age=31536000' } })
    }

    return json({ error: 'Not found', path, method }, { status: 404 })
  } catch (err) {
    console.error('API error:', err)
    return json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
