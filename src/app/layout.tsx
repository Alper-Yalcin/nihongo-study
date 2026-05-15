import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kototsuna',
  icons: {
    icon: '/logo/kotonohaFacivon.png',
    shortcut: '/logo/kotonohaFacivon.png',
  },
}

const themeInitScript = `(function () {
  var storageKeys = ['kototsuna.theme-mode', 'kotonoha.theme-mode'];
  var savedTheme = null;
  for (var i = 0; i < storageKeys.length; i++) {
    var rawValue = null;
    try { rawValue = window.localStorage.getItem(storageKeys[i]); } catch (e) {}
    if (rawValue === 'light' || rawValue === 'dark') { savedTheme = rawValue; break; }
  }
  var prefersDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.remove('theme-light', 'theme-dark');
  document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#d06070" />
        {/* Inline theme script runs before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
