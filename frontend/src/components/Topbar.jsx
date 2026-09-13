import {
  Bell,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Topbar() {
  const { user } = useAuth()

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 backdrop-blur-xl sm:px-7">

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <ShieldCheck size={20} />
        </div>

        <span className="font-bold text-white">
          DocChain
        </span>

      </div>

      {/* Desktop heading */}
      <div className="hidden lg:block">
        <p className="text-xs text-slate-500">
          SECURE DOCUMENT NETWORK
        </p>

        <p className="text-sm font-medium text-slate-300">
          Hyperledger Fabric
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:bg-slate-900 hover:text-slate-300"
          title="Notifications"
        >
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3">

          <div className="hidden text-right sm:block">

            <p className="text-sm font-medium text-slate-200">
              {user?.name || 'User'}
            </p>

            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              {user?.organization || 'Organization'} •{' '}
              {user?.role || 'USER'}
            </p>

          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-sm font-semibold text-blue-400">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-600 sm:block"
          />

        </div>

      </div>

    </header>
  )
}

export default Topbar