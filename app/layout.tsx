import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Ballas - Bahamas Club',
  description: 'Bine ai venit pe site-ul nostru',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/B.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/B.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/B.jpg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/B.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased min-h-screen bg-gradient-to-b from-background via-[#0d0d0d] to-[#1a1a1a]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
