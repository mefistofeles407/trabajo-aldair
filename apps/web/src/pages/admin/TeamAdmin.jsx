import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, User } from 'lucide-react'
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberPhotoUrl,
} from '../../api/teamApi.js'
import { buildFormDataWithImage } from '../../utils/imageUpload.js'
import ImageUpload from '../../components/ImageUpload.jsx'

const EMPTY_FORM = { name: '', role: '', bio: '', email: '', linkedin: '', order: 0, visible: true }

export default function TeamAdmin() {
  const [members, setMembers] = useState([])
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
    try { setMembers(await getTeamMembers(false)) }
    catch { setError('No se pudieron cargar los integrantes del equipo.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY_FORM); setImageFile(null); setRemoveImage(false)
    setEditingId(null); setEditingRecord(null); setFormError(null); setShowForm(true)
  }

  function openEdit(member) {
    setForm({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      order: member.order ?? 0,
      visible: member.visible ?? true,
    })
    setImageFile(null); setRemoveImage(false); setEditingId(member.id)
    setEditingRecord(member); setFormError(null); setShowForm(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('El nombre es obligatorio.'); return }
    setSubmitting(true); setFormError(null)
    try {
      const payload = { ...form, order: Number(form.order) }
      if (removeImage) payload.photo = null
      const data = buildFormDataWithImage(payload, imageFile, 'photo')
      if (editingId) await updateTeamMember(editingId, data)
      else await createTeamMember(data)
      setShowForm(false); await load()
    } catch { setFormError('Error al guardar. Intenta nuevamente.') }
    finally { setSubmitting(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este integrante del equipo?')) return
    try { await deleteTeamMember(id); await load() }
    catch { alert('No se pudo eliminar.') }
  }

  async function toggleVisibility(member) {
    try { await updateTeamMember(member.id, { visible: !member.visible }); await load() }
    catch { alert('Error al actualizar.') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Equipo</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona los integrantes del equipo del arquitecto</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nuevo integrante
        </button>
      </div>

      {loading ? <p className="text-gray-500">Cargando...</p>
        : error ? <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{error}</div>
        : members.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay integrantes aún.</p>
            <button onClick={openCreate} className="btn-secondary mt-4 text-sm">Agregar primer integrante</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Integrante</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">Cargo</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium hidden sm:table-cell">Orden</th>
                  <th className="px-4 py-3 text-center text-gray-600 font-medium">Visible</th>
                  <th className="px-4 py-3 text-right text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {member.photo ? (
                          <img
                            src={getTeamMemberPhotoUrl(member, member.photo)}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-muyu-primary/10 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-muyu-primary" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{member.role}</td>
                    <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">{member.order}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleVisibility(member)} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${member.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {member.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {member.visible ? 'Sí' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(member)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(member.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
              <h3 className="font-semibold text-gray-800">{editingId ? 'Editar integrante' : 'Nuevo integrante'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="form-label" htmlFor="tm-name">Nombre completo *</label>
                <input id="tm-name" name="name" value={form.name} onChange={handleChange} className="form-input" required />
              </div>
              <div>
                <label className="form-label" htmlFor="tm-role">Cargo / Especialidad</label>
                <input id="tm-role" name="role" value={form.role} onChange={handleChange} className="form-input" placeholder="Arquitecto, Diseñador, Gerente..." />
              </div>
              <div>
                <label className="form-label" htmlFor="tm-bio">Biografía / Descripción</label>
                <textarea id="tm-bio" name="bio" value={form.bio} onChange={handleChange} className="form-input resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="tm-email">Correo electrónico</label>
                  <input id="tm-email" name="email" type="email" value={form.email} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label" htmlFor="tm-linkedin">LinkedIn (URL)</label>
                  <input id="tm-linkedin" name="linkedin" type="url" value={form.linkedin} onChange={handleChange} className="form-input" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="tm-order">Orden</label>
                  <input id="tm-order" name="order" type="number" value={form.order} onChange={handleChange} className="form-input" min={0} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="visible" type="checkbox" checked={form.visible} onChange={handleChange} className="rounded" />
                    <span className="text-sm text-gray-700">Visible</span>
                  </label>
                </div>
              </div>
              <ImageUpload
                label="Foto de perfil"
                fieldName="tm-photo"
                currentImageUrl={editingRecord?.photo ? getTeamMemberPhotoUrl(editingRecord, editingRecord.photo) : null}
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
