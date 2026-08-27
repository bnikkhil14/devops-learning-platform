import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className={`sticky top-0 z-50 bg-white border-b transition-shadow 
          ${scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'}`}>
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-slate-900">DevOpsForge</span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
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

            {/* Auth control */}
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <span className="text-sm text-slate-500">{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/signup"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md"
                >
                  Sign up
                </NavLink>
              </div>
            )}
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

              {/* Auth control (mobile) */}
              <div className="mt-2 pt-2 border-t border-slate-200">
                {user ? (
                  <>
                    <p className="px-0 py-1 text-sm text-slate-500">{user.name || user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 py-1"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 py-1">
                    <NavLink
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md w-fit"
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </div>
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