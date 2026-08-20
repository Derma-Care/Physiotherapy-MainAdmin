import React, { useState } from 'react'
import { CRow, CCol } from '@coreui/react'
import { CChartLine, CChartDoughnut } from '@coreui/react-chartjs'
import {
  FiDownload,
  FiFilter,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiServer,
  FiHome,
  FiDollarSign,
  FiArrowUp,
  FiChevronDown,
  FiActivity,
} from 'react-icons/fi'
import './Reports.css'

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Clinic Reports')

  const tabs = [
    {
      name: 'Clinic Reports',
      icon: <FiHome size={20} color="#3b82f6" />,
      bgColor: '#eff6ff',
      subtext: 'View clinic, branch and doctor statistics',
    },
    {
      name: 'Financial Reports',
      icon: <FiDollarSign size={20} color="#f59e0b" />,
      bgColor: '#fef3c7',
      subtext: 'View revenue, payments and invoices',
    },
    {
      name: 'User Reports',
      icon: <FiUser size={20} color="#10b981" />,
      bgColor: '#d1fae5',
      subtext: 'View users, roles and activity reports',
    },
    {
      name: 'Appointment Reports',
      icon: <FiCalendar size={20} color="#3b82f6" />,
      bgColor: '#eff6ff',
      subtext: 'View appointment and booking reports',
    },
    {
      name: 'Subscription Reports',
      icon: <FiCreditCard size={20} color="#ef4444" />,
      bgColor: '#fee2e2',
      subtext: 'View subscription and plan reports',
    },
    // {
    //   name: 'Server Reports',
    //   icon: <FiServer size={20} color="#6366f1" />,
    //   bgColor: '#e0e7ff',
    //   subtext: 'View server and performance reports',
    // },
  ]

  const allTabData = {
    'Clinic Reports': {
      summary: [
        {
          title: 'Total Clinics',
          value: '48',
          change: '5.26%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiHome size={20} color="#3b82f6" />,
        },
        {
          title: 'Total Branches',
          value: '96',
          change: '4.35%',
          color: '#8b5cf6',
          bgColor: '#f3e8ff',
          icon: <FiMapPin size={20} color="#8b5cf6" />,
        },
        {
          title: 'Total Patients',
          value: '12,850',
          change: '8.45%',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <FiCalendar size={20} color="#ef4444" />,
        },
        {
          title: 'Total Appointments',
          value: '3,568',
          change: '6.21%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiActivity size={20} color="#3b82f6" />,
        },
        {
          title: 'Total Revenue',
          value: '₹18,75,430',
          change: '12.5%',
          color: '#f43f5e',
          bgColor: '#ffe4e6',
          icon: <FiDollarSign size={20} color="#f43f5e" />,
        },
      ],
      chart1: {
        title: 'New Clinics (This Month)',
        label: 'Clinics',
        data: [8, 22, 14, 20, 15, 25],
      },
      doughnut: {
        total: '3,568',
        labels: ['Completed', 'Scheduled', 'Cancelled', 'No Show'],
        data: [51.8, 33.6, 9.0, 5.6],
        legend: [
          { label: 'Completed', value: '1,850', percent: '51.8%', color: '#10b981' },
          { label: 'Scheduled', value: '1,200', percent: '33.6%', color: '#3b82f6' },
          { label: 'Cancelled', value: '320', percent: '9.0%', color: '#f59e0b' },
          { label: 'No Show', value: '198', percent: '5.6%', color: '#ef4444' },
        ],
      },
      chart3: {
        title: 'Revenue Overview',
        label: 'Revenue',
        data: [7, 15, 15, 17, 21, 17, 15, 18, 19, 21],
      },
    },
    'Financial Reports': {
      summary: [
        {
          title: 'Total Revenue',
          value: '₹24,50,000',
          change: '15.2%',
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: <FiDollarSign size={20} color="#10b981" />,
        },
        {
          title: 'Pending Payments',
          value: '₹3,40,000',
          change: '-2.1%',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: <FiCreditCard size={20} color="#f59e0b" />,
        },
        {
          title: 'Refunds',
          value: '₹12,500',
          change: '0.5%',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <FiActivity size={20} color="#ef4444" />,
        },
        {
          title: 'Subscriptions',
          value: '450',
          change: '5.0%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiCreditCard size={20} color="#3b82f6" />,
        },
        {
          title: 'Taxes',
          value: '₹4,41,000',
          change: '15.2%',
          color: '#8b5cf6',
          bgColor: '#f3e8ff',
          icon: <FiDollarSign size={20} color="#8b5cf6" />,
        },
      ],
      chart1: { title: 'Daily Revenue', label: 'Revenue', data: [12, 18, 22, 15, 28, 30] },
      doughnut: {
        total: '₹24.5L',
        labels: ['Card', 'UPI', 'Cash', 'Insurance'],
        data: [60, 25, 10, 5],
        legend: [
          { label: 'Card', value: '₹14.7L', percent: '60%', color: '#10b981' },
          { label: 'UPI', value: '₹6.1L', percent: '25%', color: '#3b82f6' },
          { label: 'Cash', value: '₹2.4L', percent: '10%', color: '#f59e0b' },
          { label: 'Insurance', value: '₹1.2L', percent: '5%', color: '#ef4444' },
        ],
      },
      chart3: {
        title: 'Expense Overview',
        label: 'Expenses',
        data: [4, 5, 8, 12, 10, 15, 12, 11, 9, 14],
      },
    },
    'User Reports': {
      summary: [
        {
          title: 'Total Users',
          value: '3,450',
          change: '10.1%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiUser size={20} color="#3b82f6" />,
        },
        {
          title: 'Active Users',
          value: '2,800',
          change: '12.4%',
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: <FiActivity size={20} color="#10b981" />,
        },
        {
          title: 'Doctors',
          value: '420',
          change: '2.5%',
          color: '#8b5cf6',
          bgColor: '#f3e8ff',
          icon: <FiMapPin size={20} color="#8b5cf6" />,
        },
        {
          title: 'Staff',
          value: '1,250',
          change: '4.2%',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: <FiServer size={20} color="#f59e0b" />,
        },
        {
          title: 'Admins',
          value: '15',
          change: '0%',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <FiHome size={20} color="#ef4444" />,
        },
      ],
      chart1: { title: 'User Registrations', label: 'Users', data: [15, 30, 25, 45, 40, 60] },
      doughnut: {
        total: '3,450',
        labels: ['Patients', 'Doctors', 'Staff', 'Admins'],
        data: [70, 12, 17, 1],
        legend: [
          { label: 'Patients', value: '2,415', percent: '70%', color: '#10b981' },
          { label: 'Doctors', value: '420', percent: '12%', color: '#3b82f6' },
          { label: 'Staff', value: '1,250', percent: '17%', color: '#f59e0b' },
          { label: 'Admins', value: '15', percent: '1%', color: '#ef4444' },
        ],
      },
      chart3: {
        title: 'Active Sessions',
        label: 'Sessions',
        data: [10, 25, 20, 30, 45, 35, 40, 50, 45, 55],
      },
    },
    'Appointment Reports': {
      summary: [
        {
          title: 'Total Appointments',
          value: '5,200',
          change: '8.2%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiCalendar size={20} color="#3b82f6" />,
        },
        {
          title: 'Completed',
          value: '4,100',
          change: '12.4%',
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: <FiActivity size={20} color="#10b981" />,
        },
        {
          title: 'Pending',
          value: '800',
          change: '-2.5%',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: <FiMapPin size={20} color="#f59e0b" />,
        },
        {
          title: 'Cancelled',
          value: '300',
          change: '1.2%',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <FiServer size={20} color="#ef4444" />,
        },
        {
          title: 'Online Consults',
          value: '1,500',
          change: '15.0%',
          color: '#8b5cf6',
          bgColor: '#f3e8ff',
          icon: <FiHome size={20} color="#8b5cf6" />,
        },
      ],
      chart1: {
        title: 'Weekly Appointments',
        label: 'Appointments',
        data: [120, 150, 130, 180, 160, 200],
      },
      doughnut: {
        total: '5,200',
        labels: ['Completed', 'Pending', 'Cancelled', 'Rescheduled'],
        data: [65, 20, 10, 5],
        legend: [
          { label: 'Completed', value: '3,380', percent: '65%', color: '#10b981' },
          { label: 'Pending', value: '1,040', percent: '20%', color: '#3b82f6' },
          { label: 'Cancelled', value: '520', percent: '10%', color: '#f59e0b' },
          { label: 'Rescheduled', value: '260', percent: '5%', color: '#ef4444' },
        ],
      },
      chart3: {
        title: 'Online vs Offline',
        label: 'Total',
        data: [50, 80, 70, 90, 110, 100, 95, 120, 130, 140],
      },
    },
    'Subscription Reports': {
      summary: [
        {
          title: 'Active Plans',
          value: '1,200',
          change: '5.6%',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: <FiCreditCard size={20} color="#3b82f6" />,
        },
        {
          title: 'New Subscribers',
          value: '150',
          change: '12.4%',
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: <FiUser size={20} color="#10b981" />,
        },
        {
          title: 'Churn Rate',
          value: '2.5%',
          change: '-0.5%',
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: <FiActivity size={20} color="#ef4444" />,
        },
        {
          title: 'Trial Users',
          value: '450',
          change: '8.2%',
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: <FiServer size={20} color="#f59e0b" />,
        },
        {
          title: 'MRR',
          value: '₹12,50,000',
          change: '15.0%',
          color: '#8b5cf6',
          bgColor: '#f3e8ff',
          icon: <FiDollarSign size={20} color="#8b5cf6" />,
        },
      ],
      chart1: {
        title: 'Subscriber Growth',
        label: 'Subscribers',
        data: [100, 120, 115, 140, 135, 160],
      },
      doughnut: {
        total: '1,200',
        labels: ['Basic', 'Premium', 'Enterprise', 'Trial'],
        data: [40, 35, 15, 10],
        legend: [
          { label: 'Basic', value: '480', percent: '40%', color: '#10b981' },
          { label: 'Premium', value: '420', percent: '35%', color: '#3b82f6' },
          { label: 'Enterprise', value: '180', percent: '15%', color: '#f59e0b' },
          { label: 'Trial', value: '120', percent: '10%', color: '#ef4444' },
        ],
      },
      chart3: {
        title: 'Revenue by Plan',
        label: 'Revenue',
        data: [10, 12, 14, 13, 16, 18, 17, 20, 22, 25],
      },
    },
  }

  const currentData = allTabData[activeTab] || allTabData['Clinic Reports']

  return (
    <div className="reports-container">
      <CRow>
        {' '}
        {/* Actions Header */}
        <div
          className="reports-actions"
          style={{ justifyContent: 'flex-end', marginBottom: '24px' }}
        >
          <div className="reports-date-picker">
            01 May 2025 - 31 May 2025 <FiChevronDown />
          </div>
          <div className="reports-filter-btn">
            <FiFilter /> Filters <FiChevronDown />
          </div>
          <button className="reports-export-btn">
            <FiDownload /> Export Report
          </button>
        </div>
        {/* Left Sidebar */}
        <CCol md={3} lg={3} xl={2}>
          <div className="reports-sidebar">
            {tabs.map((tab, idx) => (
              <div
                key={idx}
                className={`report-tab ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.name)}
              >
                <div className="report-tab-icon" style={{ backgroundColor: tab.bgColor }}>
                  {tab.icon}
                </div>
                <div className="report-tab-content">
                  <p className="report-tab-title">{tab.name}</p>
                  <p className="report-tab-sub">{tab.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </CCol>
        {/* Right Content */}
        <CCol md={9} lg={9} xl={10}>
          {/* Summary Cards */}
          <div className="summary-grid">
            {currentData.summary.map((item, idx) => (
              <div key={idx} className="summary-card">
                <div className="summary-card-header">
                  <div className="summary-icon-wrapper" style={{ backgroundColor: item.bgColor }}>
                    {item.icon}
                  </div>
                  <div className="summary-title">{item.title}</div>
                </div>
                <div className="summary-value">{item.value}</div>
                <div
                  className="summary-change"
                  style={{ color: item.change.startsWith('-') ? '#ef4444' : '#10b981' }}
                >
                  <FiArrowUp
                    size={14}
                    style={{ transform: item.change.startsWith('-') ? 'rotate(180deg)' : 'none' }}
                  />{' '}
                  {item.change} vs last month
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="charts-grid">
            {/* Chart 1: Status Breakdown (Full Width) */}
            <div className="chart-card">
              <h5 className="chart-title">Status Breakdown</h5>
              <div style={{ display: 'flex', flexDirection: 'column', height: '280px', gap: '16px' }}>
                <div
                  style={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CChartDoughnut
                    data={{
                      labels: currentData.doughnut.labels,
                      datasets: [
                        {
                          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                          data: currentData.doughnut.data,
                          borderWidth: 0,
                          cutout: '75%',
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true },
                      },
                    }}
                  />
                  <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                      {currentData.doughnut.total}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Total</div>
                  </div>
                </div>

                <div className="custom-legend" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {currentData.doughnut.legend.map((item, idx) => (
                    <div key={idx} className="legend-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <div className="legend-left">
                        <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                        {item.label}
                      </div>
                      <div className="legend-right" style={{ paddingLeft: '16px' }}>
                        <span className="legend-value">{item.value}</span>
                        <span className="legend-percent">({item.percent})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: First Line Chart */}
            <div className="chart-card">
              <h5 className="chart-title">{currentData.chart1.title}</h5>
              <div style={{ height: '280px' }}>
                <CChartLine
                  data={{
                    labels: ['01 May', '08 May', '15 May', '22 May', '29 May', '05 Jun'],
                    datasets: [
                      {
                        label: currentData.chart1.label,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: '#3b82f6',
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        data: currentData.chart1.data,
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { grid: { borderDash: [4, 4] }, min: 0 },
                    },
                  }}
                />
              </div>
            </div>

            {/* Chart 3: Second Line Chart */}
            <div className="chart-card">
              <h5 className="chart-title">{currentData.chart3.title}</h5>
              <div style={{ height: '280px' }}>
                <CChartLine
                  data={{
                    labels: [
                      '01 May',
                      '08 May',
                      '15 May',
                      '22 May',
                      '29 May',
                      '05 Jun',
                      '12 Jun',
                      '19 Jun',
                      '26 Jun',
                      '03 Jul',
                    ],
                    datasets: [
                      {
                        label: currentData.chart3.label,
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        borderColor: '#8b5cf6',
                        pointBackgroundColor: '#8b5cf6',
                        pointBorderColor: '#fff',
                        data: currentData.chart3.data,
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: {
                        grid: { borderDash: [4, 4] },
                        min: 0,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}

export default Reports
