import { useEffect, useState } from 'react'
import {
  Search,
  FileText,
  ShieldCheck,
  Clock,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { getAllDocuments } from '../services/documentService'

function Documents() {
    const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getAllDocuments()

      /*
       * Backend currently returns:
       * {
       *   success: true,
       *   organization: "Org1",
       *   data: [...]
       * }
       */
      setDocuments(response.data || [])
    } catch (err) {
      console.error('Failed to load documents:', err)

      setError(
        err.response?.data?.message ||
        'Unable to load documents.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const filteredDocuments = documents.filter((document) => {
    const searchValue = search.toLowerCase()

    return (
      document.documentId
        ?.toLowerCase()
        .includes(searchValue) ||
      document.title
        ?.toLowerCase()
        .includes(searchValue) ||
      document.owner
        ?.toLowerCase()
        .includes(searchValue) ||
      document.department
        ?.toLowerCase()
        .includes(searchValue)
    )
  })

  return (
    <div className="mx-auto w-full max-w-7xl p-5 sm:p-7">

      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Workspace
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Documents
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Documents recorded on the blockchain network.
          </p>
        </div>

        <button
          onClick={loadDocuments}
          disabled={loading}
          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? 'animate-spin' : ''}
          />

          Refresh
        </button>

      </div>

      {/* Search */}
      <div className="mb-5 flex h-11 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3">

        <Search
          size={17}
          className="text-slate-600"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by ID, title, owner or department..."
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
        />

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">

          <RefreshCw
            size={24}
            className="mx-auto animate-spin text-blue-400"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading documents from blockchain...
          </p>

        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredDocuments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">

          <FileText
            size={30}
            className="mx-auto text-slate-700"
          />

          <p className="mt-4 font-medium text-slate-400">
            {search
              ? 'No matching documents'
              : 'No documents found'}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {search
              ? 'Try a different search term.'
              : 'Documents recorded on the network will appear here.'}
          </p>

        </div>
      )}

      {/* Desktop table */}
      {!loading && filteredDocuments.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 md:block">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-slate-800 bg-slate-900/80">

                <tr className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-600">

                  <th className="px-5 py-4">
                    Document
                  </th>

                  <th className="px-5 py-4">
                    Owner
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Created
                  </th>

                  <th className="px-5 py-4">
                    Blockchain
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-800/70">

                {filteredDocuments.map((document) => (
                  <tr
                    key={document.documentId}
                    onClick={() =>
  navigate(`/documents/${document.documentId}`)
}
                    className="group transition hover:bg-slate-800/30"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                          <FileText size={17} />
                        </div>

                        <div className="min-w-0">

                          <p className="max-w-[220px] truncate text-sm font-medium text-slate-200">
                            {document.title ||
                              document.fileName ||
                              'Untitled document'}
                          </p>

                          <p className="mt-0.5 font-mono text-[10px] text-slate-600">
                            {document.documentId}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      {document.owner || '—'}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-400">
                      {document.department || '—'}
                    </td>

                    <td className="px-5 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        {document.status || 'ACTIVE'}

                      </span>

                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {document.createdAt
                        ? new Date(
                            document.createdAt
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1.5 text-emerald-400">

                        <ShieldCheck size={15} />

                        <span className="text-[10px] font-medium">
                          On-chain
                        </span>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* Mobile cards */}
      {!loading && filteredDocuments.length > 0 && (
        <div className="space-y-3 md:hidden">

          {filteredDocuments.map((document) => (
            <div
              key={document.documentId}
              onClick={() =>
    navigate(`/documents/${document.documentId}`)
  }
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-200">
                      {document.title ||
                        document.fileName ||
                        'Untitled document'}
                    </p>

                    <p className="mt-1 truncate font-mono text-[10px] text-slate-600">
                      {document.documentId}
                    </p>

                  </div>

                </div>

                <ChevronRight
                  size={17}
                  className="shrink-0 text-slate-700"
                />

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Owner
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {document.owner || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Department
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    {document.department || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Status
                  </p>

                  <p className="mt-1 text-xs font-medium text-emerald-400">
                    {document.status || 'ACTIVE'}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-600">
                    Created
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {document.createdAt
                      ? new Date(
                          document.createdAt
                        ).toLocaleDateString()
                      : '—'}
                  </p>
                </div>

              </div>

              <div className="mt-4 flex items-center gap-1.5 border-t border-slate-800 pt-3 text-[10px] text-emerald-400">

                <ShieldCheck size={14} />

                <span>
                  Recorded on Hyperledger Fabric
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* Result count */}
      {!loading && documents.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600">

          <Clock size={12} />

          Showing {filteredDocuments.length} of{' '}
          {documents.length} blockchain records

        </div>
      )}

    </div>
  )
}

export default Documents