import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Quiz from './routes/Quiz'
import You from './routes/You'
import GrindersPage from './routes/Grinders'
import BeansPage from './routes/Beans'
import GuideIndex from './routes/GuideIndex'
import GuideSection from './routes/GuideSection'

const NAV = [
  { to: '/guide', label: 'Guide' },
  { to: '/grinders', label: 'Grinders' },
  { to: '/beans', label: 'Beans' },
  { to: '/you', label: 'Your taste' },
]

export default function App() {
  return (
    <div className="shell">
      <nav className="nav">
        <div className="nav-inner">
          <NavLink to="/" className="brand">
            Brew
          </NavLink>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'link active' : 'link')}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/you" element={<You />} />
          <Route path="/grinders" element={<GrindersPage />} />
          <Route path="/beans" element={<BeansPage />} />
          <Route path="/guide" element={<GuideIndex />} />
          <Route path="/guide/:slug" element={<GuideSection />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer>
        Brew — specialty coffee in Delhi NCR. Prices are approximate and change often.
      </footer>
    </div>
  )
}
