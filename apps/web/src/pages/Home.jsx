import { useEffect, useState } from 'react'
import HeroBlock from '../components/HeroBlock.jsx'
import { getServices, getServiceFileUrl } from '../api/servicesApi.js'
import { getProjects, getProjectFileUrl } from '../api/projectsApi.js'
import { getTestimonials, getTestimonialFileUrl } from '../api/testimonialsApi.js'
import { getSectionBySlug } from '../api/sectionsApi.js'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'

/**
 * Home.jsx
 * Página de inicio del sitio MUYU Contratistas.
 * Carga dinámicamente el contenido desde PocketBase.
 */
export default function Home() {
  const [heroSection, setHeroSection] = useState(null)
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [hero, svcs, projs, tests] = await Promise.allSettled([
        getSectionBySlug('hero').catch(() => null),
        getServices(),
        getProjects(true, true),
        getTestimonials(),
      ])

      setHeroSection(hero.status === 'fulfilled' ? hero.value : null)
      setServices(svcs.status === 'fulfilled' ? svcs.value : [])
      setProjects(projs.status === 'fulfilled' ? projs.value : [])
      setTestimonials(tests.status === 'fulfilled' ? tests.value : [])
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div>
      {/* Hero */}
      <HeroBlock
        title={heroSection?.title || 'Construimos con excelencia'}
        subtitle={heroSection?.content || 'MUYU Contratistas — soluciones integrales en construcción y arquitectura.'}
        backgroundUrl={heroSection?.image ? null : null}
      />

      {/* Servicios destacados */}
      {services.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Nuestros Servicios</h2>
              <p className="section-subtitle">Ofrecemos soluciones completas para tus proyectos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service) => (
                <motion.div
                  key={service.id}
                  className="card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {service.image && (
                    <img
                      src={getServiceFileUrl(service, service.image)}
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg text-muyu-primary mb-2">{service.title}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">{service.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/servicios" className="btn-secondary">
                Ver todos los servicios <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Proyectos destacados */}
      {projects.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Proyectos Destacados</h2>
              <p className="section-subtitle">Una muestra de nuestro trabajo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {project.image ? (
                    <img
                      src={getProjectFileUrl(project, project.image)}
                      alt={project.title}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-muyu-light flex items-center justify-center text-muyu-secondary font-semibold">
                      {project.title}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-muyu-secondary font-medium uppercase tracking-wide mb-1">
                      {project.category || 'Proyecto'}
                    </p>
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    {project.location && (
                      <p className="text-sm text-gray-500 mt-1">{project.location} · {project.year}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/proyectos" className="btn-secondary">
                Ver portafolio completo <ArrowRight size={16} className="inline ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonios */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-muyu-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-muyu-accent mb-4">Lo que dicen nuestros clientes</h2>
              <p className="text-gray-400">Testimonios reales de quienes confiaron en nosotros</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <motion.div
                  key={t.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={16} className={s <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                    ))}
                  </div>
                  <p className="text-gray-200 text-sm mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar && (
                      <img src={getTestimonialFileUrl(t, t.avatar)} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-white text-sm">{t.author}</p>
                      {t.role && <p className="text-gray-400 text-xs">{t.role}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-20 bg-muyu-secondary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Listo para tu próximo proyecto?</h2>
          <p className="text-muyu-light/80 mb-8">Contáctanos y te ayudamos a hacerlo realidad</p>
          <Link to="/contacto" className="bg-white text-muyu-primary px-8 py-3 rounded-lg font-semibold hover:bg-muyu-light transition-colors">
            Cotizar ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
