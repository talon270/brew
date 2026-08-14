import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { installUpdateHandler } from './lib/sw-update'

installUpdateHandler()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter so the app can be served from GitHub Pages without
        server-side rewrite rules. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
