import PocketBase from 'pocketbase'

/**
 * URL de la instancia de PocketBase.
 * En producción, cambiar por la URL real del servidor.
 * Se puede configurar mediante la variable de entorno VITE_PB_URL.
 */
const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090'

const pb = new PocketBase(PB_URL)

// Persistir la sesión del admin en localStorage automáticamente
pb.authStore.onChange(() => {}, true)

export default pb
export { PB_URL }
