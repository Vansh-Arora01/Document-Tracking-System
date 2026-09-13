import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Archive,
  ArrowRightLeft,
  CheckCircle2,
  Clock3,
  FileEdit,
  FilePlus2,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'

import { getAllDocuments, getDocumentHistory } from '../services/documentService'

function AuditTrail() {
  const [documents, setDocuments] = useState([])
  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  async function loadAuditTrail() {
    try {
      setError('')
      setLoading(true)

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
        setEvents([])
        return
      }

      setHistoryLoading(true)

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

      const auditEvents = []

      for (const item of historyResults) {
        const { document, history } = item

        history.forEach((record, index) => {
          const previous =
            index > 0 ? history[index - 1] : null

          const event = detectEvent(
            previous,
            record
          )

          auditEvents.push({
            id: `${document.documentId}-${record.txId}-${index}`,
            documentId: document.documentId,
            title:
              record.value?.title ||
              document.title ||
              document.fileName ||
              'Untitled Document',
            owner:
              record.value?.owner ||
              document.owner ||
              '—',
            organization:
              record.value?.createdBy ||
              document.createdBy ||
              '—',
            event,
            timestamp: record.timestamp,
            txId: record.txId,
            status:
              record.value?.status ||
              document.status ||
              '—',
          })
        })
      }

      auditEvents.sort((a, b) => {
        const dateA = new Date(
          a.timestamp || 0
        ).getTime()

        const dateB = new Date(
          b.timestamp || 0
        ).getTime()

        return dateB - dateA
      })

      setEvents(auditEvents)
    } catch (err) {
      console.error('Audit trail loading failed:', err)

      setError(
        err.response?.data?.message ||
        'Unable to load audit trail.'
      )
    } finally {
      setLoading(false)
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadAuditTrail()
  }, [])

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase()

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.documentId?.toLowerCase().includes(query) ||
        event.title?.toLowerCase().includes(query) ||
        event.owner?.toLowerCase().includes(query) ||
        event.txId?.toLowerCase().includes(query)

      const matchesFilter =
        filter === 'ALL' ||
        event.event === filter

      return matchesSearch && matchesFilter
    })
  }, [events, search, filter])

  const eventCounts = useMemo(() => {
    return {
      all: events.length,
      created: events.filter(
        (event) => event.event === 'CREATED'
      ).length,
      updated: events.filter(
        (event) => event.event === 'UPDATED'
      ).length,
      transferred: events.filter(
        (event) => event.event === 'TRANSFERRED'
      ).length,
      replaced: events.filter(
        (event) => event.event === 'REPLACED'
      ).length,
      archived: events.filter(
        (event) => event.event === 'ARCHIVED'
      ).length,
    }
  }, [events])

  function formatDate(date) {
    if (!date) return '—'

    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
      return '—'
    }

    return parsed.toLocaleString()
  }

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
              <Activity className="h-4 w-4" />
              Blockchain Activity
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Audit Trail
            </h1>

            <p className="mt-2 max-w-3xl text-slate-400">
              System-wide history of document lifecycle activity
              recorded on the Hyperledger Fabric ledger.
            </p>
          </div>

          <button
            onClick={loadAuditTrail}
            disabled={loading || historyLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading || historyLoading
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          <SummaryCard
            label="All Events"
            value={eventCounts.all}
            icon={Activity}
          />

          <SummaryCard
            label="Created"
            value={eventCounts.created}
            icon={FilePlus2}
          />

          <SummaryCard
            label="Updated"
            value={eventCounts.updated}
            icon={FileEdit}
          />

          <SummaryCard
            label="Transferred"
            value={eventCounts.transferred}
            icon={ArrowRightLeft}
          />

          <SummaryCard
            label="Replaced"
            value={eventCounts.replaced}
            icon={RefreshCw}
          />

          <SummaryCard
            label="Archived"
            value={eventCounts.archived}
            icon={Archive}
          />

        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search document, owner or transaction..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500/50"
              />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500/50"
            >
              <option value="ALL">
                All Events
              </option>

              <option value="CREATED">
                Created
              </option>

              <option value="UPDATED">
                Updated
              </option>

              <option value="TRANSFERRED">
                Transferred
              </option>

              <option value="REPLACED">
                Replaced
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </select>

          </div>
        </div>

        {/* Audit table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

          <div className="border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />

              <div>
                <h2 className="font-semibold text-slate-200">
                  Blockchain Audit Events
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredEvents.length} event
                  {filteredEvents.length !== 1 ? 's' : ''} shown
                </p>
              </div>
            </div>
          </div>

          {loading || historyLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-cyan-400" />

              <p className="mt-4 text-sm text-slate-400">
                Loading blockchain history...
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Reading document history from Fabric.
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-700" />

              <p className="mt-4 text-sm text-slate-400">
                No audit events found.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Upload or modify a document to create blockchain activity.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-600">
                      <th className="px-6 py-4">
                        Event
                      </th>

                      <th className="px-6 py-4">
                        Document
                      </th>

                      <th className="px-6 py-4">
                        Owner
                      </th>

                      <th className="px-6 py-4">
                        Timestamp
                      </th>

                      <th className="px-6 py-4">
                        Transaction
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEvents.map((event) => (
                      <AuditRow
                        key={event.id}
                        event={event}
                        formatDate={formatDate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-800 md:hidden">
                {filteredEvents.map((event) => (
                  <MobileAuditCard
                    key={event.id}
                    event={event}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        {/* Information */}
        <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-6">
          <div className="flex gap-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-200">
                Ledger-backed audit history
              </h3>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
                These events are derived from the document history
                returned by Hyperledger Fabric. Each history record
                contains a blockchain transaction ID and timestamp,
                allowing document lifecycle changes to be traced back
                to the ledger.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function detectEvent(previous, current) {
  if (!previous) {
    return 'CREATED'
  }

  const previousValue = previous.value || {}
  const currentValue = current.value || {}

  if (
    previousValue.status !== 'ARCHIVED' &&
    currentValue.status === 'ARCHIVED'
  ) {
    return 'ARCHIVED'
  }

  if (
    previousValue.owner &&
    currentValue.owner &&
    previousValue.owner !== currentValue.owner
  ) {
    return 'TRANSFERRED'
  }

  if (
    previousValue.documentHash &&
    currentValue.documentHash &&
    previousValue.documentHash !== currentValue.documentHash
  ) {
    return 'REPLACED'
  }

  if (
    previousValue.title !== currentValue.title ||
    previousValue.description !== currentValue.description ||
    previousValue.department !== currentValue.department ||
    previousValue.fileName !== currentValue.fileName ||
    previousValue.mimeType !== currentValue.mimeType
  ) {
    return 'UPDATED'
  }

  return 'UPDATED'
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <Icon className="h-4 w-4 text-cyan-400" />
      </div>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>
    </div>
  )
}

