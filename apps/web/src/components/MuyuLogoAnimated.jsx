import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import pb from '../lib/pocketbaseClient.js'
import { getLogoSection, getSectionFileUrl } from '../api/sectionsApi.js'

/**
 * MuyuLogoAnimated.jsx
 * Renderiza el logo SVG de MUYU cargado desde PocketBase con animación.
 *
 * IMPORTANTE (Paso 1 del plan):
 * El registro en la colección 'sections' debe tener title='logotipo'
 * y el campo 'image' debe contener el SVG con el viewBox correcto:
 * viewBox="0 0 50.031101 46.320014"
 *
 * El logo se inyecta en el portal #logo-portal-root definido en index.html
 * y se posiciona absolutamente sobre el Header.
 *
 * Seguridad: el SVG se sanitiza antes de inyectarse en el DOM para
 * eliminar scripts y event handlers potencialmente peligrosos.
 */

/**
 * Sanitiza el contenido SVG eliminando elementos y atributos peligrosos.
 * El SVG proviene de PocketBase (solo accesible por admins), pero se
 * sanitiza como defensa en profundidad.
 * @param {string} svgText
 * @returns {string} SVG sanitizado o cadena vacía si no es SVG válido
 */
function sanitizeSvg(svgText) {
  const trimmed = svgText.trim()
  // Solo procesar si el contenido es efectivamente un SVG
  if (!trimmed.startsWith('<svg') && !trimmed.startsWith('<?xml')) {
    return ''
  }
  // Eliminar etiquetas <script> y su contenido
  let sanitized = trimmed.replace(/<script[\s\S]*?<\/script>/gi, '')
  // Eliminar event handlers inline (on*)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^>\s]+/gi, '')
  // Eliminar hrefs con javascript:
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, '')
  return sanitized
}

const PORTAL_ROOT_ID = 'logo-portal-root'

export default function MuyuLogoAnimated({ className = '', style = {} }) {
  const [svgContent, setSvgContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLogo() {
      try {
        const record = await getLogoSection()
        if (!record?.image) throw new Error('No hay imagen de logo en PocketBase.')

        const fileUrl = getSectionFileUrl(record, record.image)
        const response = await fetch(fileUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const svgText = await response.text()
        const sanitized = sanitizeSvg(svgText)
        if (!sanitized) throw new Error('El archivo no es un SVG válido.')
        if (!cancelled) {
          setSvgContent(sanitized)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          console.warn('[MuyuLogoAnimated] Error cargando logo:', err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLogo()
    return () => { cancelled = true }
  }, [])

  const portalRoot = document.getElementById(PORTAL_ROOT_ID)

  const logoContent = (
    <AnimatePresence>
      {!loading && svgContent && (
        <motion.div
          className={`muyu-logo-container ${className}`}
          style={style}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          aria-label="Logo MUYU Contratistas"
        />
      )}
    </AnimatePresence>
  )

  if (!portalRoot) {
    return logoContent
  }

  return createPortal(logoContent, portalRoot)
}
