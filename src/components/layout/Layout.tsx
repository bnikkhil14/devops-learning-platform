import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/learning-paths', label: 'Learning Paths' },
  { to: '/labs', label: 'Labs' },
  { to: '/projects', label: 'Projects' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <header className="`sticky top-0 z-50 bg-white border-b transition-shadow 
          ${scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'}`">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-slate-900">DevOpsForge</span>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 ${
                    isActive
                      ? 'text-blue-600 border-blue-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle button */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="flex flex-col px-4 py-3 gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium pb-1 border-b-2 ${
                      isActive
                        ? 'text-blue-600 border-blue-600'
                        : 'text-slate-600 border-transparent hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}