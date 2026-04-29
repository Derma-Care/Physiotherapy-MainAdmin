import React, { useState, useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCustomerByMobile } from './CustomerAPI'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faEnvelope, faMobileScreen, faVenusMars,
  faCakeCandles, faIdCard, faGift, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'
import { ArrowLeft } from 'lucide-react'

const CustomerViewDetails = () => {
  const navigate = useNavigate()
  const { mobileNumber } = useParams()
  const [customerData, setCustomerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!mobileNumber) return
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const response = await getCustomerByMobile(mobileNumber)
        const data = response?.data || response
        setCustomerData({
          ...data,
          email: data.email || data.emailId,
          appointments: data.appointments || [],
        })
      } catch (err) {
        setError('Failed to load customer details.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [mobileNumber])

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="cvd-center-screen">
        <CSpinner color="primary" />
        <p className="cvd-loading-text">Loading customer details...</p>
      </div>
    )
  }

  /* ── Error ── */
  if (error || !customerData) {
    return (
      <div className="cvd-center-screen">
        <div className="cvd-error-box">
          <FontAwesomeIcon icon={faUser} className="cvd-error-icon" />
          <p>{error || 'Customer not found.'}</p>
        </div>
      </div>
    )
  }

  /* ── Field row ── */
  const Field = ({ icon, label, value }) => (
    <div className="cvd-field">
      <div className="cvd-field-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="cvd-field-body">
        <span className="cvd-field-label">{label}</span>
        <span className="cvd-field-value">{value || '—'}</span>
      </div>
    </div>
  )

  return (
    <div className="cvd-wrapper">

      {/* ── Header ── */}
      <div className="cvd-header">
        <div className="cvd-header-left">
          <div className="cvd-avatar">
            {customerData.fullName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div>
            <h5 className="cvd-header-name">{customerData.fullName}</h5>
            <span className="cvd-header-sub">Customer Profile</span>
          </div>
        </div>
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

      {/* ── Card ── */}
      <div className="cvd-card">
        <div className="cvd-card-heading">
          <span className="cvd-card-bar" />
          <h6 className="cvd-card-title">Basic Details</h6>
        </div>

        <div className="cvd-fields-grid">
          <Field icon={faIdCard}        label="Customer ID"    value={customerData.customerId} />
          <Field icon={faUser}          label="Full Name"      value={customerData.fullName} />
          <Field icon={faEnvelope}      label="Email"          value={customerData.email} />
          <Field icon={faMobileScreen}  label="Mobile Number"  value={customerData.mobileNumber} />
          <Field icon={faVenusMars}     label="Gender"         value={customerData.gender} />
          <Field icon={faCakeCandles}   label="Date of Birth"  value={customerData.dateOfBirth} />
          <Field icon={faGift}          label="Refer Code"     value={customerData.referCode} />
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        .cvd-wrapper {
          padding: 4px 0;
          font-family: inherit;
        }

        /* Center screen for loading/error */
        .cvd-center-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70vh;
          gap: 14px;
          text-align: center;
        }
        .cvd-loading-text {
          font-size: 14px;
          font-weight: 500;
          color: #5f6e80;
          margin: 0;
        }
        .cvd-error-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #a32d2d;
          font-size: 14px;
          font-weight: 500;
        }
        .cvd-error-icon {
          font-size: 36px;
          color: #f4b8b8;
        }

        /* ── Header ── */
        .cvd-header {
          background: #185fa5;
          border-radius: 10px 10px 0 0;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cvd-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cvd-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.35);
        }
        .cvd-header-name {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
        }
        .cvd-header-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.75);
        }
        .cvd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.30);
          border-radius: 7px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cvd-back-btn:hover {
          background: rgba(255,255,255,0.28);
        }

        /* ── Card ── */
        .cvd-card {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-top: none;
          border-radius: 0 0 10px 10px;
          padding: 20px 24px 24px;
        }
        .cvd-card-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .cvd-card-bar {
          width: 3px;
          height: 18px;
          background: #185fa5;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .cvd-card-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #0c447c;
        }

        /* ── Fields grid ── */
        .cvd-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px 24px;
        }
        @media (max-width: 600px) {
          .cvd-fields-grid { grid-template-columns: 1fr; }
        }

        /* ── Single field ── */
        .cvd-field {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f7fafd;
          border: 0.5px solid #e2ecf7;
          border-radius: 8px;
          padding: 12px 14px;
          transition: box-shadow 0.15s;
        }
        .cvd-field:hover {
          box-shadow: 0 2px 8px rgba(24,95,165,0.09);
        }
        .cvd-field-icon {
          width: 32px;
          height: 32px;
          border-radius: 7px;
          background: #e6f1fb;
          color: #185fa5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .cvd-field-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .cvd-field-label {
          font-size: 11px;
          font-weight: 600;
          color: #7a90a8;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .cvd-field-value {
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          word-break: break-word;
        }
      `}</style>
    </div>
  )
}

export default CustomerViewDetails