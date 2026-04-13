import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectFileUrl,
} from '../../api/projectsApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = {
  title: '', description: '', client: '', location: '', year: new Date().getFullYear(),
  category: '', featured: false, visible: true, order: 0,
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  async function load() {
    setLoading(true); setError(null)
    try { setProjects(await getProjects(false)) }
    catch { setError('No se pudieron cargar los proyectos.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY_FORM); setImageFile(null); setRemoveImage(false)
    setEditingId(null); setEditingRecord(null); setFormError(null); setShowForm(true)
  }

  function openEdit(p) {
    setForm({
      title: p.title || '', description: p.description || '', client: p.client || '',
      location: p.location || '', year: p.year || new Date().getFullYear(),
      category: p.category || '', featured: p.featured ?? false,
      visible: p.visible ?? true, order: p.order ?? 0,
    })
    setImageFile(null); setRemoveImage(false); setEditingId(p.id); setEditingRecord(p)
    setFormError(null); setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('El título es obligatorio.'); return }
    setSubmitting(true); setFormError(null)
    try {
      const payload = { ...form, year: Number(form.year), order: Number(form.order) }
      if (removeImage) payload.image = null
      const data = buildFormDataWithImage(payload, imageFile)
      if (editingId) await updateProject(editingId, data)
      else await createProject(data)
      setShowForm(false); await load()
    } catch { setFormError('Error al guardar.') }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este proyecto?')) return
    try { await deleteProject(id); await load() }
    catch { alert('No se pudo eliminar.') }
  }

  async function toggleVisibility(p) {
    try { await updateProject(p.id, { visible: !p.visible }); await load() }
    catch { alert('Error.') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Proyectos</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona el portafolio de proyectos</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nuevo proyecto
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p>
        : error ? <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay proyectos aún.</p>
            <button onClick={openCreate} className="btn-secondary mt-4 text-sm">Crear primer proyecto</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Proyecto</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden md:table-cell">Año</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Destacado</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Visible</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{p.title}</div>
                      {p.client && <div className="text-xs text-gray-500 mt-0.5">{p.client}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.year}</td>
                    <td className="px-4 py-3 text-center">
                      {p.featured && <Star size={16} className="text-yellow-500 mx-auto" fill="currentColor" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleVisibility(p)} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${p.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.visible ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="proj-title">Título *</label>
                <input id="proj-title" name="title" value={form.title} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label className="form-label" htmlFor="proj-desc">Descripción</label>
                <textarea id="proj-desc" name="description" value={form.description} onChange={handleChange} className="form-input resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="proj-client">Cliente</label>
                  <input id="proj-client" name="client" value={form.client} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="proj-year">Año</label>
                  <input id="proj-year" name="year" type="number" value={form.year} onChange={handleChange} className="form-input" min={1990} max={2099} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="proj-location">Ubicación</label>
                  <input id="proj-location" name="location" value={form.location} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="proj-category">Categoría</label>
                  <input id="proj-category" name="category" value={form.category} onChange={handleChange} className="form-input" placeholder="Residencial, Comercial..." />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-gray-700">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="visible" type="checkbox" checked={form.visible} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-gray-700">Visible</span>
                </label>
              </div>
              <ImageUpload
                label="Imagen principal"
                fieldName="proj-image"
                currentImageUrl={editingRecord?.image ? getProjectFileUrl(editingRecord, editingRecord.image) : null}
                onFileSelect={setImageFile}
                onRemove={() => { setImageFile(null); setRemoveImage(true) }}
              />
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
