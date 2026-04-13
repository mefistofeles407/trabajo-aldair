import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

/**
 * ProtectedRoute.jsx
 * Componente de ruta protegida para el panel admin.
 * Si el usuario no está autenticado, redirige al login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
