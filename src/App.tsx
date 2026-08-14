import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Quiz from './routes/Quiz'
import You from './routes/You'
import GrindersPage from './routes/Grinders'
import BeansPage from './routes/Beans'
import GuideIndex from './routes/GuideIndex'
import GuideSection from './routes/GuideSection'
import Brew from './routes/Brew'
import Log from './routes/Log'
import Explore from './routes/Explore'
import Path from './routes/Path'
import Fix from './routes/Fix'
import Water from './routes/Water'
import Shelf from './routes/Shelf'
import Tasting from './routes/Tasting'
import Espresso from './routes/Espresso'
import Glossary from './routes/Glossary'
import Gear from './routes/Gear'
import Roasters from './routes/Roasters'
import Buy from './routes/Buy'
import { THEME_ICONS, THEME_LABELS, useTheme } from './lib/theme'

const NAV = [
  { to: '/path', label: 'Start here' },
  { to: '/guide', label: 'Learn' },
  { to: '/brew', label: 'Timer' },
  { to: '/fix', label: 'Fix a brew' },
  { to: '/log', label: 'My brews' },
  { to: '/shelf', label: 'My shelf' },
  { to: '/buy', label: 'Buy' },
  { to: '/you', label: 'Your taste' },
]

export default function App() {
  const { theme, cycle } = useTheme()

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
          <button
            className="theme-toggle"
            onClick={cycle}
            title={THEME_LABELS[theme]}
            aria-label={`${THEME_LABELS[theme]}. Click to change.`}
          >
            {THEME_ICONS[theme]}
          </button>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/brew" element={<Brew />} />
          <Route path="/log" element={<Log />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/you" element={<You />} />
          <Route path="/grinders" element={<GrindersPage />} />
          <Route path="/beans" element={<BeansPage />} />
          <Route path="/guide" element={<GuideIndex />} />
          <Route path="/guide/:slug" element={<GuideSection />} />
          <Route path="/path" element={<Path />} />
          <Route path="/fix" element={<Fix />} />
          <Route path="/water" element={<Water />} />
          <Route path="/shelf" element={<Shelf />} />
          <Route path="/tasting" element={<Tasting />} />
          <Route path="/espresso" element={<Espresso />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/gear" element={<Gear />} />
          <Route path="/roasters" element={<Roasters />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer>
        Brew — specialty coffee in Delhi NCR. Prices are approximate and change often.
      </footer>
    </div>
  )
}
