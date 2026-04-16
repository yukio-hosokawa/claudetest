import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ル・サンク南千里ローレルコート 大規模修繕に関するアンケート',
  description: 'ル・サンク南千里ローレルコート 大規模修繕に関するアンケート',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-xl mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
