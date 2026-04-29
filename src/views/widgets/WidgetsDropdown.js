import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilPeople, cilHospital, cilMedicalCross } from '@coreui/icons'

const StatCard = ({ title, value, change, isPositive, color, accent, chartData, icon }) => {
  const chartRef = useRef(null)

  return (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, ${accent} 100%)`,
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 8px 24px ${color}40`,
      height: '100%',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '20px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />

      {/* Icon */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
      }}>
        <CIcon icon={icon} style={{ color: '#fff', width: '20px', height: '20px' }} />
      </div>

      {/* Title */}
      <p style={{
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        fontWeight: '500',
        margin: '0 0 4px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      }}>
        {title}
      </p>

      {/* Value */}
      <h2 style={{
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        letterSpacing: '-0.5px',
      }}>
        {value}
      </h2>

      {/* Change badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
        borderRadius: '20px',
        padding: '3px 10px',
        marginBottom: '12px',
      }}>
        <CIcon
          icon={isPositive ? cilArrowTop : cilArrowBottom}
          style={{ color: isPositive ? '#86efac' : '#fca5a5', width: '12px', height: '12px' }}
        />
        <span style={{
          color: isPositive ? '#86efac' : '#fca5a5',
          fontSize: '11px',
          fontWeight: '600',
        }}>
          {change}
        </span>
      </div>

      {/* Mini chart */}
      <div style={{ height: '55px', marginTop: '4px' }}>
        <CChartLine
          ref={chartRef}
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,0.6)',
              pointBackgroundColor: 'rgba(255,255,255,0.9)',
              borderWidth: 2,
              data: chartData,
            }],
          }}
          options={{
            plugins: { legend: { display: false } },
            maintainAspectRatio: false,
            scales: {
              x: { display: false, grid: { display: false } },
              y: { display: false, grid: { display: false } },
            },
            elements: {
              line: { borderWidth: 2, tension: 0.4 },
              point: { radius: 0, hoverRadius: 4 },
            },
          }}
        />
      </div>
    </div>
  )
}

const WidgetsDropdown = (props) => {
  const stats = [
    {
      title: 'Total Clinics',
      value: '1,284',
      change: '+8.2% this month',
      isPositive: true,
      color: '#1B4F8A',
      accent: '#1a6bbf',
      icon: cilHospital,
      chartData: [40, 55, 50, 65, 60, 75, 70, 80, 75, 85, 80, 90],
    },
    {
      title: 'Total Doctors',
      value: '3,640',
      change: '+12.4% this month',
      isPositive: true,
      color: '#f9a825',
      accent: '#f9c571',
      icon: cilMedicalCross,
      chartData: [30, 45, 55, 50, 65, 60, 70, 68, 75, 72, 80, 85],
    },
    {
      title: 'Total Patients',
      value: '26,410',
      change: '-3.1% this month',
      isPositive: false,
      color: '#0f766e',
      accent: '#0d9488',
      icon: cilPeople,
      chartData: [80, 70, 75, 65, 72, 60, 55, 65, 60, 50, 55, 48],
    },
  ]

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {stats.map((stat, i) => (
        <CCol key={i} sm={6} xl={4}>
          <StatCard {...stat} />
        </CCol>
      ))}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown