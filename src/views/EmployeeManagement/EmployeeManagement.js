import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, UserCog, FlaskConical, MonitorCheck,
  ShieldCheck, UsersRound, Stethoscope, Pill,
} from 'lucide-react'

const employees = [
  {
    title: 'Nurses',
    subtitle: 'Patient care staff',
    icon: Stethoscope,
    path: '/employee-management/nurse',
    color: { bg: '#e6f1fb', stroke: '#185fa5', text: '#0c447c' },
  },
  {
    title: 'Pharmacist',
    subtitle: 'Medication management',
    icon: Pill,
    path: '/employee-management/pharmacist',
    color: { bg: '#eaf3de', stroke: '#3b6d11', text: '#27500a' },
  },
  {
    title: 'Lab Technician',
    subtitle: 'Diagnostics & tests',
    icon: FlaskConical,
    path: '/employee-management/lab-technician',
    color: { bg: '#faeeda', stroke: '#854f0b', text: '#633806' },
  },
  {
    title: 'Front Desk',
    subtitle: 'Reception & check-in',
    icon: MonitorCheck,
    path: '/employee-management/frontdesk',
    color: { bg: '#e6f1fb', stroke: '#185fa5', text: '#0c447c' },
  },
  {
    title: 'Security',
    subtitle: 'Premises & access',
    icon: ShieldCheck,
    path: '/employee-management/security',
    color: { bg: '#fcebeb', stroke: '#a32d2d', text: '#791f1f' },
  },
  {
    title: 'Other Staff',
    subtitle: 'Support personnel',
    icon: UsersRound,
    path: '/employee-management/otherstaff',
    color: { bg: '#eeedfe', stroke: '#534ab7', text: '#3c3489' },
  },
  {
    title: 'Administrator',
    subtitle: 'System & access control',
    icon: UserCog,
    path: '/employee-management/admin',
    color: { bg: '#fbeaf0', stroke: '#993556', text: '#72243e' },
  },
]

const EmployeeManagement = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Page Header ───────────────────────── */}
      <div className="em-page-header">
        <div className="em-page-title-group">
          <div className="em-page-icon">
            <Users size={20} />
          </div>
          <div>
            <h4 className="em-page-title">Employee Management</h4>
            <p className="em-page-sub">Select a department to manage staff</p>
          </div>
        </div>
      </div>

      {/* ── Card Grid ─────────────────────────── */}
      <div className="em-grid">
        {employees.map((emp, index) => {
          const Icon = emp.icon
          return (
            <div
              key={index}
              className="em-card"
              onClick={() => navigate(emp.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(emp.path)}
            >
              <div
                className="em-icon-wrap"
                style={{ background: emp.color.bg }}
              >
                <Icon size={24} color={emp.color.stroke} strokeWidth={1.8} />
              </div>
              <span className="em-card-title" style={{ color: emp.color.text }}>
                {emp.title}
              </span>
              <span className="em-card-sub">{emp.subtitle}</span>
            </div>
          )
        })}
      </div>

      {/* ── STYLES ──────────────────────────────── */}
      <style>{`
        /* Page Header */
        .em-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 0.5px solid #d0dce9;
        }
        .em-page-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .em-page-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #e6f1fb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #185fa5;
          flex-shrink: 0;
        }
        .em-page-title {
          font-size: 17px;
          font-weight: 600;
          color: #0c447c;
          margin: 0;
        }
        .em-page-sub {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        /* Grid */
        .em-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px;
        }

        /* Card */
        .em-card {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          padding: 22px 14px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;
          outline: none;
        }
        .em-card:hover {
          border-color: #b5d4f4;
          box-shadow: 0 4px 16px rgba(24, 95, 165, 0.10);
          transform: translateY(-2px);
        }
        .em-card:active {
          transform: scale(0.97);
        }
        .em-card:focus-visible {
          border-color: #185fa5;
          box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.2);
        }

        /* Icon wrapper */
        .em-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Text */
        .em-card-title {
          font-size: 13px;
          font-weight: 600;
          text-align: center;
          line-height: 1.3;
        }
        .em-card-sub {
          font-size: 11px;
          color: #6b7280;
          text-align: center;
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .em-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  )
}

export default EmployeeManagement