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
  const { activeTab } = state;

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>

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
