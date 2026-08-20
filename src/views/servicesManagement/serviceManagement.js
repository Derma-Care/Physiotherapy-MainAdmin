import React, { useState, useEffect, useRef } from 'react'
import {
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilTrash } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  getAllServices, postServiceData, updateServiceData,
  deleteServiceData, getServiceByServiceId,
} from './ServiceAPI'
import { CategoryData } from '../categoryManagement/CategoryAPI'
import Select from 'react-select'
import LoadingIndicator from '../../Utils/loader'
import { Edit2, Eye, Trash2, Layers, Save, X } from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'

const ServiceManagement = () => {
  const fileInputRef     = useRef(null)
  const editFileInputRef = useRef(null)

  const [searchQuery, setSearchQuery]           = useState('')
  const [service, setService]                   = useState([])
  const [categories, setCategories]             = useState([])
  const [filteredData, setFilteredData]         = useState([])
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState(null)
  const [modalVisible, setModalVisible]         = useState(false)
  const [selectedService, setSelectedService]   = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editServiceMode, setEditServiceMode]   = useState(false)
  const [isModalVisible, setIsModalVisible]     = useState(false)
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null)
  const [currentPage, setCurrentPage]           = useState(1)
  const [itemsPerPage, setItemsPerPage]         = useState(5)

  const [errors, setErrors]         = useState({ serviceName: '', categoryId: '', description: '', serviceImage: '' })
  const [editErrors, setEditErrors] = useState({})

  const [newService, setNewService] = useState({
    serviceName: '', categoryId: '', description: '', serviceImage: null,
  })
  const [updatedService, setUpdatedService] = useState({
    ServiceId: '', ServiceName: '', categoryId: '',
    description: '', serviceImage: null, existingImageName: '',
  })

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true)
    try {
      const [svcRes, catRes] = await Promise.all([getAllServices(), CategoryData()])
      setService(svcRes.data?.data || svcRes.data)
      setCategories(catRes.data)
    } catch {
      setError('Failed to fetch data')
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim()
    setFilteredData(
      q ? service.filter(s =>
        s.serviceName?.toLowerCase().includes(q) ||
        s.categoryName?.toLowerCase().includes(q)
      ) : service
    )
    setCurrentPage(1)
  }, [searchQuery, service])

  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems     = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages       = Math.ceil(filteredData.length / itemsPerPage)

  // ── View ──────────────────────────────────────────────────────────────────
  const handleViewService = async (serviceId) => {
    const data = await getServiceByServiceId(serviceId)
    setSelectedService(data)
    setViewModalVisible(true)
  }

  // ── File helpers ──────────────────────────────────────────────────────────
  const readBase64 = (file) => new Promise((res) => {
    const r = new FileReader(); r.readAsDataURL(file)
    r.onloadend = () => res(r.result?.split(',')[1])
  })

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; if (!file) return
    if (!file.type.startsWith('image/')) { setErrors(p => ({ ...p, serviceImage: 'Only image files allowed' })); return }
    const b64 = await readBase64(file)
    setNewService(p => ({ ...p, serviceImage: b64 }))
    setErrors(p => ({ ...p, serviceImage: '' }))
  }

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAddService = async () => {
    const newErrors = {}
    const name = newService.serviceName.trim()
    const desc = newService.description.trim()
    if (!name) newErrors.serviceName = 'Service Name is required.'
    else if (!/^[A-Za-z\s@&\-\.,()]+$/.test(name)) newErrors.serviceName = 'Only letters and basic symbols allowed.'
    else if (name.length < 3) newErrors.serviceName = 'Minimum 3 characters required.'
    if (!desc) newErrors.description = 'Description is required.'
    else if (desc.length < 10) newErrors.description = 'Minimum 10 characters required.'
    if (!newService.categoryId) newErrors.categoryId = 'Category is required.'
    if (!newService.serviceImage) newErrors.serviceImage = 'Service image is required.'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    if (service.some(s => s.serviceName?.toLowerCase() === name.toLowerCase())) {
      setErrors({ serviceName: 'Service already exists.' }); return
    }
    try {
      await postServiceData({ ...newService, serviceName: name, description: desc })
      toast.success('Service added successfully!')
      setModalVisible(false)
      setNewService({ serviceName: '', categoryId: '', description: '', serviceImage: null })
      fetchData()
    } catch { toast.error('Failed to add service') }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleServiceEdit = (svc) => {
    setUpdatedService({
      ServiceId: svc.serviceId, ServiceName: svc.serviceName,
      categoryId: svc.categoryId || '', description: svc.description || '',
      serviceImage: svc.serviceImage, existingImageName: svc.serviceImage ? 'Existing image' : '',
    })
    setEditErrors({})
    setEditServiceMode(true)
  }

  const handleUpdateService = async () => {
    const newErrors = {}
    const name = updatedService.ServiceName.trim()
    const desc = updatedService.description.trim()
    if (!name) newErrors.ServiceName = 'Service Name is required.'
    else if (!/^[A-Za-z\s@&\-\.,()]+$/.test(name)) newErrors.ServiceName = 'Only letters and basic symbols allowed.'
    else if (name.length < 3) newErrors.ServiceName = 'Minimum 3 characters required.'
    if (!desc) newErrors.description = 'Description is required.'
    else if (desc.length < 5) newErrors.description = 'Minimum 5 characters required.'
    if (!updatedService.categoryId) newErrors.categoryId = 'Category is required.'
    if (!updatedService.serviceImage && !updatedService.existingImageName) newErrors.serviceImage = 'Service image is required.'
    if (Object.keys(newErrors).length) { setEditErrors(newErrors); return }
    if (service.some(s => s.serviceName?.toLowerCase() === name.toLowerCase() && s.serviceId !== updatedService.ServiceId)) {
      setEditErrors({ ServiceName: 'Service already exists.' }); return
    }
    let img = updatedService.serviceImage
    if (img && typeof img !== 'string') img = (await readBase64(img))
    else if (img?.includes('base64,')) img = img.split(',')[1]
    try {
      await updateServiceData({ serviceId: updatedService.ServiceId, serviceName: name, categoryId: updatedService.categoryId, description: desc, serviceImage: img }, updatedService.ServiceId)
      toast.success('Service updated successfully!')
      setEditServiceMode(false); fetchData()
    } catch { toast.error('Failed to update service') }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    try {
      await deleteServiceData(serviceIdToDelete)
      toast.success('Service deleted successfully!')
      setIsModalVisible(false); fetchData()
    } catch { toast.error('Failed to delete service') }
  }

  const categoryOptions = categories?.map(c => ({ value: c.categoryId, label: c.categoryName })) || []

  const reactSelectStyles = {
    control: (base, state) => ({
      ...base, fontSize: 13, minHeight: 36,
      borderColor: state.isFocused ? '#185fa5' : '#d0dce9',
      borderWidth: '0.5px', borderRadius: 7, boxShadow: 'none',
      '&:hover': { borderColor: '#185fa5' },
    }),
    option: (base, state) => ({
      ...base, fontSize: 13,
      backgroundColor: state.isSelected ? '#185fa5' : state.isFocused ? '#f0f5fb' : '#fff',
      color: state.isSelected ? '#fff' : '#374151',
    }),
    menu: (base) => ({ ...base, fontSize: 13, zIndex: 9999 }),
    placeholder: (base) => ({ ...base, fontSize: 13, color: '#9ca3af' }),
  }

  // ── Shared field/image helpers ────────────────────────────────────────────
  const Field = ({ label, required, error, children }) => (
    <div className="sm-field">
      <label className="sm-label">{label}{required && <span className="sm-required">*</span>}</label>
      {children}
      {error && <span className="sm-error-text">{error}</span>}
    </div>
  )

  const ImgPreview = ({ src, onRemove }) => (
    <div className="sm-img-preview-wrap">
      <img src={src} alt="Preview" className="sm-img-preview" />
      <button type="button" className="sm-img-remove" onClick={onRemove}><Trash2 size={13} /></button>
    </div>
  )

  return (
    <div className="sm-page">
      

      {/* ── Page header ── */}
      <div className="sm-page-header">
        <div className="sm-title-group">
          <div className="sm-page-icon"><Layers size={20} /></div>
          <div>
            <h4 className="sm-page-title">Service Management</h4>
            <p className="sm-page-sub">{service.length} service{service.length !== 1 ? 's' : ''} registered</p>
          </div>
        </div>
        <div className="sm-header-right">
          <div className="sm-search-wrap">
            <CIcon icon={cilSearch} className="sm-search-icon" />
            <input className="sm-search-input" type="text"
              placeholder="Search service / category…"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button className="sm-add-btn" onClick={() => setModalVisible(true)}>+ Add Service</button>
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <LoadingIndicator message="Loading services…" />
        </div>
      ) : error ? (
        <div className="sm-error">{error}</div>
      ) : (
        <div className="sm-table-wrapper">
          <CTable className="sm-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="sm-th" style={{ width: 60 }}>S.No</CTableHeaderCell>
                <CTableHeaderCell className="sm-th">Service Name</CTableHeaderCell>
                <CTableHeaderCell className="sm-th">Category</CTableHeaderCell>
                <CTableHeaderCell className="sm-th">Description</CTableHeaderCell>
                <CTableHeaderCell className="sm-th" style={{ width: 120 }}>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length > 0 ? currentItems.map((svc, index) => (
                <CTableRow key={svc.serviceId || index} className="sm-tr">
                  <CTableDataCell className="sm-td sm-td-num">{indexOfFirstItem + index + 1}</CTableDataCell>
                  <CTableDataCell className="sm-td"><span className="sm-name">{svc.serviceName}</span></CTableDataCell>
                  <CTableDataCell className="sm-td sm-muted">{svc.categoryName}</CTableDataCell>
                  <CTableDataCell className="sm-td sm-muted" style={{ maxWidth: 260 }}>
                    <span className="sm-desc">{svc.description || 'N/A'}</span>
                  </CTableDataCell>
                  <CTableDataCell className="sm-td">
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="sm-action-btn sm-view-btn" title="View" onClick={() => handleViewService(svc.serviceId)}><Eye size={14} /></button>
                      <button className="sm-action-btn sm-edit-btn" title="Edit" onClick={() => handleServiceEdit(svc)}><Edit2 size={14} /></button>
                      <button className="sm-action-btn sm-delete-btn" title="Delete" onClick={() => { setServiceIdToDelete(svc.serviceId); setIsModalVisible(true) }}><Trash2 size={14} /></button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )) : (
                <CTableRow>
                  <CTableDataCell colSpan={5}>
                    <div className="sm-empty">
                      <Layers size={38} className="sm-empty-icon" />
                      <p>{searchQuery ? 'No matching services found.' : 'No services available.'}</p>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      )}

      {/* ── Pagination ── */}
      {filteredData.length > 0 && (
        <div className="sm-pagination">
          {/* Left: rows per page */}
          <div className="sm-rows-select">
            <span>Rows per page:</span>
            <select className="sm-select" value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Right: prev / page numbers / next / page info */}
          <div className="sm-page-controls">
            <button className="sm-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              ‹ Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`sm-page-btn sm-page-num ${i + 1 === currentPage ? 'sm-page-btn--active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="sm-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next ›
            </button>
            <span className="sm-page-label">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} backdrop="static" alignment="center">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} color="#185fa5" /> Service Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px' }}>
          {selectedService ? (
            <div className="sm-view-body">
              {selectedService.serviceImage && (
                <div className="sm-view-img-wrap">
                  <img src={`data:image/jpeg;base64,${selectedService.serviceImage}`} alt={selectedService.serviceName} className="sm-view-img" />
                </div>
              )}
              <div className="sm-view-grid">
                <div className="sm-view-field"><span className="sm-view-label">Service Name</span><span className="sm-view-value">{selectedService.serviceName}</span></div>
                <div className="sm-view-field"><span className="sm-view-label">Category</span><span className="sm-view-value">{selectedService.categoryName}</span></div>
                <div className="sm-view-field" style={{ gridColumn: '1/-1' }}><span className="sm-view-label">Description</span><span className="sm-view-value">{selectedService.description || 'N/A'}</span></div>
              </div>
            </div>
          ) : <p style={{ color: '#9ca3af', textAlign: 'center' }}>No details available</p>}
        </CModalBody>
        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px' }}>
          <button className="sm-btn-cancel" onClick={() => setViewModalVisible(false)}><X size={13} /> Close</button>
        </CModalFooter>
      </CModal>

      {/* ── Add Modal ── */}
      <CModal visible={modalVisible} onClose={() => { setModalVisible(false); setNewService({ serviceName: '', categoryId: '', description: '', serviceImage: null }); setErrors({}) }} backdrop="static" alignment="center">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} color="#185fa5" /> Add New Service
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px' }}>
          <Field label="Category" required error={errors.categoryId}>
            <Select styles={reactSelectStyles} options={categoryOptions} isClearable
              value={categoryOptions.find(o => o.value === newService.categoryId) || null}
              onChange={(sel) => { setNewService(p => ({ ...p, categoryId: sel?.value || '' })); if (errors.categoryId) setErrors(p => ({ ...p, categoryId: '' })) }}
              placeholder="Search or select a category" />
          </Field>
          <Field label="Service Name" required error={errors.serviceName}>
            <input className="sm-input" type="text" value={newService.serviceName}
              onChange={(e) => { setNewService(p => ({ ...p, serviceName: e.target.value })); if (errors.serviceName) setErrors(p => ({ ...p, serviceName: '' })) }} />
          </Field>
          <Field label="Description" required error={errors.description}>
            <input className="sm-input" type="text" value={newService.description}
              onChange={(e) => { setNewService(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddService() } }} />
          </Field>
          <Field label="Service Image" required error={errors.serviceImage}>
            <input className="sm-input" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
            {newService.serviceImage && (
              <ImgPreview src={`data:image/png;base64,${newService.serviceImage}`}
                onRemove={() => { setNewService(p => ({ ...p, serviceImage: null })); if (fileInputRef.current) fileInputRef.current.value = '' }} />
            )}
          </Field>
        </CModalBody>
        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: 8 }}>
          <button className="sm-btn-cancel" onClick={() => { setModalVisible(false); setNewService({ serviceName: '', categoryId: '', description: '', serviceImage: null }); setErrors({}) }}><X size={13} /> Cancel</button>
          <button className="sm-btn-save" onClick={handleAddService}><Save size={13} /> Add Service</button>
        </CModalFooter>
      </CModal>

      {/* ── Edit Modal ── */}
      <CModal visible={editServiceMode} onClose={() => { setEditServiceMode(false); setEditErrors({}) }} backdrop="static" alignment="center">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} color="#185fa5" /> Edit Service
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px' }}>
          <Field label="Category" required error={editErrors.categoryId}>
            <select className="sm-input" value={updatedService.categoryId}
              onChange={(e) => { setUpdatedService(p => ({ ...p, categoryId: e.target.value })); if (editErrors.categoryId) setEditErrors(p => ({ ...p, categoryId: '' })) }}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </Field>
          <Field label="Service Name" required error={editErrors.ServiceName}>
            <input className="sm-input" type="text" value={updatedService.ServiceName}
              onChange={(e) => { setUpdatedService(p => ({ ...p, ServiceName: e.target.value })); if (editErrors.ServiceName) setEditErrors(p => ({ ...p, ServiceName: '' })) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateService() } }} />
          </Field>
          <Field label="Description" required error={editErrors.description}>
            <input className="sm-input" type="text" value={updatedService.description}
              onChange={(e) => { setUpdatedService(p => ({ ...p, description: e.target.value })); if (editErrors.description) setEditErrors(p => ({ ...p, description: '' })) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateService() } }} />
          </Field>
          <Field label="Service Image" required error={editErrors.serviceImage}>
            <input className="sm-input" type="file" accept="image/*" ref={editFileInputRef}
              onChange={async (e) => {
                const file = e.target.files[0]; if (!file) return
                if (file.size > 2 * 1024 * 1024) { setEditErrors(p => ({ ...p, serviceImage: 'File size must be less than 2MB' })); return }
                setUpdatedService(p => ({ ...p, serviceImage: file, existingImageName: file.name }))
                setEditErrors(p => ({ ...p, serviceImage: '' }))
              }} />
            {(updatedService.serviceImage || updatedService.existingImage) && (
              <ImgPreview
                src={typeof updatedService.serviceImage === 'string'
                  ? updatedService.serviceImage.startsWith('data:image')
                    ? updatedService.serviceImage
                    : `data:image/png;base64,${updatedService.serviceImage}`
                  : URL.createObjectURL(updatedService.serviceImage)}
                onRemove={() => { setUpdatedService(p => ({ ...p, serviceImage: null, existingImageName: '' })); if (editFileInputRef.current) editFileInputRef.current.value = '' }} />
            )}
          </Field>
        </CModalBody>
        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: 8 }}>
          <button className="sm-btn-cancel" onClick={() => { setEditServiceMode(false); setEditErrors({}) }}><X size={13} /> Cancel</button>
          <button className="sm-btn-save" onClick={handleUpdateService}><Save size={13} /> Update</button>
        </CModalFooter>
      </CModal>

      <ConfirmationModal isVisible={isModalVisible} message="Are you sure you want to delete this service?"
        onConfirm={handleConfirmDelete} onCancel={() => setIsModalVisible(false)} />

      {/* ── Styles ── */}
      <style>{`
        .sm-page { padding: 4px 0; }

        /* Header */
        .sm-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 0.5px solid #d0dce9;
        }
        .sm-title-group { display: flex; align-items: center; gap: 12px; }
        .sm-page-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #e6f1fb; display: flex; align-items: center;
          justify-content: center; color: #185fa5; flex-shrink: 0;
        }
        .sm-page-title { font-size: 17px; font-weight: 600; color: #0c447c; margin: 0; }
        .sm-page-sub   { font-size: 12px; color: #6b7280; margin: 0; }
        .sm-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        /* Search */
        .sm-search-wrap { position: relative; }
        .sm-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; width: 15px; pointer-events: none;
        }
        .sm-search-input {
          padding: 8px 12px 8px 34px; font-size: 13px; color: #374151;
          border: 0.5px solid #d0dce9; border-radius: 8px; outline: none;
          width: 260px; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .sm-search-input:focus { border-color: #185fa5; box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12); }

        .sm-add-btn {
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 8px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s; white-space: nowrap;
        }
        .sm-add-btn:hover { filter: brightness(0.9); }

        /* Table */
        .sm-table-wrapper {
          border: 0.5px solid #d0dce9; border-radius: 10px;
          overflow: hidden; overflow-x: auto; margin-bottom: 12px;
        }
        .sm-table { margin-bottom: 0 !important; font-size: 13px; }
        .sm-th {
          background: #185fa5 !important; color: #fff !important;
          font-size: 12px !important; font-weight: 600 !important;
          padding: 11px 14px !important; white-space: nowrap; border: none !important;
        }
        .sm-tr { transition: background 0.12s; }
        .sm-tr:hover { background: #f0f5fb !important; }
        .sm-td {
          padding: 11px 14px !important; vertical-align: middle !important;
          font-size: 13px; color: #374151;
          border-bottom: 0.5px solid #eef2f7 !important; border-top: none !important;
        }
        .sm-td-num  { color: #9ca3af; font-size: 12px; }
        .sm-muted   { color: #6b7280; }
        .sm-name    { font-weight: 600; color: #0c447c; }
        .sm-desc    {
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Action buttons */
        .sm-action-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: none; border-radius: 7px;
          cursor: pointer; transition: filter 0.12s, transform 0.1s;
        }
        .sm-action-btn:hover  { filter: brightness(0.88); transform: scale(1.07); }
        .sm-action-btn:active { transform: scale(0.95); }
        .sm-view-btn   { background: #e6f1fb; color: #185fa5; }
        .sm-edit-btn   { background: #eaf3de; color: #3b6d11; }
        .sm-delete-btn { background: #fcebeb; color: #a32d2d; }

        /* Empty */
        .sm-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 40px 0; color: #9ca3af; font-size: 14px;
        }
        .sm-empty-icon { color: #d0dce9; }
        .sm-error { color: #a32d2d; padding: 20px; text-align: center; }

        /* ── Pagination (matches screenshot) ── */
        .sm-pagination {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; padding: 10px 0;
        }
        .sm-rows-select { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
        .sm-select {
          font-size: 12px; padding: 5px 8px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          outline: none; color: #374151; background: #fff;
        }
        .sm-page-controls { display: flex; align-items: center; gap: 4px; }
        .sm-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .sm-page-num { min-width: 32px; padding: 0; }
        .sm-page-btn:hover:not(:disabled) { background: #e6f1fb; color: #185fa5; border-color: #b5d4f4; }
        .sm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .sm-page-btn--active {
          background: #185fa5 !important; color: #fff !important;
          border-color: #185fa5 !important; font-weight: 700 !important;
        }
        .sm-page-label { font-size: 12px; color: #6b7280; margin-left: 6px; }

        /* Modal field */
        .sm-field { margin-bottom: 14px; }
        .sm-label { display: block; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .sm-required { color: #e24b4a; }
        .sm-error-text { font-size: 11px; color: #e24b4a; display: block; margin-top: 4px; }
        .sm-input {
          width: 100%; padding: 7px 10px; font-size: 12.5px; color: #374151;
          background: #fff; border: 0.5px solid #d0dce9; border-radius: 7px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none; -webkit-appearance: none;
        }
        .sm-input:focus { border-color: #185fa5; box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12); }

        /* Image preview */
        .sm-img-preview-wrap { position: relative; display: inline-block; margin-top: 10px; }
        .sm-img-preview { width: 110px; height: 110px; object-fit: cover; border-radius: 8px; border: 0.5px solid #d0dce9; display: block; }
        .sm-img-remove {
          position: absolute; top: -8px; right: -8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #fcebeb; color: #a32d2d; border: 0.5px solid #f5c6c6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.12s;
        }
        .sm-img-remove:hover { background: #f5c6c6; }

        /* View modal */
        .sm-view-body { display: flex; flex-direction: column; gap: 16px; }
        .sm-view-img-wrap { display: flex; justify-content: center; padding: 16px; background: #f0f5fb; border-radius: 10px; }
        .sm-view-img { max-width: 160px; border-radius: 10px; border: 0.5px solid #d0dce9; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .sm-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .sm-view-field { display: flex; flex-direction: column; gap: 3px; }
        .sm-view-label { font-size: 10.5px; font-weight: 600; color: #185fa5; text-transform: uppercase; letter-spacing: 0.3px; }
        .sm-view-value { font-size: 13px; color: #374151; font-weight: 500; }

        /* Footer buttons */
        .sm-btn-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; color: #374151; border: 0.5px solid #d0dce9;
          border-radius: 8px; padding: 7px 16px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .sm-btn-cancel:hover { background: #f3f4f6; }
        .sm-btn-save {
          display: inline-flex; align-items: center; gap: 5px;
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 7px 18px; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: filter 0.15s;
        }
        .sm-btn-save:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  )
}

export default ServiceManagement