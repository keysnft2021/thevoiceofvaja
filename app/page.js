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
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-navy">
      <div className="absolute inset-0">
        <img src={welcome.bgImage} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-navy" />
      </div>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(228,206,138,0.35), transparent 60%)' }} />
      <div className="relative z-10 min-h-full flex flex-col">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-6 md:pt-8 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase text-center">
            <span className="h-px w-6 md:w-8 bg-gold" /> Every soul has a voice. Every voice has a soul. <span className="h-px w-6 md:w-8 bg-gold" />
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
              bg="/vaja/vaja-explore-music.jpg" />
            <ExploreCard onClick={() => onEnter('voice')} icon={Mic2} title="Explore Voice & Dubbing"
              items={['Dubbing Projects', 'Voice Samples', 'Commercial Voice Overs', 'Movie Projects', 'Character Voices', 'Corporate']}
              bg="/vaja/vaja-027.jpg" />
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
            onClick={() => onEnter('home')} className="mt-10 text-gold hover:text-[color:var(--gold-soft)] text-xs tracking-[0.3em] uppercase link-sweep">
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
      <div className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-700">
        <img src={bg} alt="" className="w-full h-full object-cover object-center" />
      </div>
      {/* Global darkening for the whole card */}
      <div className="absolute inset-0 bg-navy/55 group-hover:bg-navy/45 transition-colors duration-700" />
      {/* Stronger dark wash on the bottom half where text sits */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-navy via-navy/85 to-transparent" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="w-12 h-12 rounded-full border border-gold/60 bg-navy/60 backdrop-blur flex items-center justify-center text-gold">
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className="w-6 h-6 text-gold group-hover:rotate-45 transition-all duration-500 drop-shadow-[0_2px_6px_rgba(14,27,51,0.9)]" />
      </div>
      <div className="relative z-10">
        <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-2 drop-shadow-[0_2px_8px_rgba(14,27,51,0.9)]">{title}</h3>
        <p className="text-ivory text-[13px] md:text-sm leading-relaxed drop-shadow-[0_1px_4px_rgba(14,27,51,0.85)]">
          {items.slice(0, 5).join(' · ')}
        </p>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-1 ring-gold/60 transition-all duration-500 pointer-events-none" />
    </motion.button>
  )
}

