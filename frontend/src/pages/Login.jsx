import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  ArrowRight,
  Network,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    const result = await login(
      email.trim(),
      password
    )

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
              <ShieldCheck size={31} strokeWidth={1.8} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              DocChain
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Blockchain Document Tracking System
            </p>

          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div className="mb-7 flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Welcome back
                </h2>

                <p className="text-xs text-slate-400">
                  Sign in to access your documents
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">

                  <Mail
                    size={18}
                    className="text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">

                  <LockKeyhole
                    size={18}
                    className="text-slate-500"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </form>

            {/* Blockchain status */}
            <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-800 pt-5 text-[11px] text-slate-500">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <Network size={13} />

              <span>
                Secure blockchain network access
              </span>

            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Hyperledger Fabric • Secure Document Tracking
          </p>

        </div>

      </div>
    </main>
  )
}

export default Login