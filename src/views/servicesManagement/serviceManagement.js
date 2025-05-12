import React, { useState, useEffect } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormSelect,
  CHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAllServices, postServiceData } from './ServiceAPI'
import { CategoryData } from '../categoryManagement/CategoryAPI'

const ServiceManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [service, setService] = useState([])
  const [categories, setCategories] = useState([])

  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewService, setViewService] = useState(null)
  const [editServiceMode, setEditServiceMode] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null)

  const [errors, setErrors] = useState({
    serviceName: '',
    categoryId: '',
    categoryName: '',
    description: '',
    ServiceImage: '',
  })

  const [newService, setNewService] = useState({
    serviceName: '',
    categoryId: '',
    categoryName: '',
    description: '',
    serviceImage: null,
  })

  const [updatedService, setUpdatedService] = useState({
    ServiceId: '',
    ServiceName: '',
    categoryId: '',
    categoryName: '',
    description: '',
    ServiceImage: null,
  })

  const fetchData = async () => {
    setLoading(true)
    console.log('fetchData')

    try {
      const servicesResponse = await getAllServices()
      if (!servicesResponse || !servicesResponse.data) {
        throw new Error('Invalid services response')
      }

      const categoriesResponse = await CategoryData()
      if (!categoriesResponse || !categoriesResponse.data) {
        throw new Error('Invalid categories response')
      }

      setService(servicesResponse.data.data) // ← if data is wrapped
      setCategories(categoriesResponse.data)
      console.log(categoriesResponse.data)
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to fetch data')
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleSearch = () => {
      const trimmedQuery = searchQuery.toLowerCase().trim()
      if (!trimmedQuery) {
        setFilteredData([])
        return
      }
      const filtered = service.filter((services) =>
        services.serviceName.toLowerCase().includes(searchQuery.toLowerCase().trim()),
      )
      setFilteredData(filtered)
    }
    handleSearch()
  }, [searchQuery, service])

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result

        // Strip the MIME prefix to get just the raw Base64 string
        const cleanedBase64 = base64String.split(',')[1] // Removes "data:image/jpeg;base64,"

        // Update the state with the cleaned Base64 string
        setNewService((prev) => ({
          ...prev,
          serviceImage: cleanedBase64,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // const handleServiceChange = (e) => {
  //   const { name, value } = e.target;

  //   setNewService((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleServiceChange = (e) => {
    const { name, value } = e.target

    if (name === 'categoryId') {
      const selectedCategory = categories.find((cat) => cat.categoryId === value)

      setNewService((prev) => ({
        ...prev,
        categoryId: value,
        categoryName: selectedCategory?.categoryName || '',
      }))
    } else {
      setNewService((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    console.log('Validating form with data:', newService)

    if (!newService.serviceName?.trim()) {
      newErrors.serviceName = 'Service name is required'
      console.log('Validation error: serviceName is missing')
    }

    if (!newService.description?.trim()) {
      newErrors.description = 'Description is required'
      console.log('Validation error: description is missing')
    }

    if (!newService.serviceImage) {
      newErrors.serviceImage = 'Service image is required'
      console.log('Validation error: serviceImage is missing')
    }

    setErrors(newErrors)
    console.log('Errors after validation:', newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleAddService = async () => {
    console.log('Calling handleAddService with:', newService)

    if (!validateForm()) {
      console.log('Form is invalid. Submission aborted.')
      return
    }

    try {
      console.log('Submitting service to API:', newService)

      await postServiceData(newService)
      toast.success('Service added successfully!')

      setModalVisible(false)
      setNewService({
        serviceName: '',
        categoryId: '',
        categoryName: '',
        description: '',
        serviceImage: null,
      })

      await fetchData()
    } catch (error) {
      console.error('Failed to add service:', error)
      toast.error('Failed to add service')
    }
  }

  // const handleServiceEdit = (service) => {
  //   setServiceToEdit(service)
  //   setUpdatedService({
  //     ServiceId: service.ServiceId,
  //     ServiceName: service.ServiceName,
  //     ServiceImage: service.ServiceImage,
  //   })
  //   setEditServiceMode(true)
  // }

  const handleUpdateService = async () => {
    try {
      await updateServiceData(updatedService, updatedService.serviceId)
      toast.success('Service updated successfully!')
      setEditServiceMode(false)
      await fetchData()
    } catch (error) {
      toast.error('Failed to update service')
    }
  }

  const handleDeleteService = (serviceId) => {
    setServiceIdToDelete(serviceId)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteServiceData(serviceIdToDelete)
      toast.success('Service deleted successfully!')
      setIsModalVisible(false)
      await fetchData()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }
  const columns = [
    {
      name: (
        <div
          style={{
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          S.No
        </div>
      ),
      selector: (row, index) => index + 1,
      sortable: true,
      width: '7%',
    },
    {
      name: (
        <div
          style={{
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Service Name
        </div>
      ),
      selector: (row) => row.serviceName,
      sortable: true,
      width: '20%',
      cell: (row) => <div style={{ textAlign: 'center', fontSize: '16px' }}>{row.serviceName}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: (
        <div
          style={{
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Category
        </div>
      ),
      selector: (row) => row.categoryName,
      sortable: true,
      width: '20%',
      cell: (row) => (
        <div style={{ textAlign: 'center', fontSize: '16px' }}>{row.categoryName}</div>
      ),
      headerStyle: { textAlign: 'center' },
    },
    {
      name: (
        <div
          style={{
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Description
        </div>
      ),
      selector: (row) => row.description,
      sortable: true,
      width: '30%',
      cell: (row) => <div style={{ textAlign: 'center', fontSize: '16px' }}>{row.description}</div>,
      headerStyle: { textAlign: 'center' },
    },
    {
      name: (
        <div
          style={{
            fontSize: '16px',
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
          <CButton
            className="text-primary p-0"
            onClick={() => setViewService(row)}
            style={{ marginRight: '10px', width: '80px' }}
          >
            View
          </CButton>

          <CButton
            color="link"
            className="text-success p-0"
            onClick={() => handleServiceEdit(row)}
            style={{ marginRight: '10px', width: '80px' }}
          >
            Edit
          </CButton>

          <CButton
            color="link"
            className="text-danger p-0"
            onClick={() => handleServiceDelete(row.serviceId)}
            style={{ width: '80px' }}
          >
            Delete
          </CButton>

          {/* <ConfirmationModal
            isVisible={isModalVisible}
            message="Are you sure you want to delete this service?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsModalVisible(false)}
          /> */}
        </div>
      ),
      width: '150px',
      headerStyle: { textAlign: 'center' },
    },
  ]

  return (
    <div className="container-fluid p-4">
      <ToastContainer />

      <CForm className="d-flex justify-content-between mb-3">
        <CInputGroup style={{ width: '300px' }}>
          <CFormInput
            placeholder="Search by Service Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
        </CInputGroup>

        <CButton color="primary" onClick={() => setModalVisible(true)}>
          Add Service
        </CButton>
      </CForm>

      <DataTable
        columns={columns}
        data={service}
        pagination
        progressPending={loading}
        noDataComponent={error || 'No services found'}
      />

      {/* Add Service Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Service</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            name="categoryId"
            label="Category"
            value={newService.categoryId}
            onChange={handleServiceChange}
            className="mb-3"
            feedbackInvalid={errors.categoryId}
          >
            <option value="">Select Category</option>
            {(categories || []).map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </CFormSelect>

          {/* <select
  name="categoryId"
  value={newService.categoryId}
  onChange={handleServiceChange}
  className="form-select mb-3"
>
  <option value="">Select Category</option>
  {(categories || []).map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select> */}

          <CFormInput
            type="text"
            name="serviceName" // fix casing
            label="Service Name"
            value={newService.serviceName} // fix casing
            onChange={handleServiceChange}
            error={errors.serviceName} // fix casing
            className="mb-3"
          />

          <CFormInput
            type="text"
            name="description"
            label="Description"
            value={newService.description}
            onChange={handleServiceChange}
            className="mb-3"
            feedbackInvalid={errors.description}
          />

          <CFormInput
            type="file"
            name="ServiceImage"
            label="Service Image"
            onChange={handleFileChange}
            error={errors.ServiceImage}
            accept="image/*"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddService}>
            Add Service
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Service Modal */}
      <CModal visible={!!viewService} onClose={() => setViewService(null)}>
        <CModalHeader>
          <CModalTitle>Service Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol sm={4}>
              <strong>Service Name:</strong>
            </CCol>
            <CCol sm={8}>{viewService?.serviceName}</CCol>
          </CRow>
          <CRow>
            <CCol sm={4}>
              <strong>Service Image:</strong>
            </CCol>
            <CCol sm={8}>
              {viewService?.serviceImage && (
                <img
                  src={`data:image/png;base64,${viewService?.serviceImage}`}
                  alt="Service"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this service?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleConfirmDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ServiceManagement
