'use client';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Toast.module.css';

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const COLORS = { success: '#00d4aa', error: '#ff4757', warning: '#ff9f43', info: '#54a0ff' };

export default function Toast() {
  const { state, dispatch } = useApp();
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const latest = state.notifications.slice(0, 4);
    setVisible(latest);
  }, [state.notifications]);

  const dismiss = (id) => dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });

  return (
    <div className="toast">
      {visible.map(n => (
        <div
          key={n.id}
          className={`${styles.toast} animate-fade-in-up`}
          style={{ '--accent': COLORS[n.type] || COLORS.info }}
        >
          <div className={styles.icon} style={{ background: `${COLORS[n.type]}22`, color: COLORS[n.type] }}>
            {ICONS[n.type]}
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{n.title}</div>
            <div className={styles.msg}>{n.message}</div>
            {n.jobUrl && (
              <a href={n.jobUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Complete Manually →
              </a>
            )}
          </div>
          <button className={styles.close} onClick={() => dismiss(n.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
