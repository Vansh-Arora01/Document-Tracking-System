import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Database,
  Hash,
  Building2,
  User,
} from 'lucide-react'

import { uploadDocument } from '../services/documentService'
import { useAuth } from '../context/AuthContext'

function UploadDocument() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  const [file, setFile] = useState(null)

  const [formData, setFormData] = useState({
    department: '',
    program: '',
    batch: '',
    description: '',
  })

  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const handleFile = (selectedFile) => {
    setError('')

    if (!selectedFile) {
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed.')
      return
    }

    setFile(selectedFile)
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]

    handleFile(selectedFile)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)

    const droppedFile = event.dataTransfer.files?.[0]

    handleFile(droppedFile)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const removeFile = () => {
    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess(null)

    if (!file) {
      setError('Please select a PDF document.')
      return
    }

    if (!formData.department.trim()) {
      setError('Department is required.')
      return
    }

    try {
      setUploading(true)

      const response = await uploadDocument({
        file,
        description: formData.description.trim(),
        department: formData.department.trim(),
        program: formData.program.trim(),
        batch: formData.batch.trim(),
      })

      setSuccess(response)

      setFile(null)

      setFormData({
        department: '',
        program: '',
        batch: '',
        description: '',
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error(
        'Document upload failed:',
        err
      )

      setError(
        err.response?.data?.message ||
        'Document upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
    }
  }

  if (success) {
    return (
      <UploadSuccess
        response={success}
        navigate={navigate}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-5 sm:p-7">

      {/* Back */}
      <button
        onClick={() => navigate('/documents')}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
      >
        <ArrowLeft size={16} />
        Back to documents
      </button>

      {/* Header */}
      <div className="mb-7">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Upload size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Upload Document
            </h1>

            <p className="mt-1 text-xs text-slate-600">
              Record a PDF document on the Hyperledger
              Fabric network.
            </p>
          </div>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-xs leading-5 text-red-300">
            {error}
          </p>

        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid gap-5 lg:grid-cols-5">

          {/* Upload area */}
          <section className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/60">

            <div className="border-b border-slate-800 px-5 py-4">

              <h2 className="font-semibold text-white">
                Select Document
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Only PDF files can be recorded.
              </p>

            </div>

            <div className="p-5">

              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={[
                    'flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition',
                    dragActive
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-950/30 hover:border-blue-500/50 hover:bg-blue-500/5',
                  ].join(' ')}
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                    <Upload size={27} />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-300">
                    Drag & drop your PDF here
                  </h3>

                  <p className="mt-2 text-xs text-slate-600">
                    or click to browse from your computer
                  </p>

                  <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-[10px] text-slate-600">
                    PDF documents only
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                </div>
              ) : (
                <SelectedFile
                  file={file}
                  onRemove={removeFile}
                />
              )}

              {/* Blockchain explanation */}
              <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={16}
                    className="text-blue-400"
                  />

                  <p className="text-xs font-semibold text-blue-300">
                    Blockchain-backed upload
                  </p>

                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  The backend calculates the document's
                  SHA-256 fingerprint and records the
                  document metadata on Hyperledger Fabric.
                </p>

              </div>

            </div>

          </section>

          {/* Information */}
          <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60">

            <div className="border-b border-slate-800 px-5 py-4">

              <h2 className="font-semibold text-white">
                Document Information
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Provide the information required for the
                blockchain record.
              </p>

            </div>

            <div className="space-y-4 p-5">

              {/* Logged in user */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">

                <div className="flex items-center gap-2">

                  <User
                    size={14}
                    className="text-slate-600"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                    Uploading as
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-300">
                  {user?.name || 'Authenticated user'}
                </p>

                <p className="mt-0.5 break-all text-[10px] text-slate-600">
                  {user?.email || '—'}
                </p>

              </div>

              {/* Organization */}
              <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">

                <div className="flex items-center gap-2">

                  <Building2
                    size={14}
                    className="text-blue-400"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                    Organization
                  </span>

                </div>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {user?.organization || '—'}
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-600">
                  Derived from your authenticated account.
                </p>

              </div>

              {/* Department */}
              <FormField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science"
                required
              />

              {/* Program */}
              <FormField
                label="Program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                placeholder="e.g. B.Tech CSE"
              />

              {/* Batch */}
              <FormField
                label="Batch"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                placeholder="e.g. 2026"
              />

              {/* Description */}
              <div>

                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Briefly describe this document..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-blue-500/50"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {uploading ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Recording on Blockchain...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Upload to Blockchain
                  </>
                )}

              </button>

              <p className="text-center text-[9px] leading-4 text-slate-700">
                Your organization and owner information
                are derived from your authenticated session.
              </p>

            </div>

          </section>

        </div>

      </form>

    </div>
  )
}


