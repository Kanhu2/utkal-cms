import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faNewspaper,
  faBriefcase,
  faBullhorn,
  faUsers,
  faChevronDown,
  faChevronRight,
  faCalendarPlus,
  faFileCirclePlus,
  faClipboardList,
  faUserPlus,
  faCloudUploadAlt,
  faLocationDot,
  faArrowRight,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import {
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import './dashboard.css';


/* ── Chart Data ──────────────────────────────────────── */
const chartData = [
  { name: 'Apr 20', value: 800 },
  { name: 'Apr 27', value: 950 },
  { name: 'May 04', value: 1050 },
  { name: 'May 11', value: 1425 },
  { name: 'May 18', value: 1100 },
];

/* ── Quick Access Items ──────────────────────────────── */
const quickAccessItems = [
  { label: 'Add New Event', icon: faCalendarPlus, color: 'purple' },
  { label: 'Add News', icon: faNewspaper, color: 'green' },
  { label: 'Add Notice', icon: faClipboardList, color: 'amber' },
  { label: 'Add Tender', icon: faFileCirclePlus, color: 'blue' },
  { label: 'Add Faculty', icon: faUserPlus, color: 'rose' },
  { label: 'Upload to ILMS', icon: faCloudUploadAlt, color: 'cyan' },
];

/* ── Upcoming Events ─────────────────────────────────── */
const upcomingEvents = [
  {
    month: 'MAY', day: '24', variant: 'may',
    title: 'Dept. Seminar on AI & ML',
    dateStr: 'May 24, 2025 • 10:00 AM',
    location: 'Seminar Hall, CS Dept.',
  },

  // hiii i am amanas ranjan sahoo
  {
    month: 'MAY', day: '28', variant: 'may',
    title: 'Workshop on Data Science',
    dateStr: 'May 28, 2025 • 11:00 AM',
    location: 'Lab 3, CS Dept.',
  },
  {
    month: 'JUN', day: '05', variant: 'jun',
    title: 'Industry Expert Talk',
    dateStr: 'Jun 05, 2025 • 02:00 PM',
    location: 'Seminar Hall, CS Dept.',
  },
];

/* ── Recent Updates ──────────────────────────────────── */
const recentUpdates = [
  { title: 'AI & ML Seminar Announced', type: 'Event', typeCls: 'event', by: 'Admin', date: 'May 19, 2025' },
  { title: 'New Research Project Approved', type: 'Research Project', typeCls: 'research', by: 'HOD', date: 'May 18, 2025' },
  { title: 'Python Workshop Registration Open', type: 'Workshop', typeCls: 'workshop', by: 'Admin', date: 'May 17, 2025' },
  { title: 'Tender for Lab Equipment', type: 'Tender', typeCls: 'tender', by: 'Admin', date: 'May 16, 2025' },
  { title: 'Internal Assessment Schedule', type: 'Notice', typeCls: 'notice', by: 'Admin', date: 'May 15, 2025' },
];

/* ── Recent Notices ──────────────────────────────────── */
const recentNotices = [
  { title: 'Internal Assessment Schedule', date: 'May 18, 2025' },
  { title: 'Lab Maintenance Notice', date: 'May 16, 2025' },
  { title: 'Holiday on May 21, 2025', date: 'May 15, 2025' },
  { title: 'Project Submission Deadline', date: 'May 12, 2025' },
  { title: 'Library Access Update', date: 'May 10, 2025' },
];

/* ── Custom Chart Tooltip ────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e1b4b',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800 }}>{payload[0].value.toLocaleString()}</div>
        <div style={{ fontSize: '11px', color: '#a5b4fc' }}>{label}</div>
      </div>
    );
  }
  return null;
};

/* ══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [timeRange, setTimeRange] = useState('This Week');

  const weeklyData = [
    { name: 'Mon', value: 30 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 38 },
    { name: 'Thu', value: 65 },
    { name: 'Fri', value: 48 },
    { name: 'Sat', value: 75 },
    { name: 'Sun', value: 62 },
  ];

  const monthlyData = [
    { name: 'Week 1', value: 120 },
    { name: 'Week 2', value: 210 },
    { name: 'Week 3', value: 180 },
    { name: 'Week 4', value: 285 },
  ];

  const currentChartData = timeRange === 'This Week' ? weeklyData : monthlyData;

  return (
    <div className="dashboard">
      {/* ── Header ──────────────────────────────────── */}
      <div className="dash-header">
        <div className="dash-header-left">
          <h1>Welcome To {user?.role === 'admin' ? 'Admin' : 'HOD'} Dashboard 👋</h1>
          <p>Here&apos;s what&apos;s happening in your department today.</p>
        </div>
        <button className="dash-date-picker">
          <FontAwesomeIcon icon={faCalendarDays} />
          May 20, 2025
          <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '11px' }} />
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────── */}
      <div className="summary-cards">
        {[
          { value: '38', label: 'Events', sub: 'This Month', color: 'purple', icon: faCalendarDays, trend: '+12%', up: true },
          { value: '24', label: 'News Updates', sub: 'This Month', color: 'green', icon: faNewspaper, trend: '+5%', up: true },
          ...(user?.role === 'admin'
            ? [
              {
                value: '07',
                label: 'Tenders',
                sub: 'Active',
                color: 'amber',
                icon: faBriefcase,
                trend: '0%',
                up: null,
              },
              {
                value: '12',
                label: 'Notices',
                sub: 'Active',
                color: 'blue',
                icon: faBullhorn,
                trend: '+8%',
                up: true,
              },
            ]
            : []),
          { value: '45', label: 'Faculty', sub: 'Total', color: 'rose', icon: faUsers, trend: '+2', up: true },
        ].map((card, i) => (
          <div className={`summary-card card-accent-${card.color}`} key={i}>
            <div className="card-top-row">
              <div className={`card-icon-wrap ${card.color}`}>
                <FontAwesomeIcon icon={card.icon} />
              </div>
              {card.trend && (
                <div className={`card-trend ${card.up === true ? 'up' : card.up === false ? 'down' : 'neutral'}`}>
                  {card.up === true && '↑'}
                  {card.up === false && '↓'}
                  {card.trend}
                </div>
              )}
            </div>

            <div className="card-info">
              <span className="card-value">{card.value}</span>
              <div className="card-labels-row">
                <span className="card-label">{card.label}</span>
                <span className="card-sub">{card.sub}</span>
              </div>
            </div>

            <div className={`card-decoration-glow ${card.color}`} />
            <div className={`card-decoration-shape ${card.color}`} />
          </div>
        ))}
      </div>

      {/* ── Middle Grid ────────────────────────────── */}
      <div className="middle-grid">
        {/* Department Activity Overview */}
        <div className="activity-card">
          <div className="activity-header">
            <div className="activity-title-group">
              <h3>Department Activity Overview</h3>
              <p className="activity-subtitle">Real-time performance analytics</p>
            </div>
            <div className="activity-actions">
              <div className="filter-wrapper">
                <select
                  className="activity-filter"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="filter-icon" />
              </div>
            </div>
          </div>

          <div className="activity-metrics-row">
            <div className="metric-item">
              <span className="m-label">Total Notice</span>
              <div className="m-value-group">
                <span className="m-value">12</span>
                <span className="m-trend up">+2</span>
              </div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="m-label">Total Tender</span>
              <div className="m-value-group">
                <span className="m-value">07</span>
                <span className="m-trend up">+1</span>
              </div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="m-label">Total Events</span>
              <div className="m-value-group">
                <span className="m-value">38</span>
                <span className="m-trend up">+4</span>
              </div>
            </div>
          </div>

          <div className="activity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 10 }} />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                  barSize={32}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#fff', stroke: '#4f46e5', strokeWidth: 3 }}
                  activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Access */}
        <div className="quick-access-card">
          <h3>Quick Access</h3>
          <div className="quick-access-list">
            {quickAccessItems.map((item, i) => (
              <button className="quick-access-item" key={i}>
                <div className={`qa-icon ${item.color}`}>
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span>{item.label}</span>
                <FontAwesomeIcon icon={faChevronRight} className="qa-arrow" />
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="events-card">
          <div className="events-card-header">
            <h3>Upcoming Events</h3>
            <button className="view-all-link">View All</button>
          </div>
          <div className="events-list">
            {upcomingEvents.map((evt, i) => (
              <div className="event-item" key={i}>
                <div className={`event-date-badge ${evt.variant}`}>
                  <span className="event-date-month">{evt.month}</span>
                  <span className="event-date-day">{evt.day}</span>
                </div>
                <div className="event-info">
                  <h4>{evt.title}</h4>
                  <p>{evt.dateStr}</p>
                  <p className="event-location">
                    <FontAwesomeIcon icon={faLocationDot} /> {evt.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-events">
            View All Events <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      {/* ── Bottom Grid ────────────────────────────── */}
      <div className="bottom-grid">
        {/* Recent Updates */}
        <div className="updates-card">
          <div className="updates-header">
            <h3>Recent Updates</h3>
            <button className="view-all-link">View All</button>
          </div>
          <div className="updates-table-wrap">
            <table className="updates-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((item, i) => (
                  <tr key={i}>
                    <td>{item.title}</td>
                    <td><span className={`type-badge ${item.typeCls}`}>{item.type}</span></td>
                    <td>{item.by}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Notices */}
        <div className="notices-card">
          <div className="notices-header">
            <h3>Recent Notices</h3>
            <button className="view-all-link">View All</button>
          </div>
          <div className="notices-list">
            {recentNotices.map((item, i) => (
              <div className="notice-item" key={i}>
                <div className="notice-icon">
                  <FontAwesomeIcon icon={faBullhorn} />
                </div>
                <span className="notice-text">{item.title}</span>
                <span className="notice-date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
