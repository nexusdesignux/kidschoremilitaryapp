import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Enlistment from './pages/Enlistment'
import Login from './pages/Login'
import CommandCenter from './pages/CommandCenter'
import MissionBriefing from './pages/MissionBriefing'
import AgentProfile from './pages/AgentProfile'
import RewardsPage from './pages/RewardsPage'
import FamilySettings from './pages/FamilySettings'
import AddGiftCard from './pages/AddGiftCard'
import MobileUpload from './pages/MobileUpload'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public route for mobile upload - accessible without auth */}
        <Route path="/upload/:sessionId" element={<MobileUpload />} />

        {!user ? (
          <>
            <Route path="/" element={<Enlistment />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/command-center" element={<CommandCenter />} />
            <Route path="/mission/:id" element={<MissionBriefing />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/add-gift-card" element={<AddGiftCard />} />
            <Route path="/settings" element={<FamilySettings />} />
          </Route>
        )}
      </Routes>
    </Router>
  )
}

export default App
