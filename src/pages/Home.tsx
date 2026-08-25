import { Link } from 'react-router-dom'
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
  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
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
          <Link
            to="/learning-paths"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Start Learning
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/incidents"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Try an Incident
          </Link>
        </div>
      </section>

      {/* Experience cards */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}