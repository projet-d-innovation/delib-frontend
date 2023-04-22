import { Navigate, Route, Routes } from "react-router-dom"
import AdminLayout from "../layouts/AdminLayout"
import Dashboard from "./admin/Dashboard"
import ProtectedRoute from "../components/ProtectedRoutes"
import Login from "./auth/Login"
import AuthLayout from "../layouts/AuthLayout"
import useAuthStore from "../store/authStore"
import Home from "./student/Home"

function App() {
  const authStore = useAuthStore()

  if (!authStore.mounted) {
    authStore.loadUser()
    return <div > loading </div>
  }

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="admin" element={
        <ProtectedRoute
          isSignedIn={authStore.isAuthenticated}
          isAllowed={authStore.isPermeted('ACCESS_DASHBOARD')}
          children={<AdminLayout />}
        />
      }>
        <Route index element={<Dashboard />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>

      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/redirect"
        element={
          <ProtectedRoute
            isSignedIn={authStore.isAuthenticated}
            children={authStore.isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/" />}
          />
        }
      />
      <Route path="*" element={<h1>404</h1>} />

    </Routes>
  )
}

export default App
