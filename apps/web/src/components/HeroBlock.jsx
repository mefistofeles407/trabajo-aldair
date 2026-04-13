import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * HeroBlock.jsx
 * Sección hero de la página de inicio.
 * Recibe props dinámicas desde Home.jsx (datos desde PocketBase).
 *
 * Props:
 *   - title: título principal
 *   - subtitle: subtítulo
 *   - ctaLabel: texto del botón CTA
 *   - ctaLink: ruta del botón CTA
 *   - backgroundUrl: URL de imagen de fondo
 */
export default function HeroBlock({
  title = 'Construimos con excelencia',
  subtitle = 'MUYU Contratistas — soluciones integrales en construcción y arquitectura para proyectos residenciales, comerciales e industriales.',
  ctaLabel = 'Ver proyectos',
  ctaLink = '/proyectos',
  backgroundUrl = null,
}) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: backgroundUrl
          ? `linear-gradient(to bottom, rgba(8,28,21,0.65), rgba(8,28,21,0.45)), url(${backgroundUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, #081c15 0%, #1a3a2a 50%, #2d6a4f 100%)',
      }}
    >
      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <Link to={ctaLink} className="btn-primary text-base">
            {ctaLabel}
          </Link>
          <Link to="/contacto" className="btn-secondary border-white text-white hover:bg-white hover:text-muyu-primary text-base">
            Contáctanos
          </Link>
        </motion.div>
      </div>

      {/* Flecha de scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  )
}
