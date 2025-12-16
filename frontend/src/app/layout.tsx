import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Validator | Sealmetrics',
  description: 'Validate and test Sealmetrics API endpoints with real-time response analysis',
  keywords: ['API', 'Validator', 'Sealmetrics', 'Analytics', 'Testing'],
  authors: [{ name: 'Sealmetrics' }],
  openGraph: {
    title: 'API Validator | Sealmetrics',
    description: 'Validate and test Sealmetrics API endpoints with real-time response analysis',
    type: 'website',
    url: 'https://api-validator.sealmetrics.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
