import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getContactInfo } from '../api/contactApi.js'

/**
 * Footer.jsx
 * Pie de página del sitio. Carga la información de contacto desde PocketBase.
 * Si no hay datos en BD, usa valores por defecto hardcodeados como respaldo.
 */
export default function Footer() {
  const [contact, setContact] = useState(null)

  useEffect(() => {
    getContactInfo()
      .then(setContact)
      .catch(() => setContact(null))
  }, [])

  const phone = contact?.phone || '+51 999 000 000'
  const email = contact?.email || 'info@muyucontratistas.com'
  const address = contact?.address || 'Lima, Perú'

  return (
    <footer className="bg-muyu-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Marca */}
          <div>
            <h3 className="text-xl font-bold text-muyu-accent mb-3">MUYU Contratistas</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Construcción y arquitectura de calidad. Transformamos tus ideas en espacios reales
              con profesionalismo y experiencia.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Inicio', '/'],
                ['Nosotros', '/nosotros'],
                ['Servicios', '/servicios'],
                ['Proyectos', '/proyectos'],
                ['Contacto', '/contacto'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-muyu-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={15} className="shrink-0 text-muyu-accent" />
                <a href={`tel:${phone}`} className="hover:text-muyu-accent transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={15} className="shrink-0 text-muyu-accent" />
                <a href={`mailto:${email}`} className="hover:text-muyu-accent transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={15} className="shrink-0 text-muyu-accent mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>

            {/* Redes sociales */}
            <div className="flex gap-3 mt-4">
              {contact?.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-muyu-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {contact?.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-muyu-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {contact?.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-muyu-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} MUYU Contratistas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
