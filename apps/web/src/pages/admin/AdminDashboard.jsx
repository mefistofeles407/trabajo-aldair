import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Wrench, FolderOpen, Star, Phone, ChevronRight } from 'lucide-react'
import { getSections } from '../../api/sectionsApi.js'
import { getServices } from '../../api/servicesApi.js'
import { getProjects } from '../../api/projectsApi.js'
import { getTestimonials } from '../../api/testimonialsApi.js'

const STAT_CARDS = [
  { label: 'Secciones', icon: Layers, color: 'bg-blue-50 text-blue-600', to: '/admin/secciones' },
  { label: 'Servicios', icon: Wrench, color: 'bg-green-50 text-green-600', to: '/admin/servicios' },
  { label: 'Proyectos', icon: FolderOpen, color: 'bg-yellow-50 text-yellow-600', to: '/admin/proyectos' },
  { label: 'Testimonios', icon: Star, color: 'bg-purple-50 text-purple-600', to: '/admin/testimonios' },
]

/**
 * AdminDashboard.jsx
 * Página principal del panel de administración.
 * Muestra un resumen estadístico del contenido del sitio.
 */
export default function AdminDashboard() {
  const [counts, setCounts] = useState({ sections: 0, services: 0, projects: 0, testimonials: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [sections, services, projects, testimonials] = await Promise.allSettled([
          getSections(),
          getServices(false),
          getProjects(false),
          getTestimonials(false),
        ])

        setCounts({
          sections: sections.status === 'fulfilled' ? sections.value.length : 0,
          services: services.status === 'fulfilled' ? services.value.length : 0,
          projects: projects.status === 'fulfilled' ? projects.value.length : 0,
          testimonials: testimonials.status === 'fulfilled' ? testimonials.value.length : 0,
        })
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statsData = [
    { ...STAT_CARDS[0], count: counts.sections },
    { ...STAT_CARDS[1], count: counts.services },
    { ...STAT_CARDS[2], count: counts.projects },
    { ...STAT_CARDS[3], count: counts.testimonials },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Resumen del contenido administrable del sitio</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map(({ label, icon: Icon, color, to, count }) => (
          <Link
            key={to}
            to={to}
            className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform"
          >
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '—' : count}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Accesos rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Gestionar secciones', to: '/admin/secciones', desc: 'Crear, editar o eliminar secciones del sitio' },
            { label: 'Gestionar subsecciones', to: '/admin/subsecciones', desc: 'Administrar subsecciones de cada sección' },
            { label: 'Editar servicios', to: '/admin/servicios', desc: 'Actualizar los servicios que ofrece la empresa' },
            { label: 'Editar proyectos', to: '/admin/proyectos', desc: 'Agregar o modificar proyectos del portafolio' },
            { label: 'Editar testimonios', to: '/admin/testimonios', desc: 'Gestionar las reseñas de clientes' },
            { label: 'Info de contacto', to: '/admin/contacto', desc: 'Actualizar teléfono, email y redes sociales' },
          ].map(({ label, to, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:bg-muyu-light hover:border-muyu-accent transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
