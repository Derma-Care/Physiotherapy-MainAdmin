import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CButton, CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import { toast } from 'react-toastify'
import { deleteBookingData, getBookingBy_DoctorId } from './AppointmentAPI'
import { ArrowLeft, Trash2, User, Calendar, CreditCard, Stethoscope, Clock, Phone, Activity } from 'lucide-react'

const STATUS_CONFIG = {
  completed:   { bg: '#dcfce7', color: '#166534', dot: '#22c55e', label: 'Completed' },
  confirmed:   { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6', label: 'Confirmed' },
  pending:     { bg: '#fef9c3', color: '#854d0e', dot: '#eab308', label: 'Pending' },
  rejected:    { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Rejected' },
  'in-progress':{ bg: '#ede9fe', color: '#5b21b6', dot: '#8b5cf6', label: 'Active' },
  rescheduled: { bg: '#f0f9ff', color: '#0369a1', dot: '#0ea5e9', label: 'Rescheduled' },
}

const DetailRow = ({ label, value, highlight }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    padding: '10px 14px',
    borderRadius: '10px',
    background: highlight ? '#eef4fb' : '#f9fafb',
    border: '1px solid #f0f0f0',
  }}>
    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </span>
    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
      {value || '—'}
    </span>
  </div>
)

const SectionHeader = ({ icon: Icon, title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  }}>
    <div style={{
      width: '32px', height: '32px',
      borderRadius: '8px',
      background: '#eef4fb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={16} color="#1a3a6b" />
    </div>
    <h6 style={{ margin: 0, color: '#1a3a6b', fontWeight: '700', fontSize: '14px' }}>
      {title}
    </h6>
  </div>
)

const AppointmentDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [doctor, setDoctor] = useState(null)

  const appointment = location.state?.appointment

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (
        appointment &&
        (appointment.status?.toLowerCase() === 'confirmed' ||
          appointment.status?.toLowerCase() === 'completed') &&
        appointment.doctorId
      ) {
        try {
          const res = await getBookingBy_DoctorId(appointment.doctorId)
          setDoctor(res)
        } catch (error) {
          console.error('Failed to fetch doctor details:', error)
        }
      }
    }
    fetchDoctorDetails()
  }, [appointment])

  if (!appointment) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <h5 style={{ color: '#1a3a6b', marginBottom: '8px' }}>No Appointment Found</h5>
        <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '13px' }}>
          No data found for booking ID: {id}
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 20px', borderRadius: '10px',
            background: '#1a3a6b', color: '#fff',
            border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px',
          }}
        >
          Go Back
        </button>
      </div>
    )
  }

  const handleConfirmDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    try {
      setIsDeleting(true)
      await deleteBookingData(appointment.bookingId)
      toast.success('Booking deleted successfully!', { position: 'top-right' })
      navigate('/appointment-management')
    } catch {
      toast.error('Failed to delete booking.', { position: 'top-right' })
    } finally {
      setIsDeleting(false)
    }
  }

  const getDoctorImage = (picture) => {
    if (!picture) return '/default-doctor.png'
    return picture.startsWith('data:image') ? picture : `data:image/jpeg;base64,${picture}`
  }

  const statusKey = appointment.status?.toLowerCase()
  const statusCfg = STATUS_CONFIG[statusKey] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af', label: appointment.status }

  return (
    <div style={{  padding: '4px 0', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
      <style>{`
        .detail-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(27,79,138,0.08);
          border: 1px solid #e8eef5;
          margin-bottom: 20px;
        }
        .detail-card-header {
          padding: 16px 22px;
          background: linear-gradient(135deg, #1a3a6b 0%, #1a6bbf 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .detail-card-body {
          padding: 20px 22px;
        }
        .divider {
          border: none;
          border-top: 1px solid #f0f4f8;
          margin: 18px 0;
        }
      `}</style>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div>
          <h5 style={{ color: '#1a3a6b', fontWeight: '700', margin: 0, fontSize: '18px' }}>
            Appointment Details
          </h5>
          <p style={{ color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' }}>
            Booking ID: <strong style={{ color: '#374151' }}>#{appointment.bookingId}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Status badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '20px',
            background: statusCfg.bg, color: statusCfg.color,
            fontSize: '12px', fontWeight: '700',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusCfg.dot }} />
            {statusCfg.label}
          </span>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px', borderRadius: '10px',
              background: '#fff', color: '#1a3a6b',
              border: '1.5px solid #1a3a6b',
              fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      {/* Patient Details Card */}
      <div className="detail-card">
        <div className="detail-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={17} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Patient Details</span>
          </div>
        </div>

        <div className="detail-card-body">
          <CRow className="g-3">
            <CCol md={4} xs={6}><DetailRow label="Patient Name" value={appointment?.name} highlight /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Mobile Number" value={appointment?.mobileNumber} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Booking For" value={appointment?.bookingFor} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Age" value={appointment?.age ? `${appointment.age} Yrs` : null} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Gender" value={appointment?.gender} /></CCol>
            <CCol md={8} xs={12}><DetailRow label="Problem / Complaint" value={appointment?.problem || 'N/A'} /></CCol>
          </CRow>
        </div>
      </div>

      {/* Slot & Payment Card */}
      <div className="detail-card">
        <div className="detail-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CreditCard size={17} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Slot & Payment Details</span>
          </div>
        </div>

        <div className="detail-card-body">
          <CRow className="g-3">
            <CCol md={3} xs={6}>
              <DetailRow label="Date" value={appointment?.serviceDate} highlight />
            </CCol>
            <CCol md={3} xs={6}>
              <DetailRow label="Time" value={appointment?.servicetime} />
            </CCol>
            <CCol md={3} xs={6}>
              <DetailRow label="Paid Amount" value={appointment?.totalFee ? `₹${appointment.totalFee}` : null} highlight />
            </CCol>
            <CCol md={3} xs={6}>
              <DetailRow label="Consultation Fee" value={appointment?.consultationFee ? `₹${appointment.consultationFee}` : null} />
            </CCol>
          </CRow>
        </div>
      </div>

      {/* Doctor & Service Card */}
      <div className="detail-card">
        <div className="detail-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Stethoscope size={17} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Doctor & Service Details</span>
          </div>
        </div>

        <div className="detail-card-body">
          <CRow className="g-3">
            <CCol md={4} xs={6}><DetailRow label="Doctor ID" value={appointment?.doctorId} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Consultation Type" value={appointment?.consultationType} highlight /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Service Name" value={appointment?.subServiceName} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Service ID" value={appointment?.subServiceId} /></CCol>
            <CCol md={4} xs={6}><DetailRow label="Clinic Name" value={appointment?.clinicName || 'N/A'} /></CCol>
          </CRow>
        </div>
      </div>

      {/* Doctor Profile Card */}
      {(statusKey === 'confirmed' || statusKey === 'completed') && doctor && (
        <div className="detail-card">
          <div className="detail-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={17} color="#fff" />
              </div>
              <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Assigned Doctor</span>
            </div>
          </div>

          <div className="detail-card-body">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Doctor photo */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={getDoctorImage(doctor.doctorPicture)}
                  alt={doctor.doctorName}
                  style={{
                    width: '80px', height: '80px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    border: '3px solid #eef4fb',
                    boxShadow: '0 4px 12px rgba(27,79,138,0.15)',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: '-4px', right: '-4px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#22c55e', border: '2px solid #fff',
                }} />
              </div>

              {/* Doctor info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h6 style={{ color: '#1a3a6b', fontWeight: '700', fontSize: '15px', margin: '0 0 4px' }}>
                  {doctor.doctorName}
                </h6>
                <span style={{
                  display: 'inline-block',
                  background: '#eef4fb', color: '#1a3a6b',
                  padding: '2px 10px', borderRadius: '20px',
                  fontSize: '11px', fontWeight: '600', marginBottom: '12px',
                }}>
                  {doctor.specialization}
                </span>

                <CRow className="g-2">
                  <CCol md={4} xs={6}><DetailRow label="Experience" value={doctor.experience ? `${doctor.experience} years` : null} /></CCol>
                  <CCol md={4} xs={6}><DetailRow label="Qualification" value={doctor.qualification} /></CCol>
                  <CCol md={4} xs={6}><DetailRow label="Languages" value={doctor.languages?.join(', ')} /></CCol>
                </CRow>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails