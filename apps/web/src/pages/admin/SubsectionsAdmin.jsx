import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  getSubsections,
  createSubsection,
  updateSubsection,
  deleteSubsection,
} from '../../api/subsectionsApi.js'
import { getSections } from '../../api/sectionsApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = {
  section: '',
  title: '',
  content: '',
  order: 0,
  visible: true,
}

/**
 * SubsectionsAdmin.jsx
 * Página CRUD para la gestión de subsecciones del sitio.
 */
export default function SubsectionsAdmin() {
  const [subsections, setSubsections] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [filterSection, setFilterSection] = useState('')

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [subs, sects] = await Promise.all([
        getSubsections(filterSection || null),
        getSections(),
      ])
      setSubsections(subs)
      setSections(sects)
    } catch {
      setError('No se pudieron cargar las subsecciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [filterSection])

  function openCreate() {
    setForm(EMPTY_FORM)
    setImageFile(null)
    setEditingId(null)
    setFormError(null)
    setShowForm(true)
  }

  function openEdit(sub) {
    setForm({
      section: sub.section || '',
      title: sub.title || '',
      content: sub.content || '',
      order: sub.order ?? 0,
      visible: sub.visible ?? true,
    })
    setImageFile(null)
    setEditingId(sub.id)
    setFormError(null)
    setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('El título es obligatorio.'); return }
    if (!form.section) { setFormError('Debes seleccionar una sección padre.'); return }
    setSubmitting(true)
    setFormError(null)
    try {
      const data = buildFormDataWithImage({ ...form, order: Number(form.order) }, imageFile)
      if (editingId) {
        await updateSubsection(editingId, data)
      } else {
        await createSubsection(data)
      }
      setShowForm(false)
      await loadAll()
    } catch {
      setFormError('Error al guardar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta subsección?')) return
    try {
      await deleteSubsection(id)
      await loadAll()
    } catch { alert('No se pudo eliminar la subsección.') }
  }

  async function toggleVisibility(sub) {
    try {
      await updateSubsection(sub.id, { visible: !sub.visible })
      await loadAll()
    } catch { alert('Error al actualizar visibilidad.') }
  }

  const getSectionName = (id) => sections.find((s) => s.id === id)?.title || id

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subsecciones</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona las subsecciones dentro de cada sección</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nueva subsección
        </button>
      </div>

      {/* Filtro por sección */}
      <div className="mb-4">
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="form-input max-w-xs"
        >
          <option value="">Todas las secciones</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
      ) : subsections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay subsecciones aún.</p>
          <button onClick={openCreate} className="btn-secondary mt-4 text-sm">Crear primera subsección</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Título</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">Sección padre</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Orden</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Visible</th>
                <th className="px-4 py-3 text-right text-gray-600 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subsections.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{sub.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{getSectionName(sub.section)}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{sub.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisibility(sub)}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        sub.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sub.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                      {sub.visible ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(sub)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                {editingId ? 'Editar subsección' : 'Nueva subsección'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="section">Sección padre *</label>
                <select id="section" name="section" value={form.section} onChange={handleChange} className="form-input" required>
                  <option value="">Seleccionar sección...</option>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="sub-title">Título *</label>
                <input id="sub-title" name="title" value={form.title} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label className="form-label" htmlFor="sub-content">Contenido</label>
                <textarea id="sub-content" name="content" value={form.content} onChange={handleChange} className="form-input resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="sub-order">Orden</label>
                  <input id="sub-order" name="order" type="number" value={form.order} onChange={handleChange} className="form-input" min={0} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="visible" type="checkbox" checked={form.visible} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-700">Visible</span>
                  </label>
                </div>
              </div>
              <ImageUpload label="Imagen" fieldName="sub-image" onFileSelect={setImageFile} onRemove={() => setImageFile(null)} />
              {formError && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 text-sm disabled:opacity-60">
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
