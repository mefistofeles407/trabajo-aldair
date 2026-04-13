import { useState, useEffect, useCallback } from 'react'
import pb from '../lib/pocketbaseClient.js'
import {
  loginAdmin,
  logoutAdmin,
  isAdminAuthenticated,
  getCurrentAdmin,
  refreshAdminAuth,
} from '../lib/authClient.js'

/**
 * useAuth.js
 * Hook personalizado para manejar el estado de autenticación del admin.
 * Se usa en toda la aplicación para saber si hay un admin logueado.
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated())
  const [admin, setAdmin] = useState(getCurrentAdmin())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Suscribirse a cambios en el authStore de PocketBase
  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(isAdminAuthenticated())
      setAdmin(getCurrentAdmin())
    })

    // Intentar refrescar la sesión al montar el hook
    refreshAdminAuth()

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      await loginAdmin(email, password)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    logoutAdmin()
  }, [])

  return { isAuthenticated, admin, loading, error, login, logout }
}
