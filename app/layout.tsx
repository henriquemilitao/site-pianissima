import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pianíssima | Escola de Música em Campo Grande - MS',
  description: 'Aulas particulares de piano, violão e bateria em Campo Grande/MS. Aprenda música no seu ritmo, em um ambiente acolhedor e com acompanhamento individual.',
  generator: 'v0.app',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9vCGrF4OWF23UEtvlRDJ7VgrTKcWHp.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9vCGrF4OWF23UEtvlRDJ7VgrTKcWHp.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f2eb',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
