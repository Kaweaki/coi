import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import './family-map.css'
import './shell.css'
import './skin.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Offline shell — only in the built app, never in dev.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined)
  })
}
