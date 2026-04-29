import React, { useState } from 'react'
import {
  CNav, CNavItem, CNavLink,
  CTabContent, CTabPane,
} from '@coreui/react'
import {
  LayoutDashboard, Stethoscope, Building2,
  Monitor, PanelRight,
} from 'lucide-react'

const TABS = [
  { id: 1, label: 'Dashboard Ads',      icon: LayoutDashboard, accent: '#185fa5', bg: '#e6f1fb', border: '#b5d4f4' },
  { id: 2, label: 'Service Ads',        icon: Stethoscope,      accent: '#1D9E75', bg: '#E1F5EE', border: '#9FE1CB' },
  { id: 3, label: 'Clinic Ads',         icon: Building2,        accent: '#BA7517', bg: '#FAEEDA', border: '#FAC775' },
  { id: 4, label: 'Doctor Web Ads',     icon: Monitor,          accent: '#534AB7', bg: '#EEEDFE', border: '#CECBF6' },
  { id: 5, label: 'Doctor Web Vertical',icon: PanelRight,       accent: '#993556', bg: '#FBEAF0', border: '#F4C0D1' },
]

const AdsManagement = () => {
  const [activeKey, setActiveKey] = useState(1)
  const active = TABS.find(t => t.id === activeKey)

  return (
    <div style={{ padding: '1.25rem' }}>

      {/* ── Page header ───────────────────────── */}
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Advertisement Management</h1>
          <p className="am-page-sub">Manage all ad placements across the platform</p>
        </div>
        <div className="am-header-badge">
          {TABS.length} Channels
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────── */}
      <div className="am-tabs">
        {TABS.map(({ id, label, icon: Icon, accent, bg, border }) => (
          <button
            key={id}
            className={`am-tab${activeKey === id ? ' active' : ''}`}
            style={activeKey === id
              ? { background: accent, borderColor: accent, color: '#fff' }
              : {}}
            onClick={() => setActiveKey(id)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content (children injected) ───── */}
      <div className="am-tab-panel">
        {/* Replace each placeholder with your real component, e.g.: */}
        {/* {activeKey === 2 && <ServiceAdvertisement />} */}

        <div className="am-placeholder" style={{ borderColor: active.border, background: active.bg }}>
          <div className="am-placeholder-icon" style={{ color: active.accent }}>
            {React.createElement(active.icon, { size: 32 })}
          </div>
          <p className="am-placeholder-label" style={{ color: active.accent }}>{active.label}</p>
          <p className="am-placeholder-hint">Replace this block with your tab component.</p>
        </div>
      </div>

      {/* ── Styles ────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .am-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 1.25rem;
        }
        .am-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #0c447c;
          margin: 0 0 4px;
        }
        .am-page-sub {
          font-size: 13px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .am-header-badge {
          background: #e6f1fb;
          border: 0.5px solid #b5d4f4;
          color: #185fa5;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .am-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .am-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 0.5px solid transparent;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 500;
          color: #5f5e5a;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .am-tab:hover:not(.active) { background: #f1efe8; color: #2c2c2a; }
        .am-tab.active { font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .am-tab-panel {
          background: #fff;
          border: 0.5px solid #d0dce9;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          min-height: 300px;
        }
        .am-placeholder {
          border: 1.5px dashed;
          border-radius: 12px;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
        }
        .am-placeholder-icon { opacity: 0.7; }
        .am-placeholder-label {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .am-placeholder-hint {
          font-size: 12px;
          color: #888780;
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </div>
  )
}

export default AdsManagement