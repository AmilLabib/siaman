import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import './App.css'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CCTVPage from './pages/CCTVPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import IncidentsPage from './pages/IncidentsPage'
import MapPage from './pages/MapPage'
import SatpamContactPage from './pages/SatpamContactPage'
import SatpamDashboard from './pages/SatpamDashboard'
import LaporPolisiPage from './pages/LaporPolisiPage'
import BottomNav from './components/BottomNav'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to={currentUser.role === 'warga' ? '/dashboard' : '/satpam'} replace /> : <LoginPage />} />
        <Route path="/" element={<Navigate to={currentUser ? (currentUser.role === 'warga' ? '/dashboard' : '/satpam') : '/login'} replace />} />

        {/* Warga routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* Satpam / PKD routes */}
        <Route path="/satpam" element={<ProtectedRoute><SatpamDashboard /></ProtectedRoute>} />
        <Route path="/lapor-polisi" element={<ProtectedRoute><LaporPolisiPage /></ProtectedRoute>} />

        {/* Shared routes */}
        <Route path="/cctv" element={<ProtectedRoute><CCTVPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><IncidentsPage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/satpam-contact" element={<ProtectedRoute><SatpamContactPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {currentUser && <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
