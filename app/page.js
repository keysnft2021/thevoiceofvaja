'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Music2, Mic2, Play, Pause, Instagram, Phone, Mail, MapPin,
  Youtube, Music, Headphones, Sparkles, ArrowRight, ArrowUpRight,
  Star, Quote, X, Menu, Award, Globe, Radio, Film, Volume2
} from 'lucide-react'
import { toast } from 'sonner'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'music', label: 'Music' },
  { id: 'voice', label: 'Voice & Dubbing' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'collabs', label: 'Collaborations' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'book', label: 'Book Vaja' },
  { id: 'contact', label: 'Contact' },
]

const EVENT_TYPES = [
  'Live Concert', 'Corporate Event', 'Wedding', 'Cultural Program',
  'College Event', 'Music Festival', 'Playback Singing', 'Voice Over',
  'Dubbing Project', 'Advertisement', 'Other'
]

function useReveal(dep) {
  useEffect(() => {
    if (!dep) return
    const els = document.querySelectorAll('.reveal:not(.in)')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.08 })
    els.forEach((el) => io.observe(el))
    // Force-visible after 2s in case observer misses (safety fallback)
    const timer = setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in')), 2000)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [dep])
}

function Counter({ value, suffix = '' }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let started = false
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true
          const duration = 1400
          const start = performance.now()
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setN(Math.floor(eased * value))
            if (p < 1) requestAnimationFrame(tick); else setN(value)
          }
          requestAnimationFrame(tick)
        }
      })
    }, { threshold: 0.4 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [value])
  return <span ref={ref} className="font-serif text-5xl md:text-6xl text-navy">{n}<span className="text-gold">{suffix}</span></span>
}

function Waveform({ playing }) {
  const bars = 28
  return (
    <div className="flex items-end gap-[3px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="w-[3px] rounded-full bg-navy/70"
          style={{ height: `${25 + ((i * 13) % 70)}%`, animation: playing ? `bar 1s ease-in-out ${i * 40}ms infinite` : 'none' }} />
      ))}
    </div>
  )
}

// ------------- WELCOME -------------
function WelcomeScreen({ onEnter, welcome }) {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-[100] overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <img src={welcome.bgImage} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-navy" />
      </div>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(228,206,138,0.35), transparent 60%)' }} />
      <div className="relative z-10 h-full flex flex-col">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-6 md:pt-8 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase">
            <span className="h-px w-8 bg-gold" /> Official Welcome <span className="h-px w-8 bg-gold" />
          </span>
        </motion.div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory tracking-tight leading-[1.05]">
            {welcome.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
            className="mt-5 text-gold text-sm md:text-base tracking-[0.3em] uppercase">
            {welcome.subtitle}
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-10 md:mt-14 font-corm italic text-2xl md:text-4xl text-ivory">
            “{welcome.question}”
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.9 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
            <ExploreCard onClick={() => onEnter('music')} icon={Music2} title="Explore Music"
              items={['Original Songs', 'Live Performances', 'Playback Singing', 'Albums', 'Music Videos', 'Collaborations']}
              bg="https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=srgb&fm=jpg&q=85" />
            <ExploreCard onClick={() => onEnter('voice')} icon={Mic2} title="Explore Voice & Dubbing"
              items={['Dubbing Projects', 'Voice Samples', 'Commercial Voice Overs', 'Movie Projects', 'Character Voices', 'Corporate']}
              bg="https://images.pexels.com/photos/7901950/pexels-photo-7901950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
            onClick={() => onEnter('home')} className="mt-10 text-beige/70 hover:text-gold text-xs tracking-[0.3em] uppercase link-sweep">
            or enter the full experience →
          </motion.button>
        </div>
        <div className="pb-6 text-center text-[10px] tracking-[0.35em] text-beige/50 uppercase">Chennai • India</div>
      </div>
    </motion.div>
  )
}

