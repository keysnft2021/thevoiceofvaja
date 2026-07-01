import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://vaja-vocal-hub.preview.emergentagent.com'),
  title: {
    default: 'The Voice Of Vaja — Singer • Songwriter • Playback Singer • Voice & Dubbing Artist',
    template: '%s | The Voice Of Vaja',
  },
  description: 'Official website of Vaja — a multi-dimensional artist. Original music, playback singing, live performances and professional voice & dubbing across Tamil, English, Hindi, Telugu and Malayalam.',
  keywords: ['Vaja', 'The Voice Of Vaja', 'Chennai singer', 'Indian playback singer', 'Voice artist India', 'Dubbing artist', 'Tamil singer', 'Mahi Way', 'Lucid Dream', 'Chennai Super Kings song', 'Vermilion Records', 'KM Conservatory'],
  authors: [{ name: 'Vaja' }],
  creator: 'The Voice Of Vaja',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'The Voice Of Vaja',
    title: 'The Voice Of Vaja — Music that Connects. Voices that Inspire.',
    description: 'Multilingual originals, playback and voice engagements. Book Vaja for live shows, corporate events, playback singing, voice-overs and dubbing projects.',
    images: [{ url: '/vaja/vaja-013.jpg', width: 1200, height: 630, alt: 'The Voice Of Vaja' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Voice Of Vaja',
    description: 'Music that Connects. Voices that Inspire.',
    images: ['/vaja/vaja-013.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-ivory text-navy">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
