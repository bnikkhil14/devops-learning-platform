import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import LearningPaths from './pages/LearningPaths'
import Labs from './pages/Labs'
import Projects from './pages/Projects'
import Incidents from './pages/Incidents'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learning-paths" element={<LearningPaths />} />
          <Route path="labs" element={<Labs />} />
          <Route path="projects" element={<Projects />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}