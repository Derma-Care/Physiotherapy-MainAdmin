import React, { useEffect, useState } from 'react'
import {
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormCheck,
  CBadge,
} from '@coreui/react'
import { BASE_URL, ClinicAllData } from '../../baseUrl'
import { AppointmentData, getBookingBy_ClinicId } from './AppointmentAPI'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingIndicator from '../../Utils/loader'
import { Eye, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_CONFIG = {
  Confirmed:    { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  'In-Progress':{ bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  Completed:    { bg: '#f0fdf4', color: '#14532d', dot: '#16a34a' },
  Pending:      { bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
  Rejected:     { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
}

const statusLabelMap = {
  'In-Progress': 'Active',
  Completed: 'Completed',
  Pending: 'Pending',
  Rejected: 'Rejected',
  Confirmed: 'Confirmed',
}

const FILTER_BUTTONS = [
  { key: 'Service & Treatment', label: '🩺 Service & Treatment' },
  { key: 'In-clinic',           label: '🏥 In-Clinic' },
  { key: 'Video Consultation',  label: '📹 Video Consultation' },
]

const STATUS_CHECKBOXES = [
  { value: 'Confirmed',   label: 'Confirmed' },
  { value: 'In-Progress', label: 'Active' },
  { value: 'Completed',   label: 'Completed' },
]

const AppointmentManagement = () => {
  const [filteredData, setFilteredData]     = useState([])
  const [bookings, setBookings]             = useState([])
  const [hospitals, setHospitals]           = useState([])
  const [loading, setLoading]               = useState(true)
  const [filterTypes, setFilterTypes]       = useState([])
  const [statusFilters, setStatusFilters]   = useState([])
  const [selectedHospitalId, setSelectedHospitalId] = useState('')
  const [currentPage, setCurrentPage]       = useState(1)
  const itemsPerPage = 7
  const navigate = useNavigate()

  const fetchAppointments = async (clinicId = '') => {
    setLoading(true)
    try {
      const response = clinicId
        ? await getBookingBy_ClinicId(clinicId)
        : await AppointmentData()
      const appointments = Array.isArray(response.data)
        ? response.data
        : response.data?.data || []
      setBookings(appointments)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      setBookings([])
      setFilteredData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchHospitals = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${ClinicAllData}`)
      if (response.data.success) setHospitals(response.data.data)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  useEffect(() => { fetchAppointments(); fetchHospitals() }, [])

  useEffect(() => {
    let filtered = [...bookings]
    const normalize = (val) => val?.toLowerCase().trim()
    const consultationTypeMap = {
      'Service & Treatment': 'services & treatments',
      'video Consultation':  'online consultation',
      'In-clinic':           'in-clinic consultation',
    }
    if (statusFilters.length > 0) {
      filtered = filtered.filter((item) =>
        statusFilters.some((s) => normalize(s) === normalize(item.status))
      )
    }
    if (filterTypes.length === 1) {
      const sel = filterTypes[0]
      if (sel === 'Video Consultation') {
        filtered = filtered.filter((item) =>
          normalize(item.consultationType) === 'video consultation' ||
          normalize(item.consultationType) === 'online consultation'
        )
      } else {
        const mapped = consultationTypeMap[sel]
        if (mapped) filtered = filtered.filter((item) => normalize(item.consultationType) === mapped)
      }
    }
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [bookings, filterTypes, statusFilters])

  useEffect(() => { window.scrollTo(0, 0) }, [currentPage])

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const toggleFilter = (type) => {
    setFilterTypes((prev) => (prev.includes(type) ? [] : [type]))
  }

  const handleStatusChange = (e) => {
    const value = e.target.value
    setStatusFilters((prev) => (prev.includes(value) ? [] : [value]))
  }

  const handleReset = () => {
    setFilterTypes([])
    setStatusFilters([])
    setSelectedHospitalId('')
    fetchAppointments('')
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <style>{`
        .appt-filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1.5px solid #1B4F8A;
          background: #fff;
          color: #1B4F8A;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .appt-filter-btn:hover {
          background: #e8f0fb;
        }
        .appt-filter-btn.active {
          background: #1B4F8A;
          color: #fff;
          border-color: #1B4F8A;
        }
        .appt-table thead th {
          background: #1B4F8A !important;
          color: #ffffff !important;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4px;
          padding: 12px 14px;
          border: none;
          white-space: nowrap;
        }
        .appt-table tbody tr {
          font-size: 13px;
          transition: background 0.15s;
        }
        .appt-table tbody tr:hover {
          background-color: #eef4fb !important;
        }
        .appt-table tbody td {
          padding: 11px 14px;
          vertical-align: middle;
          border-color: #f0f0f0;
          color: #374151;
        }
        .appt-view-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #1B4F8A;
          background: #fff;
          color: #1B4F8A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .appt-view-btn:hover {
          background: #1B4F8A;
          color: #fff;
        }
        .appt-page-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .appt-page-btn:hover { border-color: #1B4F8A; color: #1B4F8A; }
        .appt-page-btn.active {
          background: #1B4F8A;
          color: #fff;
          border-color: #1B4F8A;
        }
        .appt-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .appt-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .appt-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      `}</style>

      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h5 style={{ color: '#1B4F8A', fontWeight: '700', margin: 0, fontSize: '18px' }}>
            Appointment Management
          </h5>
          <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0' }}>
            {filteredData.length} appointment{filteredData.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '16px',
        boxShadow: '0 2px 12px rgba(27,79,138,0.08)',
        border: '1px solid #e8eef5',
      }}>
        {/* Type filter buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {FILTER_BUTTONS.map(({ key, label }) => (
            <button
              key={key}
              className={`appt-filter-btn ${filterTypes.includes(key) ? 'active' : ''}`}
              onClick={() => toggleFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status + Hospital + Reset row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Status checkboxes */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Status:</span>
            {STATUS_CHECKBOXES.map(({ value, label }) => (
              <label key={value} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: '#374151', cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  value={value}
                  checked={statusFilters.includes(value)}
                  onChange={handleStatusChange}
                  style={{
                    width: '15px', height: '15px', accentColor: '#1B4F8A', cursor: 'pointer',
                  }}
                />
                {label}
              </label>
            ))}
          </div>

          {/* Hospital select + Reset */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1.5px solid #d1d5db',
                fontSize: '13px',
                color: '#374151',
                minWidth: '180px',
                outline: 'none',
                cursor: 'pointer',
              }}
              value={selectedHospitalId}
              onChange={(e) => {
                const clinicId = e.target.value
                setSelectedHospitalId(clinicId)
                fetchAppointments(clinicId)
              }}
            >
              <option value="">All Hospitals</option>
              {Array.isArray(hospitals) && hospitals.map((h) => (
                <option key={h.hospitalId} value={h.hospitalId}>{h.name}</option>
              ))}
            </select>

            <button
              onClick={handleReset}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1.5px solid #f9c571',
                background: '#fffbf0',
                color: '#92610a',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(27,79,138,0.08)',
        border: '1px solid #e8eef5',
      }}>
        <CTable className="appt-table mb-0" hover responsive>
          <CTableHead>
            <CTableRow>
              {['S.No', 'H_ID', 'Patient Name', 'Consultation Type', 'Date', 'Time', 'Status', 'Action'].map((h) => (
                <CTableHeaderCell key={h} className={h === 'Action' ? 'text-center' : ''}>
                  {h}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center py-5">
                  <LoadingIndicator message="Loading appointments..." />
                </CTableDataCell>
              </CTableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => {
                const statusKey = item.status
                const cfg = STATUS_CONFIG[statusKey] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' }
                return (
                  <CTableRow key={`${item.id}-${index}`}>
                    <CTableDataCell style={{ color: '#9ca3af', fontWeight: '600', fontSize: '12px' }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </CTableDataCell>
                    <CTableDataCell>
                      <span style={{
                        background: '#eef4fb', color: '#1B4F8A',
                        padding: '2px 8px', borderRadius: '6px',
                        fontSize: '11px', fontWeight: '600',
                      }}>
                        {item?.clinicId || '-'}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: '500' }}>{item?.name || '-'}</CTableDataCell>
                    <CTableDataCell style={{ color: '#6b7280' }}>{item?.consultationType || '-'}</CTableDataCell>
                    <CTableDataCell>{item?.serviceDate || item?.sele || '-'}</CTableDataCell>
                    <CTableDataCell>{item?.slot || item?.servicetime || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <span
                        className="appt-status-badge"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        <span className="appt-status-dot" style={{ backgroundColor: cfg.dot }} />
                        {statusLabelMap[statusKey] || statusKey}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <button
                        className="appt-view-btn"
                        title="View Details"
                        onClick={() =>
                          navigate(`/appointmentDetails/${item.bookingId}`, {
                            state: { appointment: item },
                          })
                        }
                      >
                        <Eye size={15} />
                      </button>
                    </CTableDataCell>
                  </CTableRow>
                )
              })
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center py-5">
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                    No appointments found.
                  </div>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderTop: '1px solid #f0f0f0',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
            </span>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                className="appt-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 4px' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`appt-page-btn ${currentPage === p ? 'active' : ''}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                className="appt-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentManagement