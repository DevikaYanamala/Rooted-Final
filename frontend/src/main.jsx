import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import './i18n.js'
import { productsData } from './data.js'

if (import.meta.env.DEV) {
  const ar = productsData.filter((p) => p.culture === 'ar')
  console.info(
    `[Rooted] ${productsData.length} products (${ar.length} Arabic). Flashing? Disable Vite polling unless needed: ROOTED_VITE_POLL=1. dev:local no longer auto-syncs every 5s.`,
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
