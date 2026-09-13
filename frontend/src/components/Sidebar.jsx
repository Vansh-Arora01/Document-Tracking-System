import {
  LayoutDashboard,
  Files,
  Upload,
  Blocks,
  History,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { logout } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Documents',
      path: '/documents',
      icon: Files,
    },
    {
      name: 'Upload Document',
      path: '/upload',
      icon: Upload,
    },
    {
      name: 'Blockchain',
      path: '/blockchain',
      icon: Blocks,
    },
    {
      name: 'Audit Trail',
      path: '/audit',
      icon: History,
    },
  ]

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
          <ShieldCheck size={23} />
        </div>

        <div>
          <h1 className="font-bold tracking-tight text-white">
            DocChain
          </h1>

          <p className="text-[10px] text-slate-500">
            DOCUMENT TRACKING
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                  isActive
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
                ].join(' ')
              }
            >
              <Icon size={18} strokeWidth={1.8} />

              <span>{item.name}</span>
            </NavLink>
          )
        })}

      </nav>

      {/* Network status */}
      <div className="mx-3 mb-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">

        <div className="flex items-center gap-2">

          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-xs font-medium text-emerald-400">
            Network Connected
          </span>

        </div>

        <p className="mt-1 pl-4 text-[10px] text-slate-600">
          Hyperledger Fabric
        </p>

      </div>

      {/* Logout */}
      <div className="border-t border-slate-800 p-3">

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut size={18} />

          <span>Sign out</span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar