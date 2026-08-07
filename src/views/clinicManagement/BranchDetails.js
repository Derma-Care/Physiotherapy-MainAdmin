import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import {
  CRow, CCol, CSpinner,
  CModal, CModalHeader, CModalBody, CModalTitle, CModalFooter, CButton,
  CTabContent, CTabPane,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL } from '../../baseUrl'
import { fetchBranchByBranchId } from './AddBranchAPI'
import AddDoctors from '../Doctors/AddDoctors'
import DoctorCard from '../Doctors/DoctorCard'
import AppointmentManagement from '../AppointmentManagement/AppointmentManagement'
import EmployeeManagement from '../EmployeeManagement/EmployeeManagement'
import {
  ArrowLeft, Stethoscope, MapPin, Phone, Mail, Globe,
  Navigation, Building2, UserPlus, ChevronLeft, ChevronRight,
  User, Clock, Languages, Star, Briefcase, BadgeDollarSign, FileText,
} from 'lucide-react'

const TABS = ['Branch Details', 'Doctors', 'Appointments', 'Employee Management']

const BranchDetails = () => {
  const { branchId, clinicId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [formErrors, setFormErrors]         = useState({})
  const [activeTab, setActiveTab]           = useState(parseInt(searchParams.get('tab')) || 0)
  const [branchData, setBranchData]         = useState(null)
  const [loading, setLoading]               = useState(true)
  const [allDoctors, setAllDoctors]         = useState([])
  const [currentPage, setCurrentPage]       = useState(1)
  const [itemsPerPage, setItemsPerPage]     = useState(5)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showDoctorModal, setShowDoctorModal]   = useState(false)
  const [showDeleteModal, setShowDeleteModal]   = useState(false)
  const [modalVisible, setModalVisible]         = useState(false)

  /* ── sync tab from URL ── */
  useEffect(() => {
    setActiveTab(parseInt(searchParams.get('tab')) || 0)
  }, [searchParams])

  const handleTabChange = (idx) => {
    setActiveTab(idx)
    setSearchParams({ tab: idx })
  }

  /* ── fetch doctors ── */
  const fetchAllDoctors = async (cId, bId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getDoctorsByHospitalIdAndBranchId/${cId}/${bId}`
      )
      setAllDoctors(res.data?.data || [])
      setCurrentPage(1)
    } catch (err) {
      console.error('Error fetching doctors:', err)
    }
  }

  useEffect(() => {
  const fetchBranch = async () => {
    try {
      setLoading(true)
      const branch = await fetchBranchByBranchId(branchId)
      setBranchData(branch.data)
      if (branch.data?.clinicId) {
        await fetchAllDoctors(branch.data.clinicId, branchId)
      }
    } catch (err) {
      console.error('Error fetching branch:', err)
    } finally {
      setLoading(false)
    }
  }
  fetchBranch()
}, [branchId])


  useEffect(() => {
  const handleBranchRefresh = async () => {
    try {
      const branch = await fetchBranchByBranchId(branchId)
      setBranchData(branch.data)
    } catch (err) {
      console.error('Error refreshing branch:', err)
    }
  }
  window.addEventListener('clinic:branches:refresh', handleBranchRefresh)
  return () => window.removeEventListener('clinic:branches:refresh', handleBranchRefresh)
}, [branchId])

  /* ── delete doctor ── */
  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return
    try {
      const res = await axios.delete(`${BASE_URL}/admin/deleteDoctor/${selectedDoctor.doctorId}`)
      if (res.data?.success) {
        toast.success(`Dr. ${selectedDoctor.doctorName} deleted successfully!`)
        setAllDoctors((prev) => prev.filter((d) => d.doctorId !== selectedDoctor.doctorId))
      } else {
        toast.error(res.data?.message || 'Failed to delete doctor')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting doctor')
    } finally {
      setShowDeleteModal(false)
      setSelectedDoctor(null)
    }
  }

  /* ── pagination ── */
  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems     = allDoctors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages       = Math.ceil(allDoctors.length / itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const getPaginationPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
        acc.push(p)
        return acc
      }, [])

  /* ── branch detail field ── */
  const BranchField = ({ icon: Icon, label, value, isLink, openLink }) => (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      background: '#f7fafd', border: '0.5px solid #e2ecf7',
      borderRadius: '8px', padding: '12px 14px',
      transition: 'box-shadow 0.15s',
    }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,95,165,0.09)')}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '7px',
        background: '#e6f1fb', color: '#185fa5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={14} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#7a90a8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {label}
        </span>
        {isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: '500', color: '#185fa5', wordBreak: 'break-word' }}
          >
            {value}
          </a>
        ) : (
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', wordBreak: 'break-word' }}>
            {value || '—'}
          </span>
        )}
        {openLink && value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#185fa5', marginTop: '2px' }}
          >
            Open Location ↗
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <ToastContainer />

      <style>{`
        .bd-tab {
          padding: 9px 18px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .bd-tab:hover { color: #185fa5; }
        .bd-tab.active {
          color: #185fa5;
          font-weight: 700;
          border-bottom: 2px solid #185fa5;
        }
        .bd-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center;
          justify-content: center; gap: 4px; white-space: nowrap;
        }
        .bd-page-btn:hover:not(:disabled):not(.active) {
          border-color: #185fa5; color: #185fa5; background: #eef4fb;
        }
        .bd-page-btn.active { background: #185fa5; color: #fff; border-color: #185fa5; }
        .bd-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .doctor-card-container { display: flex; flex-direction: column; gap: 16px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        background: '#185fa5', borderRadius: '10px 10px 0 0',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '9px',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color="#fff" />
          </div>
          <div>
            <h5 style={{ margin: 0, color: '#fff', fontWeight: '700', fontSize: '16px' }}>
              Branch Details
            </h5>
            {branchData?.branchName && (
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                {branchData.branchName}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.30)', borderRadius: '7px',
            padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        background: '#fff', borderLeft: '0.5px solid #d0dce9',
        borderRight: '0.5px solid #d0dce9',
        display: 'flex', gap: '4px', overflowX: 'auto',
        borderBottom: '1px solid #e5e7eb', padding: '0 16px',
      }}>
        {TABS.map((label, idx) => (
          <button
            key={idx}
            className={`bd-tab ${activeTab === idx ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{
        background: '#fff', border: '0.5px solid #d0dce9',
        borderTop: 'none', borderRadius: '0 0 10px 10px',
        padding: '20px 24px 24px',
      }}>

        {/* ══ TAB 0: Branch Details ══ */}
        {activeTab === 0 && (
          loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <CSpinner color="primary" />
            </div>
          ) : branchData ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <span style={{ width: '3px', height: '18px', background: '#185fa5', borderRadius: '2px', flexShrink: 0 }} />
                <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0c447c' }}>
                  Branch Information
                </h6>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}>
                <BranchField icon={Building2}   label="Branch Name"     value={branchData.branchName} />
                <BranchField icon={Briefcase}   label="Clinic ID"       value={branchData.clinicId} />
                <BranchField icon={MapPin}      label="Address"         value={branchData.address} />
                <BranchField icon={Navigation}  label="City"            value={branchData.city} />
                <BranchField icon={Phone}       label="Contact Number"  value={branchData.contactNumber} />
                <BranchField icon={Mail}        label="Email"           value={branchData.email} />
                <BranchField icon={Globe}       label="Coordinates"     value={`${branchData.latitude || '—'}, ${branchData.longitude || '—'}`} />
                <BranchField icon={Globe}       label="Virtual Tour"    value={branchData.virtualClinicTour || 'N/A'} isLink={!!branchData.virtualClinicTour} />
                <BranchField icon={MapPin}      label="Clinic Location URL" value={branchData.location || 'N/A'} openLink={!!branchData.location} />
              </div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0' }}>
              No branch details available.
            </p>
          )
        )}

        {/* ══ TAB 1: Doctors ══ */}
        {activeTab === 1 && (
          <div>
            {/* Sub-header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px',
            }}>
              <div>
                <h6 style={{ margin: 0, color: '#185fa5', fontWeight: '700', fontSize: '15px' }}>
                  Doctor Details
                </h6>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                  {allDoctors.length} doctor{allDoctors.length !== 1 ? 's' : ''} in this branch
                </p>
              </div>
              <button
                onClick={() => { setFormErrors({}); setModalVisible(true) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '8px 18px', borderRadius: '10px',
                  background: '#185fa5', color: '#fff',
                  border: 'none', fontWeight: '600', fontSize: '13px',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(24,95,165,0.28)',
                  transition: 'background 0.15s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#0c447c')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#185fa5')}
              >
                <UserPlus size={15} /> Add Doctor
              </button>
            </div>

            {/* Add Doctor Modal */}
            {branchData?.clinicId && (
              <AddDoctors
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                clinicId={branchData.clinicId}
                branchId={branchData.branchId}
                closeForm={() => setModalVisible(false)}
                fetchAllDoctors={() => fetchAllDoctors(branchData.clinicId, branchId)}
              />
            )}

            {/* Doctor cards */}
            {currentItems.length > 0 ? (
              <div className="doctor-card-container">
                {currentItems.map((doc) => (
                  <DoctorCard
                    key={doc.doctorId}
                    doctor={doc}
                    branchId={branchData?.branchId}
                    onEdit={() => { setSelectedDoctor(doc) }}
                    onDelete={() => { setSelectedDoctor(doc); setShowDeleteModal(true) }}
                    onView={() => { setSelectedDoctor(doc); setShowDoctorModal(true) }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <Stethoscope size={36} color="#b5d4f4" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '14px' }}>No doctors available in this branch.</p>
              </div>
            )}

            {/* Pagination */}
            {allDoctors.length > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: '18px',
                paddingTop: '14px', borderTop: '1px solid #f0f0f0',
                flexWrap: 'wrap', gap: '10px',
              }}>
                {/* Rows per page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    Rows per page:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                    style={{
                      padding: '5px 8px', border: '1.5px solid #e5e7eb',
                      borderRadius: '7px', fontSize: '12px', color: '#374151',
                      cursor: 'pointer', outline: 'none', background: '#fff',
                    }}
                  >
                    {[5, 10, 25].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Page controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className="bd-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>

                  {getPaginationPages().map((p, i) =>
                    p === '…' ? (
                      <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={`bd-page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    className="bd-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next <ChevronRight size={13} />
                  </button>

                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', whiteSpace: 'nowrap' }}>
                    Page <strong style={{ color: '#185fa5' }}>{currentPage}</strong> of{' '}
                    <strong style={{ color: '#185fa5' }}>{totalPages}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 2: Appointments ══ */}
        {activeTab === 2 && (
          <AppointmentManagement branchId={branchId} clinicId={branchData?.clinicId} />
        )}

        {/* ══ TAB 3: Employee Management ══ */}
        {activeTab === 3 && (
          <EmployeeManagement branchId={branchId} clinicId={branchData?.clinicId} />
        )}
      </div>

      {/* ══ Doctor Profile Modal ══ */}
      <CModal visible={showDoctorModal} onClose={() => setShowDoctorModal(false)} size="lg" backdrop="static">
        <CModalHeader style={{ background: '#185fa5', borderBottom: 'none', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Stethoscope size={16} color="#fff" />
            </div>
            <strong style={{ color: '#fff', fontSize: '15px' }}>Doctor Profile</strong>
          </div>
        </CModalHeader>

        <CModalBody style={{ padding: '20px 24px', background: '#f7fafd' }}>
          {selectedDoctor && (
            <div>
              {/* Top: Photo + basic info */}
              <div style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                marginBottom: '20px', flexWrap: 'wrap',
              }}>
                <img
                  src={selectedDoctor.doctorPicture}
                  alt="Doctor"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e6f1fb', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <h5 style={{ margin: '0 0 4px', color: '#0c447c', fontWeight: '700', fontSize: '16px' }}>
                    {selectedDoctor.doctorName}
                  </h5>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#6b7280' }}>
                    {selectedDoctor.specialization}
                  </p>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px',
                    background: '#e6f1fb', color: '#0c447c',
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    {selectedDoctor.experience} yrs experience
                  </span>
                </div>
              </div>

              {/* Section renderer */}
              {[
                {
                  title: 'Personal Information',
                  icon: User,
                  fields: [
                    { label: 'Contact', value: selectedDoctor.doctorMobileNumber },
                    { label: 'Qualification', value: selectedDoctor.qualification },
                    { label: 'Specialization', value: selectedDoctor.specialization },
                    { label: 'Experience', value: `${selectedDoctor.experience} years` },
                  ],
                },
                {
                  title: 'Availability',
                  icon: Clock,
                  fields: [
                    { label: 'Available Days', value: selectedDoctor.availableDays },
                    { label: 'Available Times', value: selectedDoctor.availableTimes },
                  ],
                },
                {
                  title: 'Expertise',
                  icon: Star,
                  fields: [
                    { label: 'Languages', value: selectedDoctor.languages?.join(', ') || '—' },
                    { label: 'Focus Areas', value: selectedDoctor.focusAreas?.join(', ') || '—' },
                    { label: 'Highlights', value: selectedDoctor.highlights?.join(', ') || '—' },
                  ],
                },
                {
                  title: 'Consultation Fees',
                  icon: BadgeDollarSign,
                  fields: [
                    { label: 'In-Clinic Fee', value: `₹${selectedDoctor.doctorFees?.inClinicFee || 0}` },
                    { label: 'Video Fee', value: `₹${selectedDoctor.doctorFees?.vedioConsultationFee || 0}` },
                  ],
                },
              ].map(({ title, icon: Icon, fields }) => (
                <div key={title} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>{title}</span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px',
                  }}>
                    {fields.map(({ label, value }) => (
                      <div key={label} style={{
                        background: '#fff', border: '0.5px solid #e2ecf7',
                        borderRadius: '8px', padding: '10px 12px',
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#7a90a8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Services */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Services Offered</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedDoctor.service?.length > 0
                    ? selectedDoctor.service.map((s) => (
                        <span key={s.serviceId} style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                          background: '#e6f1fb', color: '#0c447c', border: '0.5px solid #b5d4f4',
                        }}>{s.serviceName}</span>
                      ))
                    : <span style={{ color: '#9ca3af', fontSize: '13px' }}>No services listed</span>
                  }
                </div>
              </div>

              {/* Profile description */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ width: '3px', height: '16px', background: '#185fa5', borderRadius: '2px' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c447c' }}>Profile Summary</span>
                </div>
                <div style={{
                  background: '#fff', border: '0.5px solid #e2ecf7',
                  borderRadius: '8px', padding: '12px 14px',
                  fontSize: '13px', color: '#374151', lineHeight: '1.6',
                }}>
                  {selectedDoctor.profileDescription || 'No description available.'}
                </div>
              </div>
            </div>
          )}
        </CModalBody>

        <CModalFooter style={{ background: '#fff', borderTop: '0.5px solid #d0dce9', padding: '12px 20px' }}>
          <button
            onClick={() => setShowDoctorModal(false)}
            style={{
              padding: '8px 20px', borderRadius: '8px',
              border: '0.5px solid #d0dce9', background: '#fff',
              color: '#374151', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Close
          </button>
        </CModalFooter>
      </CModal>

      {/* ══ Delete Confirm Modal ══ */}
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader style={{ background: '#185fa5', borderBottom: 'none', padding: '14px 20px' }}>
          <strong style={{ color: '#fff', fontSize: '15px' }}>Confirm Delete</strong>
        </CModalHeader>
        <CModalBody style={{ padding: '20px 24px', fontSize: '14px', color: '#374151' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#0c447c' }}>Dr. {selectedDoctor?.doctorName}</strong>?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter style={{ background: '#fff', borderTop: '0.5px solid #d0dce9', padding: '12px 20px', gap: '8px' }}>
          <button
            onClick={() => setShowDeleteModal(false)}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: '0.5px solid #d0dce9', background: '#fff',
              color: '#374151', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteDoctor}
            style={{
              padding: '8px 18px', borderRadius: '8px',
              border: 'none', background: '#dc2626',
              color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default BranchDetails