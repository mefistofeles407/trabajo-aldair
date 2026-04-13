import pb from '../lib/pocketbaseClient.js'

/**
 * imageUpload.js
 * Utilidades para subida, validación y eliminación de imágenes en PocketBase.
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

/**
 * Valida un archivo de imagen antes de subirlo.
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo.' }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Tipos aceptados: ${ALLOWED_TYPES.join(', ')}`,
    }
  }
  if (file.size > MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo: ${MAX_SIZE_MB} MB.`,
    }
  }
  return { valid: true, error: null }
}

/**
 * Prepara un FormData con los datos del registro y el archivo de imagen.
 * @param {object} recordData - Campos del registro (sin imagen)
 * @param {File} imageFile - Archivo de imagen
 * @param {string} fieldName - Nombre del campo de imagen en la colección
 * @returns {FormData}
 */
export function buildFormDataWithImage(recordData, imageFile, fieldName = 'image') {
  const formData = new FormData()

  Object.entries(recordData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  if (imageFile) {
    formData.append(fieldName, imageFile)
  }

  return formData
}

/**
 * Elimina un archivo de un registro en PocketBase.
 * Esto se hace enviando el campo con valor vacío ('').
 * @param {string} collection - Nombre de la colección
 * @param {string} recordId - ID del registro
 * @param {string} fieldName - Nombre del campo de archivo
 */
export async function deleteImageFromRecord(collection, recordId, fieldName = 'image') {
  return pb.collection(collection).update(recordId, {
    [`${fieldName}`]: null,
  })
}

/**
 * Genera una URL de previsualización desde un objeto File local.
 * Recuerda liberar la URL con URL.revokeObjectURL() cuando ya no se necesite.
 * @param {File} file
 * @returns {string} URL de objeto local
 */
export function createPreviewUrl(file) {
  return URL.createObjectURL(file)
}

/**
 * Genera la URL pública de un archivo en PocketBase.
 * @param {object} record - Registro de PocketBase
 * @param {string} filename - Nombre del archivo
 * @returns {string}
 */
export function getFileUrl(record, filename) {
  return pb.files.getUrl(record, filename)
}