function AuditRow({
  event,
  formatDate,
}) {
  return (
    <tr className="border-b border-slate-800/70 transition last:border-0 hover:bg-slate-800/30">

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <EventIcon event={event.event} />

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${getEventClasses(
              event.event
            )}`}
          >
            {formatEventName(event.event)}
          </span>
        </div>
      </td>

      <td className="max-w-xs px-6 py-5">
        <p className="truncate text-sm font-medium text-slate-300">
          {event.title}
        </p>

        <p className="mt-1 truncate text-xs text-slate-600">
          {event.documentId}
        </p>
      </td>

      <td className="px-6 py-5 text-sm text-slate-400">
        {event.owner}
      </td>

      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
        {formatDate(event.timestamp)}
      </td>

      <td className="max-w-xs px-6 py-5">
        <p
          className="truncate font-mono text-xs text-cyan-400"
          title={event.txId}
        >
          {event.txId || '—'}
        </p>
      </td>

    </tr>
  )
}

function MobileAuditCard({
  event,
  formatDate,
}) {
  return (
    <div className="p-5">

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <EventIcon event={event.event} />

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${getEventClasses(
              event.event
            )}`}
          >
            {formatEventName(event.event)}
          </span>
        </div>

        <Clock3 className="h-4 w-4 shrink-0 text-slate-600" />
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-300">
          {event.title}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {event.documentId}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Info
          label="Owner"
          value={event.owner}
        />

        <Info
          label="Time"
          value={formatDate(event.timestamp)}
        />
      </div>

      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-[10px] uppercase tracking-wider text-slate-600">
          Transaction ID
        </p>

        <p className="mt-1 break-all font-mono text-xs text-cyan-400">
          {event.txId || '—'}
        </p>
      </div>

    </div>
  )
}

function Info({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-xs text-slate-400">
        {value}
      </p>
    </div>
  )
}

function EventIcon({ event }) {
  const Icon =
    event === 'CREATED'
      ? FilePlus2
      : event === 'TRANSFERRED'
        ? ArrowRightLeft
        : event === 'REPLACED'
          ? RefreshCw
          : event === 'ARCHIVED'
            ? Archive
            : event === 'UPDATED'
              ? FileEdit
              : CheckCircle2

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
      <Icon className="h-4 w-4 text-cyan-400" />
    </div>
  )
}

function getEventClasses(event) {
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

function formatEventName(event) {
  return (
    event.charAt(0) +
    event.slice(1).toLowerCase()
  )
}

export default AuditTrail