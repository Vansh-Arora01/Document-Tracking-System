import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ShieldCheck,
  Building2,
  User,
  CalendarDays,
  Hash,
  CheckCircle2,
  XCircle,
  Clock3,
  Database,
  RefreshCw,
  AlertCircle,
  Pencil,
  UserRoundCheck,
  Archive,
  FileDiff,
  Plus,
  ChevronDown,
  Blocks,
  Settings2,
  Save,
  Upload,
  UserRound,
  X,
} from 'lucide-react'

import {
  getDocument,
  getDocumentHistory,
  verifyDocument,
  updateDocument,
  transferDocument,
  replaceDocument,
  archiveDocument,
} from '../services/documentService'


function DocumentDetails() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  const [document, setDocument] = useState(null)
  const [history, setHistory] = useState([])

  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(true)

  const [error, setError] = useState('')

  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] =
    useState(null)

  // Document action state
  const [action, setAction] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState(null)

  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    department: '',
  })

  const [transferOwner, setTransferOwner] = useState('')

  // Replacement PDF
  const [replacementFile, setReplacementFile] =
    useState(null)


  /* =========================================================
     LOAD DOCUMENT
  ========================================================= */

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getDocument(documentId)

        setDocument(
          response.data ||
          response.document ||
          response
        )
      } catch (err) {
        console.error(
          'Failed to load document:',
          err
        )

        setError(
          err.response?.data?.message ||
          'Unable to load document.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId])


  /* =========================================================
     LOAD HISTORY
  ========================================================= */

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true)

        const response =
          await getDocumentHistory(documentId)

        setHistory(response.data || [])
      } catch (err) {
        console.error(
          'Failed to load document history:',
          err
        )
      } finally {
        setHistoryLoading(false)
      }
    }

    loadHistory()
  }, [documentId])


  /* =========================================================
     VERIFY DOCUMENT
  ========================================================= */

  const handleVerify = async () => {
    if (!document?.documentHash) {
      return
    }

    try {
      setVerifying(true)
      setVerificationResult(null)

      const response = await verifyDocument(
        documentId,
        document.documentHash
      )

      setVerificationResult(response)

    } catch (err) {
      console.error(
        'Document verification failed:',
        err
      )

      setVerificationResult({
        success: false,
        message:
          err.response?.data?.message ||
          'Verification failed.',
      })

    } finally {
      setVerifying(false)
    }
  }


  /* =========================================================
     REFRESH DOCUMENT + HISTORY
  ========================================================= */

  const refreshDocumentData = async () => {
    const [
      documentResponse,
      historyResponse,
    ] = await Promise.all([
      getDocument(documentId),
      getDocumentHistory(documentId),
    ])

    setDocument(
      documentResponse.data ||
      documentResponse.document ||
      documentResponse
    )

    setHistory(historyResponse.data || [])
  }


  /* =========================================================
     UPDATE
  ========================================================= */

  const openUpdateAction = () => {
    setUpdateForm({
      title: document?.title || '',
      description: document?.description || '',
      department: document?.department || '',
    })

    setActionMessage(null)
    setAction('update')
  }


  const handleUpdate = async (event) => {
    event.preventDefault()

    try {
      setActionLoading(true)
      setActionMessage(null)

      await updateDocument(
        documentId,
        updateForm
      )

      await refreshDocumentData()

      setAction(null)

      setActionMessage({
        success: true,
        message:
          'Document metadata updated successfully on the blockchain.',
      })

    } catch (err) {
      console.error(
        'Document update failed:',
        err
      )

      setActionMessage({
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to update document.',
      })

    } finally {
      setActionLoading(false)
    }
  }


  /* =========================================================
     TRANSFER
  ========================================================= */

  const openTransferAction = () => {
    setTransferOwner('')
    setActionMessage(null)
    setAction('transfer')
  }


  const handleTransfer = async (event) => {
    event.preventDefault()

    if (!transferOwner.trim()) {
      return
    }

    try {
      setActionLoading(true)
      setActionMessage(null)

      await transferDocument(
        documentId,
        transferOwner.trim()
      )

      await refreshDocumentData()

      setTransferOwner('')
      setAction(null)

      setActionMessage({
        success: true,
        message:
          'Document ownership transferred successfully on the blockchain.',
      })

    } catch (err) {
      console.error(
        'Document transfer failed:',
        err
      )

      setActionMessage({
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to transfer document.',
      })

    } finally {
      setActionLoading(false)
    }
  }


  /* =========================================================
     REPLACE
  ========================================================= */

  const openReplaceAction = () => {
    setReplacementFile(null)
    setActionMessage(null)
    setAction('replace')
  }


  const handleReplace = async (event) => {
    event.preventDefault()

    if (!replacementFile) {
      setActionMessage({
        success: false,
        message:
          'Please select a replacement PDF.',
      })

      return
    }

    try {
      setActionLoading(true)
      setActionMessage(null)

      const response =
        await replaceDocument(
          documentId,
          replacementFile
        )

      await refreshDocumentData()

      setReplacementFile(null)
      setAction(null)

      setActionMessage({
        success: true,
        message:
          'Document replaced successfully. A new version and SHA-256 fingerprint have been recorded on the blockchain.',
      })

      console.log(
        'Replacement response:',
        response
      )

    } catch (err) {
      console.error(
        'Document replacement failed:',
        err
      )

      setActionMessage({
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to replace document.',
      })

    } finally {
      setActionLoading(false)
    }
  }


  /* =========================================================
     ARCHIVE
  ========================================================= */

  const handleArchive = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to archive this document?'
    )

    if (!confirmed) {
      return
    }

    try {
      setActionLoading(true)
      setActionMessage(null)

      await archiveDocument(documentId)

      await refreshDocumentData()

      setActionMessage({
        success: true,
        message:
          'Document archived successfully on the blockchain.',
      })

    } catch (err) {
      console.error(
        'Document archive failed:',
        err
      )

      setActionMessage({
        success: false,
        message:
          err.response?.data?.message ||
          'Unable to archive document.',
      })

    } finally {
      setActionLoading(false)
    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <RefreshCw
            size={25}
            className="mx-auto animate-spin text-blue-400"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading blockchain record...
          </p>

        </div>

      </div>
    )
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !document) {
    return (
      <div className="mx-auto w-full max-w-4xl p-5 sm:p-7">

        <button
          onClick={() => navigate('/documents')}
          className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
        >
          <ArrowLeft size={16} />
          Back to documents
        </button>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <AlertCircle
            size={30}
            className="mx-auto text-red-400"
          />

          <p className="mt-4 font-medium text-red-300">
            {error || 'Document not found.'}
          </p>

        </div>

      </div>
    )
  }


  const blockchainCreated =
    document.createdBy || 'Unknown'


  return (
    <div className="mx-auto w-full max-w-7xl p-5 sm:p-7">

      {/* =====================================================
          BACK
      ===================================================== */}

      <button
        onClick={() => navigate('/documents')}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
      >
        <ArrowLeft size={16} />
        Back to documents
      </button>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

        <div className="flex min-w-0 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <FileText size={23} />
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="truncate text-2xl font-bold tracking-tight text-white">
                {document.title ||
                  document.fileName ||
                  'Untitled document'}
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                {document.status || 'ACTIVE'}

              </span>

            </div>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {document.documentId}
            </p>

          </div>

        </div>


        {/* Verify */}

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {verifying ? (
            <>
              <RefreshCw
                size={15}
                className="animate-spin"
              />

              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Verify Document
            </>
          )}

        </button>

      </div>


      {/* =====================================================
          VERIFICATION RESULT
      ===================================================== */}

      {verificationResult && (
        <div
          className={[
            'mb-6 flex items-start gap-3 rounded-xl border p-4',
            verificationResult.success
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : 'border-red-500/20 bg-red-500/5',
          ].join(' ')}
        >

          {verificationResult.success ? (
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
          ) : (
            <XCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />
          )}

          <div>

            <p
              className={
                verificationResult.success
                  ? 'font-medium text-emerald-300'
                  : 'font-medium text-red-300'
              }
            >
              {verificationResult.success
                ? 'Document verification successful'
                : 'Document verification failed'}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {verificationResult.message ||
                'The stored document hash was checked against the blockchain record.'}
            </p>

          </div>

        </div>
      )}


      {/* =====================================================
          DOCUMENT ACTIONS
      ===================================================== */}

      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

        <div className="border-b border-slate-800 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Settings2 size={17} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Document Actions
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Manage the document lifecycle through Hyperledger Fabric.
              </p>

            </div>

          </div>

        </div>


        <div className="grid gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">

          {/* UPDATE */}

          <button
            type="button"
            onClick={openUpdateAction}
            disabled={actionLoading}
            className="group bg-slate-900 p-5 text-left transition hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
              <Pencil size={16} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-200">
              Update
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Update document metadata.
            </p>

          </button>


          {/* TRANSFER */}

          <button
            type="button"
            onClick={openTransferAction}
            disabled={actionLoading}
            className="group bg-slate-900 p-5 text-left transition hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
              <UserRoundCheck size={16} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-200">
              Transfer
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Change document ownership.
            </p>

          </button>


          {/* REPLACE */}

          <button
            type="button"
            onClick={openReplaceAction}
            disabled={actionLoading}
            className="group bg-slate-900 p-5 text-left transition hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
              <FileDiff size={16} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-200">
              Replace
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Replace the document with a new PDF version.
            </p>

          </button>


          {/* ARCHIVE */}

          <button
            type="button"
            onClick={handleArchive}
            disabled={
              actionLoading ||
              String(document.status).toUpperCase() ===
                'ARCHIVED'
            }
            className="group bg-slate-900 p-5 text-left transition hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20">
              <Archive size={16} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-200">
              {String(document.status).toUpperCase() ===
              'ARCHIVED'
                ? 'Archived'
                : 'Archive'}
            </p>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Archive this document.
            </p>

          </button>

        </div>


        {/* Action message */}

        {actionMessage && (
          <div
            className={[
              'border-t px-5 py-3 text-xs',
              actionMessage.success
                ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400'
                : 'border-red-500/10 bg-red-500/5 text-red-400',
            ].join(' ')}
          >
            {actionMessage.message}
          </div>
        )}

      </section>


      {/* =====================================================
          ACTION MODAL
      ===================================================== */}

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h2 className="text-lg font-semibold text-white">

                  {action === 'update' &&
                    'Update Document'}

                  {action === 'transfer' &&
                    'Transfer Ownership'}

                  {action === 'replace' &&
                    'Replace Document'}

                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  This operation will create a new blockchain state.
                </p>

              </div>


              <button
                type="button"
                onClick={() => setAction(null)}
                disabled={actionLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={17} />
              </button>

            </div>


            {/* =================================================
                UPDATE FORM
            ================================================= */}

            {action === 'update' && (
              <form
                onSubmit={handleUpdate}
                className="space-y-5 p-5"
              >

                <div>

                  <label className="text-xs font-medium text-slate-500">
                    Title
                  </label>

                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(event) =>
                      setUpdateForm({
                        ...updateForm,
                        title: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  />

                </div>


                <div>

                  <label className="text-xs font-medium text-slate-500">
                    Department
                  </label>

                  <input
                    type="text"
                    value={updateForm.department}
                    onChange={(event) =>
                      setUpdateForm({
                        ...updateForm,
                        department:
                          event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  />

                </div>


                <div>

                  <label className="text-xs font-medium text-slate-500">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={updateForm.description}
                    onChange={(event) =>
                      setUpdateForm({
                        ...updateForm,
                        description:
                          event.target.value,
                      })
                    }
                    className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  />

                </div>


                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Updating on Blockchain...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Update on Blockchain
                    </>
                  )}

                </button>

              </form>
            )}


            {/* =================================================
                TRANSFER FORM
            ================================================= */}

            {action === 'transfer' && (
              <form
                onSubmit={handleTransfer}
                className="space-y-5 p-5"
              >

                <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">

                  <div className="flex items-center gap-2">

                    <UserRound
                      size={15}
                      className="text-amber-400"
                    />

                    <span className="text-xs font-semibold text-amber-300">
                      Current Owner
                    </span>

                  </div>

                  <p className="mt-2 break-all text-sm text-slate-400">
                    {document.owner || 'Unknown'}
                  </p>

                </div>


                <div>

                  <label className="text-xs font-medium text-slate-500">
                    New Owner
                  </label>

                  <input
                    type="text"
                    value={transferOwner}
                    onChange={(event) =>
                      setTransferOwner(
                        event.target.value
                      )
                    }
                    placeholder="Enter new owner"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-amber-500"
                  />

                </div>


                <button
                  type="submit"
                  disabled={
                    actionLoading ||
                    !transferOwner.trim()
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Transferring...
                    </>
                  ) : (
                    <>
                      <UserRoundCheck size={15} />
                      Transfer on Blockchain
                    </>
                  )}

                </button>

              </form>
            )}


            {/* =================================================
                REPLACE FORM
            ================================================= */}

            {action === 'replace' && (
              <form
                onSubmit={handleReplace}
                className="space-y-5 p-5"
              >

                {/* Current version */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                        Current Version
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        Version {document.currentVersion || 1}
                      </p>

                    </div>

                    <FileDiff
                      size={18}
                      className="text-cyan-400"
                    />

                  </div>

                </div>


                {/* Current hash */}

                <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                    Current SHA-256
                  </p>

                  <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-500">
                    {document.documentHash ||
                      'Not available'}
                  </p>

                </div>


                {/* Replacement file */}

                <div>

                  <label className="text-xs font-medium text-slate-500">
                    Replacement PDF
                  </label>

                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 p-7 text-center transition hover:border-cyan-500/40 hover:bg-slate-900">

                    <Upload
                      size={25}
                      className="text-cyan-400"
                    />

                    <p className="mt-3 text-sm font-medium text-slate-300">
                      {replacementFile
                        ? replacementFile.name
                        : 'Select replacement PDF'}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      PDF files only
                    </p>

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(event) => {

                        const file =
                          event.target.files?.[0]

                        if (!file) {
                          return
                        }

                        const isPdf =
                          file.type ===
                            'application/pdf' ||
                          file.name
                            .toLowerCase()
                            .endsWith('.pdf')

                        if (!isPdf) {

                          setReplacementFile(null)

                          setActionMessage({
                            success: false,
                            message:
                              'Please select a PDF file.',
                          })

                          return
                        }

                        setReplacementFile(file)
                        setActionMessage(null)

                      }}
                    />

                  </label>

                </div>


                {/* Processing information */}

                <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">

                  <div className="flex gap-3">

                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-cyan-400"
                    />

                    <div>

                      <p className="text-xs font-semibold text-cyan-300">
                        Automatic SHA-256 Processing
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        The selected PDF is sent to the backend.
                        The backend calculates its SHA-256 fingerprint
                        and records the new document version on
                        Hyperledger Fabric.
                      </p>

                    </div>

                  </div>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={
                    actionLoading ||
                    !replacementFile
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Processing PDF & Recording...
                    </>
                  ) : (
                    <>
                      <FileDiff size={15} />

                      Replace on Blockchain
                    </>
                  )}

                </button>

              </form>
            )}

          </div>

        </div>
      )}


      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid gap-5 xl:grid-cols-3">


        {/* ===================================================
            DOCUMENT INFORMATION
        =================================================== */}

        <div className="space-y-5 xl:col-span-2">

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

            <div className="border-b border-slate-800 px-5 py-4">

              <h2 className="font-semibold text-white">
                Document Information
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Metadata recorded with the document.
              </p>

            </div>


            <div className="grid gap-px bg-slate-800">

              <div className="grid sm:grid-cols-2">

                <InfoItem
                  icon={User}
                  label="Owner"
                  value={document.owner}
                />

                <InfoItem
                  icon={Building2}
                  label="Department"
                  value={document.department}
                />

                <InfoItem
                  icon={FileText}
                  label="File Name"
                  value={document.fileName}
                />

                <InfoItem
                  icon={Database}
                  label="MIME Type"
                  value={document.mimeType}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Created"
                  value={formatDate(
                    document.createdAt
                  )}
                />

                <InfoItem
                  icon={Clock3}
                  label="Last Updated"
                  value={formatDate(
                    document.updatedAt
                  )}
                />

              </div>

            </div>


            {document.description && (
              <div className="border-t border-slate-800 p-5">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {document.description}
                </p>

              </div>
            )}

          </section>


          {/* HASH */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

            <div className="flex items-center gap-2">

              <Hash
                size={17}
                className="text-blue-400"
              />

              <h2 className="font-semibold text-white">
                SHA-256 Document Hash
              </h2>

            </div>


            <p className="mt-3 break-all rounded-xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs leading-6 text-slate-400">
              {document.documentHash ||
                'Not available'}
            </p>


            <p className="mt-3 text-[10px] text-slate-600">
              This cryptographic fingerprint is used
              to verify document integrity against the
              blockchain record.
            </p>

          </section>

        </div>


        {/* ===================================================
            BLOCKCHAIN RECORD
        =================================================== */}

        <div>

          <section className="rounded-2xl border border-blue-500/15 bg-slate-900/70">

            <div className="border-b border-slate-800 px-5 py-4">

              <div className="flex items-center gap-2">

                <BlocksIcon />

                <div>

                  <h2 className="font-semibold text-white">
                    Blockchain Record
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Hyperledger Fabric
                  </p>

                </div>

              </div>

            </div>


            <div className="space-y-5 p-5">

              <BlockchainItem
                label="Created By / MSP"
                value={blockchainCreated}
              />

              <BlockchainItem
                label="Channel"
                value="mychannel"
              />

              <BlockchainItem
                label="Network"
                value="Hyperledger Fabric"
              />

              <BlockchainItem
                label="Status"
                value="Recorded on ledger"
                success
              />


              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">

                <div className="flex items-center gap-2 text-emerald-400">

                  <ShieldCheck size={16} />

                  <span className="text-xs font-semibold">
                    Blockchain Verified Record
                  </span>

                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  The document metadata and hash are
                  maintained by the Fabric smart contract.
                </p>

              </div>

            </div>

          </section>

        </div>

      </div>


      {/* =====================================================
          DOCUMENT TRACKING
      ===================================================== */}

      <DocumentTracking
        document={document}
        history={history}
        historyLoading={historyLoading}
      />


      {/* =====================================================
          BLOCKCHAIN HISTORY
      ===================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

        <div className="border-b border-slate-800 px-5 py-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Blocks size={19} />
              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="font-semibold text-white">
                    Blockchain History
                  </h2>

                  {!historyLoading &&
                    history.length > 0 && (
                      <span className="rounded-full border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 text-[9px] font-semibold text-blue-400">
                        {history.length} transaction
                        {history.length !== 1
                          ? 's'
                          : ''}
                      </span>
                    )}

                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  Immutable transaction history returned
                  from the Hyperledger Fabric ledger.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400">
                Ledger Recorded
              </span>

            </div>

          </div>

        </div>


        <div className="p-5">

          {historyLoading ? (
            <div className="py-10 text-center">

              <RefreshCw
                size={22}
                className="mx-auto animate-spin text-blue-400"
              />

              <p className="mt-3 text-xs text-slate-600">
                Loading blockchain history...
              </p>

            </div>

          ) : history.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 py-10 text-center">

              <Database
                size={25}
                className="mx-auto text-slate-700"
              />

              <p className="mt-3 text-xs text-slate-600">
                No history records available.
              </p>

            </div>

          ) : (
            <BlockchainTimeline
              history={history}
            />
          )}

        </div>

      </section>

    </div>
  )
}


/* =========================================================
   DOCUMENT TRACKING
========================================================= */

function DocumentTracking({
  document,
  history,
  historyLoading,
}) {
  const orderedHistory = [...history].sort(
    (a, b) => {
      const aTime = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0

      const bTime = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0

      return aTime - bTime
    }
  )

  const firstEntry =
    orderedHistory.length > 0
      ? orderedHistory[0]
      : null

  const latestEntry =
    orderedHistory.length > 0
      ? orderedHistory[
          orderedHistory.length - 1
        ]
      : null

  const latestState =
    latestEntry?.value
      ? normalizeValue(latestEntry.value)
      : document

  const currentOwner =
    latestState?.owner ||
    document.owner ||
    'Unknown'

  const currentStatus =
    latestState?.status ||
    document.status ||
    'ACTIVE'

  const createdAt =
    firstEntry?.timestamp ||
    document.createdAt

  const lastActivity =
    latestEntry?.timestamp ||
    document.updatedAt ||
    document.createdAt

  const lastTransaction =
    latestEntry?.txId ||
    'Not available'

  const createdBy =
    firstEntry?.value
      ? normalizeValue(
          firstEntry.value
        )?.createdBy ||
        document.createdBy ||
        'Unknown'
      : document.createdBy ||
        'Unknown'


  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

      {/* Header */}

      <div className="border-b border-slate-800 px-5 py-5">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock3 size={19} />
            </div>

            <div>

              <h2 className="font-semibold text-white">
                Document Tracking
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Current document lifecycle and blockchain activity.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-blue-500/10 bg-blue-500/5 px-3 py-2">

            <Blocks
              size={13}
              className="text-blue-400"
            />

            <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
              Fabric Ledger
            </span>

          </div>

        </div>

      </div>


      {/* Statistics */}

      <div className="grid gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">

        <TrackingStat
          label="Current Status"
          value={currentStatus}
          icon={ShieldCheck}
          success={
            String(currentStatus).toUpperCase() ===
            'ACTIVE'
          }
        />

        <TrackingStat
          label="Current Owner"
          value={currentOwner}
          icon={User}
        />

        <TrackingStat
          label="Blockchain Events"
          value={
            historyLoading
              ? '...'
              : history.length
          }
          icon={Blocks}
        />

        <TrackingStat
          label="Last Activity"
          value={formatDate(lastActivity)}
          icon={Clock3}
        />

      </div>


      {/* Tracking details */}

      <div className="grid gap-5 p-5 lg:grid-cols-2">

        {/* Creation */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Plus size={15} />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-300">
                Document Created
              </p>

              <p className="text-[10px] text-slate-600">
                First recorded blockchain state
              </p>

            </div>

          </div>


          <div className="mt-4 space-y-3">

            <TrackingDetail
              label="Created"
              value={formatDate(createdAt)}
            />

            <TrackingDetail
              label="Created By / MSP"
              value={createdBy}
            />

          </div>

        </div>


        {/* Latest */}

        <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <RefreshCw size={15} />
            </div>

            <div>

              <p className="text-xs font-semibold text-slate-300">
                Latest Blockchain Activity
              </p>

              <p className="text-[10px] text-slate-600">
                Most recent ledger state
              </p>

            </div>

          </div>


          <div className="mt-4 space-y-3">

            <TrackingDetail
              label="Last Activity"
              value={formatDate(lastActivity)}
            />

            <TrackingDetail
              label="Last Transaction"
              value={lastTransaction}
              mono
            />

          </div>

        </div>

      </div>


      {/* Lifecycle */}

      <div className="border-t border-slate-800 p-5">

        <div className="mb-4">

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Lifecycle
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Chronological document activity recorded on the ledger.
          </p>

        </div>


        {historyLoading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 text-center">

            <RefreshCw
              size={18}
              className="mx-auto animate-spin text-blue-400"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              Loading lifecycle...
            </p>

          </div>
        ) : orderedHistory.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 text-center">

            <Database
              size={20}
              className="mx-auto text-slate-700"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              No lifecycle events available.
            </p>

          </div>
        ) : (
          <div className="relative">

            <div className="absolute bottom-5 left-4 top-5 w-px bg-slate-800" />

            <div className="space-y-4">

              {orderedHistory.map(
                (entry, index) => {
                  const previousEntry =
                    index > 0
                      ? orderedHistory[
                          index - 1
                        ]
                      : null

                  const event =
                    getHistoryEvent(
                      entry,
                      previousEntry,
                      index
                    )

                  const Icon = event.icon

                  return (
                    <div
                      key={`${entry.txId || 'tracking'}-${index}`}
                      className="relative flex gap-4"
                    >

                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-blue-400">

                        <Icon size={13} />

                      </div>


                      <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/40 p-3">

                        <div className="flex flex-col justify-between gap-1 sm:flex-row">

                          <div>

                            <p className="text-xs font-semibold text-slate-300">
                              {event.title}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-600">
                              {event.description}
                            </p>

                          </div>

                          <span className="shrink-0 text-[9px] text-slate-600">
                            {formatDate(
                              entry.timestamp
                            )}
                          </span>

                        </div>

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          </div>
        )}

      </div>

    </section>
  )
}


/* =========================================================
   TRACKING STAT
========================================================= */

function TrackingStat({
  label,
  value,
  icon: Icon,
  success = false,
}) {
  return (
    <div className="bg-slate-900 p-4">

      <div className="flex items-center gap-2 text-slate-600">

        <Icon size={13} />

        <span className="text-[9px] font-semibold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p
        className={[
          'mt-2 break-words text-sm font-semibold',
          success
            ? 'text-emerald-400'
            : 'text-slate-300',
        ].join(' ')}
      >
        {value || '—'}
      </p>

    </div>
  )
}


/* =========================================================
   TRACKING DETAIL
========================================================= */

function TrackingDetail({
  label,
  value,
  mono = false,
}) {
  return (
    <div>

      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={[
          'mt-1 break-all text-xs text-slate-400',
          mono
            ? 'font-mono text-[10px]'
            : '',
        ].join(' ')}
      >
        {value || '—'}
      </p>

    </div>
  )
}


/* =========================================================
   BLOCKCHAIN TIMELINE
========================================================= */

function BlockchainTimeline({ history }) {
  const orderedHistory = [...history].sort(
    (a, b) => {
      const aTime = a.timestamp
        ? new Date(a.timestamp).getTime()
        : 0

      const bTime = b.timestamp
        ? new Date(b.timestamp).getTime()
        : 0

      return aTime - bTime
    }
  )

  return (
    <div className="relative">

      <div className="absolute bottom-6 left-[19px] top-6 hidden w-px bg-gradient-to-b from-blue-500/40 via-slate-700 to-slate-800 sm:block" />

      <div className="space-y-5">

        {orderedHistory.map(
          (entry, index) => {
            const previousEntry =
              index > 0
                ? orderedHistory[
                    index - 1
                  ]
                : null

            const event =
              getHistoryEvent(
                entry,
                previousEntry,
                index
              )

            return (
              <HistoryEntry
                key={`${entry.txId || 'tx'}-${index}`}
                entry={entry}
                event={event}
                index={index}
              />
            )
          }
        )}

      </div>

    </div>
  )
}


/* =========================================================
   HISTORY ENTRY
========================================================= */

function HistoryEntry({
  entry,
  event,
  index,
}) {
  const Icon = event.icon

  return (
    <div className="relative flex gap-4">

      <div className="relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/20 bg-slate-950 text-blue-400 shadow-[0_0_0_4px_rgba(15,23,42,0.8)] sm:flex">

        <Icon size={16} />

      </div>


      <div className="min-w-0 flex-1">

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700">

          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-400 sm:hidden">

                <Icon size={14} />

              </div>


              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="text-sm font-semibold text-slate-200">
                    {event.title}
                  </h3>

                  <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
                    #{index + 1}
                  </span>

                </div>

                <p className="mt-1 text-[10px] text-slate-600">
                  {event.description}
                </p>

              </div>

            </div>


            {entry.timestamp && (
              <div className="flex shrink-0 items-center gap-1.5 text-[10px] text-slate-600">

                <Clock3 size={11} />

                {formatDate(
                  entry.timestamp
                )}

              </div>
            )}

          </div>


          {/* Changes */}

          {event.changes.length > 0 && (
            <div className="mt-4">

              <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                {event.changes.length === 1
                  ? 'Change'
                  : 'Changes'}
              </p>

              <div className="space-y-2">

                {event.changes.map(
                  (change, changeIndex) => (
                    <ChangeRow
                      key={`${change.field}-${changeIndex}`}
                      change={change}
                    />
                  )
                )}

              </div>

            </div>
          )}


          {/* Creation details */}

          {event.createdDetails.length > 0 && (
            <div className="mt-4">

              <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                Recorded State
              </p>

              <div className="grid gap-2 sm:grid-cols-2">

                {event.createdDetails.map(
                  (detail) => (
                    <div
                      key={detail.label}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                    >

                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                        {detail.label}
                      </p>

                      <p className="mt-1 break-words text-xs text-slate-300">
                        {detail.value}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>
          )}


          {/* Transaction */}

          {entry.txId && (
            <div className="mt-4 rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">

              <div className="flex items-center gap-2">

                <Database
                  size={12}
                  className="shrink-0 text-blue-400"
                />

                <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                  Fabric Transaction ID
                </p>

              </div>

              <p className="mt-1 break-all font-mono text-[10px] leading-5 text-slate-500">
                {entry.txId}
              </p>

            </div>
          )}


          {/* Raw state */}

          {entry.value && (
            <details className="group mt-3">

              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5 transition hover:border-slate-700">

                <span className="flex items-center gap-2 text-[10px] font-medium text-slate-500 group-hover:text-slate-300">

                  <FileText size={12} />

                  View raw blockchain state

                </span>

                <ChevronDown
                  size={13}
                  className="text-slate-600 transition group-open:rotate-180"
                />

              </summary>


              <pre className="mt-2 max-h-96 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-[10px] leading-5 text-slate-500">
                {typeof entry.value ===
                'string'
                  ? entry.value
                  : JSON.stringify(
                      entry.value,
                      null,
                      2
                    )}
              </pre>

            </details>
          )}

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   CHANGE ROW
========================================================= */

function ChangeRow({ change }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">

      <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
        {change.label}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

        <div className="min-w-0 flex-1 rounded-md border border-red-500/10 bg-red-500/5 px-3 py-2">

          <p className="text-[8px] uppercase tracking-wider text-red-400/60">
            Previous
          </p>

          <p className="mt-0.5 break-words text-xs text-slate-500">
            {formatValue(
              change.previous
            )}
          </p>

        </div>


        <ArrowRight
          size={14}
          className="hidden shrink-0 text-slate-700 sm:block"
        />


        <div className="min-w-0 flex-1 rounded-md border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">

          <p className="text-[8px] uppercase tracking-wider text-emerald-400/60">
            Current
          </p>

          <p className="mt-0.5 break-words text-xs text-slate-300">
            {formatValue(
              change.current
            )}
          </p>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   HISTORY EVENT DETECTION
========================================================= */

function getHistoryEvent(
  entry,
  previousEntry,
  index
) {
  if (entry.isDelete) {
    return {
      title: 'Document Deleted',
      description:
        'The document state was removed from the ledger.',
      icon: Archive,
      changes: [],
      createdDetails: [],
    }
  }


  const current =
    normalizeValue(entry.value)

  const previous =
    previousEntry
      ? normalizeValue(
          previousEntry.value
        )
      : null


  if (!previousEntry || !previous) {
    return {
      title: 'Document Created',
      description:
        'The document was first recorded on the blockchain.',
      icon: Plus,
      changes: [],
      createdDetails:
        getCreationDetails(current),
    }
  }


  const changes =
    getChangedFields(
      previous,
      current
    )


  if (
    hasChanged(
      previous,
      current,
      'owner'
    )
  ) {
    return {
      title: 'Ownership Transferred',
      description:
        'The document ownership was changed on the ledger.',
      icon: UserRoundCheck,
      changes,
      createdDetails: [],
    }
  }


  if (
    String(current?.status || '').toUpperCase() ===
      'ARCHIVED' &&
    String(previous?.status || '').toUpperCase() !==
      'ARCHIVED'
  ) {
    return {
      title: 'Document Archived',
      description:
        'The document status was changed to archived.',
      icon: Archive,
      changes,
      createdDetails: [],
    }
  }


  if (
    hasChanged(
      previous,
      current,
      'documentHash'
    ) ||
    hasChanged(
      previous,
      current,
      'fileName'
    )
  ) {
    return {
      title: 'Document Replaced',
      description:
        'The document file or cryptographic fingerprint was replaced.',
      icon: FileDiff,
      changes,
      createdDetails: [],
    }
  }


  return {
    title: 'Document Updated',
    description:
      'Document metadata was updated on the blockchain.',
    icon: Pencil,
    changes,
    createdDetails: [],
  }
}


/* =========================================================
   CHANGE DETECTION
========================================================= */

function getChangedFields(
  previous,
  current
) {
  const fields = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'owner',
      label: 'Owner',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'fileName',
      label: 'File Name',
    },
    {
      key: 'mimeType',
      label: 'MIME Type',
    },
    {
      key: 'documentHash',
      label: 'Document Hash',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'metadata',
      label: 'Metadata',
    },
  ]

  return fields
    .filter(
      ({ key }) =>
        hasChanged(
          previous,
          current,
          key
        )
    )
    .map(
      ({
        key,
        label,
      }) => ({
        field: key,
        label,
        previous:
          previous?.[key],
        current:
          current?.[key],
      })
    )
}


/* =========================================================
   CREATION DETAILS
========================================================= */

function getCreationDetails(value) {
  if (!value) {
    return []
  }

  const details = []

  if (value.owner) {
    details.push({
      label: 'Owner',
      value: value.owner,
    })
  }

  if (value.department) {
    details.push({
      label: 'Department',
      value: value.department,
    })
  }

  if (value.status) {
    details.push({
      label: 'Status',
      value: value.status,
    })
  }

  if (value.fileName) {
    details.push({
      label: 'File Name',
      value: value.fileName,
    })
  }

  if (value.mimeType) {
    details.push({
      label: 'MIME Type',
      value: value.mimeType,
    })
  }

  return details
}


/* =========================================================
   HELPERS
========================================================= */

function normalizeValue(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  return value
}


function hasChanged(
  previous,
  current,
  key
) {
  return (
    JSON.stringify(
      previous?.[key]
    ) !==
    JSON.stringify(
      current?.[key]
    )
  )
}


function formatValue(value) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return 'Not set'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}


/* =========================================================
   UI HELPERS
========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-900 p-5">

      <div className="flex items-center gap-2 text-slate-600">

        <Icon size={14} />

        <span className="text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p className="mt-2 break-words text-sm text-slate-300">
        {value || '—'}
      </p>

    </div>
  )
}


function BlockchainItem({
  label,
  value,
  success = false,
}) {
  return (
    <div>

      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={[
          'mt-1 break-words text-sm',
          success
            ? 'text-emerald-400'
            : 'text-slate-300',
        ].join(' ')}
      >
        {value || '—'}
      </p>

    </div>
  )
}


function BlocksIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
      <Database size={18} />
    </div>
  )
}


function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}


export default DocumentDetails