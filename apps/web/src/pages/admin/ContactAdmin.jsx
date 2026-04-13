import { useEffect, useState } from 'react'
import { Save, Mail, Trash2, Eye } from 'lucide-react'
import {
  getContactInfo,
  updateContactInfo,
  createContactInfo,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from '../../api/contactApi.js'

const EMPTY_INFO = {
  phone: '', whatsapp: '', email: '', address: '',
  city: '', google_maps_url: '', facebook: '', instagram: '',
  linkedin: '', schedule: '',
}

/**
 * ContactAdmin.jsx
 * Página para editar la información de contacto y ver mensajes recibidos.
 */
export default function ContactAdmin() {
  const [info, setInfo] = useState(null)
  const [infoId, setInfoId] = useState(null)
  const [form, setForm] = useState(EMPTY_INFO)
  const [messages, setMessages] = useState([])
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  async function loadInfo() {
    setLoadingInfo(true)
    try {
      const data = await getContactInfo()
      if (data) {
        setInfo(data)
        setInfoId(data.id)
        setForm({
          phone: data.phone || '', whatsapp: data.whatsapp || '', email: data.email || '',
          address: data.address || '', city: data.city || '', google_maps_url: data.google_maps_url || '',
          facebook: data.facebook || '', instagram: data.instagram || '',
          linkedin: data.linkedin || '', schedule: data.schedule || '',
        })
      }
    } catch { /* sin datos aún */ }
    finally { setLoadingInfo(false) }
  }

  async function loadMessages() {
    setLoadingMessages(true)
    try { setMessages(await getContactMessages()) }
    catch { /* no hay mensajes */ }
    finally { setLoadingMessages(false) }
  }

  useEffect(() => { loadInfo(); loadMessages() }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSubmitting(true); setError(null); setSuccessMsg(null)
    try {
      if (infoId) {
        await updateContactInfo(infoId, form)
      } else {
        const created = await createContactInfo(form)
        setInfoId(created.id)
      }
      setSuccessMsg('Información de contacto guardada correctamente.')
    } catch { setError('Error al guardar. Intenta nuevamente.') }
    finally { setSubmitting(false) }
  }

  async function handleMarkRead(id) {
    try { await markMessageAsRead(id); await loadMessages() }
    catch { alert('Error.') }
  }

  async function handleDeleteMsg(id) {
    if (!window.confirm('¿Eliminar este mensaje?')) return
    try { await deleteContactMessage(id); await loadMessages() }
    catch { alert('No se pudo eliminar.') }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contacto</h2>
        <p className="text-gray-500 text-sm mt-1">Información de contacto y mensajes recibidos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {[
          { key: 'info', label: 'Información de contacto' },
          { key: 'messages', label: `Mensajes${unreadCount > 0 ? ` (${unreadCount} nuevos)` : ''}` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key ? 'border-muyu-secondary text-muyu-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Info de contacto */}
      {activeTab === 'info' && (
        loadingInfo ? <p className="text-gray-500">Cargando...</p> : (
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'phone', label: 'Teléfono', placeholder: '+51 999 000 000', type: 'tel' },
                { name: 'whatsapp', label: 'WhatsApp', placeholder: '+51 999 000 000', type: 'tel' },
                { name: 'email', label: 'Correo electrónico', placeholder: 'info@muyu.com', type: 'email' },
                { name: 'city', label: 'Ciudad', placeholder: 'Lima', type: 'text' },
              ].map(({ name, label, placeholder, type }) => (
                <div key={name}>
                  <label className="form-label" htmlFor={`ci-${name}`}>{label}</label>
                  <input id={`ci-${name}`} name={name} type={type} value={form[name]} onChange={handleChange} className="form-input" placeholder={placeholder} />
                </div>
              ))}
            </div>

            <div>
              <label className="form-label" htmlFor="ci-address">Dirección</label>
              <input id="ci-address" name="address" value={form.address} onChange={handleChange} className="form-input" placeholder="Av. Principal 123" />
            </div>
            <div>
              <label className="form-label" htmlFor="ci-schedule">Horario de atención</label>
              <input id="ci-schedule" name="schedule" value={form.schedule} onChange={handleChange} className="form-input" placeholder="Lun-Vie 9am-6pm" />
            </div>
            <div>
              <label className="form-label" htmlFor="ci-maps">Enlace Google Maps</label>
              <input id="ci-maps" name="google_maps_url" value={form.google_maps_url} onChange={handleChange} className="form-input" type="url" placeholder="https://maps.google.com/..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'facebook', label: 'Facebook URL' },
                { name: 'instagram', label: 'Instagram URL' },
                { name: 'linkedin', label: 'LinkedIn URL' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="form-label" htmlFor={`ci-${name}`}>{label}</label>
                  <input id={`ci-${name}`} name={name} value={form[name]} onChange={handleChange} className="form-input" type="url" placeholder="https://..." />
                </div>
              ))}
            </div>

            {successMsg && <p className="text-sm text-green-700 bg-green-50 rounded p-2">{successMsg}</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
              <Save size={16} />
              {submitting ? 'Guardando...' : 'Guardar información'}
            </button>
          </form>
        )
      )}

      {/* Tab: Mensajes */}
      {activeTab === 'messages' && (
        loadingMessages ? <p className="text-gray-500">Cargando...</p>
          : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No hay mensajes aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${msg.read ? 'border-gray-200' : 'border-muyu-accent'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-gray-800">{msg.name}</span>
                        <span className="text-sm text-gray-500">{msg.email}</span>
                        {!msg.read && <span className="text-xs bg-muyu-accent text-white px-2 py-0.5 rounded-full">Nuevo</span>}
                      </div>
                      {msg.subject && <p className="text-sm font-medium text-gray-700 mt-1">{msg.subject}</p>}
                      <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(msg.created).toLocaleString('es-PE')}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!msg.read && (
                        <button onClick={() => handleMarkRead(msg.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Marcar como leído">
                          <Eye size={16} />
                        </button>
                      )}
                      <button onClick={() => handleDeleteMsg(msg.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )
}
