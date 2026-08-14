import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter so the app can be served from GitHub Pages without
        server-side rewrite rules. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
