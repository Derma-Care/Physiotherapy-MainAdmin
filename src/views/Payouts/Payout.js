import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CModalFooter,
} from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Download,
  Eye,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'
import { ConfirmationModal } from '../../Utils/ConfirmationDelete'
import { COLORS } from '../../Constant/Themes'
import Logo from '../../assets/images/DermaLogo.png'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Dummy Data
const initialPayments = [
  {
    id: 'INV-2025-00156',
    clinicId: 'PHY-101',
    clinic: 'Skin Care Center',
    plan: 'Premium',
    amount: '₹24,999',
    method: 'Razorpay',
    txId: 'pay_N8grX1a2b3c4',
    date: '15 May 2025 10:30 AM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00155',
    clinicId: 'PHY-102',
    clinic: 'Health Plus Clinic',
    plan: 'Standard',
    amount: '₹14,999',
    method: 'UPI',
    txId: 'pay_N8grX1a2b3c3',
    date: '02 May 2025 11:15 AM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00154',
    clinicId: 'PHY-103',
    clinic: 'Derma Solution',
    plan: 'Basic',
    amount: '₹9,999',
    method: 'Credit Card',
    txId: 'pay_N8grX1a2b3c2',
    date: '28 Apr 2025 09:20 AM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00153',
    clinicId: 'PHY-104',
    clinic: 'Aura Skin Clinic',
    plan: 'Premium',
    amount: '₹24,999',
    method: 'Net Banking',
    txId: 'pay_N8grX1a2b3c1',
    date: '10 Apr 2025 02:45 PM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00152',
    clinicId: 'PHY-105',
    clinic: 'Glow Derma Care',
    plan: 'Standard',
    amount: '₹14,999',
    method: 'Razorpay',
    txId: 'pay_N8grX1a2b3c0',
    date: '18 Mar 2025 12:05 PM',
    status: 'Failed',
  },
  {
    id: 'INV-2025-00151',
    clinicId: 'PHY-106',
    clinic: 'Rejuve Clinic',
    plan: 'Basic',
    amount: '₹9,999',
    method: 'UPI',
    txId: 'pay_N8grX1a2b3b9',
    date: '12 Mar 2025 10:10 AM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00150',
    clinicId: 'PHY-107',
    clinic: 'Bright Skin Clinic',
    plan: 'Standard',
    amount: '₹14,999',
    method: 'Credit Card',
    txId: 'pay_N8grX1a2b3b8',
    date: '05 Mar 2025 03:30 PM',
    status: 'Success',
  },
  {
    id: 'INV-2025-00149',
    clinicId: 'PHY-108',
    clinic: 'Healthy Skin Hub',
    plan: 'Premium',
    amount: '₹24,999',
    method: 'Net Banking',
    txId: 'pay_N8grX1a2b3b7',
    date: '01 Mar 2025 09:00 AM',
    status: 'Pending',
  },
]

const recentInvoices = [
  { id: 'INV-2025-00156', clinic: 'Skin Care Center', amount: '₹24,999', status: 'Paid' },
  { id: 'INV-2025-00155', clinic: 'Health Plus Clinic', amount: '₹14,999', status: 'Paid' },
  { id: 'INV-2025-00154', clinic: 'Derma Solution', amount: '₹9,999', status: 'Paid' },
  { id: 'INV-2025-00153', clinic: 'Aura Skin Clinic', amount: '₹24,999', status: 'Paid' },
  { id: 'INV-2025-00152', clinic: 'Glow Derma Care', amount: '₹14,999', status: 'Failed' },
]

