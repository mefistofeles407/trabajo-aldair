import pb from '../lib/pocketbaseClient.js'

/**
 * sectionsApi.js
 * Módulo CRUD para la colección 'sections' en PocketBase.
 *
 * Esquema de la tabla 'sections':
 *   - id (auto)
 *   - title (text) - Título de la sección
 *   - slug (text) - Identificador único URL-friendly
 *   - content (editor) - Contenido/descripción principal
 *   - image (file) - Imagen principal de la sección
 *   - order (number) - Orden de aparición
 *   - visible (bool) - Si la sección está visible en el sitio
 *   - created / updated (auto)
 */

const COLLECTION = 'sections'

/**
 * Obtiene todas las secciones ordenadas por 'order'.
 */
export async function getSections(options = {}) {
  return pb.collection(COLLECTION).getFullList({
    sort: 'order',
    ...options,
  })
}

/**
 * Obtiene una sección por su ID.
 */
export async function getSectionById(id) {
  return pb.collection(COLLECTION).getOne(id)
}

/**
 * Obtiene una sección por su slug.
 */
export async function getSectionBySlug(slug) {
  return pb.collection(COLLECTION).getFirstListItem(`slug="${slug}"`)
}

/**
 * Obtiene la sección del logo (title='logotipo').
 */
export async function getLogoSection() {
  return pb.collection(COLLECTION).getFirstListItem(`title="logotipo"`)
}

/**
 * Crea una nueva sección.
 * @param {FormData|object} data
 */
export async function createSection(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza una sección existente.
 * @param {string} id
 * @param {FormData|object} data
 */
export async function updateSection(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina una sección por su ID.
 * @param {string} id
 */
export async function deleteSection(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública de un archivo de la colección sections.
 * @param {object} record - Registro de PocketBase
 * @param {string} filename - Nombre del archivo
 */
export function getSectionFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
