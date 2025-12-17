import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'API Validator | Sealmetrics',
  description: 'Validate and test Sealmetrics API endpoints with real-time response analysis',
  keywords: ['API', 'Validator', 'Sealmetrics', 'Analytics', 'Testing'],
  authors: [{ name: 'Sealmetrics' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'API Validator | Sealmetrics',
    description: 'Validate and test Sealmetrics API endpoints with real-time response analysis',
    type: 'website',
    url: 'https://api-validator.sealmetrics.com',
    images: ['/logo.png'],
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
        {/* Sealmetrics Tracking Pixel */}
        <Script id="sealmetrics-config" strategy="afterInteractive">
          {`
            var oSm = window.oSm || {};
            oSm.account = '60a52f6ac660b269d13c3f53';
            oSm.event = 'pageview';
            oSm.content_grouping = 'API-Validator';
          `}
        </Script>
        <Script
          src="//app.sealmetrics.com/tag/tracker"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
