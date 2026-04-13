import pb from '../lib/pocketbaseClient.js'

/**
 * teamApi.js
 * Módulo CRUD para la colección 'team_members' en PocketBase.
 *
 * Esquema de la tabla 'team_members':
 *   - id (auto)
 *   - name (text) - Nombre completo del integrante
 *   - role (text) - Cargo o especialidad
 *   - bio (editor) - Biografía o descripción corta
 *   - photo (file) - Fotografía de perfil (jpg, png, webp)
 *   - email (email) - Correo de contacto (opcional)
 *   - linkedin (url) - Perfil LinkedIn (opcional)
 *   - order (number) - Orden de aparición
 *   - visible (bool) - Si aparece en el sitio
 *   - created / updated (auto)
 */

const COLLECTION = 'team_members'

/**
 * Obtiene todos los integrantes del equipo, opcionalmente solo los visibles.
 */
export async function getTeamMembers(onlyVisible = true) {
  const filter = onlyVisible ? 'visible=true' : ''
  return pb.collection(COLLECTION).getFullList({
    filter,
    sort: 'order',
  })
}

/**
 * Obtiene un integrante por su ID.
 */
export async function getTeamMemberById(id) {
  return pb.collection(COLLECTION).getOne(id)
}

/**
 * Crea un nuevo integrante del equipo.
 * @param {FormData|object} data
 */
export async function createTeamMember(data) {
  return pb.collection(COLLECTION).create(data)
}

/**
 * Actualiza un integrante del equipo.
 * @param {string} id
 * @param {FormData|object} data
 */
export async function updateTeamMember(id, data) {
  return pb.collection(COLLECTION).update(id, data)
}

/**
 * Elimina un integrante del equipo.
 * @param {string} id
 */
export async function deleteTeamMember(id) {
  return pb.collection(COLLECTION).delete(id)
}

/**
 * Genera la URL pública de la foto de un integrante.
 * @param {object} record - Registro de PocketBase
 * @param {string} filename - Nombre del archivo
 */
export function getTeamMemberPhotoUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
