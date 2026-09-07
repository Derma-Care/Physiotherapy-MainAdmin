import React, { useRef, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPencil, cilFile, cilX } from '@coreui/icons'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/zip',
]
const MAX_SIZE = 250 * 1024 // 250 KB, matches the rest of the app

const DocumentField = ({
  label,
  base64Data,
  clinicName = 'Clinic',
  isEditing = false,
  onFileChange,
  openPdfPreview,
  uploadType = 'single', // 'single' or 'multiple'
}) => {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

  // Normalize to array
  const normalizedData = Array.isArray(base64Data)
    ? base64Data
    : base64Data
      ? [base64Data]
      : []

  const getFileInfo = (data) => {
    if (!data || typeof data !== 'string') return { mime: '', ext: '', isPreviewable: false }
    const prefix = data.substring(0, 20)
    let mime = '', ext = '', isPreviewable = false

    if (prefix.includes('JVBERi0')) {
      mime = 'application/pdf'; ext = 'pdf'; isPreviewable = true
    } else if (prefix.includes('iVBORw0')) {
      mime = 'image/png'; ext = 'png'; isPreviewable = true
    } else if (prefix.includes('/9j/')) {
      mime = 'image/jpeg'; ext = 'jpg'; isPreviewable = true
    }
    return { mime, ext, isPreviewable }
  }

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        reject(`"${file.name}" is not an allowed file type`)
        return
      }
      if (file.size > MAX_SIZE) {
        reject(`"${file.name}" is larger than 250 KB`)
        return
      }
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = () => reject(`Could not read "${file.name}"`)
      reader.readAsDataURL(file)
    })

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setError('')

    // Use allSettled so one bad file doesn't wipe out the good ones.
    const results = await Promise.allSettled(files.map(readFileAsBase64))
    const succeeded = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason)

    if (failed.length) setError(failed.join('; '))

    if (succeeded.length) {
      if (uploadType === 'multiple') {
        onFileChange([...normalizedData, ...succeeded])
      } else {
        // Single mode: the newly picked file replaces the existing one.
        onFileChange(succeeded[0])
      }
    }

    // clear native input so re-selecting the same file still fires onChange
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemove = (index) => {
    setError('')
    if (uploadType === 'multiple') {
      const updated = normalizedData.filter((_, i) => i !== index)
      onFileChange(updated)
    } else {
      onFileChange('')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = (fileData, name) => {
    const a = document.createElement('a')
    a.href = fileData
    a.download = name
    a.click()
  }

  const openPicker = () => fileInputRef.current && fileInputRef.current.click()

  const showBox = normalizedData.length > 0
  const canAddMore = uploadType === 'multiple' || normalizedData.length === 0

  return (
    <div className="mb-3">
      {showBox ? (
        <div className="border rounded p-2 bg-light">
          {normalizedData.map((data, i) => {
            const info = getFileInfo(data)
            const fileName = `${clinicName}_${label}_${i + 1}.${info.ext}`
            const fileUrl = `data:${info.mime};base64,${data}`

            return (
              <div
                key={i}
                className="d-flex justify-content-between align-items-center border-bottom mb-1 pb-1"
              >
                <span className="text-muted text-truncate" style={{ maxWidth: '60%' }}>
                  {fileName}
                </span>

                <div className="d-flex align-items-center gap-2">
                  {info.isPreviewable && (
                    <span
                      className="text-info"
                      style={{ cursor: 'pointer' }}
                      title="Preview"
                      onClick={() => {
                        if (info.mime === 'application/pdf') {
                          openPdfPreview(data)
                        } else {
                          const imageUrl = `data:${info.mime};base64,${data}`
                          const newWindow = window.open()
                          newWindow.document.write(`
                            <html>
                              <head><title>Image Preview</title></head>
                              <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#111;">
                                <img src="${imageUrl}" style="max-width:100%;height:auto;object-fit:contain;" />
                              </body>
                            </html>
                          `)
                        }
                      }}
                    >
                      <CIcon icon={cilFile} size="lg" />
                    </span>
                  )}

                  <span
                    className="text-primary"
                    style={{ cursor: 'pointer' }}
                    title="Download"
                    onClick={() => handleDownload(fileUrl, fileName)}
                  >
                    <CIcon icon={cilCloudDownload} size="lg" />
                  </span>

                  {isEditing && uploadType === 'single' && (
                    <span
                      className="text-warning"
                      style={{ cursor: 'pointer' }}
                      title="Replace"
                      onClick={openPicker}
                    >
                      <CIcon icon={cilPencil} size="lg" />
                    </span>
                  )}

                  {isEditing && (
                    <span
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      title="Remove"
                      onClick={() => handleRemove(i)}
                    >
                      <CIcon icon={cilX} size="lg" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {isEditing && uploadType === 'multiple' && (
            <div
              className="d-flex align-items-center gap-2 mt-1"
              style={{ cursor: 'pointer' }}
              onClick={openPicker}
            >
              <span className="text-warning">
                <CIcon icon={cilPencil} size="lg" />
              </span>
              <span className="small text-muted">Add more files</span>
            </div>
          )}
        </div>
      ) : (
        <>
          {!isEditing ? (
            <div className="text-muted">No {label} available.</div>
          ) : (
            <div
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
              onClick={openPicker}
            >
              <span className="text-warning">
                <CIcon icon={cilPencil} size="lg" />
              </span>
              <span className="small text-muted">
                Upload {uploadType === 'multiple' ? 'one or more files' : 'a file'}
              </span>
            </div>
          )}
        </>
      )}

      {error && <div className="text-danger small mt-1">{error}</div>}

      {/* hidden file input — always hidden, opened only via the controls above */}
      {isEditing && canAddMore && (
        <input
          type="file"
          multiple={uploadType === 'multiple'}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      )}
    </div>
  )
}

export default DocumentField