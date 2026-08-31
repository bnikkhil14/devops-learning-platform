import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import LearningPaths from './pages/LearningPaths'
import Labs from './pages/Labs'
import Projects from './pages/Projects'
import Incidents from './pages/Incidents'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ProtectedRoute } from './components/ProtectedRoute'

import LabDetail from './pages/LabDetail'
import ProjectDetail from './pages/ProjectDetail'
import LearningPathDetail from './pages/LearningPathDetail'

export default function App() {
  return (
    <BrowserRouter basename="/devops-learning-platform">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="learning-paths" element={<LearningPaths />} />
          <Route path="learning-paths/:slug" element={<LearningPathDetail />} />
          
          <Route path="labs" element={<Labs />} />
          <Route path="labs/:slug" element={<LabDetail />} />
          
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          
          <Route path="incidents" element={<Incidents />} />
          
          <Route path="login" element={<Login />} />
          
          <Route path="signup" element={<Signup />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}