import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
export default function Protected({children}){ const user=useSelector(s=>s.auth.user); const location=useLocation(); if(!user) return <Navigate to='/login' state={{from:location}} replace/>; return children }
