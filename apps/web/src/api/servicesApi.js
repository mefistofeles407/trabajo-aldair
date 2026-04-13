import pb from '../lib/pocketbaseClient.js'

/**
 * servicesApi.js
 * Módulo CRUD para la colección 'services' en PocketBase.
 *
 * Esquema de la tabla 'services':
 *   - id (auto)
 *   - title (text) - Nombre del servicio
 *   - description (editor) - Descripción del servicio
 *   - icon (text) - Nombre del icono Lucide (ej: "Building2")
 *   - image (file) - Imagen representativa
 *   - order (number) - Orden de aparición
 *   - visible (bool)
 *   - created / updated (auto)
 */

const COLLECTION = 'services'

/**
 * Obtiene todos los servicios visibles, ordenados.
 */
export async function getServices(onlyVisible = true) {
  const filter = onlyVisible ? 'visible=true' : ''
  return pb.collection(COLLECTION).getFullList({
    filter,
    sort: 'order',
  })
}

/**
 * Obtiene un servicio por su ID.
 */
export async function getServiceById(id) {
  return pb.collection(COLLECTION).getOne(id)
}

/**
 * Crea un nuevo servicio.
 */
export async function createService(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza un servicio.
 */
export async function updateService(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina un servicio.
 */
export async function deleteService(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública del archivo de un servicio.
 */
export function getServiceFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
