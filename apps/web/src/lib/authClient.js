import pb from './pocketbaseClient.js'

/**
 * authClient.js
 * Módulo de autenticación para el panel admin de MUYU Contratistas.
 * Utiliza la autenticación nativa de PocketBase para administradores.
 */

/**
 * Inicia sesión del administrador.
 * @param {string} email - Correo del administrador
 * @param {string} password - Contraseña del administrador
 * @returns {Promise<object>} Datos del administrador autenticado
 */
export async function loginAdmin(email, password) {
  try {
    const authData = await pb.admins.authWithPassword(email, password)
    return authData
  } catch (error) {
    throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.')
  }
}

/**
 * Cierra la sesión del administrador actual.
 */
export function logoutAdmin() {
  pb.authStore.clear()
}

/**
 * Verifica si hay un administrador autenticado con sesión válida.
 * @returns {boolean}
 */
export function isAdminAuthenticated() {
  return pb.authStore.isValid && pb.authStore.isAdmin
}

/**
 * Refresca el token de autenticación si está próximo a expirar.
 * @returns {Promise<void>}
 */
export async function refreshAdminAuth() {
  if (isAdminAuthenticated()) {
    try {
      await pb.admins.authRefresh()
    } catch {
      pb.authStore.clear()
    }
  }
}

/**
 * Devuelve el modelo del administrador autenticado.
 * @returns {object|null}
 */
export function getCurrentAdmin() {
  return pb.authStore.model
}
