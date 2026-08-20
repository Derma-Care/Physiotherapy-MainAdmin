import React, { useEffect, useState, useRef } from 'react'
import {
  CForm,
  CFormInput,
  CFormText,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilTrash } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Edit2, Eye, Trash2, Tag, Save, X, RotateCcw } from 'lucide-react'

import {
  CategoryData,
  postCategoryData,
  updateCategoryData,
  deleteCategoryData,
} from './CategoryAPI'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import LoadingIndicator from '../../Utils/loader'

const CategoryManagement = () => {
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewCategory, setViewCategory] = useState(null)
  const [editCategoryMode, setEditCategoryMode] = useState(false)
  const [fileKey, setFileKey] = useState(Date.now())

  const [errors, setErrors] = useState({ categoryName: '', categoryImage: '' })

  const [newCategory, setNewCategory] = useState({ categoryName: '', categoryImage: null })

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null)
  const [updatedCategory, setUpdatedCategory] = useState({
    categoryId: '', categoryName: '', categoryImage: null,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true); setError(null)
    try {
      const data = await CategoryData()
      setCategory(data.data)
      setFilteredData(data.data)
    } catch {
      setError('Failed to fetch category data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim()
    const filtered = q
      ? category.filter(c => c.categoryName?.toLowerCase().includes(q))
      : category
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchQuery, category])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    if (currentPage > totalPages && currentPage !== 1) setCurrentPage(totalPages || 1)
  }, [filteredData])

  // ── Validation ───────────────────────────────────────────────────────────
  const validateField = (name, value) => {
    let error = ''
    const t = value?.trim?.() || ''
    if (name === 'categoryName') {
      if (!t) error = 'Category Name is required.'
      else if (t.length < 3) error = 'At least 3 characters required.'
      else if (/^\d+$/.test(t)) error = 'Cannot be only numbers.'
      else if (!/^[A-Za-z\s@&\-\.,()]+$/.test(t)) error = 'Only letters and basic symbols allowed.'
    }
    if (name === 'categoryImage' && !value) error = 'Category Image is required.'
    setErrors(prev => ({ ...prev, [name]: error }))
    return error === ''
  }

  const getPaginationPages = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
        acc.push(p)
        return acc
      }, [])
  }

  // ── File helpers ─────────────────────────────────────────────────────────
  const readFileAsBase64 = (file) => new Promise((res) => {
    const r = new FileReader()
    r.onloadend = () => res(r.result?.split(',')[1])
    r.readAsDataURL(file)
  })

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, categoryImage: 'Only image files are allowed.' }))
      return
    }
    const b64 = await readFileAsBase64(file)
    setNewCategory(prev => ({ ...prev, categoryImage: b64 }))
    validateField('categoryImage', b64)
  }

  const handleEditFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, categoryImage: 'Only image files are allowed.' }))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, categoryImage: 'File size must be less than 2MB.' }))
      return
    }
    const b64 = await readFileAsBase64(file)
    setUpdatedCategory(prev => ({ ...prev, categoryImage: b64 }))
    setErrors(prev => ({ ...prev, categoryImage: '' }))
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!validateField('categoryName', newCategory.categoryName)) return
    if (!validateField('categoryImage', newCategory.categoryImage)) return
    try {
      await postCategoryData({ categoryName: newCategory.categoryName.trim(), categoryImage: newCategory.categoryImage })
      toast.success('Category added successfully!')
      fetchData()
      setModalVisible(false)
      setNewCategory({ categoryName: '', categoryImage: null })
    } catch (err) {
      const msg = err.response?.data?.message?.toLowerCase() || ''
      if (msg.includes('exists')) setErrors(prev => ({ ...prev, categoryName: 'Category Name already exists.' }))
      else toast.error('Failed to add category')
    }
  }

  const handleCategoryEdit = (cat) => {
    setUpdatedCategory({ categoryId: cat.categoryId || '', categoryName: cat.categoryName || '', categoryImage: cat.categoryImage || null })
    setEditCategoryMode(true)
  }

  const handleUpdateCategory = async () => {
    if (!validateField('categoryName', updatedCategory.categoryName)) return
    if (!validateField('categoryImage', updatedCategory.categoryImage)) return
    try {
      await updateCategoryData({ categoryName: updatedCategory.categoryName.trim(), categoryImage: updatedCategory.categoryImage }, updatedCategory.categoryId)
      toast.success('Category updated successfully!')
      setEditCategoryMode(false)
      fetchData()
    } catch (err) {
      const msg = err.response?.data?.message?.toLowerCase() || ''
      if (msg.includes('exists')) setErrors(prev => ({ ...prev, categoryName: 'Category Name already exists.' }))
      else toast.error('Failed to update category')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const data = await deleteCategoryData(categoryIdToDelete)
      setIsModalVisible(false)
      toast.success(`${data.data}`)
      await fetchData()
    } catch { alert('Failed to delete category.') }
  }

  const resetAdd = () => {
    setNewCategory({ categoryName: '', categoryImage: null })
    setErrors({ categoryName: '', categoryImage: '' })
    setFileKey(Date.now())
    setModalVisible(false)
  }

  const resetEdit = () => {
    setUpdatedCategory({ categoryId: '', categoryName: '', categoryImage: null })
    setErrors({ categoryName: '', categoryImage: '' })
    setEditCategoryMode(false)
  }

  // ── Shared name input formatter ───────────────────────────────────────────
  const formatName = (val) =>
    val.replace(/[0-9]/g, '').replace(/\s+/g, ' ')
      .split(' ').filter(w => w).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ')

  return (
    <div className="cm-page">
      

      {/* ── Page header ── */}
      <div className="cm-page-header">
        <div className="cm-title-group">
          <div className="cm-page-icon"><Tag size={20} /></div>
          <div>
            <h4 className="cm-page-title">Category Management</h4>
            <p className="cm-page-sub">{category.length} categor{category.length !== 1 ? 'ies' : 'y'} registered</p>
          </div>
        </div>
        <button className="cm-add-btn" onClick={() => setModalVisible(true)}>
          + Add Category
        </button>
      </div>

      {/* ── Search ── */}
      <div className="cm-search-wrap">
        <CIcon icon={cilSearch} className="cm-search-icon" />
        <input
          className="cm-search-input"
          type="text"
          placeholder="Search by category name…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <LoadingIndicator message="Loading categories…" />
        </div>
      ) : error ? (
        <div className="cm-error">{error}</div>
      ) : (
        <div className="cm-table-wrapper">
          <CTable className="cm-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="cm-th" style={{ width: 60 }}>S.No</CTableHeaderCell>
                <CTableHeaderCell className="cm-th">Category Name</CTableHeaderCell>
                <CTableHeaderCell className="cm-th" style={{ width: 130 }}>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length > 0 ? (
                currentItems.map((cat, index) => (
                  <CTableRow key={cat.categoryId} className="cm-tr">
                    <CTableDataCell className="cm-td cm-td-num">
                      {indexOfFirstItem + index + 1}
                    </CTableDataCell>
                    <CTableDataCell className="cm-td">
                      <span className="cm-cat-name">{cat.categoryName}</span>
                    </CTableDataCell>
                    <CTableDataCell className="cm-td">
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="cm-action-btn cm-view-btn" title="View"
                          onClick={() => setViewCategory(cat)}><Eye size={14} /></button>
                        <button className="cm-action-btn cm-edit-btn" title="Edit"
                          onClick={() => handleCategoryEdit(cat)}><Edit2 size={14} /></button>
                        <button className="cm-action-btn cm-delete-btn" title="Delete"
                          onClick={() => { setCategoryIdToDelete(cat.categoryId); setIsModalVisible(true) }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={3}>
                    <div className="cm-empty">
                      <Tag size={38} className="cm-empty-icon" />
                      <p>{searchQuery ? 'No matching categories found.' : 'No categories available.'}</p>
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
        <div className="cm-pagination">
          {/* Left: rows per page */}
          <div className="cm-rows-select">
            <span>Rows per page:</span>
            <select className="cm-select" value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}>
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Right: prev / page numbers / next / page label */}
          <div className="cm-page-controls">
            <button
              className="cm-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ‹ Prev
            </button>

            {getPaginationPages().map((p, i) =>
              p === '…' ? (
                <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 4px' }}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`cm-page-btn cm-page-num ${currentPage === p ? 'cm-page-btn--active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="cm-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next ›
            </button>

            <span className="cm-page-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {viewCategory && (
        <CModal visible={!!viewCategory} onClose={() => setViewCategory(null)} backdrop="static" alignment="center">
          <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
            <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={16} color="#185fa5" /> Category Details
            </CModalTitle>
          </CModalHeader>
          <CModalBody style={{ padding: '20px' }}>
            <div className="cm-view-body">
              {viewCategory.categoryImage && (
                <div className="cm-view-img-wrap">
                  <img src={`data:image/png;base64,${viewCategory.categoryImage}`} alt="Category"
                    className="cm-view-img" />
                </div>
              )}
              <div className="cm-view-grid">
                <div className="cm-view-field">
                  <span className="cm-view-label">Category ID</span>
                  <span className="cm-view-value">{viewCategory.categoryId || 'N/A'}</span>
                </div>
                <div className="cm-view-field">
                  <span className="cm-view-label">Category Name</span>
                  <span className="cm-view-value">{viewCategory.categoryName || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CModalBody>
          <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px' }}>
            <button className="cm-btn-cancel" onClick={() => setViewCategory(null)}><X size={13} /> Close</button>
          </CModalFooter>
        </CModal>
      )}

      {/* ── Add Modal ── */}
      <CModal visible={modalVisible} onClose={resetAdd} backdrop="static" alignment="center">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={16} color="#185fa5" /> Add New Category
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px' }}>
          <CForm onSubmit={(e) => { e.preventDefault(); handleAddCategory() }}>

            <div className="cm-field">
              <label className="cm-label">Category Name <span className="cm-required">*</span></label>
              <input
                className="cm-input"
                type="text"
                placeholder="Enter category name"
                value={newCategory.categoryName}
                onChange={(e) => {
                  const val = formatName(e.target.value)
                  setNewCategory(prev => ({ ...prev, categoryName: val }))
                  if (errors.categoryName) setErrors(prev => ({ ...prev, categoryName: '' }))
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory() } }}
              />
              {errors.categoryName && <span className="cm-error-text">{errors.categoryName}</span>}
            </div>

            <div className="cm-field">
              <label className="cm-label">Category Image <span className="cm-required">*</span></label>
              <input key={fileKey} className="cm-input" type="file" accept="image/*"
                ref={fileInputRef} onChange={handleFileChange} />
              {newCategory.categoryImage && (
                <div className="cm-img-preview-wrap">
                  <img src={`data:image/png;base64,${newCategory.categoryImage}`} alt="Preview" className="cm-img-preview" />
                  <button type="button" className="cm-img-remove"
                    onClick={() => { setNewCategory(prev => ({ ...prev, categoryImage: null })); setFileKey(Date.now()) }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
              {errors.categoryImage && <span className="cm-error-text">{errors.categoryImage}</span>}
            </div>

          </CForm>
        </CModalBody>
        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: 8 }}>
          <button className="cm-btn-cancel" onClick={resetAdd}><X size={13} /> Cancel</button>
          <button className="cm-btn-save" onClick={handleAddCategory}><Save size={13} /> Add</button>
        </CModalFooter>
      </CModal>

      {/* ── Edit Modal ── */}
      <CModal visible={editCategoryMode} onClose={resetEdit} backdrop="static" alignment="center">
        <CModalHeader style={{ borderBottom: '0.5px solid #d0dce9', padding: '16px 20px' }}>
          <CModalTitle style={{ fontSize: 15, fontWeight: 600, color: '#0c447c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={16} color="#185fa5" /> Edit Category
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ padding: '20px' }}>
          <CForm onSubmit={(e) => { e.preventDefault(); handleUpdateCategory() }}>

            <div className="cm-field">
              <label className="cm-label">Category Name <span className="cm-required">*</span></label>
              <input
                className="cm-input"
                type="text"
                placeholder="Enter category name"
                value={updatedCategory.categoryName}
                onChange={(e) => {
                  const val = formatName(e.target.value)
                  setUpdatedCategory(prev => ({ ...prev, categoryName: val }))
                  if (errors.categoryName) setErrors(prev => ({ ...prev, categoryName: '' }))
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUpdateCategory() } }}
              />
              {errors.categoryName && <span className="cm-error-text">{errors.categoryName}</span>}
            </div>

            <div className="cm-field">
              <label className="cm-label">Category Image <span className="cm-required">*</span></label>
              <input className="cm-input" type="file" accept="image/*"
                ref={editFileInputRef} onChange={handleEditFileChange} />
              {updatedCategory.categoryImage ? (
                <div className="cm-img-preview-wrap">
                  <img src={`data:image/png;base64,${updatedCategory.categoryImage}`} alt="Preview" className="cm-img-preview" />
                  <button type="button" className="cm-img-remove"
                    onClick={() => {
                      setUpdatedCategory(prev => ({ ...prev, categoryImage: null }))
                      if (editFileInputRef.current) editFileInputRef.current.value = null
                    }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: 12, color: '#9ca3af', display: 'block', marginTop: 6 }}>No image available</span>
              )}
              {errors.categoryImage && <span className="cm-error-text">{errors.categoryImage}</span>}
            </div>

          </CForm>
        </CModalBody>
        <CModalFooter style={{ borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: 8 }}>
          <button className="cm-btn-cancel" onClick={resetEdit}><X size={13} /> Cancel</button>
          <button className="cm-btn-save" onClick={handleUpdateCategory}><Save size={13} /> Update</button>
        </CModalFooter>
      </CModal>

      {/* ── Delete Confirmation ── */}
      <ConfirmationModal
        isVisible={isModalVisible}
        message="Are you sure you want to delete this category? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalVisible(false)}
      />

      {/* ── Styles ── */}
      <style>{`
        /* Page layout */
        .cm-page { padding: 4px 0; }

        /* Header */
        .cm-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 0.5px solid #d0dce9;
        }
        .cm-title-group { display: flex; align-items: center; gap: 12px; }
        .cm-page-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: #e6f1fb; display: flex; align-items: center;
          justify-content: center; color: #185fa5; flex-shrink: 0;
        }
        .cm-page-title { font-size: 17px; font-weight: 600; color: #0c447c; margin: 0; }
        .cm-page-sub   { font-size: 12px; color: #6b7280; margin: 0; }

        .cm-add-btn {
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 8px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s; white-space: nowrap;
        }
        .cm-add-btn:hover { filter: brightness(0.9); }

        /* Search */
        .cm-search-wrap {
          position: relative; margin-bottom: 16px; max-width: 320px;
        }
        .cm-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; width: 15px; height: 15px; pointer-events: none;
        }
        .cm-search-input {
          width: 100%; padding: 8px 12px 8px 34px;
          font-size: 13px; color: #374151;
          border: 0.5px solid #d0dce9; border-radius: 8px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cm-search-input:focus {
          border-color: #185fa5;
          box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12);
        }

        /* Table */
        .cm-table-wrapper {
          border: 0.5px solid #d0dce9; border-radius: 10px;
          overflow: hidden; overflow-x: auto; margin-bottom: 12px;
        }
        .cm-table { margin-bottom: 0 !important; font-size: 13px; }
        .cm-th {
          background: #185fa5 !important; color: #fff !important;
          font-size: 12px !important; font-weight: 600 !important;
          padding: 11px 14px !important; white-space: nowrap; border: none !important;
        }
        .cm-tr { transition: background 0.12s; }
        .cm-tr:hover { background: #f0f5fb !important; }
        .cm-td {
          padding: 11px 14px !important; vertical-align: middle !important;
          font-size: 13px; color: #374151;
          border-bottom: 0.5px solid #eef2f7 !important; border-top: none !important;
        }
        .cm-td-num  { color: #9ca3af; font-size: 12px; }
        .cm-cat-name { font-weight: 600; color: #0c447c; }

        /* Action buttons */
        .cm-action-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: none; border-radius: 7px;
          cursor: pointer; transition: filter 0.12s, transform 0.1s; flex-shrink: 0;
        }
        .cm-action-btn:hover  { filter: brightness(0.88); transform: scale(1.07); }
        .cm-action-btn:active { transform: scale(0.95); }
        .cm-view-btn   { background: #e6f1fb; color: #185fa5; }
        .cm-edit-btn   { background: #eaf3de; color: #3b6d11; }
        .cm-delete-btn { background: #fcebeb; color: #a32d2d; }

        /* Empty state */
        .cm-empty {
          display: flex; flex-direction: column; align-items: center;
          gap: 10px; padding: 40px 0; color: #9ca3af; font-size: 14px;
        }
        .cm-empty-icon { color: #d0dce9; }
        .cm-error { color: #a32d2d; padding: 20px; text-align: center; }

        /* Pagination */
        .cm-pagination {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; padding: 10px 0;
        }
        .cm-rows-select { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
        .cm-select {
          font-size: 12px; padding: 5px 8px; border: 0.5px solid #d0dce9;
          border-radius: 6px; outline: none; color: #374151; background: #fff;
        }
        .cm-page-controls { display: flex; align-items: center; gap: 4px; }
        .cm-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border: 0.5px solid #d0dce9; border-radius: 6px;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .cm-page-num { min-width: 32px; padding: 0; }
        .cm-page-btn:hover:not(:disabled) { background: #e6f1fb; color: #185fa5; border-color: #b5d4f4; }
        .cm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cm-page-btn--active { background: #185fa5 !important; color: #fff !important; border-color: #185fa5 !important; font-weight: 700 !important; }
        .cm-page-label { font-size: 12px; color: #6b7280; margin-left: 6px; }

        /* Modal field */
        .cm-field { margin-bottom: 16px; }
        .cm-label {
          display: block; font-size: 11px; font-weight: 600;
          color: #374151; margin-bottom: 5px;
        }
        .cm-required { color: #e24b4a; }
        .cm-input {
          width: 100%; padding: 7px 10px; font-size: 12.5px; color: #374151;
          background: #fff; border: 0.5px solid #d0dce9; border-radius: 7px;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .cm-input:focus {
          border-color: #185fa5;
          box-shadow: 0 0 0 2.5px rgba(24,95,165,0.12);
        }
        .cm-error-text { font-size: 11px; color: #e24b4a; display: block; margin-top: 4px; }

        /* Image preview */
        .cm-img-preview-wrap {
          position: relative; display: inline-block; margin-top: 10px;
        }
        .cm-img-preview {
          width: 120px; height: 120px; object-fit: cover;
          border-radius: 8px; border: 0.5px solid #d0dce9;
          display: block;
        }
        .cm-img-remove {
          position: absolute; top: -8px; right: -8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #fcebeb; color: #a32d2d; border: 0.5px solid #f5c6c6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.12s;
        }
        .cm-img-remove:hover { background: #f5c6c6; }

        /* View modal body */
        .cm-view-body { display: flex; flex-direction: column; gap: 16px; }
        .cm-view-img-wrap {
          display: flex; justify-content: center;
          padding: 16px; background: #f0f5fb; border-radius: 10px;
        }
        .cm-view-img {
          max-width: 160px; border-radius: 10px;
          border: 0.5px solid #d0dce9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .cm-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cm-view-field { display: flex; flex-direction: column; gap: 3px; }
        .cm-view-label {
          font-size: 10.5px; font-weight: 600; color: #185fa5;
          text-transform: uppercase; letter-spacing: 0.3px;
        }
        .cm-view-value { font-size: 13px; color: #374151; font-weight: 500; }

        /* Footer buttons */
        .cm-btn-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff; color: #374151; border: 0.5px solid #d0dce9;
          border-radius: 8px; padding: 7px 16px;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s;
        }
        .cm-btn-cancel:hover { background: #f3f4f6; }
        .cm-btn-save {
          display: inline-flex; align-items: center; gap: 5px;
          background: #185fa5; color: #fff; border: none;
          border-radius: 8px; padding: 7px 18px;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: filter 0.15s;
        }
        .cm-btn-save:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  )
}

export default CategoryManagement