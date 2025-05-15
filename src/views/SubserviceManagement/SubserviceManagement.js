import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CRow, CCol, CFormSelect, CFormInput, CButton, CModal } from '@coreui/react'
import Select from 'react-select'

import { CategoryData } from '../categoryManagement/CategoryAPI'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { subService_URL } from '../../baseUrl'
import DataTable from 'react-data-table-component'
const AddSubService = () => {
  const [category, setCategory] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [subServiceOptions, setSubServiceOptions] = useState([])
  const [selectedSubServices, setSelectedSubServices] = useState([])
  const [subServiceInput, setSubServiceInput] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newService, setNewService] = useState({
    categoryName: '',
    categoryId: '',
    serviceName: '',
    serviceId: '',
  })

  const dummySubservices = [
    { id: 'SS001', name: 'Skin Brightening', category: 'Dermatology', service: 'Facial' },
    { id: 'SS002', name: 'Hair Fall Treatment', category: 'Hair', service: 'Hair Therapy' },
  ]

  const columns = [
    {
      name: 'S.No',
      selector: (row,index) => index+1,
      sortable: true,
      width: '120px',
    },
    {
      name: 'SubService',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: 'Service',
      selector: (row) => row.service,
      sortable: true,
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
        const res = await axios.get(`${subService_URL}/services/getServices/${value}`)
        const serviceList = res.data?.data || []
        setServiceOptions(serviceList)
      } catch (err) {
        console.error('❌ Failed to fetch services:', err)
        setServiceOptions([])
      }
    } else if (name === 'serviceName') {
      const selectedService = serviceOptions.find((s) => s.serviceName === value)

      setNewService((prev) => ({
        ...prev,
        serviceName: value,
        serviceId: selectedService?.serviceId || '',
      }))
    }
  }

  const handleSubmit = async () => {
    const payload = {
      categoryId: newService.categoryId,
      serviceId: newService.serviceId,
      subServiceIds: selectedSubServices,
    }

    try {
      const res = await axios.post(`${subService_URL}/subservices/add`, payload)
      if (res.data.success) {
        toast.success('SubServices linked successfully')
        // reset states if needed
      } else {
        toast.error('Submission failed')
      }
    } catch (err) {
      console.error('Submission Error:', err)
      toast.error('Error submitting subservices')
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>SubService Management</h4>
        <CButton color="primary" onClick={() => setShowModal(true)}>
          + Add New SubService
        </CButton>
      </div>
      {/* Modal Form */}
      <DataTable
        title="SubService List"
        columns={columns}
        data={dummySubservices}
        pagination
        highlightOnHover
        striped
        dense
      />

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <div className="p-4">
          <h5 className="mb-4">Add New SubService</h5>

          <CRow className="g-4">
            <CCol md={6}>
              <h6>
                Category Name <span className="text-danger">*</span>
              </h6>
              <CFormSelect
                name="categoryName"
                value={newService.categoryId || ''}
                onChange={handleChanges}
              >
                <option value="">Select Category</option>
                {category.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <h6>
                Service Name <span className="text-danger">*</span>
              </h6>
              <CFormSelect
                name="serviceName"
                value={newService.serviceName || ''}
                onChange={handleChanges}
              >
                <option value="">Select Service</option>
                {serviceOptions.map((s) => (
                  <option key={s.serviceId} value={s.serviceName}>
                    {s.serviceName}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={12}>
              <h6>Sub Services</h6>
              <div className="mb-2 d-flex gap-2">
                <CFormInput
                  placeholder="Enter Sub Service"
                  value={subServiceInput}
                  onChange={(e) => setSubServiceInput(e.target.value)}
                />
                <CButton
                  color="primary"
                  onClick={() => {
                    if (
                      subServiceInput.trim() &&
                      !selectedSubServices.includes(subServiceInput.trim())
                    ) {
                      setSelectedSubServices((prev) => [...prev, subServiceInput.trim()])
                      setSubServiceInput('')
                    }
                  }}
                >
                  Add
                </CButton>
              </div>

              {selectedSubServices.length > 0 && (
                <ul className="list-group">
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

            <CCol md={12} className="text-end">
              <CButton
                color="success"
                onClick={() => {
                  handleSubmit()
                  setShowModal(false)
                }}
              >
                Save SubService
              </CButton>
            </CCol>
          </CRow>
        </div>
      </CModal>
    </>
  )
}

export default AddSubService