// ------------- NAV -------------
function Nav({ scrolled, onReturnToWelcome }) {
  const [open, setOpen] = useState(false)
  const handleLogo = (e) => {
    e.preventDefault()
    setOpen(false)
    if (onReturnToWelcome) onReturnToWelcome()
  }
  return (
    <>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="mx-auto max-w-6xl px-4">
          <div className={`flex items-center justify-between rounded-full px-4 md:px-6 py-3 backdrop-blur-md border transition-all duration-500 ${scrolled ? 'bg-ivory/85 border-beige-2 shadow-[0_10px_40px_-15px_rgba(14,27,51,0.15)]' : 'bg-ivory/70 border-beige-2/60'}`}>
            <a href="#home" onClick={handleLogo} aria-label="Return to welcome screen"
               className="flex items-center gap-2 group cursor-pointer">
              <span className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-serif text-lg transition-transform group-hover:scale-105">V</span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-serif text-navy text-sm tracking-wide group-hover:text-gold transition-colors">The Voice Of Vaja</span>
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

              <img
                src={hero.image}
                alt="Vaja"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-4 md:left-6 bottom-12 z-20 bg-ivory rounded-2xl border border-beige-2 shadow-xl px-5 py-3 min-w-[230px]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" />

                  <div className="text-[10px] tracking-widest uppercase text-muted-ink whitespace-nowrap">
                    Live Booking
                  </div>
                </div>

                <div className="font-serif text-navy text-sm mt-1 whitespace-nowrap">
                  {hero.floatingRight}
                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>

      <div className="mt-12 h-[5px] md:h-[6px] overflow-hidden bg-[#0E1B33]">
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, #0E1B33 0%, #B8952F 20%, #E4CE8A 50%, #B8952F 80%, #0E1B33 100%)'
          }}
        />
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
          <div className="space-y-5">
            {timeline.map((t) => (
              <div key={t.id} className="reveal relative pl-14 md:pl-20">
                <div className="absolute left-2 md:left-4 top-1 w-9 h-9 rounded-full bg-ivory border border-gold/50 flex items-center justify-center shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{t.year}</div>
                <h3 className="font-serif text-lg md:text-xl text-navy">{t.title}</h3>
                <p className="mt-1.5 text-sm md:text-base text-navy/70 leading-relaxed max-w-xl">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper: normalise any YouTube URL to /embed/{id}
function toYouTubeEmbed(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return `${url}${url.includes('?') ? '&' : '?'}autoplay=1&rel=0`
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
  } catch { /* not a valid URL */ }
  return null
}

// ------------- MUSIC -------------
function MusicSection({ songs, youtubeUrl }) {
  const [filter, setFilter] = useState('All')
  const [playing, setPlaying] = useState(null)
  const [ytOpen, setYtOpen] = useState(null) // { url, title } | null
  const audioRef = useRef(null)
  const filters = ['All', 'Original', 'Playback', 'Tribute', 'Anthem', 'Film', 'Live']

  const filtered = useMemo(() => {
    if (filter === 'All') return songs
    if (filter === 'Playback') return songs.filter((s) => (s.role || '').includes('Playback') || s.genre === 'Playback')
    return songs.filter((s) => s.genre === filter)
  }, [filter, songs])

  const openYouTube = (song) => {
    const embed = toYouTubeEmbed(song.videoUrl)
    if (embed) { setYtOpen({ url: embed, title: song.title }); return true }
    return false
  }

  const togglePlay = (song) => {
    // If it's a Live entry OR song has a YouTube videoUrl, open the iframe modal.
    if (song.genre === 'Live' || (song.videoUrl && song.videoUrl.match(/youtu\.?be/i))) {
      if (openYouTube(song)) return
    }
    if (playing === song.title) {
      audioRef.current?.pause(); setPlaying(null)
    } else if (song.audioUrl) {
      setPlaying(song.title)
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl
        audioRef.current.play().catch(() => {})
      }
    } else if (song.streamUrl) {
      window.open(song.streamUrl, '_blank', 'noopener,noreferrer')
    } else {
      toast.info('Preview coming soon')
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
          <div className="flex items-center gap-3">
            {youtubeUrl ? (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                 className="hidden md:inline-flex items-center gap-2 rounded-full bg-navy text-ivory text-xs px-4 py-2.5 hover:bg-navy-soft transition-colors">
                <Youtube className="w-4 h-4 text-gold" /> YouTube Channel <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8 reveal">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs tracking-widest uppercase border transition-all ${filter === f ? 'bg-navy text-ivory border-navy' : 'bg-white text-navy border-beige-2 hover:border-navy'}`}>
              {f}
            </button>
          ))}
          {youtubeUrl ? (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
               className="md:hidden inline-flex items-center gap-1.5 rounded-full bg-navy text-ivory text-xs px-3 py-2">
              <Youtube className="w-3.5 h-3.5 text-gold" /> YouTube
            </a>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-beige-2 bg-beige/40">
            <div className="text-sm text-navy/60">
              {filter === 'Live'
                ? 'Live performances are being uploaded — check back soon.'
                : 'No items in this category yet.'}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s, i) => {
              const isLive = s.genre === 'Live'
              const hasYT = !!toYouTubeEmbed(s.videoUrl)
              return (
                <motion.article key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group rounded-2xl overflow-hidden bg-white border border-beige-2 shadow-[0_10px_40px_-20px_rgba(14,27,51,0.2)] hover:shadow-[0_30px_60px_-30px_rgba(14,27,51,0.35)] transition-all">
                  <button onClick={() => togglePlay(s)}
                          className={`relative aspect-[4/3] w-full overflow-hidden text-left ${(isLive || hasYT || s.audioUrl || s.streamUrl) ? 'cursor-pointer' : 'cursor-default'}`}
                          aria-label={isLive || hasYT ? `Play ${s.title} video` : `Play ${s.title}`}>
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {s.tag ? <span className="text-[10px] tracking-widest uppercase bg-gold text-navy px-2.5 py-1 rounded-full">{s.tag}</span> : null}
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase bg-red-600 text-white px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-ivory text-navy flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {(isLive || hasYT) ? <Play className="w-5 h-5 ml-0.5" /> : (playing === s.title ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />)}
                    </div>
                    {(isLive || hasYT) ? (
                      <div className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-[10px] tracking-widest uppercase bg-navy/70 text-ivory px-2 py-1 rounded-full backdrop-blur">
                        <Youtube className="w-3 h-3 text-gold" /> Watch
                      </div>
                    ) : (
                      <div className="absolute bottom-4 right-4"><Waveform playing={playing === s.title} /></div>
                    )}
                  </button>
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
                      {s.streamUrl ? (
                        <a href={s.streamUrl} target="_blank" rel="noreferrer" className="text-xs text-navy/70 hover:text-navy inline-flex items-center gap-1 link-sweep">
                          Stream <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>

      {/* YouTube iframe modal */}
      <AnimatePresence>
        {ytOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[90] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                      onClick={() => setYtOpen(null)}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> Now Playing
                </div>
                <button onClick={() => setYtOpen(null)}
                        aria-label="Close video"
                        className="w-10 h-10 rounded-full bg-ivory/10 border border-ivory/25 text-ivory hover:bg-ivory hover:text-navy transition-colors flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-ivory font-serif text-xl md:text-2xl mb-3 truncate">{ytOpen.title}</div>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                <iframe
                  src={ytOpen.url}
                  title={ytOpen.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              {youtubeUrl ? (
                <div className="mt-4 flex justify-center">
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 rounded-full bg-gold text-navy px-5 py-2.5 text-sm font-medium hover:opacity-90">
                    <Youtube className="w-4 h-4" /> Visit YouTube channel <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ------------- VOICE -------------
function Voice({ projects }) {
  const [active, setActive] = useState(0)
  const current = projects[active] || projects[0]

  const openLink = (url) => {
    if (!url) { toast.info('Link coming soon'); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="voice" className="relative section-pad bg-navy text-ivory overflow-hidden">
      <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-gold blur-[120px]" /></div>
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Voice & Dubbing</div>
            <h2 className="font-serif text-4xl md:text-5xl">A voice that can carry a <span className="italic text-gold-grad">brand</span>, a <span className="italic text-gold-grad">character</span> or a <span className="italic text-gold-grad">nation</span>.</h2>
          </div>
          <p className="max-w-md text-beige/70">From cinematic character voices to multilingual TVCs, Vaja delivers with a warmth and speed that production houses rely on. Studios: Chennai + remote-ready worldwide.</p>
        </div>

        {current && (
          <div className="mb-14 reveal rounded-3xl border border-gold/20 bg-navy-soft/80 backdrop-blur p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5">
              <button
                onClick={() => openLink(current.linkUrl)}
                className={`group block w-full aspect-video rounded-2xl overflow-hidden relative ${current.linkUrl ? 'cursor-pointer' : 'cursor-default'}`}
                aria-label={current.linkUrl ? `Open ${current.title} in a new tab` : current.title}
              >
                <img src={current.image} alt={current.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/10" />
                {current.linkUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gold text-navy px-5 py-2.5 text-xs font-medium tracking-widest uppercase shadow-xl">
                      Visit Project <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </button>
            </div>
            <div className="md:col-span-7">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{current.category} · {current.language}</div>
              <h3 className="font-serif text-3xl md:text-4xl">{current.title}</h3>
              <p className="mt-3 text-beige/70 max-w-xl">{current.desc}</p>
              {current.linkUrl && (
                <a href={current.linkUrl} target="_blank" rel="noopener noreferrer"
                   className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold text-navy px-5 py-2.5 text-sm font-medium hover:opacity-90">
                  Open project <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, idx) => (
            <motion.div key={p.id} whileHover={{ y: -4 }}
              className={`text-left rounded-2xl overflow-hidden border transition-all ${active === idx ? 'border-gold bg-gold/5' : 'border-gold/15 bg-navy-soft/40 hover:border-gold/40'}`}
            >
              <button
                onClick={() => openLink(p.linkUrl)}
                className={`block w-full aspect-[16/10] relative overflow-hidden group ${p.linkUrl ? 'cursor-pointer' : 'cursor-default'}`}
                aria-label={p.linkUrl ? `Open ${p.title} in a new tab` : p.title}
              >
                <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[900ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                {p.linkUrl && (
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/95 text-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                )}
              </button>
              <button onClick={() => setActive(idx)} className="w-full p-4 text-left hover:bg-gold/5 transition-colors">
                <div className="text-[10px] tracking-widest uppercase text-gold">{p.category} · {p.language}</div>
                <h4 className="font-serif text-lg mt-1">{p.title}</h4>
                <p className="text-xs text-beige/60 mt-1 line-clamp-2">{p.desc}</p>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------- GALLERY (Auto-playing slider) -------------
function Gallery({ items }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const total = items.length
  const INTERVAL = 5500

  const go = (n) => {
    const next = ((n % total) + total) % total
    setDir(next > i || (i === total - 1 && next === 0) ? 1 : -1)
    setI(next)
  }

  useEffect(() => {
    if (paused || total < 2) return
    const t = setInterval(() => { setDir(1); setI((v) => (v + 1) % total) }, INTERVAL)
    return () => clearInterval(t)
  }, [paused, total])

  useEffect(() => { if (i >= total) setI(0) }, [total, i])

  if (total === 0) {
    return (
      <section id="gallery" className="section-pad bg-ivory">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Gallery</div>
          <h2 className="font-serif text-4xl md:text-5xl text-navy">The story <span className="italic text-gold-grad">unfolds soon</span>.</h2>
          <p className="mt-3 text-navy/60 text-sm">Add images from the admin panel to populate the slider.</p>
        </div>
      </section>
    )
  }

  const current = items[i]
  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  }

  return (
    <section id="gallery" className="section-pad bg-ivory relative overflow-hidden">
      {/* Aura backdrops */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(228,206,138,0.35), transparent 60%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
             style={{ background: 'radial-gradient(circle, rgba(14,27,51,0.15), transparent 60%)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 reveal">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Gallery</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight">
              Frames from the <span className="italic text-gold-grad">journey</span>.
            </h2>
            <p className="mt-3 text-sm text-navy/60 max-w-md">A curated auto-playing slideshow. Latest additions appear first.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs tracking-widest uppercase text-navy/50 tabular-nums">
              {String(i + 1).padStart(2, '0')} <span className="text-navy/30">/ {String(total).padStart(2, '0')}</span>
            </div>
            <button onClick={() => setPaused((p) => !p)}
                    className="w-10 h-10 rounded-full border border-beige-2 bg-white flex items-center justify-center text-navy hover:border-navy transition-colors"
                    aria-label={paused ? 'Play' : 'Pause'}>
              {paused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Slider stage */}
        <div className="relative reveal"
             onMouseEnter={() => setPaused(true)}
             onMouseLeave={() => setPaused(false)}>
          {/* Frame — fixed viewport height, image fits inside (no crop, no skew) */}
          <div className="relative rounded-3xl overflow-hidden border border-beige-2 shadow-[0_40px_80px_-30px_rgba(14,27,51,0.35)]
                          h-[260px] sm:h-[360px] md:h-[480px] lg:h-[540px]"
               style={{ background: 'linear-gradient(135deg, #F1EADA 0%, #FBF9F5 50%, #E7DDC6 100%)' }}>
            {/* Soft radial spotlight */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)' }} />

            {/* Slides — object-contain preserves natural aspect for every image */}
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.img
                  key={current.id}
                  src={current.src}
                  alt={current.tag || current.caption || 'Gallery image'}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_50px_-20px_rgba(14,27,51,0.4)] cursor-zoom-in"
                  style={{ willChange: 'transform, opacity' }}
                  onClick={() => setLightbox(true)}
                />
              </AnimatePresence>
            </div>

            {/* Arrows */}
            {total > 1 && (
              <>
                <button onClick={() => go(i - 1)} aria-label="Previous"
                        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-ivory/90 backdrop-blur border border-beige-2 flex items-center justify-center text-navy hover:bg-white hover:scale-105 transition-all shadow-lg">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <button onClick={() => go(i + 1)} aria-label="Next"
                        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-ivory/90 backdrop-blur border border-beige-2 flex items-center justify-center text-navy hover:bg-white hover:scale-105 transition-all shadow-lg">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Progress bar */}
            {total > 1 && (
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-navy/10 z-10">
                <motion.div
                  key={current.id + '-bar-' + (paused ? 'p' : 'r')}
                  className="h-full bg-gold"
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '0%' : '100%' }}
                  transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: 'linear' }}
                />
              </div>
            )}
          </div>

          {/* Caption + dots row (below the frame, no overlap on strip images) */}
          <div className="mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={current.id + '-cap'}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.45 }}>
                  <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold">
                    <span className="h-px w-6 bg-gold" /> {current.tag || 'Gallery'}
                  </div>
                  <div className="mt-1 font-serif text-lg md:text-xl text-navy truncate">
                    {current.caption || current.tag || 'Untitled'}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {total > 1 && (
              <div className="flex items-center gap-1.5 shrink-0">
                {items.map((_, k) => (
                  <button key={k} onClick={() => go(k)} aria-label={`Slide ${k + 1}`}
                          className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-navy' : 'w-2 bg-navy/25 hover:bg-navy/50'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail rail — uniform 16:9 tiles so it never skews */}
          {total > 1 && (
            <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              {items.map((g, k) => (
                <button
                  key={g.id}
                  onClick={() => go(k)}
                  aria-label={`Show slide ${k + 1}`}
                  className={`relative shrink-0 rounded-lg overflow-hidden transition-all bg-beige/60 ${
                    k === i
                      ? 'ring-2 ring-gold ring-offset-2 ring-offset-ivory'
                      : 'ring-1 ring-beige-2 hover:ring-navy/40 opacity-70 hover:opacity-100'
                  }`}
                  style={{ width: 128, height: 72 }}
                >
                  <img src={g.src} alt="" className="w-full h-full object-contain" />
                  {k !== i ? <div className="absolute inset-0 bg-navy/5" /> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[80] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-6"
                      onClick={() => setLightbox(false)}>
            <button className="absolute top-6 right-6 text-ivory" onClick={() => setLightbox(false)}>
              <X className="w-6 h-6" />
            </button>
            <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        src={current.src} alt={current.tag || ''}
                        className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/80 text-sm tracking-widest uppercase">
              {current.caption || current.tag || ''}
            </div>
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
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', eventType: '', date: '', location: '', message: '' })
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
        <img src="/vaja/vaja-021.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-xs tracking-[0.35em] uppercase text-gold mb-3">Book Vaja</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">Let’s create something <span className="italic text-gold-grad">unforgettable</span>.</h2>
          <p className="mt-5 text-beige/70 max-w-md">Live concerts, corporate events, weddings, cultural programs, college fests, music festivals, playback singing, voice-overs and dubbing engagements. Share your brief — we’ll respond within 24 hours.</p>
          <div className="mt-8 space-y-3 text-sm">
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
              <button onClick={() => { setDone(false); setForm({ name:'', company:'', email:'', phone:'', eventType:'', date:'', location:'', message:'' }) }} className="mt-6 text-xs tracking-widest uppercase text-gold hover:text-[color:var(--gold-soft)]">Send another request →</button>
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
    <footer className="bg-navy text-white/70">
      {/* Top CTA band */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-gold mb-2">Ready to book?</div>
            <h3 className="font-serif text-3xl md:text-4xl text-white leading-tight">Bring Vaja to your <span className="italic text-gold-grad">next stage</span>.</h3>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap">
            <a href="#book" className="inline-flex items-center gap-2 rounded-full bg-gold text-navy px-6 py-3 text-sm font-medium hover:opacity-90"><Sparkles className="w-4 h-4" /> Book Vaja</a>
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 text-white px-6 py-3 text-sm hover:border-gold"><Mail className="w-4 h-4" /> Email us</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-gold text-navy flex items-center justify-center font-serif text-xl">V</span>
            <div>
              <div className="font-serif text-white text-xl">The Voice Of Vaja</div>
              <div className="text-[10px] tracking-widest uppercase text-gold">Music • Voice • Live</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            Music that connects. Voices that inspire. Multilingual originals, playback and voice
            engagements for the world’s most discerning stages, studios and screens.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam'].map((l) => (
              <span key={l} className="text-[10px] tracking-widest uppercase text-white/60 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">{l}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <a href={contact.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"
               className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold text-white/70"><Instagram className="w-4 h-4" /></a>
            {contact.youtubeUrl ? <a href={contact.youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube"
               className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold text-white/70"><Youtube className="w-4 h-4" /></a> : null}
            {contact.spotifyUrl ? <a href={contact.spotifyUrl} target="_blank" rel="noreferrer" aria-label="Spotify"
               className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold hover:text-gold text-white/70"><Music2 className="w-4 h-4" /></a> : null}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Sitemap</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li><a href="#home" className="hover:text-white link-sweep">Home</a></li>
            <li><a href="#about" className="hover:text-white link-sweep">About</a></li>
            <li><a href="#music" className="hover:text-white link-sweep">Music</a></li>
            <li><a href="#voice" className="hover:text-white link-sweep">Voice & Dubbing</a></li>
            <li><a href="#collabs" className="hover:text-white link-sweep">Collaborations</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Engage</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li><a href="#testimonials" className="hover:text-white link-sweep">Testimonials</a></li>
            <li><a href="#book" className="hover:text-white link-sweep">Book Vaja</a></li>
            <li><a href="#contact" className="hover:text-white link-sweep">Contact</a></li>
            <li><a href="/sitemap.xml" className="hover:text-white link-sweep">Sitemap.xml</a></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Reach Out</div>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" /><a href={`mailto:${contact.email}`} className="hover:text-white break-all">{contact.email}</a></li>
            <li className="flex items-start gap-3"><Instagram className="w-4 h-4 mt-0.5 text-gold shrink-0" /><a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">@{contact.instagram}</a></li>
            <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" /><span>{contact.location}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} The Voice Of Vaja · All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
            <span className="opacity-30">·</span>
            <a href="/robots.txt" className="hover:text-white">Robots</a>
            <span className="opacity-30">·</span>
            <span>
              Crafted with care by{' '}
              <a
                href="https://quantemlabs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Quantemlabs
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ------------- LOADER -------------
function Loader() {
  return (
    <div className="fixed inset-0 z-[200] bg-ivory flex items-center justify-center overflow-hidden">
      {/* Soft radial glow behind mic */}
      <div className="absolute w-[420px] h-[420px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(201,169,74,0.18), transparent 60%)' }} />

      <div className="relative flex flex-col items-center gap-6">
        {/* Vintage mic + sound waves */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Pulsing sound waves */}
          <span className="absolute inset-0 rounded-full border border-gold/40"
                style={{ animation: 'micWave 2.4s ease-out infinite' }} />
          <span className="absolute inset-0 rounded-full border border-gold/30"
                style={{ animation: 'micWave 2.4s ease-out 0.8s infinite' }} />
          <span className="absolute inset-0 rounded-full border border-gold/20"
                style={{ animation: 'micWave 2.4s ease-out 1.6s infinite' }} />

          {/* Rotating gold ring */}
          <span className="absolute w-24 h-24 rounded-full border-2 border-transparent"
                style={{ borderTopColor: 'var(--gold)', borderRightColor: 'var(--gold-soft)', animation: 'spin 2s linear infinite' }} />

          {/* Vintage microphone SVG */}
          <svg viewBox="0 0 64 96" className="relative w-16 h-24 float-slow" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="micBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E2C4C" />
                <stop offset="100%" stopColor="#0E1B33" />
              </linearGradient>
              <linearGradient id="micGrille" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4CE8A" />
                <stop offset="60%" stopColor="#C9A94A" />
                <stop offset="100%" stopColor="#8E7627" />
              </linearGradient>
              <linearGradient id="micShine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Top yoke pivot */}
            <rect x="26" y="4" width="12" height="4" rx="1.5" fill="#0E1B33" />

            {/* Yoke arms */}
            <path d="M14 22 C14 12, 22 8, 32 8 C42 8, 50 12, 50 22" stroke="#0E1B33" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Mic head — vintage capsule shape */}
            <rect x="16" y="16" width="32" height="42" rx="16" fill="url(#micBody)" stroke="#0E1B33" strokeWidth="1.5" />

            {/* Grille horizontal bars */}
            <g stroke="url(#micGrille)" strokeWidth="1.8" strokeLinecap="round">
              <line x1="20" y1="24" x2="44" y2="24" />
              <line x1="20" y1="30" x2="44" y2="30" />
              <line x1="20" y1="36" x2="44" y2="36" />
              <line x1="20" y1="42" x2="44" y2="42" />
              <line x1="20" y1="48" x2="44" y2="48" />
            </g>

            {/* Gold bezel around grille */}
            <rect x="16" y="16" width="32" height="42" rx="16" fill="none" stroke="url(#micGrille)" strokeWidth="2" opacity="0.9" />

            {/* Highlight shine */}
            <rect x="18" y="18" width="10" height="38" rx="8" fill="url(#micShine)" opacity="0.6" />

            {/* Neck / body */}
            <rect x="28" y="58" width="8" height="14" fill="#0E1B33" />
            <rect x="26" y="70" width="12" height="4" rx="1.5" fill="#C9A94A" />
            <rect x="27" y="74" width="10" height="16" rx="1.5" fill="#0E1B33" />
            <rect x="24" y="90" width="16" height="4" rx="1.5" fill="#0E1B33" />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <div className="text-[10px] tracking-[0.4em] uppercase text-gold">Tuning in</div>
          <div className="mt-1 font-serif text-navy text-xl">The Voice Of Vaja</div>
          {/* Animated equalizer bars */}
          <div className="mt-3 flex items-end justify-center gap-[3px] h-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <span key={i} className="w-[3px] rounded-full bg-navy/80"
                    style={{ height: `${30 + ((i * 17) % 70)}%`, animation: `bar 1.1s ease-in-out ${i * 80}ms infinite` }} />
            ))}
          </div>
        </div>
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
    // Wait for welcome to unmount, then smooth-scroll to the requested section.
    const sectionId = target === 'music' ? 'music' : target === 'voice' ? 'voice' : 'home'
    setTimeout(() => {
      const el = document.getElementById(sectionId)
      if (!el) return window.scrollTo({ top: 0, behavior: 'smooth' })
      const y = sectionId === 'home' ? 0 : (el.getBoundingClientRect().top + window.scrollY - 88)
      window.scrollTo({ top: y, behavior: 'smooth' })
    }, 700)
  }

  function returnToWelcome() {
    // Scroll to top first so when welcome dismisses again, we land nicely.
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Small delay lets the scroll begin, then we overlay the welcome again.
    setTimeout(() => setEntered(false), 350)
  }

  if (!content) return <Loader />

  return (
    <main className="relative">
      <AnimatePresence>
        {!entered && <WelcomeScreen key="welcome" onEnter={enter} welcome={content.site.welcome} />}
      </AnimatePresence>
      <Nav scrolled={scrolled} onReturnToWelcome={returnToWelcome} />
      <Hero hero={content.site.hero} />
      <Stats stats={content.site.stats || []} />
      <About about={content.site.about} timeline={content.timeline} />
      <MusicSection songs={content.songs} youtubeUrl={content.site.contact?.youtubeUrl} />
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
