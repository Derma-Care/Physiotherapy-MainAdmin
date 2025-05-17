import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CRow, CCol, CFormSelect, CFormInput, CButton, CModal } from '@coreui/react'
import Select from 'react-select'

import { CategoryData } from '../categoryManagement/CategoryAPI'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL, subService_URL, updateSubservices, getService } from '../../baseUrl'
import DataTable from 'react-data-table-component'
import postSubService from '../SubserviceManagement/SUbServiceAPI'
import { getAllSubServices, deleteSubServiceData } from '../SubserviceManagement/SUbServiceAPI'
import { getServiceByCategoryId } from '../servicesManagement/ServiceAPI'

const AddSubService = () => {
  const [category, setCategory] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [subServiceOptions, setSubServiceOptions] = useState([])
  const [selectedSubServices, setSelectedSubServices] = useState([])
  const [subServiceInput, setSubServiceInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editSubServiceId, setEditSubServiceId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSubServices, setFilteredSubServices] = useState([])

  const [newService, setNewService] = useState({
    categoryName: '',
    categoryId: '',
    serviceName: '',
    serviceId: '',
  })
  const [subServices, setSubServices] = useState([]) // will be filled by API

  useEffect(() => {
    fetchSubServices()
  }, [])
  const fetchSubServices = async () => {
    const result = await getAllSubServices()

    // Flatten subservice structure if needed
    const formattedSubServices = result.flatMap((item) =>
      Array.isArray(item.subServices)
        ? item.subServices.map((sub) => ({
            id: sub.subServiceId,
            name: sub.subServiceName,
            category: item.categoryName,
            service: item.serviceName,
            serviceId: item.serviceId,
          }))
        : [],
    )

    setSubServices(formattedSubServices) // your state setter
  }
  const handleCategoryEdit = async (row) => {
    setEditMode(true)
    setEditSubServiceId(row.id)
    setShowModal(true)

    // Get the categoryId from name
    const selectedCategory = category.find((c) => c.categoryName === row.category)
    const selectedCategoryId = selectedCategory?.categoryId || ''

    // Fetch services for that category
    try {
      const res = await getServiceByCategoryId(selectedCategoryId)

      setServiceOptions(res)

      // Find the selected service by name
      const selectedService = res.find((s) => s.serviceName === row.service)

      setNewService({
        categoryName: row.category,
        categoryId: selectedCategoryId,
        serviceName: row.service,
        serviceId: selectedService?.serviceId || '',
      })
    } catch (err) {
      console.error('❌ Failed to load services for edit:', err)
      setServiceOptions([])
    }

    // Set the subservice being edited
    setSelectedSubServices([row.name])
  }

  const handleConfirmDelete = async (serviceId) => {
    const confirmed = window.confirm('Are you sure you want to delete this subservice?')
    if (!confirmed) return

    try {
      const res = await deleteSubServiceData(serviceId)
      console.log('🧪 Delete Response:', res)

      if (res?.data?.success === true) {
        toast.success('Subservice deleted successfully!', { position: 'top-right' })
        await fetchSubServices()
      } else {
        toast.error('Failed to delete subservice.', { position: 'top-right' })
      }
    } catch (error) {
      console.error('❌ Delete error:', error)
      toast.error('Failed to delete subservice.', { position: 'top-right' })
    }
  }

  const columns = [
    {
      name: 'S.No',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '120px',
    },
    {
      name: (
        <div
          style={{
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          SubService
        </div>
      ),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Category
        </div>
      ),
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Service
        </div>
      ),
      selector: (row) => row.service,
      sortable: true,
    },
    {
      name: (
        <div
          style={{
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Actions
        </div>
      ),
      cell: (row) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '230px',
          }}
        >
          {/* <CButton
            //  color="link"
            className="text-primary p-0"
            onClick={() => setViewCategory(row)}
            style={{ marginRight: '10px', width: '80px' }}
          >
            View
          </CButton> */}

          <CButton
            color="link"
            className="text-success p-0"
            onClick={() => handleCategoryEdit(row)}
            style={{ marginRight: '10px', width: '80px' }}
          >
            Edit
          </CButton>

          <CButton
            color="link"
            className="text-danger p-0"
            onClick={() => handleConfirmDelete(row.id)}
            style={{ width: '80px' }}
          >
            Delete
          </CButton>
        </div>
      ),
    },
  ]

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryData()
        if (res?.data) {
          setCategory(res.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setCategory([])
      }
    }

    fetchCategories()
  }, [])

  const handleChanges = async (e) => {
    const { name, value } = e.target
    console.log(name)
    if (name === 'categoryName') {
      console.log('Selected category ID:', value)
      const selectedCategory = category.find((cat) => cat.categoryId === value)
      console.log('Selected category:', selectedCategory)

      setNewService((prev) => ({
        ...prev,
        categoryName: selectedCategory?.categoryName || '',
        categoryId: value,
        serviceName: '',
        serviceId: '',
      }))

      try {
        const res = await getServiceByCategoryId(value)

        setServiceOptions(res)
      } catch (err) {
        console.error('❌ Failed to fetch services:', err)
        setServiceOptions([])
      }
    } else if (name === 'serviceName') {
      const selectedService = serviceOptions.find((s) => s.serviceId === value)

      setNewService((prev) => ({
        ...prev,
        serviceName: selectedService?.serviceName || '',
        serviceId: value,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      if (editMode && editSubServiceId) {
        // Send only one subservice name
        // const payload = {
        //   // categoryId: newService.categoryId,
        //   // serviceId: newService.serviceId,
        //   subServiceName: selectedSubServices,
        // }
        const payload = {
          subServices: selectedSubServices.map((name) => ({
            subServiceName: name,
          })),
        }

        console.log(editSubServiceId)

        const res = await axios.put(`${BASE_URL}/${updateSubservices}/${editSubServiceId}`, payload)

        if (res?.data?.success) {
          toast.success('SubService updated successfully!')
        } else {
          toast.error('Failed to update subservice.')
        }
      } else {
        const formattedSubServices = selectedSubServices.map((name) => ({
          subServiceName: name,
        }))

        const payload = {
          categoryId: newService.categoryId,
          serviceId: newService.serviceId,
          subServices: formattedSubServices,
        }

        const res = await postSubService(payload)
        if (res?.data?.success) {
          toast.success('SubServices linked successfully')
        } else {
          toast.error('Submission failed')
        }
      }

      await fetchSubServices()
      setSelectedSubServices([])
      setSubServiceInput('')
      setNewService({
        categoryName: '',
        categoryId: '',
        serviceName: '',
        serviceId: '',
      })
      setEditMode(false)
      setEditSubServiceId(null)
      setShowModal(false)
    } catch (err) {
      console.error('Submission Error:', err)
      toast.error('Error submitting subservices')
    }
  }
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubServices(subServices)
    } else {
      const lowerSearch = searchQuery.toLowerCase()
      const filtered = subServices.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.category.toLowerCase().includes(lowerSearch) ||
          item.service.toLowerCase().includes(lowerSearch),
      )
      setFilteredSubServices(filtered)
    }
  }, [searchQuery, subServices])

  return (
    <>
      <CRow>
        <CCol md={6}>
          <div className="d-flex justify-content-start mb-3">
            <CFormInput
              type="text"
              placeholder="Search by Category, Service, SubService"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CCol>
      </CRow>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>SubService Management</h4>
        <CButton
          color="primary"
          onClick={() => {
            setEditMode(false) // ✅ Reset edit mode
            setEditSubServiceId(null)
            setNewService({
              categoryName: '',
              categoryId: '',
              serviceName: '',
              serviceId: '',
            })
            setSelectedSubServices([])
            setSubServiceInput('')
            setShowModal(true)
          }}
        >
          + Add New SubService
        </CButton>
      </div>
      {/* Modal Form */}
      <DataTable
        columns={columns}
        data={filteredSubServices}
        pagination
        highlightOnHover
        striped
        dense
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <div className="p-4">
          {/* <h5 className="mb-4">➕ Add New SubService</h5> */}
          <h5 className="mb-4">{editMode ? 'Edit Sub Service' : '➕ Add New SubService'}</h5>
          <CRow className="g-4">
            {/* Category Select */}
            <CCol md={6}>
              <h6>
                Category <span className="text-danger">*</span>
              </h6>
              <CFormSelect
                name="categoryName"
                value={newService.categoryId || ''}
                onChange={handleChanges}
                disabled={editMode}
              >
                <option value="">Select Category</option>
                {category.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Service Select */}
            <CCol md={6}>
              <h6>
                Service <span className="text-danger">*</span>
              </h6>
              <CFormSelect
                name="serviceName"
                value={newService.serviceId || ''}
                onChange={handleChanges}
                disabled={editMode} // Make it disabled only in edit mode
              >
                <option value="">Select Service</option>
                {serviceOptions.map((s) => (
                  <option key={s.serviceId} value={s.serviceId}>
                    {s.serviceName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* SubService Entry */}
            <CCol md={12}>
              <h6>{editMode ? 'Edit Sub Service' : 'Add Sub Services'}</h6>

              {/* Add Mode: Input + Button */}
              {!editMode && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <CFormInput
                    placeholder="Enter Sub Service"
                    value={subServiceInput}
                    onChange={(e) => setSubServiceInput(e.target.value)}
                    style={{ flexGrow: 1 }}
                  />

                  <CButton
                    color="success"
                    className="text-white"
                    onClick={() => {
                      const trimmedInput = subServiceInput.trim()
                      if (!trimmedInput) return

                      if (selectedSubServices.includes(trimmedInput)) {
                        toast.warn('Subservice already added!', {
                          position: 'top-right',
                          autoClose: 2000,
                        })
                        return
                      }

                      setSelectedSubServices((prev) => [...prev, trimmedInput])
                      setSubServiceInput('')
                    }}
                  >
                    Add
                  </CButton>
                </div>
              )}

              {/* Edit Mode: Single Input Field */}
              {editMode && (
                <CFormInput
                  placeholder="Edit Sub Service"
                  value={selectedSubServices[0] || ''}
                  onChange={(e) => setSelectedSubServices([e.target.value])}
                />
              )}

              {/* Show List of Subservices only in Add Mode */}
              {!editMode && selectedSubServices.length > 0 && (
                <ul className="list-group mt-3">
                  {selectedSubServices.map((sub, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {sub}
                      <CButton
                        size="sm"
                        color="danger"
                        variant="outline"
                        onClick={() =>
                          setSelectedSubServices((prev) => prev.filter((item) => item !== sub))
                        }
                      >
                        Remove
                      </CButton>
                    </li>
                  ))}
                </ul>
              )}
            </CCol>
          </CRow>

          {/* Modal Footer Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <CButton color="secondary" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </CButton>

            <CButton
              color="primary"
              className="text-white"
              onClick={async () => {
                await handleSubmit() // call first
                setShowModal(false) // close only after success
              }}
            >
              <h6>{editMode ? 'Update Sub Service' : 'Add SubService'}</h6>
            </CButton>
          </div>
        </div>
      </CModal>
    </>
  )
}

export default AddSubService
