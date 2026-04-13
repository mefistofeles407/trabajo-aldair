import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MuyuLogoAnimated from './MuyuLogoAnimated.jsx'

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Contacto', to: '/contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <MuyuLogoAnimated className="h-10 w-auto" />
            <span className="text-xl font-bold text-muyu-primary sr-only">MUYU</span>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-muyu-secondary border-b-2 border-muyu-secondary'
                      : 'text-gray-700 hover:text-muyu-secondary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-1 text-sm text-muyu-secondary font-medium"
            >
              <Phone size={16} />
              Llámanos
            </a>
            <Link to="/contacto" className="btn-primary text-sm py-2">
              Cotizar
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-3">
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2 text-base font-medium border-b border-gray-100 ${
                      isActive ? 'text-muyu-secondary' : 'text-gray-700'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/contacto"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-center mt-2"
              >
                Cotizar proyecto
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
