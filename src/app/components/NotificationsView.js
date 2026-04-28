'use client';
import { useApp } from '../context/AppContext';
import styles from './NotificationsView.module.css';

const TYPE_CONFIG = {
  success: { icon: '✓', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', label: 'Success' },
  error:   { icon: '✕', color: '#ff4757', bg: 'rgba(255,71,87,0.12)',  label: 'Error'   },
  warning: { icon: '⚠', color: '#ff9f43', bg: 'rgba(255,159,67,0.12)',label: 'Warning' },
  info:    { icon: 'ℹ', color: '#54a0ff', bg: 'rgba(84,160,255,0.12)', label: 'Info'   },
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60)  return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  return `${Math.floor(diff/3600)}h ago`;
}

export default function NotificationsView() {
  const { state, dispatch } = useApp();
  const { notifications } = state;

  const clearAll = () => notifications.forEach(n => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🔔 Notifications</h1>
          <p className={styles.subtitle}>{notifications.length} notifications</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={clearAll}>Clear All</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className={`glass ${styles.empty}`}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔕</div>
          <h2>All caught up!</h2>
          <p>Notifications will appear here when the AI agent finds jobs or submits applications.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            return (
              <div key={n.id} className={styles.card} style={{ '--accent': cfg.color }}>
                <div className={styles.iconBox} style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className={styles.content}>
                  <div className={styles.notifTitle}>{n.title}</div>
                  <div className={styles.notifMsg}>{n.message}</div>
                  {n.jobUrl && (
                    <a href={n.jobUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Complete Application →
                    </a>
                  )}
                </div>
                <div className={styles.right}>
                  <div className={styles.timeAgo}>{timeAgo(n.timestamp)}</div>
                  <span className={`badge`} style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}44` }}>
                    {cfg.label}
                  </span>
                  <button className={styles.dismiss} onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id })}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
