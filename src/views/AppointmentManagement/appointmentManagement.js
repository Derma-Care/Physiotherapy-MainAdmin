import React, { useEffect, useState } from 'react'
import {
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
import { AppointmentData } from './appointmentAPI'

const ServiceManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [service, setService] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewService, setViewService] = useState(null)

  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const Appointment = await AppointmentData()
      console.log(Appointment.data)
      setService(Appointment.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again later.')
    } finally {
      setLoading(false) 
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleSearch = () => {
      const trimmedQuery = searchQuery.toLowerCase().trim();

      const filtered = service.filter((item) => {
        const patientName = item.patientName?.toLowerCase().includes(trimmedQuery);
        const categoryName = item.categoryName?.toLowerCase().includes(trimmedQuery);
        const serviceName = item.servicesAdded.some((service) =>
          service.serviceName?.toLowerCase().includes(trimmedQuery),
        );
        const city = item.addressDto.city?.toLowerCase().includes(trimmedQuery);
        const street = item.addressDto.street?.toLowerCase().includes(trimmedQuery);
        const houseNo = item.addressDto.houseNo?.toLowerCase().includes(trimmedQuery);
        const state = item.addressDto.state?.toLowerCase().includes(trimmedQuery);
        const pinCode = item.addressDto.postalCode?.toLowerCase().includes(trimmedQuery);

        const filterStartDate = startDateFilter ? new Date(startDateFilter) : null;
        const filterEndDate = endDateFilter ? new Date(endDateFilter) : null;

        const isWithinDateRange = item.servicesAdded.some((service) => {
          const serviceStartDate = new Date(service.startDate.split("-").reverse().join("-"));
          const serviceEndDate = new Date(service.endDate.split("-").reverse().join("-"));

          return (
            (!filterStartDate || serviceStartDate >= filterStartDate) &&
            (!filterEndDate || serviceEndDate <= filterEndDate)
          );
        });

        return (
          (patientName ||
            categoryName ||
            serviceName ||
            city ||
            street ||
            state ||
            pinCode ||
            houseNo) &&
          isWithinDateRange
        );
      });

      setFilteredData(filtered);
    };

    handleSearch();
  }, [searchQuery, startDateFilter, endDateFilter, service]);

  const columns = [
    {
      name: 'Patient Name',
      selector: (row) => row.patientName,
      sortable: true,
    },
    {
      name: 'Category Name',
      selector: (row) => row.categoryName,
    },
    {
      name: 'Service Name',
      selector: (row) =>
        row.servicesAdded.map((service, index) => <div key={index}>{service.serviceName}</div>),
    },
    {
      name: 'Price',
      selector: (row) =>
        row.servicesAdded.map((service, index) => <div key={index}>{service.price} </div>),
      width: '100px',
    },

    {
      name: 'Start Date',
      selector: (row) =>
        row.servicesAdded.map((service, index) => <div key={index}>{service.startDate}</div>),
    },

    {
      name: 'End Date',
      selector: (row) =>
        row.servicesAdded.map((service, index) => <div key={index}>{service.endDate}</div>),
    },

    {
      name: 'Amount',
      selector: (row) => row.payAmount,
    },
    {
      name: 'Status',
      selector: (row) =>
        row.servicesAdded.map((service, index) => <div key={index}>{service.status}</div>),
    },

    {
      name: 'Actions',
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
            color="primary"
            onClick={() => ViewService(row)}
            style={{ marginRight: '5px', width: '80px' }}
          >
            View
          </CButton>
        </div>
      ),
    },
  ]

  const ViewService = (row) => {
    setViewService(row)
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <div>
        <CForm className="d-flex justify-content-end mb-3">
          <CInputGroup
            className="mb-3"
            style={{ marginRight: '20px', width: '450px', marginTop: '27px' }}
          >
            <CFormInput
              type="text"
              placeholder="Search by PatientName/Category/ServiceName/location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '40px' }}
            />
            <CInputGroupText style={{ height: '40px' }}>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
          </CInputGroup>

          <div>
            <h6 style={{ marginLeft: '30px' }}>Start Date</h6>
            <CInputGroup className="mb-3" style={{ marginRight: '20px', width: '200px' }}>
              <CFormInput
                type="date"
                placeholder="Start Date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                style={{ height: '40px' }}
              />
            </CInputGroup>
          </div>
          <div>
            <h6 style={{ marginLeft: '30px' }}>End Date</h6>
            <CInputGroup className="mb-3" style={{ marginRight: '20px', width: '200px' }}>
              <CFormInput
                type="date"
                placeholder="End Date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                style={{ height: '40px' }}
              />
            </CInputGroup>
          </div>
        </CForm>
      </div>

      {viewService && (
        <CModal visible={!!viewService} onClose={() => setViewService(null)} size="md">
          <CModalHeader>
            <CModalTitle style={{ textAlign: 'center', width: '100%' }}>
              Appointment Details
            </CModalTitle>
          </CModalHeader>
          <CModalBody style={{margin:'10px'}}>
            <CRow>
              <CCol sm={4}>
                <strong>Appointment ID :</strong>
              </CCol>
              <CCol sm={8}>{viewService.appointmentId}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Patient Name :</strong>
              </CCol>
              <CCol sm={8}>{viewService.patientName}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Relationship :</strong>
              </CCol>
              <CCol sm={8}>{viewService.relationShip}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Patient Number :</strong>
              </CCol>
              <CCol sm={8}>{viewService.patientNumber}</CCol>
            </CRow>
            {viewService.addressDto && (
              <>
                <CRow>
                  <CCol sm={4}>
                    <strong>House No. :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.houseNo}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>Street :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.street}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>City :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.city}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>State :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.state}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>Postal Code :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.postalCode}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>Latitude :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.latitude}</CCol>
                </CRow>
                <CRow>
                  <CCol sm={4}>
                    <strong>Longitude :</strong>
                  </CCol>
                  <CCol sm={8}>{viewService.addressDto.longitude}</CCol>
                </CRow>
              </>
            )}
            <div style={{ marginTop: '20px' }}>
              {viewService.servicesAdded && viewService.servicesAdded.length > 0 ? (
                <CRow>
                  <CCol sm={12}>
                    <h5
                      style={{
                        textAlign: 'center',
                        borderBottom: '2px solid black',
                        paddingBottom: '10px',
                        marginLeft: '150px',
                        marginRight: '150px',
                      }}
                    >
                      Added Services
                    </h5>

                    {viewService.servicesAdded.map((service, index) => (
                      <div key={index}>
                        <CRow>
                          <CCol sm={4}>
                            <strong>Service ID:</strong>
                          </CCol>
                          <CCol sm={8}>{service.serviceId || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>Service Name:</strong>
                          </CCol>
                          <CCol sm={8}>{service.serviceName || 'N/A'}</CCol>
                        </CRow>

                        <CRow>
                          <CCol sm={4}>
                            <strong>Price:</strong>
                          </CCol>
                          <CCol sm={8}>{service.price || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>Start Date:</strong>
                          </CCol>
                          <CCol sm={8}>{service.startDate || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>End Date:</strong>
                          </CCol>
                          <CCol sm={8}>{service.endDate || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>numberOfDays:</strong>
                          </CCol>
                          <CCol sm={8}>{service.numberOfDays || 'N/A'}</CCol>
                        </CRow>

                        <CRow>
                          <CCol sm={4}>
                            <strong>Start Time:</strong>
                          </CCol>
                          <CCol sm={8}>{service.startTime || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>End time:</strong>
                          </CCol>
                          <CCol sm={8}>{service.endTime || 'N/A'}</CCol>
                        </CRow>
                        <CRow>
                          <CCol sm={4}>
                            <strong>numberOfHours:</strong>
                          </CCol>
                          <CCol sm={8}>{service.numberOfHours || 'N/A'}</CCol>
                        </CRow>

                        {index !== viewService.servicesAdded.length - 1 && (
                          <hr style={{ margin: '10px 0' }} />
                        )}
                      </div>
                    ))}
                  </CCol>
                </CRow>
              ) : (
                <CRow>
                  <CCol sm={12}>
                    <p>No services added</p>
                  </CCol>
                </CRow>
              )}
            </div>
            <hr></hr>
            <CRow>
              <CCol sm={4}>
                <strong>Total Price :</strong>
              </CCol>
              <CCol sm={8}>{viewService.totalPrice || 'N/A'}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Total Discount :</strong>
              </CCol>
              <CCol sm={8}>{viewService.totalDiscountAmount || 'N/A'}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Total Discounted Amount:</strong>
              </CCol>
              <CCol sm={8}>{viewService.totalDiscountedAmount || 'N/A'}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Total Tax:</strong>
              </CCol>
              <CCol sm={8}>{viewService.totalTax || 'N/A'}</CCol>
            </CRow>
            <CRow>
              <CCol sm={4}>
                <strong>Total Cost :</strong>
              </CCol>
              <CCol sm={8}>{viewService.payAmount || 'N/A'}</CCol>
            </CRow>
          </CModalBody>
          <CModalFooter></CModalFooter>
        </CModal>
      )}

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '1.5rem',
          }}
        >
          Loading...
        </div>
      ) : error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '1.5rem',
            color: 'red',
          }}
        >
          {error}
        </div>
      ) : filteredData.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
          pagination
          highlightOnHover
          pointerOnHover
        />
      ) : (
        <h6 style={{ textAlign: 'center', margin: '100px' }}>No Data Found</h6>
      )}
    </div>
  )
}

export default ServiceManagement