function ExploreCard({ onClick, icon: Icon, title, items, bg }) {
  return (
    <motion.button whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-gold/30 bg-navy-soft/50 backdrop-blur text-left p-6 md:p-8 h-[260px] md:h-[300px] flex flex-col justify-between">
      <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <img src={bg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/70 to-navy/50" />
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-12 h-12 rounded-full border border-gold/60 flex items-center justify-center text-gold"><Icon className="w-5 h-5" /></div>
        <ArrowUpRight className="w-6 h-6 text-gold/70 group-hover:text-gold group-hover:rotate-45 transition-all duration-500" />
      </div>
      <div className="relative z-10">
        <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-3">{title}</h3>
        <p className="text-ivory/90 text-xs md:text-sm leading-relaxed">{items.slice(0, 5).join(' · ')}</p>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-gold/60 transition-all duration-500 pointer-events-none" />
    </motion.button>
  )
}

// ------------- NAV -------------
function Nav({ scrolled }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="mx-auto max-w-6xl px-4">
          <div className={`flex items-center justify-between rounded-full px-4 md:px-6 py-3 backdrop-blur-md border transition-all duration-500 ${scrolled ? 'bg-ivory/85 border-beige-2 shadow-[0_10px_40px_-15px_rgba(14,27,51,0.15)]' : 'bg-ivory/70 border-beige-2/60'}`}>
            <a href="#home" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-serif text-lg">V</span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-serif text-navy text-sm tracking-wide">The Voice Of Vaja</span>
                <span className="text-[9px] tracking-[0.3em] text-muted-ink uppercase mt-0.5">Since 2007</span>
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.slice(1, 8).map((l) => (
                <a key={l.id} href={`#${l.id}`} className="text-[13px] text-navy/80 hover:text-navy link-sweep">{l.label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <a href="#book" className="hidden md:inline-flex items-center gap-2 rounded-full bg-navy text-ivory text-xs px-4 py-2 hover:bg-navy-soft transition-colors">
                Book Vaja <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => setOpen(true)} className="lg:hidden w-10 h-10 rounded-full border border-beige-2 flex items-center justify-center"><Menu className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-navy/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory p-8">
              <div className="flex justify-between items-center mb-8">
                <span className="font-serif text-xl text-navy">The Voice Of Vaja</span>
                <button onClick={() => setOpen(false)}><X /></button>
              </div>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((l) => (
                  <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="font-serif text-2xl text-navy hover:text-gold">{l.label}</a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ------------- HERO -------------
function Hero({ hero }) {
  return (
    <section id="home" className="relative overflow-hidden bg-ivory pt-24 pb-8">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-8 items-center min-h-[70vh]">
        <div className="lg:col-span-6 relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-navy/70">{hero.eyebrow}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-navy">
            {hero.titleLine1} <br />
            <span className="italic text-gold-grad">{hero.titleLine2}</span>
          </h1>
          <p className="mt-5 text-navy/75 text-base leading-relaxed max-w-xl">{hero.intro}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#music" className="inline-flex items-center gap-2 rounded-full bg-navy text-ivory px-6 py-3 text-sm hover:bg-navy-soft transition-colors"><Play className="w-4 h-4" /> Listen Now</a>
            <a href="#voice" className="inline-flex items-center gap-2 rounded-full border border-navy/25 bg-white/60 text-navy px-6 py-3 text-sm hover:bg-white transition-colors"><Mic2 className="w-4 h-4" /> Explore Voice Projects</a>
            <a href="#book" className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/10 text-navy px-6 py-3 text-sm hover:bg-gold/20 transition-colors"><Sparkles className="w-4 h-4 text-gold" /> Book Vaja</a>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-navy/60">
            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gold" /> WOW Awards Asia 2023</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-gold" /> CSK Collaboration</span>
            <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-gold" /> 5 Languages</span>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] max-w-[460px] mx-auto">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-gold/20 via-beige to-transparent blur-2xl" />
            <div className="relative rounded-[2rem] overflow-hidden border border-beige-2 shadow-[0_50px_100px_-30px_rgba(14,27,51,0.35)] h-full">
              <img src={hero.image} alt="Vaja" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-4 md:-left-8 bottom-14 bg-ivory rounded-2xl border border-beige-2 shadow-xl p-3 pr-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center"><Music className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-muted-ink">Now Playing</div>
                  <div className="font-serif text-navy text-sm">{hero.floatingLabel}</div>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-3 md:-right-6 top-10 bg-ivory rounded-2xl border border-beige-2 shadow-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <div className="text-[10px] tracking-widest uppercase text-muted-ink">Live Booking</div>
                </div>
                <div className="font-serif text-navy text-sm mt-1">{hero.floatingRight}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-y border-beige-2 bg-beige/50 overflow-hidden">
        <div className="flex marquee-track py-3">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-14 pr-14 text-navy/70 font-serif text-lg italic whitespace-nowrap">
              {['Tamil','English','Hindi','Telugu','Malayalam','Originals','Playback','Live','Voice-Overs','Dubbing','Tamil','English','Hindi','Telugu','Malayalam','Originals','Playback','Live'].map((t, i) => (
                <span key={i} className="flex items-center gap-14"><span>{t}</span><Sparkles className="w-4 h-4 text-gold" /></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- STATS -------------
function Stats({ stats }) {
  return (
    <section className="bg-ivory section-pad">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14 reveal">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">By The Numbers</div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy">A journey measured in <span className="italic text-gold-grad">moments</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="reveal rounded-2xl bg-beige/60 border border-beige-2 p-6 text-center">
              <Counter value={s.value} suffix={s.suffix} />
              <div className="mt-2 text-xs tracking-[0.2em] uppercase text-navy/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- ABOUT + TIMELINE -------------
function About({ about, timeline }) {
  return (
    <section id="about" className="relative section-pad bg-beige/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 reveal">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">About Vaja</div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy leading-[1.05]">{about.title}</h2>
          <p className="mt-6 text-navy/75 leading-relaxed">{about.paragraph1}</p>
          <p className="mt-4 text-navy/75 leading-relaxed">{about.paragraph2}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {(about.languages || []).map((l) => (
              <span key={l} className="rounded-full border border-navy/15 bg-white text-navy text-xs px-3 py-1.5">{l}</span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-beige-2 to-transparent" />
          <div className="space-y-8">
            {timeline.map((t) => (
              <div key={t.id} className="reveal relative pl-14 md:pl-20">
                <div className="absolute left-2 md:left-4 top-1 w-9 h-9 rounded-full bg-ivory border border-gold/50 flex items-center justify-center shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{t.year}</div>
                <h3 className="font-serif text-xl md:text-2xl text-navy">{t.title}</h3>
                <p className="mt-2 text-navy/70 leading-relaxed max-w-xl">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------- MUSIC -------------
function MusicSection({ songs }) {
  const [filter, setFilter] = useState('All')
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)
  const filters = ['All', 'Original', 'Playback', 'Tribute', 'Anthem', 'Film']

  const filtered = useMemo(() => {
    if (filter === 'All') return songs
    if (filter === 'Playback') return songs.filter((s) => (s.role || '').includes('Playback'))
    return songs.filter((s) => s.genre === filter)
  }, [filter, songs])

  const togglePlay = (song) => {
    if (playing === song.title) {
      audioRef.current?.pause()
      setPlaying(null)
    } else {
      setPlaying(song.title)
      if (song.audioUrl && audioRef.current) {
        audioRef.current.src = song.audioUrl
        audioRef.current.play().catch(() => {})
      }
    }
  }

  return (
    <section id="music" className="section-pad bg-ivory">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 reveal">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Music</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Original songs, playback and <span className="italic text-gold-grad">live magic</span>.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs tracking-widest uppercase border transition-all ${filter === f ? 'bg-navy text-ivory border-navy' : 'bg-white text-navy border-beige-2 hover:border-navy'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <motion.article key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group rounded-2xl overflow-hidden bg-white border border-beige-2 shadow-[0_10px_40px_-20px_rgba(14,27,51,0.2)] hover:shadow-[0_30px_60px_-30px_rgba(14,27,51,0.35)] transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                <div className="absolute top-4 left-4"><span className="text-[10px] tracking-widest uppercase bg-gold text-navy px-2.5 py-1 rounded-full">{s.tag}</span></div>
                <button onClick={() => togglePlay(s)} className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-ivory text-navy flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  {playing === s.title ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="absolute bottom-4 right-4"><Waveform playing={playing === s.title} /></div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-xl text-navy leading-tight">{s.title}</h3>
                  <span className="text-xs text-muted-ink whitespace-nowrap mt-1">{s.year}</span>
                </div>
                <div className="text-xs text-gold mt-1 tracking-wide">{s.role}</div>
                <p className="mt-3 text-sm text-navy/70 leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-beige-2 pt-3">
                  <div className="flex items-center gap-3 text-xs text-navy/60">
                    <span className="inline-flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {s.language}</span>
                    <span className="inline-flex items-center gap-1"><Music2 className="w-3.5 h-3.5" /> {s.genre}</span>
                  </div>
                  {(s.streamUrl || s.videoUrl) ? (
                    <a href={s.streamUrl || s.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-navy/70 hover:text-navy inline-flex items-center gap-1 link-sweep">
                      {s.videoUrl ? 'Watch' : 'Stream'} <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- VOICE -------------
function Voice({ projects }) {
  const [active, setActive] = useState(0)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const iconMap = { Radio, Film, Volume2, Headphones, Mic2 }
  const current = projects[active] || projects[0]
  const IconComp = iconMap[current?.icon] || Radio

  const togglePlay = () => {
    if (!current?.audioUrl) { toast.info('Sample coming soon'); return }
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false) }
    else {
      if (audioRef.current) {
        audioRef.current.src = current.audioUrl
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      }
    }
  }

  return (
    <section id="voice" className="relative section-pad bg-navy text-ivory overflow-hidden">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-gold blur-[120px]" /></div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Voice & Dubbing</div>
            <h2 className="font-serif text-4xl md:text-5xl">A voice that can carry a <span className="italic text-gold-grad">brand</span>, a <span className="italic text-gold-grad">character</span>, or a <span className="italic text-gold-grad">nation</span>.</h2>
          </div>
          <p className="max-w-md text-beige/70">From cinematic character voices to multilingual TVCs, Vaja delivers with a warmth and speed that production houses rely on. Studios: Chennai + remote-ready worldwide.</p>
        </div>
        {current && (
          <div className="mb-14 reveal rounded-3xl border border-gold/20 bg-navy-soft/80 backdrop-blur p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5">
              <div className="aspect-video rounded-2xl overflow-hidden relative">
                <img src={current.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/10" />
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{current.category} · {current.language}</div>
              <h3 className="font-serif text-3xl md:text-4xl">{current.title}</h3>
              <p className="mt-3 text-beige/70 max-w-xl">{current.desc}</p>
              <div className="mt-6 flex items-center gap-4">
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-gold text-navy flex items-center justify-center hover:scale-105 transition-transform">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <Waveform playing={isPlaying} />
                  <div className="mt-2 flex justify-between text-[10px] tracking-widest uppercase text-beige/50"><span>00:00</span><span>02:14</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.button key={p.id} onClick={() => { setActive(i); setIsPlaying(false) }} whileHover={{ y: -4 }}
              className={`text-left rounded-2xl overflow-hidden border transition-all ${active === i ? 'border-gold bg-gold/5' : 'border-gold/15 bg-navy-soft/40 hover:border-gold/40'}`}>
              <div className="aspect-[16/10] relative overflow-hidden">
                <img src={p.image} alt="" className="w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center"><Radio className="w-4 h-4" /></div>
              </div>
              <div className="p-4">
                <div className="text-[10px] tracking-widest uppercase text-gold">{p.category} · {p.language}</div>
                <h4 className="font-serif text-lg mt-1">{p.title}</h4>
                <p className="text-xs text-beige/60 mt-1 line-clamp-2">{p.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- GALLERY -------------
function Gallery({ items }) {
  const [lightbox, setLightbox] = useState(null)
  return (
    <section id="gallery" className="section-pad bg-ivory">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Gallery</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Frames from the <span className="italic text-gold-grad">journey</span>.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {items.map((g) => (
            <motion.button key={g.id} onClick={() => setLightbox(g)} whileHover={{ scale: 1.01 }}
              className={`relative rounded-2xl overflow-hidden group ${g.span || ''}`}>
              <img src={g.src} alt={g.tag} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-ivory bg-navy/60 backdrop-blur px-2 py-1 rounded-full">{g.tag}</div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-navy/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
            <button className="absolute top-6 right-6 text-ivory" onClick={() => setLightbox(null)}><X className="w-6 h-6" /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={lightbox.src} alt={lightbox.tag} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ------------- COLLABORATIONS -------------
function Collaborations({ collaborators, highlights }) {
  return (
    <section id="collabs" className="section-pad bg-beige/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12 reveal">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Collaborations</div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy">Trusted by <span className="italic text-gold-grad">iconic</span> names.</h2>
        </div>
        <div className="overflow-hidden py-6 border-y border-beige-2 bg-ivory/60 rounded-2xl">
          <div className="flex marquee-track">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center gap-12 pr-12">
                {collaborators.map((c) => (
                  <div key={c.id + k} className="whitespace-nowrap font-serif text-navy/70 hover:text-navy transition-colors text-2xl md:text-3xl italic">
                    {c.name} <span className="text-gold mx-6">✦</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {highlights.map((c) => (
            <div key={c.id} className="reveal rounded-2xl bg-white border border-beige-2 p-6 hover:border-gold/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center mb-4"><Award className="w-5 h-5" /></div>
              <div className="text-[10px] tracking-widest uppercase text-gold">{c.sub}</div>
              <h3 className="font-serif text-2xl text-navy mt-1">{c.title}</h3>
              <p className="mt-3 text-sm text-navy/70 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- TESTIMONIALS -------------
function Testimonials({ items }) {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % Math.max(items.length, 1)), 6000); return () => clearInterval(t) }, [items.length])
  const t = items[i] || items[0]
  if (!t) return null
  return (
    <section id="testimonials" className="section-pad bg-ivory">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3 reveal">Testimonials</div>
        <h2 className="font-serif text-4xl md:text-5xl text-navy reveal">Kind words from the <span className="italic text-gold-grad">industry</span>.</h2>
        <div className="relative mt-12 min-h-[220px]">
          <Quote className="w-12 h-12 text-gold/30 mx-auto" />
          <AnimatePresence mode="wait">
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="mt-6">
              <p className="font-corm italic text-2xl md:text-3xl text-navy leading-relaxed">“{t.text}”</p>
              <div className="mt-6 flex flex-col items-center">
                <div className="flex gap-1 text-gold">{Array.from({ length: t.stars || 5 }).map((_, k) => (<Star key={k} className="w-4 h-4 fill-current" />))}</div>
                <div className="mt-3 font-serif text-navy">{t.name}</div>
                <div className="text-xs tracking-widest uppercase text-muted-ink">{t.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, k) => (<button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${i === k ? 'w-8 bg-navy' : 'w-2 bg-navy/25'}`} />))}
        </div>
      </div>
    </section>
  )
}

// ------------- BOOK -------------
function Book({ contact }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', eventType: '', date: '', location: '', budget: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.eventType) { toast.error('Please fill name, email and event type.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setDone(true); toast.success('Booking request received — Vaja’s team will reach out shortly.') }
      else toast.error(data.error || 'Something went wrong.')
    } catch { toast.error('Network error. Please try again.') }
    finally { setLoading(false) }
  }
  return (
    <section id="book" className="section-pad bg-navy text-ivory relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1565035010268-a3816f98589a?crop=entropy&cs=srgb&fm=jpg&q=85" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Book Vaja</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">Let’s create something <span className="italic text-gold-grad">unforgettable</span>.</h2>
          <p className="mt-5 text-beige/70 max-w-md">Live concerts, corporate events, weddings, cultural programs, college fests, music festivals, playback singing, voice-overs and dubbing engagements. Share your brief — we’ll respond within 24 hours.</p>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /> {contact.phone}</div>
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold" /> {contact.email}</div>
            <div className="flex items-center gap-3"><Instagram className="w-4 h-4 text-gold" /> @{contact.instagram}</div>
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold" /> {contact.location}</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          {!done ? (
            <form onSubmit={submit} className="rounded-3xl bg-ivory/5 border border-ivory/10 backdrop-blur p-6 md:p-8 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name *" value={form.name} onChange={(v) => set('name', v)} />
                <Field label="Company / Organization" value={form.company} onChange={(v) => set('company', v)} />
                <Field label="Email *" type="email" value={form.email} onChange={(v) => set('email', v)} />
                <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-beige/60">Event Type *</label>
                  <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className="mt-1 w-full bg-transparent border-b border-ivory/25 py-2 focus:outline-none focus:border-gold text-ivory">
                    <option value="" className="text-navy">Select…</option>
                    {EVENT_TYPES.map((et) => <option key={et} value={et} className="text-navy">{et}</option>)}
                  </select>
                </div>
                <Field label="Preferred Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
                <Field label="Location" value={form.location} onChange={(v) => set('location', v)} />
                <Field label="Budget (approx.)" value={form.budget} onChange={(v) => set('budget', v)} />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-beige/60">Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} className="mt-1 w-full bg-transparent border-b border-ivory/25 py-2 focus:outline-none focus:border-gold text-ivory resize-none" placeholder="Tell us more about your event or project…" />
              </div>
              <button type="submit" disabled={loading} className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold text-navy px-6 py-3 text-sm font-medium hover:bg-[color:var(--gold-soft)] transition-colors disabled:opacity-60">
                {loading ? 'Sending…' : 'Send Booking Request'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl bg-gold/10 border border-gold/40 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-gold text-navy mx-auto flex items-center justify-center"><Sparkles className="w-6 h-6" /></div>
              <h3 className="font-serif text-3xl mt-4">Request received.</h3>
              <p className="mt-3 text-beige/80 max-w-md mx-auto">Thank you — Vaja’s team will get back to you within 24 hours at the email you provided.</p>
              <button onClick={() => { setDone(false); setForm({ name:'', company:'', email:'', phone:'', eventType:'', date:'', location:'', budget:'', message:'' }) }} className="mt-6 text-xs tracking-widest uppercase text-gold hover:text-[color:var(--gold-soft)]">Send another request →</button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-beige/60">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-b border-ivory/25 py-2 focus:outline-none focus:border-gold text-ivory placeholder:text-beige/30" />
    </div>
  )
}

// ------------- CONTACT -------------
function Contact({ contact }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill name, email and message.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { toast.success('Message sent!'); setForm({ name: '', email: '', subject: '', message: '' }) }
      else toast.error(data.error || 'Something went wrong.')
    } catch { toast.error('Network error.') }
    finally { setLoading(false) }
  }
  return (
    <section id="contact" className="section-pad bg-ivory">
      <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12">
        <div className="reveal">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Contact</div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight">Say hello, share a brief, or just <span className="italic text-gold-grad">say hi</span>.</h2>
          <p className="mt-5 text-navy/70 max-w-md">Whether you’re a fan, a director, a brand, or a curator — we’d love to hear from you.</p>
          <div className="mt-8 space-y-4">
            <ContactRow icon={Phone} label="Phone" value={contact.phone} href={`tel:${(contact.phone||'').replace(/\s/g,'')}`} />
            <ContactRow icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
            <ContactRow icon={Instagram} label="Instagram" value={'@' + contact.instagram} href={contact.instagramUrl} />
            <ContactRow icon={MapPin} label="Based in" value={contact.location} />
          </div>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-beige-2 bg-beige/40 p-6 md:p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <LightField label="Name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
            <LightField label="Email" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} />
          </div>
          <LightField label="Subject" value={form.subject} onChange={(v) => setForm({...form, subject: v})} />
          <div>
            <label className="text-[10px] tracking-widest uppercase text-navy/60">Message</label>
            <textarea rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}
              className="mt-1 w-full bg-white border border-beige-2 rounded-xl p-3 focus:outline-none focus:border-navy resize-none" placeholder="Type your message…" />
          </div>
          <button disabled={loading} className="rounded-full bg-navy text-ivory px-6 py-3 text-sm hover:bg-navy-soft transition-colors disabled:opacity-60">
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
function LightField({ label, value, onChange, type='text' }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest uppercase text-navy/60">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-white border border-beige-2 rounded-xl px-3 py-2.5 focus:outline-none focus:border-navy" />
    </div>
  )
}
function ContactRow({ icon: Icon, label, value, href }) {
  const inner = (
    <div className="flex items-center gap-4 group">
      <div className="w-11 h-11 rounded-full bg-beige border border-beige-2 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-gold transition-all"><Icon className="w-5 h-5" /></div>
      <div>
        <div className="text-[10px] tracking-widest uppercase text-navy/60">{label}</div>
        <div className="font-serif text-navy text-lg">{value}</div>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner
}

// ------------- FOOTER -------------
function Footer({ contact }) {
  return (
    <footer className="bg-navy text-beige/70 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-serif text-xl">V</span>
            <div>
              <div className="font-serif text-ivory text-xl">The Voice Of Vaja</div>
              <div className="text-[10px] tracking-widest uppercase text-gold">Music • Voice • Live</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm">Music that connects. Voices that inspire. Multilingual originals, playback and voice engagements for the world’s most discerning stages, studios and screens.</p>
        </div>
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.slice(1, 6).map((l) => (<li key={l.id}><a href={`#${l.id}`} className="hover:text-ivory link-sweep">{l.label}</a></li>))}
          </ul>
        </div>
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Reach Out</div>
          <ul className="space-y-2 text-sm">
            <li>{contact.phone}</li>
            <li>{contact.email}</li>
            <li><a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-ivory link-sweep">@{contact.instagram}</a></li>
            <li>{contact.location}</li>
          </ul>
        </div>
      </div>
      <div className="mt-14 border-t border-ivory/10 pt-6 mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div>© {new Date().getFullYear()} The Voice Of Vaja. All rights reserved. <a href="/admin" className="hover:text-ivory ml-3 opacity-60">Admin</a></div>
        <div className="flex items-center gap-4">
          <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-ivory"><Instagram className="w-4 h-4" /></a>
          {contact.youtubeUrl ? <a href={contact.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-ivory"><Youtube className="w-4 h-4" /></a> : null}
          {contact.spotifyUrl ? <a href={contact.spotifyUrl} target="_blank" rel="noreferrer" className="hover:text-ivory"><Music2 className="w-4 h-4" /></a> : null}
        </div>
      </div>
    </footer>
  )
}

// ------------- LOADER -------------
function Loader() {
  return (
    <div className="fixed inset-0 z-[200] bg-ivory flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-beige-2" />
          <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        </div>
        <div className="font-serif text-navy text-lg">The Voice Of Vaja</div>
      </div>
    </div>
  )
}

// ------------- MAIN -------------
function App() {
  const [entered, setEntered] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [content, setContent] = useState(null)
  useReveal(content)

  useEffect(() => {
    fetch('/api/content').then((r) => r.json()).then(setContent).catch(() => {})
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function enter(target) {
    setEntered(true)
    setTimeout(() => { const el = document.getElementById(target === 'home' ? 'home' : target); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 600)
  }

  if (!content) return <Loader />

  return (
    <main className="relative">
      <AnimatePresence>
        {!entered && <WelcomeScreen key="welcome" onEnter={enter} welcome={content.site.welcome} />}
      </AnimatePresence>
      <Nav scrolled={scrolled} />
      <Hero hero={content.site.hero} />
      <Stats stats={content.site.stats || []} />
      <About about={content.site.about} timeline={content.timeline} />
      <MusicSection songs={content.songs} />
      <Voice projects={content.voiceProjects} />
      <Gallery items={content.gallery} />
      <Collaborations collaborators={content.collaborators} highlights={content.collabHighlights} />
      <Testimonials items={content.testimonials} />
      <Book contact={content.site.contact} />
      <Contact contact={content.site.contact} />
      <Footer contact={content.site.contact} />
    </main>
  )
}

export default App
