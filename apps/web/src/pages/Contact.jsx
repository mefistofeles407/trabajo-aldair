import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { getContactInfo, sendContactMessage } from '../api/contactApi.js'

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' }

/**
 * Contact.jsx
 * Página de contacto con información de la empresa y formulario funcional.
 * La información de contacto se carga desde PocketBase.
 */
export default function Contact() {
  const [contactInfo, setContactInfo] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getContactInfo()
      .then(setContactInfo)
      .catch(() => null)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Por favor completa los campos obligatorios.')
      return
    }
    setSubmitting(true); setError(null)
    try {
      await sendContactMessage(form)
      setSuccess(true)
      setForm(EMPTY_FORM)
    } catch {
      setError('Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="bg-muyu-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
        <p className="text-muyu-light/80 text-lg max-w-2xl mx-auto">
          Estamos aquí para ayudarte a hacer realidad tu proyecto.
        </p>
      </div>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Información de contacto */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-muyu-primary mb-6">Información de contacto</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Teléfono', value: contactInfo?.phone || '+51 999 000 000', href: `tel:${contactInfo?.phone}` },
                  { icon: Mail, label: 'Correo electrónico', value: contactInfo?.email || 'info@muyucontratistas.com', href: `mailto:${contactInfo?.email}` },
                  { icon: MapPin, label: 'Dirección', value: `${contactInfo?.address || ''}${contactInfo?.city ? `, ${contactInfo.city}` : ''}` || 'Lima, Perú', href: contactInfo?.google_maps_url },
                  { icon: Clock, label: 'Horario', value: contactInfo?.schedule || 'Lunes a Viernes, 9am - 6pm' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="bg-muyu-light p-3 rounded-lg shrink-0">
                      <Icon size={20} className="text-muyu-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      {href ? (
                        <a href={href} className="text-muyu-secondary hover:underline text-sm" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-600 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.div
              className="bg-white rounded-2xl shadow-md p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {success ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-600 mb-6">Te responderemos lo antes posible.</p>
                  <button onClick={() => setSuccess(false)} className="btn-secondary text-sm">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Envíanos un mensaje</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="c-name">Nombre *</label>
                      <input id="c-name" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Tu nombre" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="c-email">Correo *</label>
                      <input id="c-email" name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="tu@email.com" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label" htmlFor="c-phone">Teléfono</label>
                      <input id="c-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder="+51 999 000 000" />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="c-subject">Asunto</label>
                      <input id="c-subject" name="subject" value={form.subject} onChange={handleChange} className="form-input" placeholder="Cotización de proyecto" />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" htmlFor="c-message">Mensaje *</label>
                    <textarea id="c-message" name="message" value={form.message} onChange={handleChange} className="form-input resize-none" rows={5} placeholder="Describe tu proyecto o consulta..." required />
                  </div>

                  {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

                  <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    <Send size={16} />
                    {submitting ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
