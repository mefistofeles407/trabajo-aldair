import pb from '../lib/pocketbaseClient.js'

/**
 * contactApi.js
 * Módulo CRUD para la colección 'contact_info' en PocketBase.
 * También maneja el envío de mensajes de contacto (colección 'contact_messages').
 *
 * Esquema de la tabla 'contact_info':
 *   - id (auto)
 *   - phone (text) - Teléfono principal
 *   - whatsapp (text) - Número de WhatsApp
 *   - email (text) - Correo de contacto
 *   - address (text) - Dirección física
 *   - city (text) - Ciudad
 *   - google_maps_url (url) - Link de Google Maps
 *   - facebook (url) - Link Facebook
 *   - instagram (url) - Link Instagram
 *   - linkedin (url) - Link LinkedIn
 *   - schedule (text) - Horario de atención
 *   - created / updated (auto)
 *
 * Esquema de la tabla 'contact_messages':
 *   - id (auto)
 *   - name (text) - Nombre del remitente
 *   - email (text) - Email del remitente
 *   - phone (text) - Teléfono (opcional)
 *   - subject (text) - Asunto
 *   - message (editor) - Mensaje
 *   - read (bool) - Si fue leído por el admin
 *   - created / updated (auto)
 */

const CONTACT_INFO_COLLECTION = 'contact_info'
const CONTACT_MESSAGES_COLLECTION = 'contact_messages'

/**
 * Obtiene la información de contacto (solo hay un registro).
 */
export async function getContactInfo() {
  const list = await pb.collection(CONTACT_INFO_COLLECTION).getFullList({ limit: 1 })
  return list[0] || null
}

/**
 * Actualiza la información de contacto.
 * @param {string} id - ID del registro
 * @param {object} data
 */
export async function updateContactInfo(id, data) {
  return pb.collection(CONTACT_INFO_COLLECTION).update(id, data)
}

/**
 * Crea el registro de información de contacto inicial.
 */
export async function createContactInfo(data) {
  return pb.collection(CONTACT_INFO_COLLECTION).create(data)
}

/**
 * Obtiene todos los mensajes de contacto recibidos.
 * @param {boolean} unreadOnly - Si solo devuelve los no leídos
 */
export async function getContactMessages(unreadOnly = false) {
  const filter = unreadOnly ? 'read=false' : ''
  return pb.collection(CONTACT_MESSAGES_COLLECTION).getFullList({
    filter,
    sort: '-created',
  })
}

/**
 * Envía un nuevo mensaje de contacto desde el formulario público.
 */
export async function sendContactMessage(data) {
  return pb.collection(CONTACT_MESSAGES_COLLECTION).create({
    ...data,
    read: false,
  })
}

/**
 * Marca un mensaje como leído.
 */
export async function markMessageAsRead(id) {
  return pb.collection(CONTACT_MESSAGES_COLLECTION).update(id, { read: true })
}

/**
 * Elimina un mensaje de contacto.
 */
export async function deleteContactMessage(id) {
  return pb.collection(CONTACT_MESSAGES_COLLECTION).delete(id)
}
