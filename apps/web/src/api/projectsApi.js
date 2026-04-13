import pb from '../lib/pocketbaseClient.js'

/**
 * projectsApi.js
 * Módulo CRUD para la colección 'projects' en PocketBase.
 *
 * Esquema de la tabla 'projects':
 *   - id (auto)
 *   - title (text) - Nombre del proyecto
 *   - description (editor) - Descripción del proyecto
 *   - client (text) - Nombre del cliente
 *   - location (text) - Ubicación del proyecto
 *   - year (number) - Año de realización
 *   - category (text) - Categoría (residencial, comercial, industrial, etc.)
 *   - image (file) - Imagen principal
 *   - gallery (file, multiple) - Galería de imágenes
 *   - featured (bool) - Si es proyecto destacado
 *   - visible (bool)
 *   - order (number)
 *   - created / updated (auto)
 */

const COLLECTION = 'projects'

/**
 * Obtiene todos los proyectos.
 * @param {boolean} onlyVisible - Si solo devuelve los proyectos visibles
 * @param {boolean} featuredOnly - Si solo devuelve los proyectos destacados
 */
export async function getProjects(onlyVisible = true, featuredOnly = false) {
  const filters = []
  if (onlyVisible) filters.push('visible=true')
  if (featuredOnly) filters.push('featured=true')
  const filter = filters.join(' && ')

  return pb.collection(COLLECTION).getFullList({
    filter,
    sort: '-year,order',
  })
}

/**
 * Obtiene un proyecto por su ID.
 */
export async function getProjectById(id) {
  return pb.collection(COLLECTION).getOne(id)
}

/**
 * Crea un nuevo proyecto.
 */
export async function createProject(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza un proyecto.
 */
export async function updateProject(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina un proyecto.
 */
export async function deleteProject(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública del archivo de un proyecto.
 */
export function getProjectFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
