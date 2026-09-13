import api from './api'

export async function getAllDocuments() {
  const response = await api.get('/documents')

  return response.data
}

export async function getDocument(documentId) {
  const response = await api.get(
    `/documents/${documentId}`
  )

  return response.data
}

export async function verifyDocument(
  documentId,
  documentHash
) {
  const response = await api.post(
    `/documents/${documentId}/verify`,
    {
      documentHash,
    }
  )

  return response.data
}

export async function getDocumentHistory(documentId) {
  const response = await api.get(
    `/documents/${documentId}/history`
  )

  return response.data
}

export async function uploadDocument({
  file,
  description,
  department,
  program,
  batch,
}) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('description', description)
  formData.append('department', department)

  if (program) {
    formData.append('program', program)
  }

  if (batch) {
    formData.append('batch', batch)
  }

  const response = await api.post(
    '/documents/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}
export async function updateDocument(documentId, data) {
  const response = await api.put(
    `/documents/${documentId}`,
    data
  )

  return response.data
}
export async function transferDocument(documentId, newOwner) {
  const response = await api.post(
    `/documents/${documentId}/transfer`,
    { newOwner }
  )

  return response.data
}

export async function replaceDocument(
    documentId,
    file
) {
    const formData = new FormData()

    formData.append('file', file)

    const response = await api.post(
        `/documents/${documentId}/replace`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return response.data
}

export async function archiveDocument(documentId) {
  const response = await api.post(
    `/documents/${documentId}/archive`
  )

  return response.data
}