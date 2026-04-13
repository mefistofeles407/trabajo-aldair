import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getServices, getServiceFileUrl } from '../api/servicesApi.js'

/**
 * Services.jsx
 * Página de servicios con renderizado dinámico desde PocketBase.
 */
export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('No se pudieron cargar los servicios.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Encabezado de página */}
      <div className="bg-muyu-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h1>
        <p className="text-muyu-light/80 text-lg max-w-2xl mx-auto">
          Ofrecemos soluciones completas en construcción y arquitectura para todo tipo de proyectos.
        </p>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Cargando servicios...</div>
          ) : error ? (
            <div className="text-center py-20 text-gray-500">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No hay servicios disponibles en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  className="card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {service.image && (
                    <img
                      src={getServiceFileUrl(service, service.image)}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg mb-5"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-muyu-primary mb-3">{service.title}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
