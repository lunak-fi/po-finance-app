import { Geist } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import Providers from '@/app/providers'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PO Finance Manager',
  description: 'Manage your purchase order financing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
