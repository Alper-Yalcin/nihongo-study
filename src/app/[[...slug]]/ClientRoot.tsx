'use client'

import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import '@/i18n'

export default function ClientRoot() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
