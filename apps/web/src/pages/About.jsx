import { useEffect, useState } from 'react'
import { getSectionBySlug } from '../api/sectionsApi.js'
import { getSubsections } from '../api/subsectionsApi.js'
import { getTeamMembers, getTeamMemberPhotoUrl } from '../api/teamApi.js'
import { motion } from 'framer-motion'
import { Mail, Linkedin, User } from 'lucide-react'

/**
 * About.jsx
 * Página de "Nosotros" con contenido dinámico desde PocketBase.
 * Incluye sección de equipo con fotos de perfil gestionadas desde el panel admin.
 *
 * La imagen del arquitecto principal (mefistofeles.jpg) se sirve desde
 * /images/mefistofeles.jpg como recurso estático de respaldo.
 * Cuando se sube una foto al panel admin (colección team_members),
 * esa imagen dinámica tiene prioridad sobre el archivo estático.
 */
export default function About() {
  const [section, setSection] = useState(null)
  const [subsections, setSubsections] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const sec = await getSectionBySlug('nosotros').catch(() => null)
        setSection(sec)
        const [subs, team] = await Promise.all([
          sec ? getSubsections(sec.id).catch(() => []) : Promise.resolve([]),
          getTeamMembers().catch(() => []),
        ])
        setSubsections(subs)
        setTeamMembers(team)
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

      {/* Sección del equipo */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Nuestro Equipo</h2>
              <p className="section-subtitle">Conoce a los profesionales detrás de cada proyecto</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden text-center p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-4 flex justify-center">
                    {member.photo ? (
                      <img
                        src={getTeamMemberPhotoUrl(member, member.photo)}
                        alt={member.name}
                        className="w-28 h-28 rounded-full object-cover ring-4 ring-muyu-primary/10"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-muyu-primary/10 flex items-center justify-center ring-4 ring-muyu-primary/10">
                        <User size={40} className="text-muyu-primary/50" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-muyu-primary mb-1">{member.name}</h3>
                  {member.role && (
                    <p className="text-sm text-muyu-secondary font-medium mb-3">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-muyu-primary transition-colors"
                        aria-label={`Enviar correo a ${member.name}`}
                      >
                        <Mail size={18} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-muyu-primary transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
