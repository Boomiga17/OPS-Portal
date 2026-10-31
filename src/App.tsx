import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientTrackerPage from './pages/ClientTrackerPage'
import FeaturesPage from './pages/FeaturesPage'
import MigrationPage from './pages/MigrationPage'
import AdminPanelPage from './pages/AdminPanelPage'
import PresentationPage from './pages/PresentationPage'
import { PortalProvider } from './context/PortalContext'
import SettingsModal from './components/SettingsModal'
import PresentationModal from './components/PresentationModal'
import AddClientModal from './components/AddClientModal'
import ImportExportModal from './components/ImportExportModal'
import ClientDetailModal from './components/ClientDetailModal'

function App() {
  return (
    <BrowserRouter>
      <PortalProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/client-tracker" element={<ClientTrackerPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/migration" element={<MigrationPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="/present" element={<PresentationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Global Modal Layer */}
        <SettingsModal />
        <PresentationModal />
        <AddClientModal />
        <ImportExportModal />
        <ClientDetailModal />
      </PortalProvider>
    </BrowserRouter>
  )
}

export default App
