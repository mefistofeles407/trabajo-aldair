import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProjects, getProjectFileUrl } from '../api/projectsApi.js'
import { MapPin, Calendar } from 'lucide-react'

/**
 * Projects.jsx
 * Página de portafolio de proyectos con renderizado dinámico desde PocketBase.
 */
export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('Todos')
  const [categories, setCategories] = useState(['Todos'])

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data)
        const cats = ['Todos', ...new Set(data.map((p) => p.category).filter(Boolean))]
        setCategories(cats)
      })
      .catch(() => setError('No se pudieron cargar los proyectos.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'Todos' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div>
      <div className="bg-muyu-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Proyectos</h1>
        <p className="text-muyu-light/80 text-lg max-w-2xl mx-auto">
          Conoce algunos de los proyectos que hemos realizado con éxito.
        </p>
      </div>

      {/* Filtros de categoría */}
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 py-8 px-4 bg-white border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-muyu-secondary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-muyu-light hover:text-muyu-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Cargando proyectos...</div>
          ) : error ? (
            <div className="text-center py-20 text-gray-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No hay proyectos en esta categoría.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  {project.image ? (
                    <img
                      src={getProjectFileUrl(project, project.image)}
                      alt={project.title}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-muyu-light flex items-center justify-center">
                      <span className="text-muyu-secondary font-semibold">{project.title}</span>
                    </div>
                  )}
                  <div className="p-5">
                    {project.category && (
                      <span className="text-xs text-muyu-secondary font-semibold uppercase tracking-wider">
                        {project.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-800 text-lg mt-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {project.location}
                        </span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {project.year}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
