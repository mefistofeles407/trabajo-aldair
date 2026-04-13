import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceFileUrl,
} from '../../api/servicesApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = { title: '', description: '', icon: '', order: 0, visible: true }

export default function ServicesAdmin() {
  const [services, setServices] = useState([])
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
    try { setServices(await getServices(false)) }
    catch { setError('No se pudieron cargar los servicios.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY_FORM); setImageFile(null); setRemoveImage(false)
    setEditingId(null); setEditingRecord(null); setFormError(null); setShowForm(true)
  }

  function openEdit(svc) {
    setForm({ title: svc.title || '', description: svc.description || '', icon: svc.icon || '', order: svc.order ?? 0, visible: svc.visible ?? true })
    setImageFile(null); setRemoveImage(false); setEditingId(svc.id); setEditingRecord(svc)
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
      const payload = { ...form, order: Number(form.order) }
      if (removeImage) payload.image = null
      const data = buildFormDataWithImage(payload, imageFile)
      if (editingId) await updateService(editingId, data)
      else await createService(data)
      setShowForm(false); await load()
    } catch { setFormError('Error al guardar. Intenta nuevamente.') }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este servicio?')) return
    try { await deleteService(id); await load() }
    catch { alert('No se pudo eliminar.') }
  }

  async function toggleVisibility(svc) {
    try { await updateService(svc.id, { visible: !svc.visible }); await load() }
    catch { alert('Error al actualizar.') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona los servicios que ofrece la empresa</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p>
        : error ? <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        : services.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay servicios aún.</p>
            <button onClick={openCreate} className="btn-secondary mt-4 text-sm">Crear primer servicio</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Servicio</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium hidden sm:table-cell">Orden</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Visible</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{svc.title}</div>
                      {svc.description && <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{svc.description}</div>}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">{svc.order}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleVisibility(svc)} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${svc.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {svc.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {svc.visible ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(svc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(svc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
              <h3 className="font-semibold text-gray-800">{editingId ? 'Editar servicio' : 'Nuevo servicio'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="svc-title">Título *</label>
                <input id="svc-title" name="title" value={form.title} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label className="form-label" htmlFor="svc-desc">Descripción</label>
                <textarea id="svc-desc" name="description" value={form.description} onChange={handleChange} className="form-input resize-none" rows={3} />
              </div>
              <div>
                <label className="form-label" htmlFor="svc-icon">Icono (nombre Lucide, ej: Building2)</label>
                <input id="svc-icon" name="icon" value={form.icon} onChange={handleChange} className="form-input" placeholder="Building2, Hammer, Ruler..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="svc-order">Orden</label>
                  <input id="svc-order" name="order" type="number" value={form.order} onChange={handleChange} className="form-input" min={0} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="visible" type="checkbox" checked={form.visible} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-700">Visible</span>
                  </label>
                </div>
              </div>
              <ImageUpload
                label="Imagen del servicio"
                fieldName="svc-image"
                currentImageUrl={editingRecord?.image ? getServiceFileUrl(editingRecord, editingRecord.image) : null}
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
