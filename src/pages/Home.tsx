import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'
import {
  BookOpen,
  FlaskConical,
  Hammer,
  Siren,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react'

const experiences = [
  {
    to: '/learning-paths',
    icon: BookOpen,
    title: 'Learning Paths',
    description: 'A structured DevOps roadmap from foundations to Kubernetes.',
  },
  {
    to: '/labs',
    icon: FlaskConical,
    title: 'Hands-On Labs',
    description: 'Guided exercises across Linux, Git, Docker, Terraform, and K8s.',
  },
  {
    to: '/projects',
    icon: Hammer,
    title: 'Projects',
    description: 'Increasingly realistic builds, from containers to full IaC.',
  },
  {
    to: '/incidents',
    icon: Siren,
    title: 'Incident Simulator',
    description: 'Troubleshoot real-world failures under simulated pressure.',
  },
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    title: 'Progress Dashboard',
    description: 'Track what you have learned, built, and fixed.',
  },
]

export default function Home() {
  usePageTitle('Home')
  return (
    <div>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center"
      >
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
          DevOps<span className="text-blue-600">Forge</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500">
          Learn. Build. Break. Fix.
        </p>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          An interactive DevOps learning platform. Don't just read about DevOps —
          practice it, build it, and debug it when it breaks.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            render={<Link to="/learning-paths" />}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-base"
          >
            Start Learning
              <ArrowRight size={18} />
          </Button>
          <Button
            render={<Link to="/incidents" />}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-base"
          >
            Try an Incident
          </Button>
        </div>
      </motion.section>

      {/* Experience cards */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map(({ to, icon: Icon, title, description }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.15, ease: 'easeOut' } }}
            >
              <Link
                to={to}
                className="block group rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}