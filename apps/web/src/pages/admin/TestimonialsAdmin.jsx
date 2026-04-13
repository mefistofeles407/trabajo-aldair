import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialFileUrl,
} from '../../api/testimonialsApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = { author: '', role: '', content: '', rating: 5, visible: true, order: 0 }

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([])
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
    try { setItems(await getTestimonials(false)) }
    catch { setError('No se pudieron cargar los testimonios.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY_FORM); setImageFile(null); setRemoveImage(false)
    setEditingId(null); setEditingRecord(null); setFormError(null); setShowForm(true)
  }

  function openEdit(t) {
    setForm({ author: t.author || '', role: t.role || '', content: t.content || '', rating: t.rating ?? 5, visible: t.visible ?? true, order: t.order ?? 0 })
    setImageFile(null); setRemoveImage(false); setEditingId(t.id); setEditingRecord(t)
    setFormError(null); setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.author.trim()) { setFormError('El nombre del autor es obligatorio.'); return }
    if (!form.content.trim()) { setFormError('El contenido del testimonio es obligatorio.'); return }
    setSubmitting(true); setFormError(null)
    try {
      const payload = { ...form, rating: Number(form.rating), order: Number(form.order) }
      if (removeImage) payload.avatar = null
      const data = buildFormDataWithImage(payload, imageFile, 'avatar')
      if (editingId) await updateTestimonial(editingId, data)
      else await createTestimonial(data)
      setShowForm(false); await load()
    } catch { setFormError('Error al guardar.') }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este testimonio?')) return
    try { await deleteTestimonial(id); await load() }
    catch { alert('No se pudo eliminar.') }
  }

  async function toggleVisibility(t) {
    try { await updateTestimonial(t.id, { visible: !t.visible }); await load() }
    catch { alert('Error.') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Testimonios</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona las reseñas y testimonios de clientes</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nuevo testimonio
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p>
        : error ? <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay testimonios aún.</p>
            <button onClick={openCreate} className="btn-secondary mt-4 text-sm">Agregar primer testimonio</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((t) => (
              <div key={t.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{t.author}</p>
                    {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={14} className={s <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{t.content}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => toggleVisibility(t)} className={`p-1.5 rounded-lg text-xs ${t.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {t.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">{editingId ? 'Editar testimonio' : 'Nuevo testimonio'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="t-author">Autor *</label>
                  <input id="t-author" name="author" value={form.author} onChange={handleChange} className="form-input" required />
                </div>
                <div>
                  <label className="form-label" htmlFor="t-role">Cargo / Rol</label>
                  <input id="t-role" name="role" value={form.role} onChange={handleChange} className="form-input" placeholder="Cliente residencial" />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="t-content">Testimonio *</label>
                <textarea id="t-content" name="content" value={form.content} onChange={handleChange} className="form-input resize-none" rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="t-rating">Puntuación (1-5)</label>
                  <input id="t-rating" name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="t-order">Orden</label>
                  <input id="t-order" name="order" type="number" value={form.order} onChange={handleChange} className="form-input" min={0} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="visible" type="checkbox" checked={form.visible} onChange={handleChange} className="rounded" />
                <span className="text-sm text-gray-700">Visible en el sitio</span>
              </label>
              <ImageUpload
                label="Foto del autor (opcional)"
                fieldName="t-avatar"
                currentImageUrl={editingRecord?.avatar ? getTestimonialFileUrl(editingRecord, editingRecord.avatar) : null}
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
