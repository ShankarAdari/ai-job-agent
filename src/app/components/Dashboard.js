'use client';
import { useApp } from '../context/AppContext';
import styles from './Dashboard.module.css';

const PLATFORM_COLORS = {
  LinkedIn:'#0077b5', Indeed:'#2164f3', 'Indeed India':'#e31b23',
  Naukri:'#ff7555', Glassdoor:'#0caa41', Greenhouse:'#23a65e',
  Lever:'#4054b2', Workday:'#f26722',
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
      <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
      <p>No applications tracked yet. Click "Open & Apply" on any job, then mark it as Applied.</p>
    </div>
  );
  return (
    <div className={styles.activityList}>
      {apps.slice(0, 8).map((a, i) => (
        <div key={i} className={styles.activityItem}>
          <div className={styles.activityDot} style={{ background: '#00d4aa' }} />
          <div className={styles.activityInfo}>
            <span className={styles.activityTitle}>{a.title}</span>
            <span className={styles.activityCompany}>{a.company}</span>
          </div>
          <div className={styles.activityRight}>
            <span className="badge badge-success">Applied ✓</span>
            <span className={styles.activityPlatform} style={{ color: PLATFORM_COLORS[a.platform] || '#aaa' }}>
              {a.platform}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { state, scanJobs, dispatch } = useApp();
  const { stats, scanning, jobs, applications, lastScanned, profile } = state;

  const topMatches = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const savedJobs  = jobs.filter(j => j.status === 'saved').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            {profile.fullName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className={styles.subtitle}>
            {jobs.length > 0
              ? `${jobs.length} jobs loaded across 7 platforms · ${stats.totalApplied} applied · ${savedJobs} saved`
              : 'Click "Find Jobs" to load real job listings from LinkedIn, Indeed, Naukri and more.'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-primary" onClick={scanJobs} disabled={scanning}>
            {scanning ? '⟳ Searching…' : '🔍 Find Jobs'}
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch({ type:'SET_TAB', payload:'jobs' })}>
            📋 View All Jobs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <StatCard icon="📨" label="Applied"       value={stats.totalApplied}           sub="jobs you applied to"         accent="#6c63ff" />
        <StatCard icon="🔖" label="Saved"         value={savedJobs}                    sub="bookmarked for later"        accent="#ff9f43" />
        <StatCard icon="🔍" label="Jobs Found"    value={stats.newMatches}             sub="matching your profile"       accent="#54a0ff" />
        <StatCard icon="📊" label="Pending"       value={pendingJobs}                  sub="not yet applied"             accent="#00d4aa" />
      </div>

      {/* Middle row */}
      <div className={styles.midRow}>
        {/* Top Matches */}
        <div className={`glass ${styles.topMatches}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎯 Top Matches</h2>
            <button className="btn btn-secondary btn-sm"
              onClick={() => dispatch({ type:'SET_TAB', payload:'jobs' })}>
              View All →
            </button>
          </div>
          {topMatches.length === 0 ? (
            <div className={styles.empty}>
              <p>Click "Find Jobs" to discover matching roles.</p>
              <button className="btn btn-primary btn-sm" onClick={scanJobs} style={{ marginTop:12 }} disabled={scanning}>
                {scanning ? '⟳ Searching…' : '🔍 Find Jobs Now'}
              </button>
            </div>
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
                <div className="progress-bar" style={{ width:60 }}>
                  <div className="progress-fill" style={{ width:`${job.matchScore}%` }} />
                </div>
                <div className={styles.scorePlatform} style={{ color: PLATFORM_COLORS[job.platform] }}>
                  {job.platform}
                </div>
              </div>
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-sm" style={{ flexShrink:0 }}>
                Apply →
              </a>
            </div>
          ))}
        </div>

        {/* Platform breakdown */}
        <div className={`glass ${styles.platformStats}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📊 Applied by Platform</h2>
          </div>
          {Object.entries(stats.platformStats).map(([platform, count]) => (
            <div key={platform} className={styles.platformRow}>
              <div className={styles.platformName} style={{ color: PLATFORM_COLORS[platform] || '#aaa' }}>
                {platform}
              </div>
              <div className="progress-bar" style={{ flex:1, margin:'0 10px' }}>
                <div className="progress-fill" style={{
                  width:`${stats.totalApplied ? Math.round((count / Math.max(stats.totalApplied,1)) * 100) : 0}%`,
                  background: PLATFORM_COLORS[platform] || '#6c63ff'
                }} />
              </div>
              <div className={styles.platformCount}>{count}</div>
            </div>
          ))}
          {lastScanned && (
            <div className={styles.lastScan}>Last search: {new Date(lastScanned).toLocaleTimeString()}</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`glass ${styles.activity}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>✅ Applications Tracker</h2>
          <span className="badge badge-blue">{applications.length} tracked</span>
        </div>
        <RecentActivity apps={applications} />
      </div>
    </div>
  );
}
