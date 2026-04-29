import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CFormSwitch } from '@coreui/react'
import { toast } from 'react-toastify'
import { updateDoctorAvailability } from './DoctorAPI'
import { Stethoscope } from 'lucide-react'

const DoctorCard = ({ doctor, branchId }) => {
  const navigate = useNavigate()
  const [availability, setAvailability] = useState(doctor?.doctorAvailabilityStatus ?? false)

  if (!doctor) return null

  const handleToggle = async () => {
    const newValue = !availability
    setAvailability(newValue)
    const success = await updateDoctorAvailability(doctor.doctorId, newValue)
    if (success) {
      toast.success(`Availability set to ${newValue ? 'Available' : 'Not Available'}`)
    } else {
      toast.error('Failed to update availability')
      setAvailability(!newValue)
    }
  }

  return (
    <>
      <div className="dc-card">
        {/* ── Avatar ─────────────────────────── */}
        <div className="dc-avatar-wrap">
          <img
            src={doctor.doctorPicture}
            alt={`Dr. ${doctor.doctorName || 'Doctor'}`}
            className="dc-avatar"
            onError={(e) => {
              if (e.target.src !== window.location.origin + '/default-avatar.png')
                e.target.src = '/default-avatar.png'
            }}
          />
        </div>

        {/* ── Info ───────────────────────────── */}
        <div className="dc-info">
          <h2 className="dc-name">
            {doctor.doctorName}
            {doctor.qualification ? `, ${doctor.qualification}` : ''}
          </h2>
          <p className="dc-speciality">{doctor.specialization}</p>
          <p className="dc-exp">
            <span className="dc-exp-badge">{doctor.experience} yrs</span> experience
          </p>

          {/* Availability toggle */}
          <div className="dc-availability">
            <span className="dc-avail-label">Availability</span>
            <CFormSwitch
              id={`availability-${doctor.doctorId}`}
              checked={availability}
              onChange={handleToggle}
              color="info"
            />
            <span className={`dc-avail-badge ${availability ? 'available' : 'unavailable'}`}>
              {availability ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>

        {/* ── Action panel ───────────────────── */}
        <div className="dc-action-panel">
          <div className="dc-doctor-icon">
            <Stethoscope size={22} />
          </div>
          <p className="dc-id-label">
            <span className="dc-id-text">{doctor.doctorId}</span>
          </p>
          <button
            className="dc-view-btn"
            onClick={() => navigate(`/doctor/${doctor.doctorId}`, { state: { doctor, branchId } })}
            aria-label={`View details of Dr. ${doctor.doctorName}`}
          >
            View Details
          </button>
        </div>
      </div>

      <style>{`
        .dc-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 18px 20px;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          margin-bottom: 14px;
          box-shadow: 0 2px 8px rgba(24,95,165,0.06);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .dc-card:hover {
          box-shadow: 0 4px 18px rgba(24,95,165,0.13);
          border-color: #b5d4f4;
        }

        /* Avatar */
        .dc-avatar-wrap {
          flex-shrink: 0;
          width: 88px; height: 88px;
          border-radius: 50%;
          border: 2.5px solid #185fa5;
          padding: 3px;
          background: #e6f1fb;
          overflow: hidden;
        }
        .dc-avatar {
          width: 100%; height: 100%;
          border-radius: 50%; object-fit: cover;
        }

        /* Info */
        .dc-info { flex-grow: 1; padding: 0 6px; }
        .dc-name {
          font-size: 16px; font-weight: 700;
          color: #0c447c; margin: 0 0 3px;
        }
        .dc-speciality {
          font-size: 13px; color: #185fa5;
          font-weight: 500; margin: 0 0 4px;
        }
        .dc-exp {
          font-size: 12px; color: #6b7280;
          margin: 0 0 10px;
          display: flex; align-items: center; gap: 6px;
        }
        .dc-exp-badge {
          background: #e6f1fb; color: #185fa5;
          border: 0.5px solid #b5d4f4;
          border-radius: 20px; font-size: 11px;
          font-weight: 700; padding: 2px 8px;
        }

        /* Availability */
        .dc-availability {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .dc-avail-label {
          font-size: 12px; font-weight: 600; color: #374151;
        }
        .dc-avail-badge {
          border-radius: 20px; font-size: 11px;
          font-weight: 600; padding: 2px 10px;
          border: 0.5px solid;
        }
        .dc-avail-badge.available {
          background: #eaf3de; color: #3b6d11; border-color: #c0dd97;
        }
        .dc-avail-badge.unavailable {
          background: #f3f4f6; color: #6b7280; border-color: #d1d5db;
        }

        /* Action panel */
        .dc-action-panel {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: #f7fafd;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          min-width: 150px; max-width: 180px;
          flex-shrink: 0;
        }
        .dc-doctor-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: #e6f1fb; color: #185fa5;
          display: flex; align-items: center; justify-content: center;
        }
        .dc-id-label {
          font-size: 11px; color: #6b7280; text-align: center; margin: 0;
        }
        .dc-id-text {
          font-weight: 600; color: #185fa5; font-size: 11px;
          background: #e6f1fb; border: 0.5px solid #b5d4f4;
          border-radius: 20px; padding: 2px 8px; display: inline-block;
        }
        .dc-view-btn {
          background: #185fa5; color: #fff;
          border: none; padding: 8px 16px;
          border-radius: 8px; cursor: pointer;
          font-weight: 600; font-size: 13px;
          width: 100%; text-align: center;
          box-shadow: 0 2px 8px rgba(24,95,165,0.2);
          transition: background 0.15s, transform 0.1s;
        }
        .dc-view-btn:hover  { background: #0c447c; }
        .dc-view-btn:active { transform: scale(0.97); }

        @media (max-width: 600px) {
          .dc-card { flex-direction: column; align-items: center; text-align: center; }
          .dc-availability { justify-content: center; }
          .dc-action-panel { width: 100%; max-width: 100%; }
        }
      `}</style>
    </>
  )
}

export default DoctorCard