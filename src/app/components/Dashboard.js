'use client';
import { useApp } from '../context/AppContext';
import styles from './Dashboard.module.css';

const PLATFORM_COLORS = {
  LinkedIn: '#0077b5', Indeed: '#2164f3', Glassdoor: '#0caa41',
  Greenhouse: '#23a65e', Lever: '#4054b2', Workday: '#f26722',
};

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`glass ${styles.statCard}`} style={{ '--accent': accent }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
      <div className={styles.statGlow} />
    </div>
  );
}

function RecentActivity({ apps }) {
  if (!apps.length) return (
    <div className={styles.empty}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
      <p>No activity yet. Start the AI agent to begin applying!</p>
    </div>
  );
  return (
    <div className={styles.activityList}>
      {apps.slice(0, 8).map((a, i) => (
        <div key={i} className={styles.activityItem}>
          <div className={styles.activityDot} style={{
            background: a.status === 'applied' ? '#00d4aa' : a.status === 'failed' ? '#ff4757' : '#ff9f43'
          }} />
          <div className={styles.activityInfo}>
            <span className={styles.activityTitle}>{a.title}</span>
            <span className={styles.activityCompany}>{a.company}</span>
          </div>
          <div className={styles.activityRight}>
            <span className={`badge ${a.status === 'applied' ? 'badge-success' : a.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
              {a.status}
            </span>
            <span className={styles.activityPlatform}
              style={{ color: PLATFORM_COLORS[a.platform] || '#aaa' }}>
              {a.platform}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { state, scanJobs, autoApplyAll } = useApp();
  const { stats, scanning, applying, jobs, applications, lastScanned, automationRunning, profile } = state;

  const pending = jobs.filter(j => j.status === 'pending').length;
  const topMatches = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {profile.fullName?.split(' ')[0] || 'Agent'} 👋
          </h1>
          <p className={styles.subtitle}>
            {automationRunning
              ? '🟢 AI Agent is actively scanning and applying to jobs.'
              : 'Start the AI Agent to begin automated job discovery & applications.'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={scanJobs} disabled={scanning}>
            {scanning ? <><span className="animate-spin" style={{display:'inline-block'}}>⟳</span> Scanning...</> : '🔍 Scan Jobs'}
          </button>
          <button className="btn btn-primary" onClick={autoApplyAll} disabled={applying || !pending}>
            {applying ? '⚡ Applying...' : `⚡ Apply to ${pending} Jobs`}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <StatCard icon="📨" label="Total Applied"   value={stats.totalApplied}   sub="jobs submitted"          accent="#6c63ff" />
        <StatCard icon="✅" label="Success Rate"    value={`${stats.successRate}%`} sub="of applications sent"  accent="#00d4aa" />
        <StatCard icon="⭐" label="New Matches"     value={stats.newMatches}      sub="jobs ≥60% relevance"     accent="#54a0ff" />
        <StatCard icon="⚠️" label="Needs Attention" value={stats.pendingManual}   sub="manual action required"  accent="#ff9f43" />
      </div>

      {/* Middle row */}
      <div className={styles.midRow}>
        {/* Top Matches */}
        <div className={`glass ${styles.topMatches}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎯 Top Matches</h2>
            <span className="badge badge-primary">{topMatches.length} jobs</span>
          </div>
          {topMatches.length === 0 ? (
            <div className={styles.empty}><p>Run a scan to find matching jobs.</p></div>
          ) : topMatches.map(job => (
            <div key={job.id} className={styles.matchCard}>
              <div className={styles.matchLogo} style={{ background: job.color }}>{job.logo}</div>
              <div className={styles.matchInfo}>
                <div className={styles.matchTitle}>{job.title}</div>
                <div className={styles.matchCompany}>{job.company} · {job.location}</div>
                <div className={styles.matchSalary}>{job.salary}</div>
              </div>
              <div className={styles.matchScore}>
                <div className={styles.scoreNum}>{job.matchScore}%</div>
                <div className="progress-bar" style={{ width: 60 }}>
                  <div className="progress-fill" style={{ width: `${job.matchScore}%` }} />
                </div>
                <div className={styles.scorePlatform} style={{ color: PLATFORM_COLORS[job.platform] }}>{job.platform}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Stats */}
        <div className={`glass ${styles.platformStats}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📊 Platform Stats</h2>
          </div>
          {Object.entries(stats.platformStats).map(([platform, count]) => (
            <div key={platform} className={styles.platformRow}>
              <div className={styles.platformName} style={{ color: PLATFORM_COLORS[platform] }}>{platform}</div>
              <div className="progress-bar" style={{ flex: 1, margin: '0 10px' }}>
                <div className="progress-fill" style={{
                  width: `${stats.totalApplied ? Math.round((count/Math.max(stats.totalApplied,1))*100) : 0}%`,
                  background: PLATFORM_COLORS[platform]
                }} />
              </div>
              <div className={styles.platformCount}>{count}</div>
            </div>
          ))}
          {lastScanned && (
            <div className={styles.lastScan}>
              Last scan: {new Date(lastScanned).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`glass ${styles.activity}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>⚡ Recent Activity</h2>
          <span className="badge badge-blue">{applications.length} total</span>
        </div>
        <RecentActivity apps={applications} />
      </div>
    </div>
  );
}
