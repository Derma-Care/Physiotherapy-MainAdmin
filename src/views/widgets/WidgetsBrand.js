import React from 'react'
import PropTypes from 'prop-types'
import { CCol } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

const WidgetsBrand = (props) => {
  const monthlyData = [1200, 1900, 3000, 2500, 2200, 2800, 3200, 3100, 3300, 3500, 3700, 3900]
  const yearlyData = [14400, 22800, 36000, 30000, 26400, 33600, 38400, 37200, 39600, 42000, 44400, 46800]
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const totalMonthly = '$38.4K'
  const totalYearly = '$450K'
  const monthlyGrowth = '+12.3%'
  const yearlyGrowth = '+18.7%'

  return (
    <CCol sm={12}>
      <div style={{
        background: 'linear-gradient(135deg, #1B4F8A 0%, #153d6e 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(27,79,138,0.3)',
        position: 'relative',
      }}>

        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(249,197,113,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '10%',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        {/* Header */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            <h5 style={{
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '17px',
              margin: '0 0 4px 0',
              letterSpacing: '0.2px',
            }}>
              Earnings Overview
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: 0 }}>
              Monthly & yearly performance
            </p>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Monthly', value: totalMonthly, growth: monthlyGrowth, color: '#36A2EB' },
              { label: 'Yearly', value: totalYearly, growth: yearlyGrowth, color: '#f9c571' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
                minWidth: '120px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: item.color,
                  }} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '500' }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.3px' }}>
                  {item.value}
                </div>
                <div style={{
                  color: '#86efac', fontSize: '11px', fontWeight: '600',
                  marginTop: '2px',
                }}>
                  ↑ {item.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        {props.withCharts && (
          <div style={{ padding: '20px 24px 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ height: '220px' }}>
              <CChart
                type="bar"
                data={{
                  labels,
                  datasets: [
                    {
                      label: 'Monthly Earnings ($)',
                      backgroundColor: 'rgba(54,162,235,0.85)',
                      borderColor: '#36A2EB',
                      borderWidth: 0,
                      borderRadius: 6,
                      borderSkipped: false,
                      barThickness: 18,
                      data: monthlyData,
                    },
                    {
                      label: 'Yearly Earnings ($)',
                      backgroundColor: 'rgba(249,197,113,0.85)',
                      borderColor: '#f9c571',
                      borderWidth: 0,
                      borderRadius: 6,
                      borderSkipped: false,
                      barThickness: 18,
                      data: yearlyData.map(v => v / 10),
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      align: 'end',
                      labels: {
                        color: 'rgba(255,255,255,0.75)',
                        font: { size: 11, weight: '500' },
                        boxWidth: 10,
                        boxHeight: 10,
                        borderRadius: 3,
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        padding: 16,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(15,30,60,0.95)',
                      titleColor: '#ffffff',
                      bodyColor: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      cornerRadius: 10,
                      padding: 10,
                      callbacks: {
                        label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: 'rgba(255,255,255,0.5)',
                        font: { size: 11 },
                      },
                      border: { display: false },
                    },
                    y: {
                      grid: {
                        color: 'rgba(255,255,255,0.07)',
                        drawBorder: false,
                      },
                      ticks: {
                        color: 'rgba(255,255,255,0.5)',
                        font: { size: 11 },
                        callback: (v) => `$${v >= 1000 ? (v/1000).toFixed(0)+'K' : v}`,
                        maxTicksLimit: 5,
                      },
                      border: { display: false },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </CCol>
  )
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand