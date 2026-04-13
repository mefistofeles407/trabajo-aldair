import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { validateImageFile, createPreviewUrl } from '../utils/imageUpload.js'

/**
 * ImageUpload.jsx
 * Componente reutilizable para seleccionar, previsualizar y subir imágenes.
 *
 * Props:
 *   - currentImageUrl: URL de la imagen actual (para mostrar en edición)
 *   - onFileSelect: callback que recibe el File seleccionado
 *   - onRemove: callback para cuando el usuario quiere quitar la imagen
 *   - label: etiqueta del campo
 *   - fieldName: nombre del campo (para accesibilidad)
 */
/**
 * Valida que una URL sea segura para usar como src de imagen.
 * Acepta blob: (previsualización local) y http/https (PocketBase).
 * @param {string} url
 * @returns {string} URL validada o cadena vacía si no es segura
 */
function sanitizeImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return ''
}

export default function ImageUpload({
  currentImageUrl = null,
  onFileSelect,
  onRemove,
  label = 'Imagen',
  fieldName = 'image',
  accept = 'image/*',
}) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const { valid, error: validationError } = validateImageFile(file)
    if (!valid) {
      setError(validationError)
      return
    }

    setError(null)
    const url = createPreviewUrl(file)
    setPreview(url)
    onFileSelect?.(file)
  }

  function handleRemove() {
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onRemove?.()
  }

  const displayUrl = sanitizeImageUrl(preview || currentImageUrl)
  const imgRef = useRef(null)

  // Set img src imperatively after URL validation to ensure the sanitized
  // value is what reaches the DOM, avoiding inline prop taint-flow.
  useEffect(() => {
    if (!imgRef.current) return
    if (displayUrl) {
      imgRef.current.setAttribute('src', displayUrl)
    } else {
      imgRef.current.removeAttribute('src')
    }
  }, [displayUrl])

  return (
    <div className="space-y-2">
      <label className="form-label" htmlFor={fieldName}>
        {label}
      </label>

      {displayUrl ? (
        <div className="relative inline-block">
          <img
            ref={imgRef}
            alt="Vista previa"
            className="w-48 h-32 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label="Quitar imagen"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-muyu-accent transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-500">Haz clic para seleccionar una imagen</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, SVG · Máx. 5 MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        id={fieldName}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {!displayUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-sm text-muyu-secondary hover:text-muyu-primary"
        >
          <Upload size={16} />
          Seleccionar imagen
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
