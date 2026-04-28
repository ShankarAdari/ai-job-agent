'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Applications.module.css';

const PLATFORM_COLORS = {
  LinkedIn: '#0077b5', Indeed: '#2164f3', Glassdoor: '#0caa41',
  Greenhouse: '#23a65e', Lever: '#4054b2', Workday: '#f26722',
};

const STATUS_CONFIG = {
  applied: { label: 'Applied',  icon: '✓', color: '#00d4aa' },
  failed:  { label: 'Failed',   icon: '✕', color: '#ff4757' },
  manual:  { label: 'Manual',   icon: '⚠', color: '#ff9f43' },
  pending: { label: 'Pending',  icon: '…', color: '#54a0ff' },
};

export default function Applications() {
  const { state } = useApp();
  const { applications, stats } = state;
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter);

  const grouped = filtered.reduce((acc, a) => {
    const d = new Date(a.timestamp).toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
    if (!acc[d]) acc[d] = [];
    acc[d].push(a);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📋 Applications</h1>
          <p className={styles.subtitle}>{applications.length} total applications tracked</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid-4">
        {[
          { key:'applied', label:'Submitted',      color:'#00d4aa', icon:'✓' },
          { key:'manual',  label:'Needs Attention', color:'#ff9f43', icon:'⚠' },
          { key:'failed',  label:'Failed',          color:'#ff4757', icon:'✕' },
          { key:'all',     label:'Total',           color:'#6c63ff', icon:'📋' },
        ].map(s => {
          const count = s.key === 'all' ? applications.length : applications.filter(a => a.status === s.key).length;
          return (
            <button
              key={s.key}
              className={`glass ${styles.summaryCard} ${filter === s.key ? styles.summaryActive : ''}`}
              onClick={() => setFilter(s.key)}
              style={{ '--accent': s.color }}
            >
              <div className={styles.summaryIcon} style={{ color: s.color }}>{s.icon}</div>
              <div className={styles.summaryNum}>{count}</div>
              <div className={styles.summaryLabel}>{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Success rate bar */}
      {applications.length > 0 && (
        <div className={`glass ${styles.successBar}`}>
          <div className={styles.successLabel}>
            <span>Overall Success Rate</span>
            <span style={{ color: '#00d4aa', fontWeight: 700 }}>{stats.successRate}%</span>
          </div>
          <div className="progress-bar" style={{ height: 10, marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${stats.successRate}%` }} />
          </div>
          <div className={styles.successHint}>
            {applications.filter(a=>a.status==='applied').length} applied · {applications.filter(a=>a.status==='failed').length} failed · {applications.filter(a=>a.status==='manual').length} manual
          </div>
        </div>
      )}

      {/* Applications list */}
      {Object.keys(grouped).length === 0 ? (
        <div className={`glass ${styles.empty}`}>
          <div style={{ fontSize: 52 }}>📭</div>
          <h2>No applications yet</h2>
          <p>Run the AI Agent to start submitting applications automatically.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, apps]) => (
          <div key={date} className={styles.group}>
            <div className={styles.groupDate}>{date}</div>
            <div className={styles.appList}>
              {apps.map((app, i) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                return (
                  <div key={i} className={styles.appRow}>
                    <div className={styles.statusIcon} style={{ background: `${cfg.color}22`, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className={styles.appInfo}>
                      <div className={styles.appTitle}>{app.title}</div>
                      <div className={styles.appCompany}>{app.company}</div>
                    </div>
                    <div className={styles.appMeta}>
                      <span className="badge" style={{
                        background: `${PLATFORM_COLORS[app.platform]}22`,
                        color: PLATFORM_COLORS[app.platform],
                        borderColor: `${PLATFORM_COLORS[app.platform]}44`
                      }}>
                        {app.platform}
                      </span>
                      <span className={styles.appTime}>
                        {new Date(app.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={styles.appStatus}>
                      <span className={`badge ${app.status === 'applied' ? 'badge-success' : app.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                        {cfg.label}
                      </span>
                      {/* Always show real verifiable links */}
                      <div className={styles.appLinks}>
                        {app.applicationUrl && (
                          <a href={app.applicationUrl} target="_blank" rel="noopener noreferrer" className={styles.appLink}>
                            🔗 View on {app.platform}
                          </a>
                        )}
                        {app.careerUrl && (
                          <a href={app.careerUrl} target="_blank" rel="noopener noreferrer" className={styles.appLink}>
                            🏢 {app.company} Careers
                          </a>
                        )}
                      </div>
                      {(app.status === 'failed' || app.status === 'manual') && app.careerUrl && (
                        <a href={app.careerUrl} target="_blank" rel="noopener noreferrer" className={styles.manualLink}>
                          ⚠ Complete Manually →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
