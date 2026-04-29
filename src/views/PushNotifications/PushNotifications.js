import React, { useState, useEffect } from 'react'
import {
  Bell, BellOff, Send, ChevronLeft, ChevronRight, RotateCcw,
  CheckCircle, XCircle, Clock, Users, User,
  TrendingUp, AlertCircle, Megaphone, X, Loader,
} from 'lucide-react'

// ─── Static Data ──────────────────────────────────────────────────────────────
const STATIC_NOTIFICATIONS = [
  { id: 1,  title: 'Appointment Confirmed',    body: 'Your appointment with Dr. Priya Sharma on 2026-04-29 at 10:30 AM has been confirmed.',  target: 'All Users',     type: 'Appointment', status: 'Sent',      sentAt: '2026-04-29  9:00 AM', recipients: 142 },
  { id: 2,  title: 'New Doctor Available',      body: 'Dr. Ramesh Gupta (Cardiologist) is now available for online consultations.',            target: 'All Users',     type: 'Doctor',      status: 'Sent',      sentAt: '2026-04-28 11:15 AM', recipients: 380 },
  { id: 3,  title: 'Appointment Reminder',      body: 'Reminder: You have an appointment tomorrow at Kiran Clinic at 4:00 PM.',               target: 'Specific User', type: 'Reminder',    status: 'Sent',      sentAt: '2026-04-27  6:00 PM', recipients: 1   },
  { id: 4,  title: 'Slot Cancelled',            body: 'Unfortunately, your 3:00 PM slot on 2026-04-26 has been cancelled. Please rebook.',    target: 'Specific User', type: 'Appointment', status: 'Failed',    sentAt: '2026-04-26  2:45 PM', recipients: 1   },
  { id: 5,  title: 'Health Tips — May',         body: 'Stay hydrated this summer! Check out our top 10 health tips for May 2026.',            target: 'All Users',     type: 'General',     status: 'Scheduled', sentAt: '2026-05-01  8:00 AM', recipients: 520 },
  { id: 6,  title: 'Payment Received',          body: 'Your payment of ₹500 for booking #Kin-Sar-2026-0016 has been received.',              target: 'Specific User', type: 'Payment',     status: 'Sent',      sentAt: '2026-04-25 10:10 AM', recipients: 1   },
  { id: 7,  title: 'New Clinic Added',          body: 'Sunrise Wellness Clinic has joined our network. Book your slot today!',               target: 'All Users',     type: 'General',     status: 'Sent',      sentAt: '2026-04-24  3:00 PM', recipients: 410 },
  { id: 8,  title: 'Video Consultation Ready',  body: 'Your video consultation with Dr. Anil Kapoor starts in 10 minutes. Join now.',        target: 'Specific User', type: 'Reminder',    status: 'Sent',      sentAt: '2026-04-23  9:50 AM', recipients: 1   },
  { id: 9,  title: 'Profile Update Required',   body: 'Please complete your health profile to get personalised recommendations.',            target: 'All Users',     type: 'General',     status: 'Scheduled', sentAt: '2026-05-02 10:00 AM', recipients: 520 },
  { id: 10, title: 'Booking Rescheduled',       body: 'Your appointment has been rescheduled to 2026-04-30 at 11:00 AM.',                   target: 'Specific User', type: 'Appointment', status: 'Sent',      sentAt: '2026-04-22  4:30 PM', recipients: 1   },
  { id: 11, title: 'Seasonal Offer',            body: 'Get 20% off on all Lab Tests this week. Use code LAB20 at checkout.',                target: 'All Users',     type: 'General',     status: 'Sent',      sentAt: '2026-04-21  8:00 AM', recipients: 500 },
  { id: 12, title: 'Doctor Rating Request',     body: 'How was your experience with Dr. Sneha Reddy? Rate your appointment.',               target: 'Specific User', type: 'Reminder',    status: 'Failed',    sentAt: '2026-04-20  7:00 PM', recipients: 1   },
]

