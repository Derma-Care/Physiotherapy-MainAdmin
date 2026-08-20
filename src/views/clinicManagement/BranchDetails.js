import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
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
  Edit2, Calendar, Users, ChevronDown, MoreHorizontal, Activity, Home, ChevronRight as ChevronRightSm
} from 'lucide-react'

const BranchDetails = () => {
  const { branchId, clinicId } = useParams()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [formErrors, setFormErrors]         = useState({})
  const [activeTab, setActiveTab]           = useState(parseInt(searchParams.get('tab')) || 0)
  const [branchData, setBranchData]         = useState(location.state?.branchData || null)
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
      if (branch?.data) {
        setBranchData(branch.data)
        if (branch.data.clinicId) {
          await fetchAllDoctors(branch.data.clinicId, branchId)
        }
      } else if (location.state?.branchData) {
        setBranchData(location.state.branchData)
        if (location.state.branchData.clinicId) {
          await fetchAllDoctors(location.state.branchData.clinicId, branchId)
        }
      }
    } catch (err) {
      console.error('Error fetching branch:', err)
      if (location.state?.branchData) {
        setBranchData(location.state.branchData)
      }
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

  const getTabs = () => ['Overview', `Users (${branchData?.totalReceptionists || '7'})`, `Doctors (${allDoctors.length || '4'})`, 'Appointments', 'Activity Log']
  const tabsList = getTabs()

  return (
    <div style={{ fontFamily: 'inherit', background: '#f8fafc', padding: '24px', minHeight: '100vh' }}>
      <ToastContainer />

      <style>{`
        .bd-tab {
          padding: 0 0 12px 0; border: none; background: transparent;
          font-size: 14px; font-weight: 500; color: #6b7280;
          cursor: pointer; border-bottom: 2px solid transparent;
          transition: all 0.2s; white-space: nowrap;
        }
        .bd-tab:hover { color: #185fa5; }
        .bd-tab.active { color: #185fa5; font-weight: 600; border-bottom: 2px solid #185fa5; }
        .bd-page-btn {
          height: 32px; min-width: 32px; padding: 0 10px;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; color: #374151; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 4px; white-space: nowrap;
        }
        .bd-page-btn:hover:not(:disabled):not(.active) { border-color: #185fa5; color: #185fa5; background: #eef4fb; }
        .bd-page-btn.active { background: #185fa5; color: #fff; border-color: #185fa5; }
        .bd-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .doctor-card-container { display: flex; flex-direction: column; gap: 16px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => navigate('/')}><Home size={12} /> Home</span> <ChevronRightSm size={14} />
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/branchManagement')}>Branch Management</span> <ChevronRightSm size={14} />
            <span style={{ color: '#185fa5', fontWeight: '500' }}>Branch Details</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Branch Details
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            borderRadius: '8px', background: '#185fa5', color: '#fff', border: 'none',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(24,95,165,0.2)'
          }}>
            <Edit2 size={14} /> Edit Branch
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            borderRadius: '8px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb',
            fontWeight: '600', fontSize: '13px', cursor: 'pointer'
          }}>
            More <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* ── Top Info Cards ── */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{
          flex: '2', minWidth: '350px', background: '#fff',
          borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', flexWrap: 'wrap'
        }}>
          <div style={{ width: '180px', height: '180px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={branchData?.virtualClinicTour || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400"} alt="Clinic Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, paddingTop: '4px', minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h4 style={{ margin: 0, fontWeight: '700', color: '#1f2937', fontSize: '20px' }}>{branchData?.branchName || 'Branch Name'}</h4>
              <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', background: branchData?.status === 'Inactive' ? '#fee2e2' : '#dcfce7', color: branchData?.status === 'Inactive' ? '#b91c1c' : '#166534', border: `1px solid ${branchData?.status === 'Inactive' ? '#fecaca' : '#bbf7d0'}` }}>
                {branchData?.status || 'Active'}
              </span>
            </div>
            <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: '500' }}>
              {branchData?.branchCode || 'BR001'}
            </div>
            <div style={{ color: '#185fa5', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              {branchData?.clinicName || 'Skin Care Center'} ({branchData?.clinicId || 'CLN001'})
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontSize: '13px' }}>
                <Phone size={14} color="#6b7280" /> {branchData?.contactNumber || '+91 98765 43210'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563', fontSize: '13px' }}>
                <Mail size={14} color="#6b7280" /> {branchData?.email || 'email@example.com'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#4b5563', fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>
              <MapPin size={16} color="#6b7280" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{branchData?.address || 'Address'} {branchData?.city ? `, ${branchData.city}` : ''}</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>Server</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={18} color="#185fa5" />
              </div>
              <div style={{ color: '#185fa5', fontSize: '15px', fontWeight: '700' }}>{branchData?.server || 'Server 1'}</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>Branch Admin</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(branchData?.adminName || 'Admin User')}&background=random`} alt="Admin" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#1f2937', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{branchData?.adminName || 'Admin User'}</div>
                <div style={{ color: '#6b7280', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{branchData?.contactNumber || 'Contact'}</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>Total Doctors</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={18} color="#4f46e5" />
              </div>
              <div style={{ color: '#1f2937', fontSize: '20px', fontWeight: '700' }}>{allDoctors?.length || '4'}</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>Total Receptionists</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#16a34a" />
              </div>
              <div style={{ color: '#1f2937', fontSize: '20px', fontWeight: '700' }}>{branchData?.totalReceptionists || '3'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Container ── */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        
        {/* ── Tab Bar ── */}
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          {tabsList.map((label, idx) => (
            <button key={idx} className={`bd-tab ${activeTab === idx ? 'active' : ''}`} onClick={() => handleTabChange(idx)}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB 0: Overview ══ */}
        {activeTab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#e0f2fe', padding: '6px', borderRadius: '6px' }}><Users size={14} color="#0284c7" /></div>
                Total Patients
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>1,245</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#ffedd5', padding: '6px', borderRadius: '6px' }}><Calendar size={14} color="#ea580c" /></div>
                Today's Appointments
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>15</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#dcfce7', padding: '6px', borderRadius: '6px' }}><UserPlus size={14} color="#16a34a" /></div>
                This Month Appointments
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>320</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#ffedd5', padding: '6px', borderRadius: '6px' }}><Star size={14} color="#ea580c" /></div>
                Monthly Revenue
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>₹98,750</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#ffedd5', padding: '6px', borderRadius: '6px' }}><Star size={14} color="#ea580c" /></div>
                Reward Points Issued
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>4,250</div>
            </div>
          </div>
        )}

        {/* ══ TAB 1: Users (Employee Management) ══ */}
        {activeTab === 1 && (
          <EmployeeManagement branchId={branchId} clinicId={branchData?.clinicId} />
        )}

        {/* ══ TAB 2: Doctors ══ */}
        {activeTab === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h6 style={{ margin: 0, color: '#185fa5', fontWeight: '700', fontSize: '15px' }}>Doctor Details</h6>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>{allDoctors.length} doctor{allDoctors.length !== 1 ? 's' : ''} in this branch</p>
              </div>
              <button onClick={() => { setFormErrors({}); setModalVisible(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 18px', borderRadius: '10px', background: '#185fa5', color: '#fff', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(24,95,165,0.28)', transition: 'background 0.15s' }}>
                <UserPlus size={15} /> Add Doctor
              </button>
            </div>

            {branchData?.clinicId && (
              <AddDoctors modalVisible={modalVisible} setModalVisible={setModalVisible} clinicId={branchData.clinicId} branchId={branchData.branchId} closeForm={() => setModalVisible(false)} fetchAllDoctors={() => fetchAllDoctors(branchData.clinicId, branchId)} />
            )}

            {currentItems.length > 0 ? (
              <div className="doctor-card-container">
                {currentItems.map((doc) => (
                  <DoctorCard key={doc.doctorId} doctor={doc} branchId={branchData?.branchId} onEdit={() => { setSelectedDoctor(doc) }} onDelete={() => { setSelectedDoctor(doc); setShowDeleteModal(true) }} onView={() => { setSelectedDoctor(doc); setShowDoctorModal(true) }} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <Stethoscope size={36} color="#b5d4f4" style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '14px' }}>No doctors available in this branch.</p>
              </div>
            )}

            {allDoctors.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Rows per page:</span>
                  <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }} style={{ padding: '5px 8px', border: '1.5px solid #e5e7eb', borderRadius: '7px', fontSize: '12px', color: '#374151', cursor: 'pointer', outline: 'none', background: '#fff' }}>
                    {[5, 10, 25].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button className="bd-page-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}><ChevronLeft size={13} /> Prev</button>
                  {getPaginationPages().map((p, i) => p === '…' ? <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span> : <button key={p} className={`bd-page-btn ${currentPage === p ? 'active' : ''}`} onClick={() => handlePageChange(p)}>{p}</button>)}
                  <button className="bd-page-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next <ChevronRight size={13} /></button>
                  <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '6px', whiteSpace: 'nowrap' }}>Page <strong style={{ color: '#185fa5' }}>{currentPage}</strong> of <strong style={{ color: '#185fa5' }}>{totalPages}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 3: Appointments ══ */}
        {activeTab === 3 && (
          <AppointmentManagement branchId={branchId} clinicId={branchData?.clinicId} />
        )}

        {/* ══ TAB 4: Activity Log ══ */}
        {activeTab === 4 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <Activity size={36} color="#b5d4f4" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px' }}>No recent activity to show.</p>
          </div>
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