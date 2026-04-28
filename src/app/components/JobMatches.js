'use client';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './JobMatches.module.css';

const PLATFORM_COLORS = {
  LinkedIn: '#0077b5', Indeed: '#2164f3', Glassdoor: '#0caa41',
  Greenhouse: '#23a65e', Lever: '#4054b2', Workday: '#f26722',
};

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  cls: 'badge-blue'    },
  applied:  { label: 'Applied',  cls: 'badge-success'  },
  failed:   { label: 'Failed',   cls: 'badge-danger'   },
  manual:   { label: 'Manual',   cls: 'badge-warning'  },
};

function JobCard({ job, onApply, applying }) {
  const [expanded, setExpanded] = useState(false);
  const isApplying = applying === job.id;
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.pending;

  const scoreColor =
    job.matchScore >= 85 ? '#00d4aa' :
    job.matchScore >= 70 ? '#6c63ff' :
    job.matchScore >= 55 ? '#ff9f43' : '#ff4757';

  return (
    <div className={`${styles.jobCard} ${isApplying ? styles.applying : ''}`}>
      {isApplying && <div className={styles.applyingBar} />}

      <div className={styles.cardTop}>
        {/* Logo */}
        <div className={styles.logo} style={{ background: job.color }}>
          {job.logo}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.jobTitle}>{job.title}</div>
          <div className={styles.company}>{job.company}</div>
          <div className={styles.meta}>
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
            <span>🕐 {job.postedHoursAgo}h ago</span>
          </div>
        </div>

        {/* Score */}
        <div className={styles.scoreBlock}>
          <div className={styles.scoreCircle} style={{ '--score-color': scoreColor }}>
            <span className={styles.scoreNum}>{job.matchScore}%</span>
            <span className={styles.scoreLabel}>match</span>
          </div>
        </div>

        {/* Platform & status */}
        <div className={styles.right}>
          <span className="badge" style={{ background: `${PLATFORM_COLORS[job.platform]}22`, color: PLATFORM_COLORS[job.platform], borderColor: `${PLATFORM_COLORS[job.platform]}44` }}>
            {job.platform}
          </span>
          <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
          {job.easyApply && <span className="badge badge-success" style={{ fontSize: 10 }}>⚡ Easy Apply</span>}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.cardBottom}>
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Less' : '▼ Details'}
        </button>

        {/* Real verifiable links — always visible */}
        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"
          className="btn btn-secondary btn-sm" title={`View on ${job.platform}`}>
          🔗 View on {job.platform}
        </a>
        <a href={job.careerUrl} target="_blank" rel="noopener noreferrer"
          className="btn btn-secondary btn-sm" title="Company careers page">
          🏢 {job.company} Careers
        </a>

        {job.status === 'pending' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onApply(job)}
            disabled={!!applying}
          >
            {isApplying ? <><span className="animate-spin" style={{display:'inline-block',marginRight:4}}>⟳</span>Applying…</> : '⚡ Auto Apply'}
          </button>
        )}
        {(job.status === 'failed' || job.status === 'manual') && (
          <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm">
            ⚠ Complete Manually
          </a>
        )}
        {job.status === 'applied' && (
          <span className="badge badge-success" style={{ padding: '6px 12px' }}>✓ Application Sent</span>
        )}
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className={styles.description}>
          <div className={styles.descTitle}>Job Description</div>
          <p>{job.description}</p>

          <div className={styles.realLinkBox}>
            <div className={styles.descTitle} style={{ marginBottom: 10 }}>🔍 Real Job Links — Click to Verify</div>
            <div className={styles.realLinks}>
              <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span className={styles.realLinkIcon}>🔗</span>
                <div>
                  <div className={styles.realLinkTitle}>View on {job.platform}</div>
                  <div className={styles.realLinkUrl}>{job.applicationUrl}</div>
                </div>
                <span className={styles.realLinkArrow}>↗</span>
              </a>
              <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span className={styles.realLinkIcon}>🏢</span>
                <div>
                  <div className={styles.realLinkTitle}>{job.company} Official Careers Page</div>
                  <div className={styles.realLinkUrl}>{job.careerUrl}</div>
                </div>
                <span className={styles.realLinkArrow}>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobMatches() {
  const { state, scanJobs, applyToJob } = useApp();
  const { jobs, scanning, applying, currentlyApplying, profile } = state;

  const [filter, setFilter] = useState('all');
  const [minScore, setMinScore] = useState(60);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');

  const filtered = jobs
    .filter(j => filter === 'all' || j.status === filter)
    .filter(j => j.matchScore >= minScore)
    .filter(j => platform === 'all' || j.platform === platform)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.matchScore - a.matchScore);

  const platforms = [...new Set(jobs.map(j => j.platform))];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🔍 Job Matches</h1>
          <p className={styles.subtitle}>
            {jobs.length} jobs found · filtered to {filtered.length} · posted within 48 hours
          </p>
        </div>
        <button className="btn btn-primary" onClick={scanJobs} disabled={scanning}>
          {scanning
            ? <><span className="animate-spin" style={{display:'inline-block'}}>⟳</span> Scanning…</>
            : '🔄 Refresh Scan'}
        </button>
      </div>

      {/* Filters */}
      <div className={`glass-sm ${styles.filters}`}>
        <input
          className="input"
          placeholder="🔍 Search role or company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <select className="select" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="applied">Applied</option>
          <option value="manual">Manual</option>
          <option value="failed">Failed</option>
        </select>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div className={styles.sliderGroup}>
          <label className={styles.sliderLabel}>Min Match: <strong>{minScore}%</strong></label>
          <input type="range" min={40} max={95} value={minScore}
            onChange={e => setMinScore(+e.target.value)}
            className={styles.slider}
          />
        </div>
      </div>

      {/* Scanning state */}
      {scanning && (
        <div className={`glass ${styles.scanningBanner}`}>
          <span className="animate-spin" style={{display:'inline-block', fontSize:20}}>⟳</span>
          <div>
            <div style={{ fontWeight: 700 }}>Scanning platforms…</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Crawling LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, Workday…</div>
          </div>
        </div>
      )}

      {/* Job cards */}
      {!scanning && filtered.length === 0 && (
        <div className={`glass ${styles.empty}`}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
          <h2>No matches found</h2>
          <p>Try lowering the minimum match score or run a new scan.</p>
          <button className="btn btn-primary" onClick={scanJobs} style={{ marginTop: 16 }}>
            🔍 Scan Now
          </button>
        </div>
      )}

      <div className={styles.jobList}>
        {filtered.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onApply={applyToJob}
            applying={applying ? currentlyApplying : null}
          />
        ))}
      </div>
    </div>
  );
}
