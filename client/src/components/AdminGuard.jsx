import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export default function AdminGuard({ children }) {
  const user = useSelector(s => s.auth.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
