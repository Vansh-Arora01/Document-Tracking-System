import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Archive,
  Blocks,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import {
  getAllDocuments,
  getDocumentHistory,
} from '../services/documentService'

function Dashboard() {
  const { user } = useAuth()

  const [documents, setDocuments] = useState([])
  const [blockchainEvents, setBlockchainEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activityLoading, setActivityLoading] = useState(false)

  const [error, setError] = useState('')

  async function loadDashboard() {
    try {
      setError('')

      const result = await getAllDocuments()

      const docs =
        Array.isArray(result)
          ? result
          : Array.isArray(result?.documents)
            ? result.documents
            : Array.isArray(result?.data)
              ? result.data
              : []

      setDocuments(docs)

      if (docs.length === 0) {
        setBlockchainEvents([])
        return
      }

      setActivityLoading(true)

      try {
        const historyResults = await Promise.all(
          docs.map(async (document) => {
            try {
              const result = await getDocumentHistory(
                document.documentId
              )

              const history =
                Array.isArray(result)
                  ? result
                  : Array.isArray(result?.history)
                    ? result.history
                    : Array.isArray(result?.data)
                      ? result.data
                      : []

              return {
                document,
                history,
              }
            } catch (historyError) {
              console.error(
                `Failed to load history for ${document.documentId}:`,
                historyError
              )

              return {
                document,
                history: [],
              }
            }
          })
        )

        const events = []

        historyResults.forEach(({ document, history }) => {
          history.forEach((record, index) => {
            const previous =
              index > 0
                ? history[index - 1]
                : null

            const event = detectBlockchainEvent(
              previous,
              record
            )

            events.push({
              id: `${document.documentId}-${record.txId}-${index}`,

              documentId: document.documentId,

              title:
                record.value?.title ||
                document.title ||
                document.fileName ||
                'Untitled Document',

              event,

              timestamp: record.timestamp,

              txId: record.txId,

              owner:
                record.value?.owner ||
                document.owner ||
                '—',
            })
          })
        })

        events.sort((a, b) => {
          const dateA = new Date(
            a.timestamp || 0
          ).getTime()

          const dateB = new Date(
            b.timestamp || 0
          ).getTime()

          return dateB - dateA
        })

        setBlockchainEvents(
          events.slice(0, 8)
        )
      } finally {
        setActivityLoading(false)
      }
    } catch (err) {
      console.error(
        'Dashboard loading failed:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Unable to load dashboard data.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
      setActivityLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await loadDashboard()
  }

  const stats = useMemo(() => {
    const total = documents.length

    const active = documents.filter(
      (doc) =>
        String(doc.status || '').toUpperCase() ===
        'ACTIVE'
    ).length

    const archived = documents.filter(
      (doc) =>
        String(doc.status || '').toUpperCase() ===
        'ARCHIVED'
    ).length

    /*
     * Current VerifyDocument operation performs
     * verification without changing ledger state.
     *
     * Therefore we only count documents as verified
     * if verification information is actually present
     * in the returned document state.
     */
    const verified = documents.filter((doc) => {
      return (
        doc.verified === true ||
        doc.isVerified === true ||
        String(
          doc.verificationStatus || ''
        ).toUpperCase() === 'VERIFIED'
      )
    }).length

    return {
      total,
      active,
      archived,
      verified,
    }
  }, [documents])

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt ||
          a.createdAt ||
          0
        ).getTime()

        const dateB = new Date(
          b.updatedAt ||
          b.createdAt ||
          0
        ).getTime()

        return dateB - dateA
      })
      .slice(0, 5)
  }, [documents])

  function formatDate(date) {
    if (!date) {
      return '—'
    }

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return '—'
    }

    return parsed.toLocaleString()
  }

  function getStatusClasses(status) {
    const normalized =
      String(status || '').toUpperCase()

    if (normalized === 'ACTIVE') {
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
    }

    if (normalized === 'ARCHIVED') {
      return 'border-amber-500/20 bg-amber-500/10 text-amber-400'
    }

    return 'border-slate-500/20 bg-slate-500/10 text-slate-400'
  }

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
              <Activity className="h-4 w-4" />
              Blockchain Document Network
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome back, {user?.name || 'User'}.
              Monitor your documents and blockchain activity.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={
              loading ||
              refreshing ||
              activityLoading
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />

            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Documents"
            value={
              loading
                ? '—'
                : stats.total
            }
            subtitle="Documents on the network"
            icon={FileText}
          />

          <StatCard
            title="Active Documents"
            value={
              loading
                ? '—'
                : stats.active
            }
            subtitle="Currently active"
            icon={CheckCircle2}
          />

          <StatCard
            title="Archived Documents"
            value={
              loading
                ? '—'
                : stats.archived
            }
            subtitle="Archived records"
            icon={Archive}
          />

          <StatCard
            title="Verified Documents"
            value={
              loading
                ? '—'
                : stats.verified
            }
            subtitle="Verification records"
            icon={ShieldCheck}
          />

        </div>

        {/* Organization + Blockchain */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Organization */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Current Organization
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {user?.organization || '—'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Permissioned blockchain participant
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <InfoBox
                label="Role"
                value={user?.role || '—'}
              />

              <InfoBox
                label="Identity"
                value={user?.email || '—'}
              />

            </div>

          </div>

          {/* Blockchain */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/10">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-400">
                  Blockchain Network
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Hyperledger Fabric
                </h2>

                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                  Network Connected
                </div>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
                <Blocks className="h-6 w-6 text-violet-400" />
              </div>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <InfoBox
                label="Channel"
                value="mychannel"
              />

              <InfoBox
                label="Ledger"
                value="Distributed"
              />

            </div>

          </div>

        </div>

        {/* Recent Documents */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-3 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold">
                Recent Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest records available from the blockchain network
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="h-4 w-4" />
              Live API data
            </div>

          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading blockchain records...
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="p-8 text-center">

              <FileText className="mx-auto h-10 w-10 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No documents found.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Upload a document to create the first blockchain record.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {recentDocuments.map((doc) => (
                <div
                  key={doc.documentId}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="min-w-0">

                    <div className="flex items-center gap-3">

                      <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-medium text-slate-200">
                          {doc.title ||
                            doc.fileName ||
                            'Untitled Document'}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {doc.documentId ||
                            'No document ID'}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">

                    <div className="text-xs text-slate-500">
                      {formatDate(
                        doc.updatedAt ||
                        doc.createdAt
                      )}
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                        doc.status
                      )}`}
                    >
                      {doc.status ||
                        'UNKNOWN'}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Recent Blockchain Activity */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-3 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />

                <h2 className="text-lg font-semibold">
                  Recent Blockchain Activity
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Latest document lifecycle events recorded on the Fabric ledger
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Blocks className="h-4 w-4" />
              Fabric Ledger
            </div>

          </div>

          {activityLoading ? (
            <div className="p-10 text-center">

              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-cyan-400" />

              <p className="mt-3 text-sm text-slate-400">
                Reading blockchain history...
              </p>

            </div>
          ) : blockchainEvents.length === 0 ? (
            <div className="p-10 text-center">

              <Blocks className="mx-auto h-10 w-10 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No blockchain activity found.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Document transactions will appear here after blockchain activity occurs.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {blockchainEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5 transition hover:bg-slate-800/30"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex min-w-0 items-start gap-4">

                      <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
                        <Blocks className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${getActivityEventClasses(
                              event.event
                            )}`}
                          >
                            {formatActivityEvent(
                              event.event
                            )}
                          </span>

                          <span className="text-xs text-slate-600">
                            {formatActivityDate(
                              event.timestamp
                            )}
                          </span>

                        </div>

                        <p className="mt-2 truncate text-sm font-medium text-slate-300">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {event.documentId}
                        </p>

                      </div>

                    </div>

                    <div className="lg:max-w-sm lg:text-right">

                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Transaction ID
                      </p>

                      <p
                        className="mt-1 truncate font-mono text-xs text-cyan-400"
                        title={event.txId}
                      >
                        {event.txId || '—'}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Owner: {event.owner}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Blockchain information */}
        <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 p-6">

          <div className="flex gap-4">

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
              <Blocks className="h-6 w-6 text-cyan-400" />
            </div>

            <div>

              <h3 className="font-semibold text-slate-200">
                Protected by a Permissioned Blockchain
              </h3>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Document records are maintained through the Hyperledger
                Fabric network. Each organization operates with its own
                blockchain identity while document lifecycle operations
                are recorded on the shared ledger.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

function detectBlockchainEvent(
  previous,
  current
) {
  if (!previous) {
    return 'CREATED'
  }

  const previousValue =
    previous.value || {}

  const currentValue =
    current.value || {}

  if (
    previousValue.status !== 'ARCHIVED' &&
    currentValue.status === 'ARCHIVED'
  ) {
    return 'ARCHIVED'
  }

  if (
    previousValue.owner &&
    currentValue.owner &&
    previousValue.owner !==
      currentValue.owner
  ) {
    return 'TRANSFERRED'
  }

  if (
    previousValue.documentHash &&
    currentValue.documentHash &&
    previousValue.documentHash !==
      currentValue.documentHash
  ) {
    return 'REPLACED'
  }

  if (
    previousValue.title !==
      currentValue.title ||
    previousValue.description !==
      currentValue.description ||
    previousValue.department !==
      currentValue.department ||
    previousValue.fileName !==
      currentValue.fileName ||
    previousValue.mimeType !==
      currentValue.mimeType
  ) {
    return 'UPDATED'
  }

  return 'UPDATED'
}

function formatActivityEvent(event) {
  return (
    event.charAt(0) +
    event.slice(1).toLowerCase()
  )
}

function getActivityEventClasses(event) {
  if (event === 'CREATED') {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
  }

  if (event === 'TRANSFERRED') {
    return 'border-violet-500/20 bg-violet-500/10 text-violet-400'
  }

  if (event === 'REPLACED') {
    return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400'
  }

  if (event === 'ARCHIVED') {
    return 'border-amber-500/20 bg-amber-500/10 text-amber-400'
  }

  return 'border-slate-500/20 bg-slate-500/10 text-slate-400'
}

function formatActivityDate(date) {
  if (!date) {
    return '—'
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return '—'
  }

  return parsed.toLocaleString()
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {subtitle}
          </p>

        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>

      </div>

    </div>
  )
}

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-slate-300">
        {value}
      </p>

    </div>
  )
}

export default Dashboard