const getStatusBadge = (status) => {
  if (status === 'Success' || status === 'Paid')
    return (
      <span
        style={{
          color: '#16a34a',
          background: '#dcfce7',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    )
  if (status === 'Pending')
    return (
      <span
        style={{
          color: '#d97706',
          background: '#fef3c7',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    )
  if (status === 'Failed')
    return (
      <span
        style={{
          color: '#dc2626',
          background: '#fee2e2',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    )
  return <span>{status}</span>
}

const Payouts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // CRUD states
  const [paymentsList, setPaymentsList] = useState(initialPayments)

  const clinicOptions = useMemo(() => {
    return [...new Set(initialPayments.map((p) => p.clinic))].map((c) => ({ value: c, label: c }))
  }, [])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editPaymentIndex, setEditPaymentIndex] = useState(null)
  const [paymentFormData, setPaymentFormData] = useState({
    clinic: '',
    plan: 'Basic',
    amount: '',
    method: 'Credit Card',
    status: 'Success',
    txId: '',
  })

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [paymentToDeleteIndex, setPaymentToDeleteIndex] = useState(null)

  const handleDownloadPDF = async (invoice) => {
    setSelectedInvoice(invoice)
    
    setTimeout(async () => {
      const input = document.getElementById('invoice-print-area')
      if (!input) return

      const btnContainer = document.getElementById('download-btn-container')
      if (btnContainer) btnContainer.style.display = 'none'

      try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${invoice.id}.pdf`)
      } catch (err) {
        console.error('PDF generation failed', err)
      } finally {
        if (btnContainer) btnContainer.style.display = 'block'
      }
    }, 300)
  }

  const handleSavePayment = () => {
    if (!paymentFormData.clinic || !paymentFormData.amount) {
      alert('Please enter Clinic Name and Amount')
      return
    }

    const newPayment = {
      ...paymentFormData,
      id:
        editPaymentIndex !== null
          ? paymentsList[editPaymentIndex].id
          : `INV-2025-${Math.floor(10000 + Math.random() * 90000)}`,
      clinicId:
        editPaymentIndex !== null
          ? paymentsList[editPaymentIndex].clinicId
          : `PHY-${Math.floor(100 + Math.random() * 900)}`,
      txId:
        paymentFormData.method === 'Cash'
          ? '-'
          : paymentFormData.txId ||
            (editPaymentIndex !== null
              ? paymentsList[editPaymentIndex].txId
              : `pay_${Math.random().toString(36).substring(2, 10)}`),
      date:
        editPaymentIndex !== null
          ? paymentsList[editPaymentIndex].date
          : new Date().toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
    }

    if (editPaymentIndex !== null) {
      const updated = [...paymentsList]
      updated[editPaymentIndex] = newPayment
      setPaymentsList(updated)
    } else {
      setPaymentsList([newPayment, ...paymentsList])
    }

    setShowPaymentModal(false)
    setPaymentFormData({
      clinic: '',
      plan: 'Basic',
      amount: '',
      method: 'Credit Card',
      status: 'Success',
      txId: '',
    })
    setEditPaymentIndex(null)
  }

  const handleDeleteClick = (idx) => {
    setPaymentToDeleteIndex(idx)
    setIsDeleteModalVisible(true)
  }

  const confirmDeletePayment = () => {
    if (paymentToDeleteIndex !== null) {
      setPaymentsList(paymentsList.filter((_, i) => i !== paymentToDeleteIndex))
      setPaymentToDeleteIndex(null)
      setIsDeleteModalVisible(false)
    }
  }

  return (
    <div style={{ fontFamily: 'inherit', color: '#1f2937' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>Payments / Invoices</h4>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            Home &gt; Payments
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type="text"
              placeholder="Search clinic, invoice, transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '14px',
              }}
            />
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1a56a1',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onClick={() => {
              setEditPaymentIndex(null)
              setPaymentFormData({
                clinic: '',
                plan: 'Basic',
                amount: '',
                method: 'Credit Card',
                status: 'Success',
                txId: '',
              })
              setShowPaymentModal(true)
            }}
          >
            <Plus size={16} /> Add Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          {
            title: 'Total Payments',
            value: '156',
            sub: 'All Time',
            icon: <FileText size={20} color="#8b5cf6" />,
            bg: '#ede9fe',
          },
          {
            title: 'Successful Payments',
            value: '142',
            sub: '91.03%',
            icon: <CheckCircle size={20} color="#10b981" />,
            bg: '#d1fae5',
          },
          {
            title: 'Pending Payments',
            value: '8',
            sub: '5.13%',
            icon: <Clock size={20} color="#f59e0b" />,
            bg: '#fef3c7',
          },
          {
            title: 'Failed Payments',
            value: '6',
            sub: '3.85%',
            icon: <XCircle size={20} color="#ef4444" />,
            bg: '#fee2e2',
          },
          {
            title: 'Total Amount Received',
            value: '₹2,45,78,620',
            sub: '15.3% vs last month',
            icon: <DollarSign size={20} color="#3b82f6" />,
            bg: '#dbeafe',
            trend: true,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: '1',
              minWidth: '180px',
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                {stat.title}
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: stat.trend ? '#10b981' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {stat.trend && <TrendingUp size={12} />} {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Payment Summary and Recent Invoices */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'stretch',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {/* Chart (40%) */}
        <div
          style={{
            flex: '4',
            minWidth: '350px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Payment Summary</h5>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  padding: '6px 10px',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#4b5563',
                }}
              >
                <Filter size={12} /> Filter
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  padding: '6px 10px',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#4b5563',
                }}
              >
                <Download size={12} /> Export
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '160px', height: '160px', position: 'relative' }}>
              <CChartDoughnut
                data={{
                  labels: ['Razorpay', 'UPI', 'Credit Card', 'Net Banking', 'Others'],
                  datasets: [
                    {
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'],
                      data: [45, 25, 15, 10, 5],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: '75%',
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
                  ₹18,75,430
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>Total Received</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Razorpay', pct: '45%', amt: '(₹8,43,944)', color: '#3b82f6' },
                { label: 'UPI', pct: '25%', amt: '(₹4,68,857)', color: '#10b981' },
                { label: 'Credit Card', pct: '15%', amt: '(₹2,81,315)', color: '#f59e0b' },
                { label: 'Net Banking', pct: '10%', amt: '(₹1,87,314)', color: '#8b5cf6' },
                { label: 'Others', pct: '5%', amt: '(₹93,000)', color: '#f43f5e' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.color,
                      }}
                    ></div>
                    {item.label}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{item.pct}</span>
                    <span style={{ color: '#6b7280' }}>{item.amt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Invoices (60%) */}
        <div
          style={{
            flex: '6',
            minWidth: '450px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h5 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Recent Invoices</h5>
            <button
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                color: '#3b82f6',
                fontSize: '12px',
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              View All
            </button>
          </div>
          <div>
            {recentInvoices.map((inv, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx !== recentInvoices.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  <span style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>
                    {inv.id}
                  </span>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>{inv.clinic}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                    {inv.amount}
                  </span>
                  {getStatusBadge(inv.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section (Table full width) */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h5 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>All Payments</h5>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '13px',
                color: '#4b5563',
                background: '#fff',
              }}
            >
              <option>All Status</option>
              <option>Success</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
            <select
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                outline: 'none',
                fontSize: '13px',
                color: '#4b5563',
                background: '#fff',
              }}
            >
              <option>All Servers</option>
            </select>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '13px',
                color: '#4b5563',
                background: '#fff',
              }}
            >
              <Calendar size={14} /> 01 May 2025 - 31 May 2025
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <CTable hover align="middle" style={{ margin: 0, borderBottom: 'none' }}>
            <CTableHead style={{ background: '#f8fafc' }}>
              <CTableRow>
                {[
                  'Invoice No.',
                  'Clinic ID',
                  'Clinic Name',
                  'Plan',
                  'Amount',
                  'Payment Method',
                  'Transaction ID',
                  'Payment Date',
                  'Status',
                  'Action',
                ].map((th) => (
                  <CTableHeaderCell
                    key={th}
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {th}
                  </CTableHeaderCell>
                ))}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paymentsList.map((p, idx) => (
                <CTableRow key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <CTableDataCell
                    style={{
                      fontSize: '13px',
                      color: '#3b82f6',
                      fontWeight: '500',
                      padding: '14px 16px',
                    }}
                  >
                    {p.id}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      fontWeight: '500',
                      padding: '14px 16px',
                    }}
                  >
                    {p.clinicId}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{
                      fontSize: '13px',
                      color: '#374151',
                      padding: '14px 16px',
                      fontWeight: '500',
                    }}
                  >
                    {p.clinic}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ fontSize: '13px', color: '#6b7280', padding: '14px 16px' }}
                  >
                    {p.plan}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1f2937',
                      padding: '14px 16px',
                    }}
                  >
                    {p.amount}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#374151',
                      padding: '14px 16px',
                    }}
                  >
                    {p.method}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ fontSize: '13px', color: '#6b7280', padding: '14px 16px' }}
                  >
                    {p.txId}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ fontSize: '12px', color: '#6b7280', padding: '14px 16px' }}
                  >
                    {p.date.split(' ').slice(0, 3).join(' ')} <br />{' '}
                    {p.date.split(' ').slice(3).join(' ')}
                  </CTableDataCell>
                  <CTableDataCell style={{ padding: '14px 16px' }}>
                    {getStatusBadge(p.status)}
                  </CTableDataCell>
                  <CTableDataCell style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="cm-action-btn view"
                        title="View Invoice"
                        onClick={() => setSelectedInvoice(p)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="cm-action-btn"
                        title="Download Invoice"
                        onClick={() => handleDownloadPDF(p)}
                      >
                        <Download size={15} />
                      </button>
                      <button
                        className="cm-plan-action-btn edit"
                        style={{
                          color: '#6b7280',
                          border: `1px solid ${COLORS.primary}`,
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setEditPaymentIndex(idx)
                          setPaymentFormData({
                            clinic: p.clinic,
                            plan: p.plan,
                            amount: p.amount.replace(/[^0-9]/g, ''),
                            method: p.method,
                            status: p.status,
                            txId: p.txId !== '-' ? p.txId : '',
                          })
                          setShowPaymentModal(true)
                        }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="cm-plan-action-btn delete"
                        style={{
                          color: '#dc2626',
                          border: `1px solid ${COLORS.primary}`,
                          background: 'transparent',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleDeleteClick(idx)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '13px', color: '#6b7280' }}>Showing 1 to 8 of 156 payments</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button className="cm-page-btn" disabled>
              <ChevronLeft size={13} /> Prev
            </button>
            <button className="cm-page-btn active">1</button>
            <button className="cm-page-btn">2</button>
            <button className="cm-page-btn">3</button>
            <span style={{ margin: '0 4px', color: '#9ca3af' }}>...</span>
            <button className="cm-page-btn">20</button>
            <button className="cm-page-btn">
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <CModal
        visible={selectedInvoice !== null}
        onClose={() => setSelectedInvoice(null)}
        size="lg"
        alignment="center"
        backdrop="static"
      >
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle></CModalTitle>
        </CModalHeader>
        <CModalBody className="p-4 pt-0">
          {selectedInvoice && (
            <div
              id="invoice-print-area"
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Company Header */}
              <div
                style={{
                  background: '#fff',
                  padding: '30px 30px 20px',
                  color: '#1f2937',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ height: '45px', objectFit: 'contain', alignSelf: 'flex-start' }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: '#374151',
                        marginTop: '8px',
                      }}
                    >
                      PhysioElite
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '4px',
                        maxWidth: '280px',
                        lineHeight: '1.4',
                      }}
                    >
                      204, Road Number 55, CBI Colony, Jubilee Hills, Hyderabad, Telangana 500033
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      ngkDerma@gmail.com | +91 9398984034
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontWeight: '800',
                      fontSize: '28px',
                      textTransform: 'uppercase',
                      color: COLORS.primary,
                      letterSpacing: '1px',
                    }}
                  >
                    INVOICE
                  </h3>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#4b5563',
                      marginTop: '4px',
                    }}
                  >
                    #{selectedInvoice.id}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                    Date: {selectedInvoice.date.split(' ').slice(0, 3).join(' ')}
                  </div>
                  <div style={{ marginTop: '12px' }}>{getStatusBadge(selectedInvoice.status)}</div>
                </div>
              </div>

              {/* Bill To */}
              <div
                style={{
                  padding: '30px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Billed To
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>
                    {selectedInvoice.clinic}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
                    Clinic ID: {selectedInvoice.clinicId}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
                    Subscription: {selectedInvoice.plan} Plan
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Payment Details
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
                    Method: {selectedInvoice.method}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '2px' }}>
                    Txn ID: {selectedInvoice.txId}
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div style={{ padding: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '12px 8px',
                          fontSize: '13px',
                          color: '#6b7280',
                          fontWeight: '600',
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          textAlign: 'center',
                          padding: '12px 8px',
                          fontSize: '13px',
                          color: '#6b7280',
                          fontWeight: '600',
                        }}
                      >
                        Qty
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: '12px 8px',
                          fontSize: '13px',
                          color: '#6b7280',
                          fontWeight: '600',
                        }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td
                        style={{
                          padding: '16px 8px',
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500',
                        }}
                      >
                        Software Subscription - {selectedInvoice.plan}
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginTop: '4px',
                            fontWeight: 'normal',
                          }}
                        >
                          1 Year License
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px 8px',
                          fontSize: '14px',
                          color: '#4b5563',
                          textAlign: 'center',
                        }}
                      >
                        1
                      </td>
                      <td
                        style={{
                          padding: '16px 8px',
                          fontSize: '14px',
                          color: '#1f2937',
                          textAlign: 'right',
                          fontWeight: '600',
                        }}
                      >
                        {selectedInvoice.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <div style={{ width: '250px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        fontSize: '13px',
                        color: '#4b5563',
                      }}
                    >
                      <span>Subtotal</span>
                      <span>{selectedInvoice.amount}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        fontSize: '13px',
                        color: '#4b5563',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <span>Tax (18% GST incl.)</span>
                      <span>₹0.00</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '16px 0 0 0',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1f2937',
                      }}
                    >
                      <span>Total</span>
                      <span>{selectedInvoice.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '20px 30px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#6b7280',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                Thank you for your business. This is a computer-generated invoice and requires no
                signature.
                <div id="download-btn-container" style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    style={{
                      background: '#1a56a1',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </CModalBody>
      </CModal>

      {/* Add / Edit Payment Modal */}
      <CModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        alignment="center"
        backdrop="static"
      >
        <CModalHeader closeButton className="border-bottom-0 pb-0">
          <CModalTitle className="fw-bold">
            {editPaymentIndex !== null ? 'Edit Payment' : 'Add New Payment'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="pt-2">
          <p className="text-muted small mb-4">
            {editPaymentIndex !== null
              ? 'Modify payment details for this invoice.'
              : 'Manually add a payment record for a clinic.'}
          </p>
          <CForm>
            <div className="mb-3">
              <CFormLabel className="small fw-semibold text-dark">Clinic Name</CFormLabel>
              <Select
                options={clinicOptions}
                placeholder="Search Clinic..."
                value={clinicOptions.find((opt) => opt.value === paymentFormData.clinic) || null}
                onChange={(selected) =>
                  setPaymentFormData({ ...paymentFormData, clinic: selected ? selected.value : '' })
                }
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#f8fafc',
                    border: 'none',
                    boxShadow: 'none',
                    padding: '2px',
                    borderRadius: '6px',
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: '14px',
                    zIndex: 9999,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? '#1a56a1'
                      : state.isFocused
                        ? '#e0e7ff'
                        : '#fff',
                    color: state.isSelected ? '#fff' : '#1f2937',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Subscription Plan</CFormLabel>
                <CFormSelect
                  className="bg-light border-0 py-2"
                  value={paymentFormData.plan}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, plan: e.target.value })}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </CFormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Amount (₹)</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="e.g. 14999"
                  className="bg-light border-0 py-2"
                  value={paymentFormData.amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setPaymentFormData({ ...paymentFormData, amount: val })
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Payment Method</CFormLabel>
                <CFormSelect
                  className="bg-light border-0 py-2"
                  value={paymentFormData.method}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, method: e.target.value })
                  }
                >
                  <option value="Razorpay">Razorpay</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </CFormSelect>
              </div>
              <div className="col-md-6 mb-3">
                <CFormLabel className="small fw-semibold text-dark">Status</CFormLabel>
                <CFormSelect
                  className="bg-light border-0 py-2"
                  value={paymentFormData.status}
                  onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, status: e.target.value })
                  }
                >
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </CFormSelect>
              </div>
            </div>
            {paymentFormData.method !== 'Cash' && (
              <div className="mb-3">
                <CFormLabel className="small fw-semibold text-dark">Transaction ID</CFormLabel>
                <CFormInput
                  type="text"
                  placeholder="e.g. pay_XYZ123 (Leave blank to auto-generate)"
                  className="bg-light border-0 py-2"
                  value={paymentFormData.txId || ''}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, txId: e.target.value })}
                />
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter className="border-top-0 pt-0">
          <CButton
            color="light"
            className="text-dark fw-medium px-4"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </CButton>
          <CButton
            style={{ backgroundColor: '#1a56a1', borderColor: '#1a56a1' }}
            className="text-white fw-medium px-4"
            onClick={() => {
              // format amount before saving
              const amt = `₹${Number(paymentFormData.amount).toLocaleString('en-IN')}`
              paymentFormData.amount = amt
              handleSavePayment()
            }}
          >
            {editPaymentIndex !== null ? 'Save Changes' : 'Add Payment'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={isDeleteModalVisible}
        title="Delete Payment Record"
        message="Are you sure you want to delete this payment record? This action cannot be undone and will permanently remove the invoice."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="secondary"
        onConfirm={confirmDeletePayment}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </div>
  )
}

export default Payouts
