import pb from '../lib/pocketbaseClient.js'

/**
 * testimonialsApi.js
 * Módulo CRUD para la colección 'testimonials' en PocketBase.
 *
 * Esquema de la tabla 'testimonials':
 *   - id (auto)
 *   - author (text) - Nombre del autor
 *   - role (text) - Cargo o descripción del autor (ej: "Cliente residencial")
 *   - content (editor) - Texto del testimonio
 *   - avatar (file) - Foto del autor (opcional)
 *   - rating (number) - Puntuación 1-5 (opcional)
 *   - visible (bool)
 *   - order (number)
 *   - created / updated (auto)
 */

const COLLECTION = 'testimonials'

/**
 * Obtiene todos los testimonios visibles.
 */
export async function getTestimonials(onlyVisible = true) {
  const filter = onlyVisible ? 'visible=true' : ''
  return pb.collection(COLLECTION).getFullList({
    filter,
    sort: 'order',
  })
}

/**
 * Obtiene un testimonio por su ID.
 */
export async function getTestimonialById(id) {
  return pb.collection(COLLECTION).getOne(id)
}

/**
 * Crea un nuevo testimonio.
 */
export async function createTestimonial(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza un testimonio.
 */
export async function updateTestimonial(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina un testimonio.
 */
export async function deleteTestimonial(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública del avatar de un testimonio.
 */
export function getTestimonialFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
