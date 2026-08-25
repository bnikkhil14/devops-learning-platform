import { useState } from 'react'
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

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 relative">
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
                  `text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
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
                    `py-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
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