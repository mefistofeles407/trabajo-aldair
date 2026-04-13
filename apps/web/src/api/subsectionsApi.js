import pb from '../lib/pocketbaseClient.js'

/**
 * subsectionsApi.js
 * Módulo CRUD para la colección 'subsections' en PocketBase.
 *
 * Esquema de la tabla 'subsections':
 *   - id (auto)
 *   - section (relation → sections) - Sección padre
 *   - title (text) - Título de la subsección
 *   - content (editor) - Contenido/descripción
 *   - image (file) - Imagen de la subsección
 *   - order (number) - Orden dentro de la sección padre
 *   - visible (bool)
 *   - created / updated (auto)
 */

const COLLECTION = 'subsections'

/**
 * Obtiene todas las subsecciones, opcionalmente filtradas por sección padre.
 * @param {string} [sectionId] - ID de la sección padre (opcional)
 */
export async function getSubsections(sectionId = null) {
  const filter = sectionId ? `section="${sectionId}"` : ''
  return pb.collection(COLLECTION).getFullList({
    filter,
    sort: 'order',
    expand: 'section',
  })
}

/**
 * Obtiene una subsección por su ID.
 */
export async function getSubsectionById(id) {
  return pb.collection(COLLECTION).getOne(id, { expand: 'section' })
}

/**
 * Crea una nueva subsección.
 */
export async function createSubsection(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza una subsección existente.
 */
export async function updateSubsection(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina una subsección.
 */
export async function deleteSubsection(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública del archivo de una subsección.
 */
export function getSubsectionFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