/* =========================================================
   SELECTED FILE
   ========================================================= */

function SelectedFile({
  file,
  onRemove,
}) {
  return (
    <div className="min-h-[320px] rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">

      <div className="flex h-full min-h-[270px] flex-col items-center justify-center text-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
          <FileText size={28} />
        </div>

        <h3 className="mt-5 max-w-md break-all text-sm font-semibold text-slate-300">
          {file.name}
        </h3>

        <p className="mt-2 text-xs text-slate-600">
          {formatFileSize(file.size)}
        </p>

        <div className="mt-5 flex items-center gap-2">

          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">

            <CheckCircle2
              size={13}
              className="text-emerald-400"
            />

            <span className="text-[10px] text-emerald-400">
              PDF ready
            </span>

          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-[10px] text-slate-600 transition hover:border-red-500/20 hover:text-red-400"
          >
            <X size={13} />
            Remove
          </button>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   FORM FIELD
   ========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>

      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">

        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}

      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-10 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 text-xs text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-blue-500/50"
      />

    </div>
  )
}


/* =========================================================
   SUCCESS PAGE
   ========================================================= */

function UploadSuccess({
  response,
  navigate,
}) {
  const documentData =
    response?.data ||
    response?.document ||
    response

  const documentId =
    documentData?.documentId ||
    response?.documentId

  const documentHash =
    documentData?.documentHash ||
    response?.documentHash

  const organization =
    documentData?.createdBy ||
    documentData?.organization ||
    response?.organization

  const transactionId =
    response?.transactionId ||
    response?.txId ||
    documentData?.transactionId ||
    documentData?.txId

  return (
    <div className="mx-auto w-full max-w-3xl p-5 sm:p-7">

      <div className="flex min-h-[65vh] items-center justify-center">

        <div className="w-full">

          {/* Success icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={30} />
          </div>

          <div className="mt-5 text-center">

            <h1 className="text-2xl font-bold text-white">
              Document Recorded Successfully
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-600">
              The document has been processed and its
              metadata has been recorded on the
              Hyperledger Fabric blockchain.
            </p>

          </div>

          {/* Blockchain card */}
          <div className="mt-7 overflow-hidden rounded-2xl border border-emerald-500/15 bg-slate-900/70">

            <div className="border-b border-slate-800 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Database size={17} />
                </div>

                <div>

                  <h2 className="text-sm font-semibold text-white">
                    Blockchain Record Created
                  </h2>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Hyperledger Fabric · mychannel
                  </p>

                </div>

              </div>

            </div>

            <div className="grid gap-px bg-slate-800 sm:grid-cols-2">

              <SuccessItem
                icon={FileText}
                label="Document ID"
                value={documentId}
              />

              <SuccessItem
                icon={Building2}
                label="Organization"
                value={organization}
              />

              <SuccessItem
                icon={Hash}
                label="SHA-256"
                value={documentHash}
                mono
              />

              <SuccessItem
                icon={Database}
                label="Transaction ID"
                value={
                  transactionId ||
                  'Available in Blockchain History'
                }
                mono
              />

            </div>

            <div className="border-t border-slate-800 p-4">

              <div className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>

                  <p className="text-xs font-semibold text-blue-300">
                    Integrity fingerprint generated
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-600">
                    The SHA-256 hash can be used later to
                    verify that the document has not been
                    altered.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            {documentId && (
              <button
                onClick={() =>
                  navigate(
                    `/documents/${documentId}`
                  )
                }
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <FileText size={16} />
                View Document
              </button>
            )}

            <button
              onClick={() =>
                navigate('/documents')
              }
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
            >
              Back to Documents
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}


/* =========================================================
   SUCCESS ITEM
   ========================================================= */

function SuccessItem({
  icon: Icon,
  label,
  value,
  mono = false,
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
          'mt-2 break-all text-xs',
          mono
            ? 'font-mono text-slate-500'
            : 'text-slate-300',
        ].join(' ')}
      >
        {value || 'Not returned'}
      </p>

    </div>
  )
}


/* =========================================================
   HELPERS
   ========================================================= */

function formatFileSize(bytes) {
  if (!bytes) {
    return '0 Bytes'
  }

  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB',
  ]

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  )

  const size =
    bytes /
    Math.pow(1024, index)

  return `${size.toFixed(index === 0 ? 0 : 2)} ${
    units[index]
  }`
}

export default UploadDocument