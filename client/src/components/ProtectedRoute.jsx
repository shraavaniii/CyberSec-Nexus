import { Navigate } from "react-router-dom"

function ProtectedRoute({ children, adminOnly = false }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  const role = localStorage.getItem("role")

  // NOT LOGGED IN → GO TO LOGIN
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // ADMIN ONLY PAGE + USER IS NOT ADMIN → ACCESS DENIED
  if (adminOnly && role !== "admin") {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
