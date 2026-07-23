import type { Metadata } from 'next'
import WelcomeGate from '@/components/WelcomeGate'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lingimo',
  description: 'Language learning sessions in a focused web app.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WelcomeGate />
        {children}
      </body>
    </html>
  )
}
