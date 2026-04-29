import React, { useState } from 'react'

const t = {
  text: 'var(--cui-body-color, #1e293b)',
  textMuted: 'var(--cui-secondary-color, #64748b)',
  textLight: '#94a3b8',
  surface: 'var(--cui-tertiary-bg, #f8fafc)',
  border: 'var(--cui-border-color, #e2e8f0)',
  bg: 'var(--cui-body-bg, #ffffff)',
  radius: '10px',
  radiusSm: '6px',
  shadow: '0 1px 3px rgba(0,0,0,0.07)',
}

const STATUS_CONFIG = {
  Pending:   { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27' },
  Completed: { bg: '#EAF3DE', color: '#3B6D11', border: '#97C459' },
  Failed:    { bg: '#FCEBEB', color: '#A32D2D', border: '#F09595' },
}

const TABS = [
  { key: 'Pending',   label: 'Pending',   countBg: '#FAEEDA', countColor: '#854F0B', activeBar: '#BA7517' },
  { key: 'Completed', label: 'Completed', countBg: '#EAF3DE', countColor: '#3B6D11', activeBar: '#3B6D11' },
  { key: 'Failed',    label: 'Failed',    countBg: '#FCEBEB', countColor: '#A32D2D', activeBar: '#A32D2D' },
]

const sampleData = [
  { id: 1, name: 'Dr. Ayesha Khan',  amount: '₹3,200', date: '25 Oct 2025', status: 'Pending' },
  { id: 2, name: 'Dr. Raj Patel',    amount: '₹5,800', date: '24 Oct 2025', status: 'Completed' },
  { id: 3, name: 'Dr. Sneha Rao',    amount: '₹2,100', date: '23 Oct 2025', status: 'Failed' },
]

const getInitials = (name) =>
  name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {}
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: '600',
      background: cfg.bg, color: cfg.color,
    }}>
      {status}
    </span>
  )
}

const ActionBtn = ({ status }) => {
  const styles = {
    Pending:   { color: '#3B6D11', border: '#97C459', label: 'Release', hover: '#EAF3DE' },
    Completed: { color: '#185FA5', border: '#85B7EB', label: 'View',    hover: '#E6F1FB' },
    Failed:    { color: '#A32D2D', border: '#F09595', label: 'Retry',   hover: '#FCEBEB' },
  }
  const s = styles[status] || styles.Completed
  const [hovered, setHovered] = useState(false)
  return (
    <button
      style={{
        background: hovered ? s.hover : 'transparent',
        border: `0.5px solid ${s.border}`,
        borderRadius: t.radiusSm,
        padding: '4px 14px',
        fontSize: '12px', fontWeight: '600',
        color: s.color, cursor: 'pointer',
        transition: 'background .15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {s.label}
    </button>
  )
}

const StatCard = ({ label, value, sub, valueStyle }) => (
  <div style={{
    background: t.surface,
    borderRadius: t.radius,
    padding: '1rem',
    flex: '1 1 120px',
  }}>
    <div style={{ fontSize: '12px', color: t.textMuted, marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: '500', ...valueStyle }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: t.textLight, marginTop: '4px' }}>{sub}</div>}
  </div>
)

const Payouts = () => {
  const [activeTab, setActiveTab] = useState('Pending')

  const filtered = sampleData.filter(d => d.status === activeTab)
  const countByStatus = (s) => sampleData.filter(d => d.status === s).length

  return (
    <div style={{ fontFamily: 'inherit', color: t.text }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: t.text }}>Payout management</div>
        <div style={{ fontSize: '12px', color: t.textMuted, marginTop: '2px' }}>Manage and release doctor payouts</div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatCard label="Total payouts" value="₹11,100" sub="3 transactions" valueStyle={{ color: t.text }} />
        <StatCard label="Pending"   value="₹3,200" sub="1 awaiting release" valueStyle={{ color: '#BA7517' }} />
        <StatCard label="Completed" value="₹5,800" sub="1 settled"          valueStyle={{ color: '#3B6D11' }} />
        <StatCard label="Failed"    value="₹2,100" sub="1 needs retry"      valueStyle={{ color: '#A32D2D' }} />
      </div>

      {/* Card with tabs + table */}
      <div style={{
        background: t.bg,
        border: `0.5px solid ${t.border}`,
        borderRadius: t.radius,
        boxShadow: t.shadow,
        overflow: 'hidden',
      }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${t.border}` }}>
          {TABS.map(tab => {
            const active = activeTab === tab.key
            return (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: active ? `2px solid ${tab.activeBar}` : '2px solid transparent',
                  padding: '10px 18px',
                  fontSize: '13px', fontWeight: active ? '600' : '500',
                  color: active ? t.text : t.textMuted,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'color .15s, border-color .15s',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
                <span style={{
                  background: tab.countBg, color: tab.countColor,
                  fontSize: '11px', fontWeight: '600',
                  padding: '1px 7px', borderRadius: '20px',
                }}>
                  {countByStatus(tab.key)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: `0.5px solid ${t.border}` }}>
                {['#', 'Doctor', 'Amount', 'Date', 'Status', 'Action'].map((h, i) => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: i === 5 ? 'right' : 'left',
                    fontSize: '11px', fontWeight: '500', color: t.textMuted,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    background: t.surface, whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((row, idx) => (
                <TableRow key={row.id} row={row} idx={idx} />
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: t.textLight, fontSize: '13px' }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const TableRow = ({ row, idx }) => {
  const [hovered, setHovered] = useState(false)
  const initials = getInitials(row.name)
  return (
    <tr
      style={{ borderBottom: `0.5px solid ${t.border}`, background: hovered ? t.surface : 'transparent', transition: 'background .1s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={{ padding: '11px 14px', color: t.textMuted }}>{idx + 1}</td>
      <td style={{ padding: '11px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#E6F1FB', color: '#185FA5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '600', flexShrink: 0,
          }}>
            {initials}
          </div>
          <span style={{ fontWeight: '500' }}>{row.name}</span>
        </div>
      </td>
      <td style={{ padding: '11px 14px', fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>{row.amount}</td>
      <td style={{ padding: '11px 14px', color: t.textMuted, fontSize: '12px' }}>{row.date}</td>
      <td style={{ padding: '11px 14px' }}><Badge status={row.status} /></td>
      <td style={{ padding: '11px 14px', textAlign: 'right' }}><ActionBtn status={row.status} /></td>
    </tr>
  )
}

export default Payouts