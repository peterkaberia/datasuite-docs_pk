/* eslint-env node */
import 'nextra-theme-docs/style.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
