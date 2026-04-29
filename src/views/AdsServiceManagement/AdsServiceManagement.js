import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormInput,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import { Get_AllServAdvData, Add_ServAdvData, delete_ServAdvData } from './AdsServiceManagementAPI'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { Trash2, PlusCircle, ImageIcon, Film } from 'lucide-react'
import LoadingIndicator from '../../Utils/loader'

const ServiceAdvertisement = () => {
  const [advData, setAdvData]             = useState([])
  const [visible, setVisible]             = useState(false)
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [selectedFile, setSelectedFile]   = useState(null)
  const [previewUrl, setPreviewUrl]       = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [carouselIdToDelete, setCarouselIdToDelete] = useState(null)
  const [loading, setLoading]             = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await Get_AllServAdvData()
      setAdvData(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load advertisements.')
      setAdvData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async () => {
    if (!carouselIdToDelete) return
    try {
      const data = await delete_ServAdvData(carouselIdToDelete)
      toast.success(data || 'Advertisement deleted successfully!')
      setIsModalVisible(false)
      await fetchData()
    } catch {
      toast.error('Failed to delete advertisement.')
    }
  }

  const handleCarouselDelete = (id) => {
    setCarouselIdToDelete(id)
    setIsModalVisible(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!selectedFile) { toast.warning('Please select an image or video file.'); return }
    setIsSubmitting(true)
    try {
      const base64 = await convertToBase64(selectedFile)
      await Add_ServAdvData({ mediaUrlOrImage: base64 })
      toast.success('Advertisement added successfully!')
      setVisible(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      fetchData()
    } catch {
      toast.error('Failed to add advertisement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload  = () => resolve(reader.result)
      reader.onerror = reject
    })

  const isVideo = (src) => src?.startsWith('data:video')

  return (
    <>
      <ToastContainer />

      {/* ── Header row ──────────────────────────── */}
      <div className="sa-header">
        <div>
          <h2 className="sa-title">Service Advertisements</h2>
          <p className="sa-sub">{advData.length} ad{advData.length !== 1 ? 's' : ''} currently active</p>
        </div>
        <button className="sa-btn sa-btn-primary" onClick={() => setVisible(true)}>
          <PlusCircle size={14} /> Add Advertisement
        </button>
      </div>

      {/* ── Table ───────────────────────────────── */}
      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Carousel ID</th>
              <th>Media Preview</th>
              <th style={{ width: 100, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="sa-td-center sa-td-loading">
                  <LoadingIndicator message="Loading advertisements…" />
                </td>
              </tr>
            ) : advData.length === 0 ? (
              <tr>
                <td colSpan={3} className="sa-td-center sa-td-empty">
                  <ImageIcon size={32} style={{ color: '#d3d1c7', marginBottom: 8 }} />
                  <p>No advertisements found</p>
                </td>
              </tr>
            ) : (
              advData.map((item, idx) => (
                <tr key={idx} className="sa-row">
                  <td>
                    <span className="sa-id-badge">{item.carouselId}</span>
                  </td>
                  <td>
                    {item.mediaUrlOrImage ? (
                      isVideo(item.mediaUrlOrImage) ? (
                        <div className="sa-media-wrap">
                          <video src={item.mediaUrlOrImage} height={56} controls className="sa-media" />
                          <span className="sa-media-badge video"><Film size={10} /> Video</span>
                        </div>
                      ) : (
                        <div className="sa-media-wrap">
                          <img src={item.mediaUrlOrImage} alt="Ad" height={56} className="sa-media" />
                          <span className="sa-media-badge image"><ImageIcon size={10} /> Image</span>
                        </div>
                      )
                    ) : (
                      <span className="sa-no-media">No media</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="sa-icon-btn delete"
                      onClick={() => handleCarouselDelete(item.carouselId)}
                      title="Delete advertisement"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Confirmation modal ───────────────────── */}
      <ConfirmationModal
        isVisible={isModalVisible}
        message="Are you sure you want to delete this advertisement?"
        onConfirm={handleDelete}
        onCancel={() => setIsModalVisible(false)}
      />

      {/* ── Add modal ───────────────────────────── */}
      <CModal
        visible={visible}
        onClose={() => { setVisible(false); setSelectedFile(null); setPreviewUrl(null) }}
        backdrop="static"
        alignment="center"
        className="sa-modal"
      >
        <CModalHeader className="sa-modal-header">
          <CModalTitle className="sa-modal-title">Add Advertisement</CModalTitle>
        </CModalHeader>
        <CModalBody className="sa-modal-body">
          <CForm onSubmit={handleAdd}>

            {/* Drop zone */}
            <label className="sa-dropzone" htmlFor="sa-file-input">
              {previewUrl ? (
                isVideo(previewUrl) || selectedFile?.type?.startsWith('video') ? (
                  <video src={previewUrl} className="sa-drop-preview" controls />
                ) : (
                  <img src={previewUrl} alt="Preview" className="sa-drop-preview" />
                )
              ) : (
                <>
                  <div className="sa-drop-icon">
                    <ImageIcon size={28} />
                  </div>
                  <p className="sa-drop-text">Click to select image or video</p>
                  <p className="sa-drop-hint">JPG, PNG, MP4 supported</p>
                </>
              )}
            </label>
            <input
              id="sa-file-input"
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="sa-selected-name">
                Selected: <strong>{selectedFile.name}</strong>
              </p>
            )}

            <CModalFooter className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-ghost"
                onClick={() => { setVisible(false); setSelectedFile(null); setPreviewUrl(null) }}>
                Cancel
              </button>
              <button type="submit" className="sa-btn sa-btn-primary" disabled={isSubmitting || !selectedFile}>
                {isSubmitting ? 'Uploading…' : 'Add Advertisement'}
              </button>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      {/* ── Styles ──────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* Header */
        .sa-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .sa-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #0c447c;
          margin: 0 0 4px;
        }
        .sa-sub {
          font-size: 12px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Buttons */
        .sa-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 9px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          border: 0.5px solid;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .sa-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .sa-btn-primary {
          background: #185fa5;
          color: #fff;
          border-color: #185fa5;
          box-shadow: 0 2px 8px rgba(24,95,165,0.2);
        }
        .sa-btn-primary:hover:not(:disabled) { background: #0c447c; border-color: #0c447c; }
        .sa-btn-ghost {
          background: #fff;
          color: #5f5e5a;
          border-color: #d0dce9;
        }
        .sa-btn-ghost:hover { background: #f1efe8; }

        /* Table */
        .sa-table-wrap {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .sa-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
        }
        .sa-table thead tr {
          background: linear-gradient(135deg, #042C53, #185fa5);
        }
        .sa-table thead th {
          padding: 12px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          border: none;
        }
        .sa-row {
          border-bottom: 0.5px solid #f1efe8;
          transition: background 0.12s;
        }
        .sa-row:hover { background: #f7fafd; }
        .sa-row:last-child { border-bottom: none; }
        .sa-table tbody td { padding: 12px 16px; vertical-align: middle; color: #2c2c2a; }
        .sa-td-center { text-align: center; padding: 2.5rem 1rem !important; }
        .sa-td-loading {}
        .sa-td-empty {
          color: #888780;
          font-style: italic;
          font-size: 13px;
          display: table-cell;
        }
        .sa-td-empty p { margin: 0; }

        /* ID badge */
        .sa-id-badge {
          display: inline-block;
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          color: #0c447c;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Media */
        .sa-media-wrap { display: inline-flex; align-items: center; gap: 8px; }
        .sa-media {
          border-radius: 8px;
          object-fit: cover;
          border: 0.5px solid #d3d1c7;
          display: block;
        }
        .sa-media-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          border: 0.5px solid;
        }
        .sa-media-badge.image { background: #e6f1fb; color: #0c447c; border-color: #b5d4f4; }
        .sa-media-badge.video { background: #EEEDFE; color: #3C3489; border-color: #CECBF6; }
        .sa-no-media { font-size: 12px; color: #888780; font-style: italic; }

        /* Icon button */
        .sa-icon-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 0.5px solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s;
          background: transparent;
        }
        .sa-icon-btn.delete {
          color: #791F1F;
          border-color: #F7C1C1;
          background: #FCEBEB;
        }
        .sa-icon-btn.delete:hover { background: #F7C1C1; }

        /* Modal */
        .sa-modal .modal-content {
          border: 0.5px solid #d0dce9 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(4,44,83,0.14) !important;
        }
        .sa-modal-header {
          background: linear-gradient(135deg, #042C53, #185fa5) !important;
          border-bottom: none !important;
          padding: 16px 20px !important;
        }
        .sa-modal-title {
          font-family: 'Syne', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
        }
        .sa-modal .btn-close { filter: brightness(0) invert(1); opacity: 0.75; }
        .sa-modal-body {
          background: #f7f6f2 !important;
          padding: 1.25rem !important;
        }
        .sa-modal-footer {
          background: transparent !important;
          border-top: 0.5px solid #d0dce9 !important;
          padding: 12px 0 0 !important;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        /* Drop zone */
        .sa-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px dashed #b5d4f4;
          border-radius: 12px;
          background: #f0f6fd;
          padding: 2rem 1rem;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          min-height: 140px;
          text-align: center;
          margin-bottom: 10px;
        }
        .sa-dropzone:hover { border-color: #185fa5; background: #e6f1fb; }
        .sa-drop-icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #fff;
          border: 0.5px solid #b5d4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #185fa5;
          margin-bottom: 4px;
        }
        .sa-drop-text {
          font-size: 13px;
          font-weight: 500;
          color: #185fa5;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-drop-hint {
          font-size: 11px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-drop-preview {
          max-height: 160px;
          max-width: 100%;
          border-radius: 8px;
          object-fit: contain;
        }
        .sa-selected-name {
          font-size: 12px;
          color: #5f5e5a;
          margin: 0 0 4px;
          font-family: 'DM Sans', sans-serif;
        }
        .sa-selected-name strong { color: #0c447c; }
      `}</style>
    </>
  )
}

export default ServiceAdvertisement