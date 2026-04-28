'use client';
import styles from './AppShell.module.css';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import JobMatches from './JobMatches';
import Applications from './Applications';
import ProfileView from './ProfileView';
import NotificationsView from './NotificationsView';
import Toast from './Toast';
import { useApp } from '../context/AppContext';

export default function AppShell() {
  const { state } = useApp();
  const { activeTab, applying, currentlyApplying, jobs } = state;

  const applyingJob = jobs.find(j => j.id === currentlyApplying);

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        {/* Applying overlay banner */}
        {applying && applyingJob && (
          <div className={styles.applyingBanner}>
            <span className="animate-spin" style={{ display: 'inline-block', fontSize: 16 }}>⟳</span>
            <span>
              AI agent is submitting your application to{' '}
              <strong>{applyingJob.title}</strong> at{' '}
              <strong>{applyingJob.company}</strong> via {applyingJob.platform}…
            </span>
          </div>
        )}

        {/* Views */}
        <div className={styles.view}>
          {activeTab === 'dashboard'     && <Dashboard />}
          {activeTab === 'jobs'          && <JobMatches />}
          {activeTab === 'applications'  && <Applications />}
          {activeTab === 'profile'       && <ProfileView />}
          {activeTab === 'notifications' && <NotificationsView />}
        </div>
      </main>

      <Toast />
    </div>
  );
}
