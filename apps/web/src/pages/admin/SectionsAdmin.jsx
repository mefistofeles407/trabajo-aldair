import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  getSectionFileUrl,
} from '../../api/sectionsApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = {
  title: '',
  slug: '',
  content: '',
  order: 0,
  visible: true,
}

/**
 * SectionsAdmin.jsx
 * Página CRUD para la gestión de secciones del sitio.
 */
export default function SectionsAdmin() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  async function loadSections() {
    setLoading(true)
    setError(null)
    try {
      const data = await getSections()
      setSections(data)
    } catch {
      setError('No se pudieron cargar las secciones. Verifica la conexión a PocketBase.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSections() }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setImageFile(null)
    setEditingId(null)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(section) {
    setForm({
      title: section.title || '',
      slug: section.slug || '',
      content: section.content || '',
      order: section.order ?? 0,
      visible: section.visible ?? true,
    })
    setImageFile(null)
    setEditingId(section.id)
    setFormError(null)
    setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setFormError('El título es obligatorio.')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      const data = buildFormDataWithImage(
        { ...form, order: Number(form.order) },
        imageFile,
        'image'
      )
      if (editingId) {
        await updateSection(editingId, data)
      } else {
        await createSection(data)
      }
      setShowForm(false)
      await loadSections()
    } catch {
      setFormError('Ocurrió un error al guardar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta sección? Esta acción no se puede deshacer.')) return
    try {
      await deleteSection(id)
      await loadSections()
    } catch {
      alert('No se pudo eliminar la sección.')
    }
  }

  async function toggleVisibility(section) {
    try {
      await updateSection(section.id, { visible: !section.visible })
      await loadSections()
    } catch {
      alert('No se pudo actualizar la visibilidad.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Secciones</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona las secciones del sitio web</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nueva sección
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay secciones aún.</p>
          <button onClick={openCreate} className="btn-secondary mt-4 text-sm">
            Crear primera sección
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Título</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Orden</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Visible</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {section.title}
                    {section.image && (
                      <span className="ml-2 text-xs text-green-600">📷</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{section.slug}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{section.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisibility(section)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        section.visible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {section.visible ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(section)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                {editingId ? 'Editar sección' : 'Nueva sección'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="title">Título *</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: Hero, Servicios, Nosotros..."
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="slug">Slug</label>
                <input
                  id="slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: hero, servicios, nosotros"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="content">Contenido</label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="form-input resize-none"
                  rows={4}
                  placeholder="Descripción o texto de la sección..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="order">Orden</label>
                  <input
                    id="order"
                    name="order"
                    type="number"
                    value={form.order}
                    onChange={handleChange}
                    className="form-input"
                    min={0}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="visible"
                      type="checkbox"
                      checked={form.visible}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Visible en sitio</span>
                  </label>
                </div>
              </div>

              <ImageUpload
                label="Imagen de sección"
                fieldName="image"
                onFileSelect={setImageFile}
                onRemove={() => setImageFile(null)}
              />

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded p-2">{formError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 text-sm disabled:opacity-60"
                >
                  {submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