const TYPE_META = {
  Appointment: { emoji: '📅', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  Doctor:      { emoji: '🩺', color: '#5b21b6', bg: '#ede9fe', border: '#c4b5fd' },
  Reminder:    { emoji: '⏰', color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
  Payment:     { emoji: '💳', color: '#166534', bg: '#dcfce7', border: '#86efac' },
  General:     { emoji: '📢', color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
}

const STATUS_META = {
  Sent:      { color: '#166534', bg: '#dcfce7', dot: '#22c55e', icon: CheckCircle },
  Failed:    { color: '#991b1b', bg: '#fee2e2', dot: '#ef4444', icon: XCircle     },
  Scheduled: { color: '#854d0e', bg: '#fef9c3', dot: '#eab308', icon: Clock       },
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [])
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
      background: '#1a3a6b', color: '#fff',
      padding: '13px 20px', borderRadius: '12px',
      fontSize: '13px', fontWeight: '600',
      boxShadow: '0 8px 32px rgba(26,58,107,0.35)',
      display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'slideUp 0.3s ease',
    }}>
      <CheckCircle size={16} color="#4ade80" />
      {msg}
    </div>
  )
}

// ─── Send Modal ───────────────────────────────────────────────────────────────
const SendModal = ({ onClose, onSend, permission, onRequestPermission }) => {
  const [form, setForm]       = useState({ title: '', body: '', target: 'All Users', type: 'General' })
  const [sending, setSending] = useState(false)
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.body.trim())  e.body  = 'Message is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSend = async () => {
    if (!validate()) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    if (permission === 'granted') {
      try { new Notification(form.title, { body: form.body, icon: '/favicon.ico' }) } catch {}
    }
    onSend(form)
    setSending(false)
    onClose()
  }

  const inputBase = (field) => ({
    width: '100%', padding: '10px 13px',
    border: `1.5px solid ${errors[field] ? '#fca5a5' : '#e5e7eb'}`,
    borderRadius: '10px', fontSize: '13px', color: '#1f2937',
    outline: 'none', background: errors[field] ? '#fff5f5' : '#fff',
    fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  const focusInput  = (e) => { e.target.style.borderColor = '#1a3a6b'; e.target.style.boxShadow = '0 0 0 3px rgba(26,58,107,0.10)' }
  const blurInput   = (e, field) => { e.target.style.borderColor = errors[field] ? '#fca5a5' : '#e5e7eb'; e.target.style.boxShadow = 'none' }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,20,50,0.52)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '500px',
          boxShadow: '0 32px 80px rgba(26,58,107,0.22)', overflow: 'hidden',
          animation: 'popIn 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 26px',
          background: 'linear-gradient(135deg, #1a3a6b 0%, #1a5faa 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '11px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Megaphone size={19} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>Send Push Notification</div>
              <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: '11px', marginTop: '1px' }}>Reach your users instantly</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
            width: '30px', height: '30px', borderRadius: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Permission warning */}
          {permission !== 'granted' && (
            <div style={{
              background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px',
              padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <AlertCircle size={15} color="#d97706" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500', flex: 1 }}>
                Browser notifications are currently blocked.
              </span>
              <button onClick={onRequestPermission} style={{
                padding: '5px 13px', borderRadius: '8px',
                background: '#1a3a6b', color: '#fff',
                border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>Enable</button>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '7px' }}>
              Notification Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Appointment Confirmed"
              value={form.title}
              onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((er) => ({ ...er, title: '' })) }}
              style={inputBase('title')}
              onFocus={focusInput}
              onBlur={(e) => blurInput(e, 'title')}
            />
            {errors.title && <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '7px' }}>
              Message *
            </label>
            <textarea
              placeholder="Write the notification message here..."
              value={form.body}
              rows={3}
              onChange={(e) => { setForm((f) => ({ ...f, body: e.target.value })); setErrors((er) => ({ ...er, body: '' })) }}
              style={{ ...inputBase('body'), resize: 'vertical', minHeight: '80px' }}
              onFocus={focusInput}
              onBlur={(e) => blurInput(e, 'body')}
            />
            {errors.body && <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.body}</span>}
          </div>

          {/* Target + Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Target Audience',     key: 'target', options: ['All Users', 'Specific User'] },
              { label: 'Notification Type',   key: 'type',   options: Object.keys(TYPE_META) },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '7px' }}>
                  {label}
                </label>
                <select
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid #e5e7eb', borderRadius: '10px',
                    fontSize: '13px', color: '#1f2937', background: '#fff',
                    cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                  }}
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {key === 'type' ? `${TYPE_META[o].emoji}  ${o}` : o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Live Preview */}
          {(form.title || form.body) && (
            <div style={{
              background: '#f8fafc', border: '1.5px dashed #cbd5e1',
              borderRadius: '12px', padding: '13px 15px',
            }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Live Preview
              </div>
              <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                  background: TYPE_META[form.type]?.bg || '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                }}>
                  {TYPE_META[form.type]?.emoji || '📢'}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937' }}>
                    {form.title || 'Notification Title'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', lineHeight: '1.5' }}>
                    {form.body || 'Your message will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 26px', borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          background: '#fafbfc',
        }}>
          <button onClick={onClose} style={{
            padding: '9px 22px', borderRadius: '10px',
            border: '1.5px solid #e5e7eb', background: '#fff',
            color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>Cancel</button>
          <button
            onClick={handleSend}
            disabled={sending}
            style={{
              padding: '9px 24px', borderRadius: '10px',
              background: sending ? '#93afd4' : '#1a3a6b',
              color: '#fff', border: 'none',
              fontSize: '13px', fontWeight: '700',
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: sending ? 'none' : '0 4px 14px rgba(26,58,107,0.30)',
              transition: 'all 0.2s',
            }}
          >
            {sending
              ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={14} />
            }
            {sending ? 'Sending...' : 'Send Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, iconColor, iconBg, accent }) => (
  <div
    style={{
      background: '#fff', borderRadius: '14px', padding: '18px 20px',
      border: '1px solid #e8eef5', flex: '1', minWidth: '130px',
      boxShadow: '0 2px 10px rgba(27,79,138,0.07)',
      borderLeft: `4px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: '16px',
      transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'default',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,79,138,0.13)' }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(27,79,138,0.07)' }}
  >
    <div style={{
      width: '46px', height: '46px', borderRadius: '12px',
      background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={21} color={iconColor} />
    </div>
    <div>
      <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a3a6b', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
    </div>
  </div>
)

// ─── Main ─────────────────────────────────────────────────────────────────────
const PushNotifications = () => {
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS)
  const [statusFilter, setStatusFilter]   = useState('')
  const [typeFilter, setTypeFilter]       = useState('')
  const [currentPage, setCurrentPage]     = useState(1)
  const [itemsPerPage, setItemsPerPage]   = useState(5)
  const [showModal, setShowModal]         = useState(false)
  const [toast, setToast]                 = useState('')
  const [permission, setPermission]       = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermission)
    }
  }, [])

  const requestPermission = () => {
    if (typeof Notification !== 'undefined') {
      Notification.requestPermission().then(setPermission)
    }
  }

  const counts = {
    sent:      notifications.filter((n) => n.status === 'Sent').length,
    scheduled: notifications.filter((n) => n.status === 'Scheduled').length,
    failed:    notifications.filter((n) => n.status === 'Failed').length,
    total:     notifications.length,
  }

  const filtered = notifications.filter((n) => {
    if (statusFilter && n.status !== statusFilter) return false
    if (typeFilter   && n.type   !== typeFilter)   return false
    return true
  })

  useEffect(() => { setCurrentPage(1) }, [statusFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getPaginationPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
        acc.push(p)
        return acc
      }, [])

  const handleSend = (form) => {
    const entry = {
      id: Date.now(),
      title: form.title,
      body: form.body,
      target: form.target,
      type: form.type,
      status: 'Sent',
      sentAt: new Date().toLocaleString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit' }),
      recipients: form.target === 'All Users' ? 520 : 1,
    }
    setNotifications((prev) => [entry, ...prev])
    setToast(`"${form.title}" sent successfully!`)
  }

  return (
    <div style={{ padding: '4px 0', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes popIn   { from { opacity:0; transform:scale(0.93) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) }             to { opacity:1; transform:translateY(0) } }
        @keyframes spin    { to   { transform: rotate(360deg) } }
        .pn-table { width:100%; border-collapse:collapse; }
        .pn-table thead th {
          background: #1a3a6b; color:#fff;
          font-size:11px; font-weight:700;
          padding:13px 16px; border:none;
          letter-spacing:0.5px; text-transform:uppercase; white-space:nowrap;
        }
        .pn-table tbody td { padding:13px 16px; vertical-align:middle; border-bottom:1px solid #f0f4f8; color:#374151; font-size:13px; }
        .pn-table tbody tr:last-child td { border-bottom:none; }
        .pn-table tbody tr { transition:background 0.15s; }
        .pn-table tbody tr:hover { background:#f0f6ff !important; }
        .pn-chip {
          padding:5px 13px; border-radius:20px;
          border:1.5px solid #1a3a6b; background:#fff; color:#1a3a6b;
          font-size:12px; font-weight:700; cursor:pointer;
          transition:all 0.18s; white-space:nowrap;
        }
        .pn-chip:hover { background:#eef4fb; }
        .pn-chip.active { background:#1a3a6b; color:#fff; }
        .pn-page-btn {
          height:32px; min-width:32px; padding:0 10px;
          border-radius:8px; border:1.5px solid #e5e7eb;
          background:#fff; color:#374151; font-size:12px; font-weight:600;
          cursor:pointer; transition:all 0.18s;
          display:inline-flex; align-items:center; justify-content:center; gap:4px; white-space:nowrap;
        }
        .pn-page-btn:hover:not(:disabled):not(.active) { border-color:#1a3a6b; color:#1a3a6b; background:#eef4fb; }
        .pn-page-btn.active { background:#1a3a6b; color:#fff; border-color:#1a3a6b; }
        .pn-page-btn:disabled { opacity:0.35; cursor:not-allowed; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '22px',
        flexWrap: 'wrap', gap: '14px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a3a6b, #1a6bbf)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(26,58,107,0.30)',
            }}>
              <Bell size={20} color="#fff" />
            </div>
            <div>
              <h5 style={{ color: '#1a3a6b', fontWeight: '800', margin: 0, fontSize: '20px', letterSpacing: '-0.3px' }}>
                Push Notifications
              </h5>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                Manage and broadcast notifications to your users
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Permission badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '7px 14px', borderRadius: '20px',
            border: `1.5px solid ${permission === 'granted' ? '#86efac' : '#fde68a'}`,
            background: permission === 'granted' ? '#f0fdf4' : '#fffbeb',
          }}>
            {permission === 'granted'
              ? <Bell size={13} color="#16a34a" />
              : <BellOff size={13} color="#d97706" />
            }
            <span style={{
              fontSize: '11px', fontWeight: '700',
              color: permission === 'granted' ? '#15803d' : '#b45309',
            }}>
              {permission === 'granted' ? 'Browser Notifications On' : 'Notifications Blocked'}
            </span>
          </div>

          {/* Send button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 20px', borderRadius: '11px',
              background: 'linear-gradient(135deg, #1a3a6b, #1a5faa)',
              color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,58,107,0.32)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(26,58,107,0.40)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,107,0.32)' }}
          >
            <Send size={14} /> Send Notification
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <StatCard label="Total Sent" value={counts.sent}      icon={CheckCircle} iconColor="#16a34a" iconBg="#dcfce7" accent="#22c55e" />
        <StatCard label="Scheduled"  value={counts.scheduled} icon={Clock}       iconColor="#ca8a04" iconBg="#fef9c3" accent="#eab308" />
        <StatCard label="Failed"     value={counts.failed}    icon={XCircle}     iconColor="#dc2626" iconBg="#fee2e2" accent="#ef4444" />
        <StatCard label="All Time"   value={counts.total}     icon={TrendingUp}  iconColor="#1a3a6b" iconBg="#eef4fb" accent="#1a3a6b" />
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', padding: '16px 20px',
        marginBottom: '16px', border: '1px solid #e8eef5',
        boxShadow: '0 2px 10px rgba(27,79,138,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '46px' }}>Status</span>
              <div style={{ width: '1px', height: '16px', background: '#e5e7eb' }} />
              {['Sent', 'Scheduled', 'Failed'].map((s) => (
                <button key={s} className={`pn-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter((p) => p === s ? '' : s)}>
                  {s === 'Sent' ? '✅' : s === 'Scheduled' ? '⏳' : '❌'} {s}
                </button>
              ))}
            </div>
            {/* Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '46px' }}>Type</span>
              <div style={{ width: '1px', height: '16px', background: '#e5e7eb' }} />
              {Object.entries(TYPE_META).map(([t, m]) => (
                <button key={t} className={`pn-chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter((p) => p === t ? '' : t)}>
                  {m.emoji} {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(statusFilter || typeFilter) && (
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                <strong style={{ color: '#1a3a6b' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
            <button
              onClick={() => { setStatusFilter(''); setTypeFilter('') }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 15px', borderRadius: '9px',
                border: '1.5px solid #fcd34d', background: '#fffbeb',
                color: '#92400e', fontSize: '12px', fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: '#fff', borderRadius: '14px', overflow: 'hidden',
        border: '1px solid #e8eef5', boxShadow: '0 2px 12px rgba(27,79,138,0.08)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="pn-table">
            <thead>
              <tr>
                {['#', 'Notification', 'Type', 'Target', 'Recipients', 'Sent At', 'Status'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? paginated.map((n, i) => {
                const sm = STATUS_META[n.status] || { color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' }
                const tm = TYPE_META[n.type]    || { emoji: '📢', color: '#374151', bg: '#f3f4f6', border: '#e5e7eb' }
                return (
                  <tr key={n.id}>
                    {/* # */}
                    <td style={{ color: '#9ca3af', fontWeight: '700', fontSize: '12px', width: '50px' }}>
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>
                    {/* Notification */}
                    <td style={{ minWidth: '240px' }}>
                      <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                          background: tm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', border: `1px solid ${tm.border}`,
                        }}>
                          {tm.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#1a3a6b', fontSize: '13px' }}>{n.title}</div>
                          <div style={{
                            fontSize: '12px', color: '#6b7280', marginTop: '3px', lineHeight: '1.5',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            overflow: 'hidden', maxWidth: '260px',
                          }}>
                            {n.body}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Type */}
                    <td>
                      <span style={{
                        padding: '4px 11px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '700',
                        background: tm.bg, color: tm.color, border: `1px solid ${tm.border}`,
                        display: 'inline-block',
                      }}>
                        {tm.emoji} {n.type}
                      </span>
                    </td>
                    {/* Target */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 11px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '700',
                        background: n.target === 'All Users' ? '#eef4fb' : '#f9fafb',
                        color:      n.target === 'All Users' ? '#1a3a6b' : '#374151',
                        border: `1px solid ${n.target === 'All Users' ? '#bfdbfe' : '#e5e7eb'}`,
                      }}>
                        {n.target === 'All Users' ? <Users size={10} /> : <User size={10} />}
                        {n.target}
                      </span>
                    </td>
                    {/* Recipients */}
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '700', color: '#1a3a6b' }}>
                        {n.recipients >= 1000 ? `${(n.recipients / 1000).toFixed(1)}k` : n.recipients}
                      </span>
                    </td>
                    {/* Sent At */}
                    <td style={{ whiteSpace: 'nowrap', color: '#6b7280', fontSize: '12px' }}>
                      {n.sentAt}
                    </td>
                    {/* Status */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '5px 12px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '700',
                        background: sm.bg, color: sm.color,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sm.dot, flexShrink: 0 }} />
                        {n.status}
                      </span>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="7" style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔔</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>No notifications found</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Try adjusting your filters</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 20px', borderTop: '1px solid #f0f4f8',
            flexWrap: 'wrap', gap: '10px', background: '#fafbfc',
          }}>
            {/* Rows per page */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' }}>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                style={{
                  padding: '5px 9px', border: '1.5px solid #e5e7eb', borderRadius: '7px',
                  fontSize: '12px', color: '#374151', cursor: 'pointer', outline: 'none', background: '#fff',
                }}
              >
                {[5, 10, 25, 50].map((n) => <option key={n}>{n}</option>)}
              </select>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
              </span>
            </div>

            {/* Page controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button className="pn-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft size={13} /> Prev
              </button>

              {getPaginationPages().map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 2px' }}>…</span>
                ) : (
                  <button key={p} className={`pn-page-btn ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>
                    {p}
                  </button>
                )
              )}

              <button className="pn-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Next <ChevronRight size={13} />
              </button>
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px', whiteSpace: 'nowrap' }}>
                Page <strong style={{ color: '#1a3a6b' }}>{currentPage}</strong> of <strong style={{ color: '#1a3a6b' }}>{totalPages}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <SendModal
          onClose={() => setShowModal(false)}
          onSend={handleSend}
          permission={permission}
          onRequestPermission={() => {
            if (typeof Notification !== 'undefined') Notification.requestPermission().then(setPermission)
          }}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  )
}

export default PushNotifications