import React from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import Logo from '../../assets/images/DermaCareNoBG.png'
import {
  Server,
  Building2,
  GitBranch,
  Stethoscope,
  Users,
  Calendar,
  IndianRupee,
  BadgeCheck,
  BadgeX,
  HardDrive,
  CheckCircle2,
  UserPlus,
  XCircle,
} from 'lucide-react'

const StatCard = ({ title, value, subtext, icon: Icon, color, subtextColor = 'text-success' }) => (
  <CCard className="h-100 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
    <CCardBody className="p-3 d-flex align-items-center">
      <div
        className="d-flex justify-content-center align-items-center rounded"
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: `${color}15`,
          color: color,
          marginRight: '16px',
          flexShrink: 0,
        }}
      >
        <Icon size={24} />
      </div>
      <div>
        <div className="text-muted small fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
          {title}
        </div>
        <div className="fs-4 fw-bold text-dark lh-1 mb-1">{value}</div>
        <div className={`small fw-semibold ${subtextColor}`} style={{ fontSize: '0.7rem' }}>
          {subtext}
        </div>
      </div>
    </CCardBody>
  </CCard>
)

const Dashboard = () => {
  return (
    <div style={{ fontFamily: '"Inter", sans-serif' }}>
      <CRow className="row-cols-1 row-cols-sm-2 row-cols-xl-5 g-3 mb-3">
        <CCol>
          <StatCard
            title="Total Servers"
            value="5"
            subtext="Online 5"
            icon={Server}
            color="#10B981"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Total Clinics"
            value="48"
            subtext="Active 45"
            icon={Building2}
            color="#8B5CF6"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Total Branches"
            value="96"
            subtext="Active 92"
            icon={GitBranch}
            color="#3B82F6"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Total Doctors"
            value="156"
            subtext="Active 150"
            icon={Stethoscope}
            color="#10B981"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Total Patients"
            value="12,850"
            subtext="This Month"
            icon={Users}
            color="#F59E0B"
            subtextColor="text-muted"
          />
        </CCol>
      </CRow>

      <CRow className="row-cols-1 row-cols-sm-2 row-cols-xl-5 g-3 mb-3">
        <CCol>
          <StatCard
            title="Today's Appointments"
            value="356"
            subtext="+ 18.0%"
            icon={Calendar}
            color="#F97316"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Monthly Revenue"
            value="₹18,75,430"
            subtext="+ 12.5%"
            icon={IndianRupee}
            color="#F59E0B"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Active Subscriptions"
            value="42"
            subtext="Expiring Soon 6"
            icon={BadgeCheck}
            color="#EF4444"
            subtextColor="text-danger"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Expired Subscriptions"
            value="6"
            subtext="+2 this month"
            icon={BadgeX}
            color="#F97316"
            subtextColor="text-muted"
          />
        </CCol>
        <CCol>
          <StatCard
            title="Storage Used"
            value="256 GB / 1 TB"
            subtext="25% Used"
            icon={HardDrive}
            color="#3B82F6"
            subtextColor="text-muted"
          />
        </CCol>
      </CRow>

      <CRow className="g-3 mb-3">
        {/* Clinics by Server */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <CCardBody>
              <h6 className="fw-bold text-dark">Clinics by Server</h6>
              <div className="d-flex justify-content-center align-items-center gap-5">
                <div style={{ width: '120px' }}>
                  <CChart
                    type="doughnut"
                    data={{
                      labels: ['Server 1', 'Server 2', 'Server 3', 'Server 4', 'Server 5'],
                      datasets: [
                        {
                          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
                          data: [12, 10, 9, 8, 9],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      cutout: '70%',
                    }}
                  />
                  <div className="text-center mt-[-70px] pt-4" style={{ marginTop: '-105px' }}>
                    <div className="fs-3 fw-bold lh-1 text-dark">48</div>
                    <div className="small text-muted" style={{ fontSize: '10px' }}>
                      Total Clinics
                    </div>
                  </div>
                </div>
                <div className="w-50">
                  {[
                    { label: 'Server 1', count: 12, pct: '25%', color: '#3B82F6' },
                    { label: 'Server 2', count: 10, pct: '20.8%', color: '#10B981' },
                    { label: 'Server 3', count: 9, pct: '18.8%', color: '#F59E0B' },
                    { label: 'Server 4', count: 8, pct: '16.7%', color: '#8B5CF6' },
                    { label: 'Server 5', count: 9, pct: '18.8%', color: '#EF4444' },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-center mb-2 small"
                      style={{ fontSize: '11px' }}
                    >
                      <div className="d-flex align-items-center text-muted fw-semibold">
                        <div
                          className="rounded-circle me-2"
                          style={{ width: '8px', height: '8px', backgroundColor: s.color }}
                        ></div>
                        {s.label}
                      </div>
                      <div className="text-dark fw-bold">
                        {s.count} ({s.pct})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Subscription Status */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <CCardBody>
              <h6 className="fw-bold mb-4 text-dark">Subscription Status</h6>
              <div className="d-flex justify-content-center align-items-center gap-5">
                <div style={{ width: '120px' }}>
                  <CChart
                    type="doughnut"
                    data={{
                      labels: ['Active', 'Expiring Soon', 'Expired'],
                      datasets: [
                        {
                          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                          data: [42, 6, 0],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      cutout: '70%',
                    }}
                  />
                  <div className="text-center mt-[-70px] pt-4" style={{ marginTop: '-105px' }}>
                    <div className="fs-3 fw-bold lh-1 text-dark">48</div>
                    <div className="small text-muted" style={{ fontSize: '10px' }}>
                      Total Clinics
                    </div>
                  </div>
                </div>
                <div className="w-50">
                  {[
                    { label: 'Active', count: 42, pct: '87.5%', color: '#10B981' },
                    { label: 'Expiring Soon', count: 6, pct: '12.5%', color: '#F59E0B' },
                    { label: 'Expired', count: 0, pct: '0%', color: '#EF4444' },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between align-items-center mb-2 small"
                      style={{ fontSize: '11px' }}
                    >
                      <div className="d-flex align-items-center text-muted fw-semibold">
                        <div
                          className="rounded-circle me-2"
                          style={{ width: '8px', height: '8px', backgroundColor: s.color }}
                        ></div>
                        {s.label}
                      </div>
                      <div className="text-dark fw-bold">
                        {s.count} ({s.pct})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Revenue Overview */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <CCardBody>
              <h6 className="fw-bold mb-2 text-dark">Revenue Overview (This Month)</h6>
              <CChart
                type="line"
                data={{
                  labels: ['1 May', '8 May', '15 May', '22 May', '29 May'],
                  datasets: [
                    {
                      label: 'Revenue',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#3B82F6',
                      pointBackgroundColor: '#3B82F6',
                      pointBorderColor: '#fff',
                      data: [5, 12, 9, 20, 14, 16, 12, 18, 25],
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                    y: {
                      ticks: { font: { size: 10 }, callback: (value) => '₹' + value + 'L' },
                      border: { display: false },
                    },
                  },
                  maintainAspectRatio: false,
                }}
                style={{ height: '140px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-3">
        {/* Recent Clinics */}
        <CCol lg={7}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-dark">Recent Clinics</h6>
                <a
                  href="#"
                  className="small fw-semibold text-primary text-decoration-none"
                  style={{ fontSize: '11px' }}
                >
                  View All
                </a>
              </div>
              <CTable responsive align="middle" className="mb-0 border-top">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0"
                      style={{ fontSize: '11px' }}
                    >
                      Clinic Name
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0 text-center"
                      style={{ fontSize: '11px' }}
                    >
                      Branches
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0 text-center"
                      style={{ fontSize: '11px' }}
                    >
                      Server
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0 text-center"
                      style={{ fontSize: '11px' }}
                    >
                      Subscription Plan
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0"
                      style={{ fontSize: '11px' }}
                    >
                      Expiry Date
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-muted small fw-semibold border-0"
                      style={{ fontSize: '11px' }}
                    >
                      Status
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {[
                    {
                      name: 'Skin Care Center',
                      branches: 2,
                      server: 'Server 1',
                      plan: 'Premium',
                      date: '15 Jun 2025',
                      status: 'Active',
                      sColor: 'success',
                    },
                    {
                      name: 'Health Plus Clinic',
                      branches: 2,
                      server: 'Server 2',
                      plan: 'Standard',
                      date: '02 Jun 2025',
                      status: 'Expiring Soon',
                      sColor: 'warning',
                    },
                    {
                      name: 'Derma Solution',
                      branches: 2,
                      server: 'Server 3',
                      plan: 'Basic',
                      date: '28 May 2025',
                      status: 'Active',
                      sColor: 'success',
                    },
                    {
                      name: 'Aura Skin Clinic',
                      branches: 2,
                      server: 'Server 4',
                      plan: 'Premium',
                      date: '10 Jun 2025',
                      status: 'Active',
                      sColor: 'success',
                    },
                    {
                      name: 'Glow Derma Care',
                      branches: 2,
                      server: 'Server 5',
                      plan: 'Standard',
                      date: '18 Jun 2025',
                      status: 'Active',
                      sColor: 'success',
                    },
                  ].map((row, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell
                        className="fw-semibold text-dark border-0 small"
                        style={{ fontSize: '12px' }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={Logo}
                            alt={row.name}
                            className="me-2 flex-shrink-0"
                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                          />
                          {row.name}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center text-muted fw-semibold border-0 small"
                        style={{ fontSize: '12px' }}
                      >
                        {row.branches}
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center border-0 small"
                        style={{ fontSize: '12px' }}
                      >
                        <CBadge
                          color="primary"
                          className="text-primary bg-primary bg-opacity-10 rounded-pill"
                        >
                          {row.server}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center text-muted fw-semibold border-0 small"
                        style={{ fontSize: '12px' }}
                      >
                        {row.plan}
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-muted fw-semibold border-0 small"
                        style={{ fontSize: '12px' }}
                      >
                        {row.date}
                      </CTableDataCell>
                      <CTableDataCell className="border-0 small">
                        <CBadge
                          color={row.sColor}
                          className={`text-${row.sColor} bg-${row.sColor} bg-opacity-10 rounded-pill px-2 py-1`}
                        >
                          {row.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Recent Activities */}
        <CCol lg={5}>
          <CCard className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <CCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0 text-dark">Recent Activities</h6>
                <a
                  href="#"
                  className="small fw-semibold text-primary text-decoration-none"
                  style={{ fontSize: '11px' }}
                >
                  View All
                </a>
              </div>
              <div className="pt-2">
                {[
                  {
                    text: 'New clinic "Skin Care Center" has been added',
                    date: '10 May 2025 10:30 AM',
                    icon: CheckCircle2,
                    color: 'success',
                  },
                  {
                    text: 'New user Dr. Ravi Kumar added in Health Plus Clinic',
                    date: '10 May 2025 09:45 AM',
                    icon: UserPlus,
                    color: 'warning',
                  },
                  {
                    text: 'Payment received from "Derma Solution"',
                    date: '10 May 2025 09:15 AM',
                    icon: IndianRupee,
                    color: 'primary',
                  },
                  {
                    text: 'New branch "Banjara Hills" added in Aura Skin Clinic',
                    date: '10 May 2025 08:50 AM',
                    icon: GitBranch,
                    color: 'info',
                  },
                  {
                    text: 'Subscription expired for "Glow Derma Care"',
                    date: '10 May 2025 08:20 AM',
                    icon: XCircle,
                    color: 'danger',
                  },
                ].map((act, idx) => (
                  <div key={idx} className="d-flex mb-3 align-items-start">
                    <div
                      className={`text-${act.color} bg-${act.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 mt-1 flex-shrink-0`}
                      style={{ width: '28px', height: '28px' }}
                    >
                      <act.icon size={14} />
                    </div>
                    <div>
                      <div className="fw-semibold text-dark small" style={{ fontSize: '12px' }}>
                        {act.text}
                      </div>
                      <div className="text-muted small fw-semibold" style={{ fontSize: '10px' }}>
                        {act.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
