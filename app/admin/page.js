'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { toast, Toaster } from 'sonner'
import {
  Lock, LogOut, LayoutDashboard, Home, User, Music2, Mic2, Image as ImgIcon,
  Users, Star, Phone, CalendarCheck, Mail, Plus, Trash2, Save, Upload, Eye, EyeOff,
  ArrowLeft, Settings, Loader2, Link as LinkIcon
} from 'lucide-react'

const TOKEN_KEY = 'vaja_admin_token'

function useAdminAuth() {
  const [token, setToken] = useState(null)
  useEffect(() => { setToken(localStorage.getItem(TOKEN_KEY)) }, [])
  const login = (t) => { localStorage.setItem(TOKEN_KEY, t); setToken(t) }
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(null) }
  return { token, login, logout }
}

async function api(path, opts = {}, token) {
  const res = await fetch(`/api/${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-admin-token': token } : {}),
      ...(opts.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// ------------------ LOGIN ------------------
function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api('admin/login', { method: 'POST', body: JSON.stringify({ password: pw }) })
      onLogin(data.token)
      toast.success('Welcome back.')
    } catch (err) { toast.error(err.message || 'Invalid password') }
    finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(228,206,138,0.25), transparent 60%)' }} />
      </div>
      <form onSubmit={submit} className="relative z-10 w-full max-w-md mx-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-gold">
            <span className="h-px w-8 bg-gold" /> Admin Access <span className="h-px w-8 bg-gold" />
          </div>
          <h1 className="mt-4 font-serif text-4xl text-ivory">The Voice Of Vaja</h1>
          <p className="mt-2 text-beige/70 text-sm">Sign in to manage your content.</p>
        </div>
        <div className="rounded-3xl bg-navy-soft/70 backdrop-blur border border-gold/20 p-8">
          <label className="text-[10px] tracking-widest uppercase text-beige/60">Password</label>
          <div className="relative mt-1">
            <Lock className="w-4 h-4 absolute left-0 top-3 text-beige/50" />
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-transparent border-b border-ivory/25 pl-6 pr-8 py-2 focus:outline-none focus:border-gold text-ivory placeholder:text-beige/30"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-3 text-beige/50 hover:text-ivory">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button disabled={loading} className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold text-navy py-3 text-sm font-medium hover:opacity-90 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter Dashboard'}
          </button>
          <a href="/" className="mt-4 flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-beige/60 hover:text-gold">
            <ArrowLeft className="w-3 h-3" /> Back to site
          </a>
        </div>
      </form>
    </div>
  )
}

// ------------------ UI PRIMITIVES ------------------
function Card({ title, subtitle, children, actions }) {
  return (
    <section className="bg-white rounded-2xl border border-beige-2 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-navy">{title}</h2>
          {subtitle ? <p className="text-sm text-navy/60 mt-1">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

function Field({ label, value, onChange, type = 'text', textarea, rows = 3, placeholder }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-navy/60">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="mt-1 w-full bg-white border border-beige-2 rounded-xl px-3 py-2.5 focus:outline-none focus:border-navy resize-none text-sm" />
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="mt-1 w-full bg-white border border-beige-2 rounded-xl px-3 py-2.5 focus:outline-none focus:border-navy text-sm" />
      )}
    </div>
  )
}

function MediaField({ label, value, onChange, token, accept = 'image/*' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) { toast.error('Max 8MB'); return }
    setUploading(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = reject
        r.readAsDataURL(file)
      })
      const res = await api('media/upload', {
        method: 'POST',
        body: JSON.stringify({ dataUrl, name: file.name, mime: file.type }),
      }, token)
      onChange(res.url)
      toast.success('Uploaded')
    } catch (err) { toast.error(err.message || 'Upload failed') }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  const isImg = accept.startsWith('image')
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-navy/60">{label}</label>
      <div className="mt-1 flex items-start gap-3">
        {value && isImg ? (
          <img src={value} alt="" className="w-20 h-20 object-cover rounded-xl border border-beige-2" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-beige/50 border border-dashed border-beige-2 flex items-center justify-center text-navy/40">
            <ImgIcon className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Paste URL or upload"
            className="w-full bg-white border border-beige-2 rounded-xl px-3 py-2 focus:outline-none focus:border-navy text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              className="text-xs inline-flex items-center gap-1.5 rounded-full bg-navy text-ivory px-3 py-1.5 hover:bg-navy-soft disabled:opacity-60">
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? 'Uploading' : 'Upload'}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange('')} className="text-xs inline-flex items-center gap-1.5 rounded-full border border-beige-2 text-navy/70 px-3 py-1.5 hover:border-navy">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            ) : null}
          </div>
          <input ref={inputRef} type="file" accept={accept} onChange={onFile} className="hidden" />
        </div>
      </div>
    </div>
  )
}

function Row({ children, cols = 2 }) {
  return <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>{children}</div>
}

// ------------------ SECTIONS ------------------
function SiteEditor({ site, setSite, save }) {
  const s = site || {}
  const patch = (key, val) => setSite({ ...s, [key]: { ...(s[key] || {}), ...val } })

  return (
    <div className="space-y-6">
      <Card title="Welcome Screen" subtitle="The immersive entry experience." actions={<button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>}>
        <Row cols={2}>
          <Field label="Main Title" value={s.welcome?.title} onChange={(v) => patch('welcome', { title: v })} />
          <Field label="Question" value={s.welcome?.question} onChange={(v) => patch('welcome', { question: v })} />
          <Field label="Subtitle" value={s.welcome?.subtitle} onChange={(v) => patch('welcome', { subtitle: v })} />
          <MediaField label="Background Image" value={s.welcome?.bgImage} onChange={(v) => patch('welcome', { bgImage: v })} token={site?._token} />
        </Row>
      </Card>

      <Card title="Homepage Hero" actions={<button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>}>
        <Row cols={2}>
          <Field label="Eyebrow (Tagline)" value={s.hero?.eyebrow} onChange={(v) => patch('hero', { eyebrow: v })} />
          <MediaField label="Hero Portrait" value={s.hero?.image} onChange={(v) => patch('hero', { image: v })} token={site?._token} />
          <Field label="Title Line 1" value={s.hero?.titleLine1} onChange={(v) => patch('hero', { titleLine1: v })} />
          <Field label="Title Line 2 (italic)" value={s.hero?.titleLine2} onChange={(v) => patch('hero', { titleLine2: v })} />
        </Row>
        <div className="mt-4">
          <Field label="Intro Paragraph" textarea rows={3} value={s.hero?.intro} onChange={(v) => patch('hero', { intro: v })} />
        </div>
        <Row cols={2}>
          <Field label="Floating Card (Now Playing)" value={s.hero?.floatingLabel} onChange={(v) => patch('hero', { floatingLabel: v })} />
          <Field label="Floating Card (Availability)" value={s.hero?.floatingRight} onChange={(v) => patch('hero', { floatingRight: v })} />
        </Row>
      </Card>

      <Card title="About Section" actions={<button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>}>
        <Field label="About Title" textarea rows={2} value={s.about?.title} onChange={(v) => patch('about', { title: v })} />
        <div className="mt-4"><Field label="Paragraph 1" textarea rows={3} value={s.about?.paragraph1} onChange={(v) => patch('about', { paragraph1: v })} /></div>
        <div className="mt-4"><Field label="Paragraph 2" textarea rows={3} value={s.about?.paragraph2} onChange={(v) => patch('about', { paragraph2: v })} /></div>
        <div className="mt-4">
          <Field label="Languages (comma-separated)" value={(s.about?.languages || []).join(', ')}
            onChange={(v) => patch('about', { languages: v.split(',').map(x => x.trim()).filter(Boolean) })} />
        </div>
      </Card>

      <Card title="Statistics" subtitle="Numbers shown on the homepage." actions={
        <div className="flex gap-2">
          <button onClick={() => setSite({ ...s, stats: [...(s.stats || []), { label: 'New Stat', value: 0, suffix: '' }] })}
            className="rounded-full bg-beige text-navy text-xs px-3 py-2 inline-flex items-center gap-1.5"><Plus className="w-3 h-3" /> Add</button>
          <button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>
        </div>
      }>
        <div className="grid md:grid-cols-2 gap-3">
          {(s.stats || []).map((st, i) => (
            <div key={i} className="rounded-xl border border-beige-2 p-3 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-6"><Field label="Label" value={st.label} onChange={(v) => { const arr = [...s.stats]; arr[i] = { ...arr[i], label: v }; setSite({ ...s, stats: arr }) }} /></div>
              <div className="col-span-3"><Field label="Value" type="number" value={st.value} onChange={(v) => { const arr = [...s.stats]; arr[i] = { ...arr[i], value: Number(v) || 0 }; setSite({ ...s, stats: arr }) }} /></div>
              <div className="col-span-2"><Field label="Suffix" value={st.suffix} onChange={(v) => { const arr = [...s.stats]; arr[i] = { ...arr[i], suffix: v }; setSite({ ...s, stats: arr }) }} /></div>
              <button onClick={() => { const arr = s.stats.filter((_, k) => k !== i); setSite({ ...s, stats: arr }) }} className="col-span-1 h-10 rounded-lg text-navy/60 hover:text-red-600 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Contact & Social" actions={<button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>}>
        <Row cols={2}>
          <Field label="Phone" value={s.contact?.phone} onChange={(v) => patch('contact', { phone: v })} />
          <Field label="Email" value={s.contact?.email} onChange={(v) => patch('contact', { email: v })} />
          <Field label="Instagram handle (no @)" value={s.contact?.instagram} onChange={(v) => patch('contact', { instagram: v })} />
          <Field label="Instagram URL" value={s.contact?.instagramUrl} onChange={(v) => patch('contact', { instagramUrl: v })} />
          <Field label="YouTube URL" value={s.contact?.youtubeUrl} onChange={(v) => patch('contact', { youtubeUrl: v })} />
          <Field label="Spotify URL" value={s.contact?.spotifyUrl} onChange={(v) => patch('contact', { spotifyUrl: v })} />
          <Field label="Location" value={s.contact?.location} onChange={(v) => patch('contact', { location: v })} />
        </Row>
      </Card>

      <Card title="SEO Settings" actions={<button onClick={save} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>}>
        <Row cols={1}>
          <Field label="Page Title" value={s.seo?.title} onChange={(v) => patch('seo', { title: v })} />
          <Field label="Meta Description" textarea rows={2} value={s.seo?.description} onChange={(v) => patch('seo', { description: v })} />
        </Row>
      </Card>
    </div>
  )
}

// ------------------ COLLECTION MANAGER ------------------
function CollectionManager({ title, subtitle, endpoint, token, fields, emptyItem, onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const data = await api(endpoint); setItems(data.items || []) }
    catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [endpoint])

  async function saveItem(item) {
    try {
      if (item._new) {
        const { _new, ...body } = item
        const res = await api(endpoint, { method: 'POST', body: JSON.stringify(body) }, token)
        toast.success('Created')
        await load(); setExpanded(res.item?.id || null); onChanged?.()
      } else {
        await api(`${endpoint}/${item.id}`, { method: 'PUT', body: JSON.stringify(item) }, token)
        toast.success('Saved')
        onChanged?.()
      }
    } catch (e) { toast.error(e.message) }
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return
    try { await api(`${endpoint}/${id}`, { method: 'DELETE' }, token); toast.success('Deleted'); await load(); onChanged?.() }
    catch (e) { toast.error(e.message) }
  }

  function addItem() {
    const newItem = { _new: true, id: 'new-' + Date.now(), ...emptyItem }
    setItems([newItem, ...items])
    setExpanded(newItem.id)
  }

  const update = (id, patch) => setItems(items.map((it) => it.id === id ? { ...it, ...patch } : it))

  return (
    <Card title={title} subtitle={subtitle} actions={
      <button onClick={addItem} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Plus className="w-3 h-3" /> Add</button>
    }>
      {loading ? (
        <div className="text-center py-10 text-navy/50"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-navy/50 text-sm">No items yet. Click Add to create one.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="border border-beige-2 rounded-xl overflow-hidden">
              <div className="w-full flex items-stretch hover:bg-beige/40">
                <button
                  onClick={() => setExpanded(expanded === it.id ? null : it.id)}
                  className="flex-1 flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {it.image || it.src ? (<img src={it.image || it.src} alt="" className="w-10 h-10 rounded-lg object-cover" />) : (
                      <div className="w-10 h-10 rounded-lg bg-beige border border-beige-2 flex items-center justify-center text-navy/40"><ImgIcon className="w-4 h-4" /></div>
                    )}
                    <div className="text-left min-w-0">
                      <div className="font-medium text-navy truncate">{it.title || it.name || it.tag || it.year || 'Untitled'}</div>
                      <div className="text-xs text-navy/50 truncate">{it.role || it.category || it.desc || it.text || ''}</div>
                    </div>
                  </div>
                  <span className="text-navy/40 text-xs ml-3">{expanded === it.id ? 'Close' : 'Edit'}</span>
                </button>
                {!it._new && (
                  <button
                    onClick={() => deleteItem(it.id)}
                    className="w-11 flex items-center justify-center text-navy/50 hover:text-red-600 hover:bg-red-50 border-l border-beige-2"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {expanded === it.id && (
                <div className="p-4 border-t border-beige-2 bg-beige/20 space-y-4">
                  <Row cols={2}>
                    {fields.map((f) => (
                      <div key={f.key} className={f.full ? 'md:col-span-2' : ''}>
                        {f.type === 'media' ? (
                          <MediaField label={f.label} value={it[f.key]} onChange={(v) => update(it.id, { [f.key]: v })} token={token} accept={f.accept || 'image/*'} />
                        ) : f.type === 'textarea' ? (
                          <Field label={f.label} textarea rows={f.rows || 3} value={it[f.key]} onChange={(v) => update(it.id, { [f.key]: v })} />
                        ) : f.type === 'select' ? (
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-navy/60">{f.label}</label>
                            <select value={it[f.key] || ''} onChange={(e) => update(it.id, { [f.key]: e.target.value })}
                              className="mt-1 w-full bg-white border border-beige-2 rounded-xl px-3 py-2.5 focus:outline-none focus:border-navy text-sm">
                              <option value="">Select…</option>
                              {f.options.map((o) => (<option key={o} value={o}>{o}</option>))}
                            </select>
                          </div>
                        ) : (
                          <Field label={f.label} type={f.type || 'text'} value={it[f.key]} onChange={(v) => update(it.id, { [f.key]: f.type === 'number' ? Number(v) || 0 : v })} />
                        )}
                      </div>
                    ))}
                  </Row>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => saveItem(it)} className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5"><Save className="w-3 h-3" /> Save</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ------------------ BOOKINGS ------------------
function BookingsView({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const load = async () => { setLoading(true); try { const d = await api('bookings', {}, token); setItems(d.items || []) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  async function del(id) {
    if (!confirm('Delete this booking?')) return
    await api(`bookings/${id}`, { method: 'DELETE' }, token); toast.success('Deleted'); load()
  }
  return (
    <Card title="Booking Requests" subtitle={`${items.length} received`}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto my-8" /> : items.length === 0 ? (
        <div className="text-center py-10 text-navy/50 text-sm">No booking requests yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] tracking-widest uppercase text-navy/50 border-b border-beige-2">
              <tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Event</th><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Contact</th><th className="py-3 pr-4">Received</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-beige-2">
              {items.map((b) => (
                <tr key={b.id} className="hover:bg-beige/20 align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-navy">{b.name}</div>
                    <div className="text-xs text-navy/50">{b.company}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-navy">{b.eventType}</div>
                    <div className="text-xs text-navy/50">{b.location} · Budget: {b.budget || '—'}</div>
                    {b.message ? <div className="text-xs text-navy/60 mt-1 max-w-sm">{b.message}</div> : null}
                  </td>
                  <td className="py-3 pr-4 text-navy/70">{b.date || '—'}</td>
                  <td className="py-3 pr-4">
                    <div className="text-navy/80"><a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a></div>
                    <div className="text-xs text-navy/50">{b.phone}</div>
                  </td>
                  <td className="py-3 pr-4 text-navy/50 text-xs">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="py-3">
                    <button onClick={() => del(b.id)} className="w-8 h-8 rounded-lg text-navy/50 hover:text-red-600 hover:bg-red-50 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function MessagesView({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const load = async () => { setLoading(true); try { const d = await api('contact', {}, token); setItems(d.items || []) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  async function del(id) {
    if (!confirm('Delete this message?')) return
    await api(`contact/${id}`, { method: 'DELETE' }, token); toast.success('Deleted'); load()
  }
  return (
    <Card title="Contact Messages" subtitle={`${items.length} received`}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto my-8" /> : items.length === 0 ? (
        <div className="text-center py-10 text-navy/50 text-sm">No messages yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m.id} className="rounded-xl border border-beige-2 p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-navy">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="text-xs text-navy/60 hover:underline">{m.email}</a>
                </div>
                {m.subject ? <div className="text-xs text-gold tracking-wide uppercase mt-0.5">{m.subject}</div> : null}
                <p className="mt-2 text-sm text-navy/80 whitespace-pre-wrap">{m.message}</p>
                <div className="mt-2 text-[11px] text-navy/40">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <button onClick={() => del(m.id)} className="w-8 h-8 rounded-lg text-navy/50 hover:text-red-600 hover:bg-red-50 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ------------------ OVERVIEW ------------------
function Overview({ token }) {
  const [stats, setStats] = useState({ songs: 0, voice: 0, gallery: 0, bookings: 0, messages: 0, testimonials: 0 })
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    Promise.all([
      api('songs').then((d) => d.items?.length || 0),
      api('voice-projects').then((d) => d.items?.length || 0),
      api('gallery').then((d) => d.items?.length || 0),
      api('bookings', {}, token).then((d) => d.items?.length || 0).catch(() => 0),
      api('contact', {}, token).then((d) => d.items?.length || 0).catch(() => 0),
      api('testimonials').then((d) => d.items?.length || 0),
    ]).then(([songs, voice, gallery, bookings, messages, testimonials]) => setStats({ songs, voice, gallery, bookings, messages, testimonials }))
  }, [token])

  async function resetMedia(mode) {
    const msg = mode === 'all'
      ? 'WIPE all content (songs, voice, gallery, timeline, testimonials, collaborators, etc.) and reseed from defaults with Vaja’s real photos?\n\nThis will delete any custom content you have added. Continue?'
      : 'Reset ALL images (hero, welcome, songs, voice projects, gallery) to the default Vaja photos?\n\nText/content will not be touched. Continue?'
    if (!confirm(msg)) return
    setResetting(true)
    try {
      const res = await api('admin/reset-media', { method: 'POST', body: JSON.stringify({ mode }) }, token)
      toast.success(`Reset complete — ${JSON.stringify(res.updated)}`)
      setTimeout(() => window.location.reload(), 1000)
    } catch (e) { toast.error(e.message || 'Reset failed') }
    finally { setResetting(false) }
  }

  const tiles = [
    { label: 'Songs', value: stats.songs, icon: Music2, color: 'from-navy to-navy-soft' },
    { label: 'Voice Projects', value: stats.voice, icon: Mic2, color: 'from-navy-soft to-navy' },
    { label: 'Gallery Items', value: stats.gallery, icon: ImgIcon, color: 'from-navy to-navy-soft' },
    { label: 'Bookings', value: stats.bookings, icon: CalendarCheck, color: 'from-gold to-[color:var(--gold-soft)]', dark: true },
    { label: 'Messages', value: stats.messages, icon: Mail, color: 'from-gold to-[color:var(--gold-soft)]', dark: true },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'from-navy to-navy-soft' },
  ]
  return (
    <div className="space-y-6">
      <Card title="Welcome back" subtitle="Manage every part of The Voice Of Vaja from here.">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className={`relative rounded-2xl p-5 bg-gradient-to-br ${t.color} overflow-hidden`}>
              <t.icon className={`w-5 h-5 mb-4 ${t.dark ? 'text-navy' : 'text-gold'}`} />
              <div className={`font-serif text-3xl ${t.dark ? 'text-navy' : 'text-ivory'}`}>{t.value}</div>
              <div className={`text-[10px] tracking-widest uppercase mt-1 ${t.dark ? 'text-navy/70' : 'text-beige/70'}`}>{t.label}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Quick actions">
        <div className="grid md:grid-cols-3 gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="rounded-xl border border-beige-2 p-4 hover:border-navy transition-colors flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-gold" />
            <div><div className="font-medium text-navy">View live site</div><div className="text-xs text-navy/50">Opens in new tab</div></div>
          </a>
          <div className="rounded-xl border border-beige-2 p-4 flex items-center gap-3">
            <Settings className="w-5 h-5 text-gold" />
            <div><div className="font-medium text-navy">Password</div><div className="text-xs text-navy/50">Set env <code>ADMIN_PASSWORD</code></div></div>
          </div>
          <div className="rounded-xl border border-beige-2 p-4 flex items-center gap-3">
            <Upload className="w-5 h-5 text-gold" />
            <div><div className="font-medium text-navy">Media uploads</div><div className="text-xs text-navy/50">Images stored in DB (≤ 8MB each)</div></div>
          </div>
        </div>
      </Card>

      <Card title="Restore default media" subtitle="Use this after deploying to a new environment where images are missing.">
        <div className="space-y-3">
          <div className="rounded-xl border border-beige-2 bg-beige/30 p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="max-w-xl">
                <div className="font-medium text-navy">Reset all images to defaults</div>
                <p className="text-xs text-navy/60 mt-1">
                  Overwrites hero portrait, welcome background, song covers, voice project images and the entire gallery with Vaja’s real photos from <code>/vaja/*.jpg</code>. Text content is untouched.
                </p>
              </div>
              <button
                disabled={resetting}
                onClick={() => resetMedia('images')}
                className="rounded-full bg-navy text-ivory text-xs px-4 py-2 inline-flex items-center gap-1.5 disabled:opacity-60"
              >
                {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImgIcon className="w-3 h-3" />} Reset images
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="max-w-xl">
                <div className="font-medium text-red-800">Full factory reset</div>
                <p className="text-xs text-red-800/70 mt-1">
                  <b>Destructive.</b> Wipes songs, voice projects, gallery, timeline, testimonials, collaborators, and collab highlights, then reseeds everything from defaults. Bookings, messages, and admin uploads are preserved.
                </p>
              </div>
              <button
                disabled={resetting}
                onClick={() => resetMedia('all')}
                className="rounded-full bg-red-600 text-white text-xs px-4 py-2 inline-flex items-center gap-1.5 hover:bg-red-700 disabled:opacity-60"
              >
                {resetting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Full reset
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ------------------ DASHBOARD ------------------
function Dashboard({ token, logout }) {
  const [tab, setTab] = useState('overview')
  const [site, setSite] = useState(null)

  useEffect(() => { api('site').then((s) => setSite({ ...s, _token: token })) }, [token])

  async function saveSite() {
    try { const { _token, ...body } = site; await api('site', { method: 'PUT', body: JSON.stringify(body) }, token); toast.success('Site content saved') }
    catch (e) { toast.error(e.message) }
  }

  const menu = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'site', label: 'Home / About / Contact', icon: Home },
    { id: 'timeline', label: 'Timeline', icon: User },
    { id: 'songs', label: 'Music', icon: Music2 },
    { id: 'voice', label: 'Voice Projects', icon: Mic2 },
    { id: 'gallery', label: 'Gallery', icon: ImgIcon },
    { id: 'collabs', label: 'Collaborators', icon: Users },
    { id: 'highlights', label: 'Collab Highlights', icon: Star },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'messages', label: 'Messages', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-beige/40 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-ivory flex-shrink-0 sticky top-0 h-screen flex flex-col">
        <div className="p-6 border-b border-ivory/10">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-serif text-lg">V</span>
            <div>
              <div className="font-serif text-ivory">The Voice Of Vaja</div>
              <div className="text-[10px] tracking-widest uppercase text-gold">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {menu.map((m) => (
            <button key={m.id} onClick={() => setTab(m.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                tab === m.id ? 'bg-gold text-navy font-medium' : 'text-beige/80 hover:bg-navy-soft'
              }`}>
              <m.icon className="w-4 h-4" /> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-ivory/10">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-beige/70 hover:text-ivory rounded-xl">
            <LinkIcon className="w-4 h-4" /> View site
          </a>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-beige/70 hover:text-ivory rounded-xl">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-6xl">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-2">Admin</div>
          <h1 className="font-serif text-3xl md:text-4xl text-navy mb-8">{menu.find((m) => m.id === tab)?.label}</h1>

          {tab === 'overview' && <Overview token={token} />}
          {tab === 'site' && (site ? <SiteEditor site={site} setSite={setSite} save={saveSite} /> : <Loader2 className="w-5 h-5 animate-spin" />)}
          {tab === 'timeline' && <CollectionManager
            title="Career Timeline" subtitle="Chronological milestones (sorted by order)."
            endpoint="timeline" token={token}
            emptyItem={{ order: 99, year: '', title: '', desc: '' }}
            fields={[
              { key: 'year', label: 'Year' },
              { key: 'order', label: 'Order', type: 'number' },
              { key: 'title', label: 'Title', full: true },
              { key: 'desc', label: 'Description', type: 'textarea', full: true },
            ]}
          />}
          {tab === 'songs' && <CollectionManager
            title="Music" subtitle="Original songs, playback, tributes, anthems."
            endpoint="songs" token={token}
            emptyItem={{ title: '', role: '', year: new Date().getFullYear(), language: '', genre: '', desc: '', image: '', tag: '', audioUrl: '', videoUrl: '', streamUrl: '' }}
            fields={[
              { key: 'title', label: 'Song Title' },
              { key: 'year', label: 'Year', type: 'number' },
              { key: 'role', label: 'Role' },
              { key: 'tag', label: 'Tag / Label' },
              { key: 'language', label: 'Language' },
              { key: 'genre', label: 'Genre', type: 'select', options: ['Original', 'Playback', 'Tribute', 'Anthem', 'Film', 'Cover'] },
              { key: 'desc', label: 'Description', type: 'textarea', full: true },
              { key: 'image', label: 'Cover Image', type: 'media', full: true },
              { key: 'audioUrl', label: 'Audio URL (mp3)' },
              { key: 'videoUrl', label: 'Video URL (YouTube)' },
              { key: 'streamUrl', label: 'Streaming URL (Spotify / Apple)', full: true },
            ]}
          />}
          {tab === 'voice' && <CollectionManager
            title="Voice & Dubbing" subtitle="Portfolio of voice projects."
            endpoint="voice-projects" token={token}
            emptyItem={{ title: '', category: '', language: '', desc: '', image: '', audioUrl: '' }}
            fields={[
              { key: 'title', label: 'Project Title' },
              { key: 'category', label: 'Category', type: 'select', options: ['Corporate', 'Character', 'Commercial', 'Dubbing', 'Movie', 'Advertisement'] },
              { key: 'language', label: 'Language' },
              { key: 'desc', label: 'Description', type: 'textarea', full: true },
              { key: 'image', label: 'Poster / Image', type: 'media', full: true },
              { key: 'audioUrl', label: 'Audio Sample URL (mp3)', full: true },
            ]}
          />}
          {tab === 'gallery' && <CollectionManager
            title="Gallery" subtitle="Photos from concerts, studio, portraits."
            endpoint="gallery" token={token}
            emptyItem={{ src: '', tag: '', span: '' }}
            fields={[
              { key: 'src', label: 'Image', type: 'media', full: true },
              { key: 'tag', label: 'Tag (Live, Studio, Portrait…)' },
              { key: 'span', label: 'Grid Span', type: 'select', options: ['', 'col-span-2', 'row-span-2'] },
            ]}
          />}
          {tab === 'collabs' && <CollectionManager
            title="Collaborators" subtitle="Names shown in the marquee wall."
            endpoint="collaborators" token={token}
            emptyItem={{ name: '' }}
            fields={[{ key: 'name', label: 'Collaborator Name', full: true }]}
          />}
          {tab === 'highlights' && <CollectionManager
            title="Collaboration Highlights" subtitle="Featured collaboration cards below the marquee."
            endpoint="collab-highlights" token={token}
            emptyItem={{ title: '', sub: '', desc: '' }}
            fields={[
              { key: 'title', label: 'Collaboration' },
              { key: 'sub', label: 'Sub-line' },
              { key: 'desc', label: 'Description', type: 'textarea', full: true },
            ]}
          />}
          {tab === 'testimonials' && <CollectionManager
            title="Testimonials" subtitle="Kind words from clients & industry."
            endpoint="testimonials" token={token}
            emptyItem={{ name: '', role: '', text: '', stars: 5 }}
            fields={[
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role / Company' },
              { key: 'text', label: 'Testimonial', type: 'textarea', rows: 4, full: true },
              { key: 'stars', label: 'Stars (1-5)', type: 'number' },
            ]}
          />}
          {tab === 'bookings' && <BookingsView token={token} />}
          {tab === 'messages' && <MessagesView token={token} />}
        </div>
      </main>
    </div>
  )
}

// ------------------ PAGE ------------------
function AdminPage() {
  const { token, login, logout } = useAdminAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <>
      <Toaster position="top-right" richColors />
      {!token ? <Login onLogin={login} /> : <Dashboard token={token} logout={logout} />}
    </>
  )
}

export default AdminPage
