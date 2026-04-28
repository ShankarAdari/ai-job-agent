'use client';
import { useApp } from '../context/AppContext';
import styles from './Sidebar.module.css';

const NAV = [
  { id: 'dashboard',     icon: '⬡', label: 'Dashboard' },
  { id: 'jobs',          icon: '🔍', label: 'Job Matches' },
  { id: 'applications',  icon: '📋', label: 'Applications' },
  { id: 'profile',       icon: '👤', label: 'My Profile' },
  { id: 'notifications', icon: '🔔', label: 'Notifications' },
];

export default function Sidebar() {
  const { state, dispatch, startAutomation, stopAutomation } = useApp();
  const { stats, automationRunning, notifications, activeTab } = state;
  const unread = notifications.length;

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>AI</span>
        </div>
        <div>
          <div className={styles.logoTitle}>JobAgent</div>
          <div className={styles.logoSub}>AI-Powered</div>
        </div>
      </div>

      {/* Automation Toggle */}
      <div className={styles.automation}>
        <div className={styles.automationStatus}>
          <span className={`status-dot ${automationRunning ? 'online' : 'pending'}`} />
          <span className={styles.automationLabel}>{automationRunning ? 'Agent Active' : 'Agent Stopped'}</span>
        </div>
        <button
          className={`btn ${automationRunning ? 'btn-danger' : 'btn-success'} btn-sm`}
          onClick={automationRunning ? stopAutomation : startAutomation}
          style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
        >
          {automationRunning ? '⏹ Stop Agent' : '▶ Start Agent'}
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', payload: item.id })}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.id === 'notifications' && unread > 0 && (
              <span className={styles.badge}>{unread > 9 ? '9+' : unread}</span>
            )}
            {item.id === 'applications' && stats.pendingManual > 0 && (
              <span className={`${styles.badge} ${styles.badgeWarn}`}>{stats.pendingManual}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.qStat}>
          <span className={styles.qNum}>{stats.totalApplied}</span>
          <span className={styles.qLabel}>Applied</span>
        </div>
        <div className={styles.qStat}>
          <span className={styles.qNum}>{stats.newMatches}</span>
          <span className={styles.qLabel}>Matches</span>
        </div>
        <div className={styles.qStat}>
          <span className={styles.qNum}>{stats.successRate}%</span>
          <span className={styles.qLabel}>Success</span>
        </div>
      </div>

      {/* Profile mini */}
      <div className={styles.profileMini}>
        <div className={styles.avatar}>
          {state.profile.fullName ? state.profile.fullName.slice(0,2).toUpperCase() : '?'}
        </div>
        <div>
          <div className={styles.profileName}>{state.profile.fullName || 'Set up profile'}</div>
          <div className={styles.profileEmail}>{state.profile.email || 'No email set'}</div>
        </div>
      </div>
    </aside>
  );
}
