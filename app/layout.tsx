import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Arktik - Coming Soon | Innovative Software Solutions',
  description: 'Arktik is crafting cutting-edge software solutions that transform businesses and drive innovation. Join our waitlist for exclusive early access.',
  keywords: 'software solutions, custom development, enterprise software, web applications',
  authors: [{ name: 'Arktik' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}