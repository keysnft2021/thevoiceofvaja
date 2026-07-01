import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'The Voice Of Vaja — Singer • Songwriter • Playback Singer • Voice & Dubbing Artist',
  description: 'Official website of Vaja — a multi-dimensional artist. Original music, playback singing, live performances and professional voice & dubbing across Tamil, English, Hindi, Telugu and Malayalam.',
  keywords: 'Vaja, The Voice Of Vaja, Singer Chennai, Playback Singer, Voice Artist, Dubbing Artist, Mahi Way, Lucid Dream, Chennai Super Kings, Vermilion Records',
  openGraph: {
    title: 'The Voice Of Vaja',
    description: 'Music that Connects. Voices that Inspire.',
    type: 'website',
  },
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
