javascript


import './globals.css'

export const metadata = {
  title: 'Typora - Google Fonts Explorer',
  description: 'Beautiful Google Fonts explorer with dark mode',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
