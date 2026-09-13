import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import DocumentDetails from './pages/DocumentDetails'
import UploadDocument from './pages/UploadDocument'
import Blockchain from './pages/Blockchain'
import AuditTrail from './pages/AuditTrail'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Protected application */}
          <Route element={<ProtectedRoute />}>

            <Route element={<AppLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route
  path="/documents"
  element={<Documents />}
/>
<Route
  path="/documents/:documentId"
  element={<DocumentDetails />}
/>
<Route
  path="/upload"
  element={<UploadDocument />}
/>
<Route
  path="/blockchain"
  element={<Blockchain />}
/>
<Route
  path="/audit"
  element={<AuditTrail />}
/>

            </Route>

          </Route>

          {/* Default */}
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
        

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App