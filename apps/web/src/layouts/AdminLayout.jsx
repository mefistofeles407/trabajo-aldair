import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  Wrench,
  FolderOpen,
  Star,
  Phone,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Secciones', to: '/admin/secciones', icon: Layers },
  { label: 'Subsecciones', to: '/admin/subsecciones', icon: ChevronRight },
  { label: 'Servicios', to: '/admin/servicios', icon: Wrench },
  { label: 'Proyectos', to: '/admin/proyectos', icon: FolderOpen },
  { label: 'Testimonios', to: '/admin/testimonios', icon: Star },
  { label: 'Contacto', to: '/admin/contacto', icon: Phone },
]

/**
 * AdminLayout.jsx
 * Layout del panel de administración.
 * Incluye sidebar de navegación, header y área de contenido.
 */
export default function AdminLayout() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}
      >
        {/* Logo sidebar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link to="/" className="text-lg font-bold text-muyu-primary">
            MUYU Admin
          </Link>
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-gray-100 px-3 py-4">
          <div className="px-3 mb-3">
            <p className="text-xs text-gray-500">Administrador</p>
            <p className="text-sm font-medium text-gray-700 truncate">
              {admin?.email || 'admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="admin-sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header admin */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Panel de Administración</h1>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm text-muyu-secondary hover:underline"
          >
            Ver sitio ↗
          </Link>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
