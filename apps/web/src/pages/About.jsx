import { useEffect, useState } from 'react'
import { getSectionBySlug } from '../api/sectionsApi.js'
import { getSubsections } from '../api/subsectionsApi.js'
import { motion } from 'framer-motion'

/**
 * About.jsx
 * Página de "Nosotros" con contenido dinámico desde PocketBase.
 */
export default function About() {
  const [section, setSection] = useState(null)
  const [subsections, setSubsections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const sec = await getSectionBySlug('nosotros').catch(() => null)
        setSection(sec)
        if (sec) {
          const subs = await getSubsections(sec.id).catch(() => [])
          setSubsections(subs)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-muyu-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {section?.title || 'Sobre Nosotros'}
        </h1>
        {section?.content && (
          <p className="text-muyu-light/80 text-lg max-w-2xl mx-auto">{section.content}</p>
        )}
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {subsections.length > 0 ? (
            <div className="space-y-16">
              {subsections.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-center`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {sub.image && (
                    <div className="w-full md:w-1/2">
                      <img
                        src={`${import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090'}/api/files/subsections/${sub.id}/${sub.image}`}
                        alt={sub.title}
                        className="rounded-xl shadow-md w-full object-cover h-64 md:h-80"
                      />
                    </div>
                  )}
                  <div className={sub.image ? 'md:w-1/2' : 'w-full'}>
                    <h3 className="text-2xl font-bold text-muyu-primary mb-4">{sub.title}</h3>
                    {sub.content && (
                      <p className="text-gray-600 leading-relaxed">{sub.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">Próximamente publicaremos información sobre nuestra empresa.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
