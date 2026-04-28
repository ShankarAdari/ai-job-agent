'use client';
import { useState } from 'react';
import { useApp, generateCoverLetter } from '../context/AppContext';
import styles from './JobMatches.module.css';

const PLATFORM_COLORS = {
  LinkedIn: '#0077b5', Indeed: '#2164f3', 'Indeed India': '#e31b23',
  Naukri: '#ff7555', Glassdoor: '#0caa41', Greenhouse: '#23a65e',
  Lever: '#4054b2', Workday: '#f26722',
};

const APPLY_TYPE_INFO = {
  easy: { label: '⚡ Auto Apply', color: '#00d4aa', desc: 'Agent will submit automatically' },
  guided: { label: '📋 Guided Apply', color: '#ff9f43', desc: 'Pre-filled form + cover letter ready' },
  manual: { label: '🔗 Manual Apply', color: '#ff6584', desc: 'Opens company careers page' },
};

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  cls: 'badge-blue'   },
  applied:  { label: 'Applied',  cls: 'badge-success' },
  failed:   { label: 'Failed',   cls: 'badge-danger'  },
  manual:   { label: 'Action Needed', cls: 'badge-warning' },
};

const GUIDED_STEPS = [
  '1️⃣ Click "Open Application Page" below',
  '2️⃣ Create / log in to your account on the platform',
  '3️⃣ Copy the pre-generated cover letter and paste it',
  '4️⃣ Upload your resume from your downloads folder',
  '5️⃣ Fill any remaining fields and submit',
];

function JobCard({ job, onApply, applying, profile }) {
  const [expanded, setExpanded] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [copied, setCopied] = useState(false);
  const isApplying = applying === job.id;
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.pending;
  const applyInfo = APPLY_TYPE_INFO[job.applyType] || APPLY_TYPE_INFO.manual;

  const scoreColor =
    job.matchScore >= 85 ? '#00d4aa' :
    job.matchScore >= 70 ? '#6c63ff' :
    job.matchScore >= 55 ? '#ff9f43' : '#ff4757';

  const coverLetter = generateCoverLetter(profile, job);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`${styles.jobCard} ${isApplying ? styles.applying : ''}`}>
      {isApplying && <div className={styles.applyingBar} />}

      <div className={styles.cardTop}>
        <div className={styles.logo} style={{ background: job.color }}>{job.logo}</div>
        <div className={styles.info}>
          <div className={styles.jobTitle}>{job.title}</div>
          <div className={styles.company}>{job.company}</div>
          <div className={styles.meta}>
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
            <span>🕐 {job.postedHoursAgo}h ago</span>
          </div>
        </div>
        <div className={styles.scoreBlock}>
          <div className={styles.scoreCircle} style={{ '--score-color': scoreColor }}>
            <span className={styles.scoreNum}>{job.matchScore}%</span>
            <span className={styles.scoreLabel}>match</span>
          </div>
        </div>
        <div className={styles.right}>
          <span className="badge" style={{ background: `${PLATFORM_COLORS[job.platform] || '#6c63ff'}22`, color: PLATFORM_COLORS[job.platform] || '#6c63ff', borderColor: `${PLATFORM_COLORS[job.platform] || '#6c63ff'}44` }}>
            {job.platform}
          </span>
          <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
          <span className={styles.applyTypeBadge} style={{ color: applyInfo.color, borderColor: `${applyInfo.color}44`, background: `${applyInfo.color}11` }}>
            {applyInfo.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.cardBottom}>
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Less' : '▼ Details'}
        </button>
        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          🔗 View on {job.platform}
        </a>
        <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          🏢 {job.company} Careers
        </a>
        {job.status === 'pending' && (
          <button className="btn btn-primary btn-sm" onClick={() => onApply(job)} disabled={!!applying}>
            {isApplying ? <><span style={{display:'inline-block',marginRight:4}}>⟳</span>Applying…</> : applyInfo.label}
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

      {/* Expanded panel */}
      {expanded && (
        <div className={styles.description}>
          <div className={styles.descTitle}>Job Description</div>
          <p>{job.description}</p>

          {/* Apply type banner */}
          <div className={styles.applyBanner} style={{ borderColor: `${applyInfo.color}44`, background: `${applyInfo.color}0d` }}>
            <div className={styles.applyBannerTitle} style={{ color: applyInfo.color }}>{applyInfo.label} — {applyInfo.desc}</div>
            {job.applyType === 'easy' && <div className={styles.applyBannerSub}>✅ Agent submits directly via platform API/Easy Apply flow. No action needed from you.</div>}
            {job.applyType === 'guided' && (
              <div>
                <div className={styles.applyBannerSub}>Follow these steps — your cover letter is pre-generated:</div>
                <ol className={styles.guidedSteps}>
                  {GUIDED_STEPS.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
                <div className={styles.guidedActions}>
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    🚀 Open Application Page
                  </a>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowCover(c => !c)}>
                    {showCover ? 'Hide' : '📄 Show'} Cover Letter
                  </button>
                </div>
              </div>
            )}
            {job.applyType === 'manual' && (
              <div className={styles.applyBannerSub}>
                This platform uses a protected ATS (Workday/custom). Click below to open the job page and apply directly.
                <div style={{ marginTop: 8 }}>
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    🔗 Open & Apply Manually
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Cover letter */}
          {showCover && (
            <div className={styles.coverBox}>
              <div className={styles.coverHeader}>
                <span className={styles.descTitle}>📄 Generated Cover Letter</span>
                <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre className={styles.coverText}>{coverLetter}</pre>
            </div>
          )}

          {/* Real links */}
          <div className={styles.realLinkBox}>
            <div className={styles.descTitle} style={{ marginBottom: 10 }}>🔍 Real Job Links — Click to Verify</div>
            <div className={styles.realLinks}>
              <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span className={styles.realLinkIcon}>🔗</span>
                <div><div className={styles.realLinkTitle}>View on {job.platform}</div><div className={styles.realLinkUrl}>{job.applicationUrl}</div></div>
                <span className={styles.realLinkArrow}>↗</span>
              </a>
              <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span className={styles.realLinkIcon}>🏢</span>
                <div><div className={styles.realLinkTitle}>{job.company} Official Careers Page</div><div className={styles.realLinkUrl}>{job.careerUrl}</div></div>
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
  const [minScore, setMinScore] = useState(55);
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
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🔍 Job Matches</h1>
          <p className={styles.subtitle}>
            {jobs.length} jobs across {platforms.length} platforms · {filtered.length} shown · posted within 48h
          </p>
        </div>
        <button className="btn btn-primary" onClick={scanJobs} disabled={scanning}>
          {scanning ? <><span style={{display:'inline-block'}}>⟳</span> Scanning…</> : '🔄 Refresh Scan'}
        </button>
      </div>

      <div className={`glass-sm ${styles.filters}`}>
        <input className="input" placeholder="🔍 Search role or company…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ maxWidth: 220 }} />
        <select className="select" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 140 }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="applied">Applied</option>
          <option value="manual">Action Needed</option>
        </select>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="all">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <div className={styles.sliderGroup}>
          <label className={styles.sliderLabel}>Min Match: <strong>{minScore}%</strong></label>
          <input type="range" min={40} max={95} value={minScore}
            onChange={e => setMinScore(+e.target.value)} className={styles.slider} />
        </div>
      </div>

      {scanning && (
        <div className={`glass ${styles.scanningBanner}`}>
          <span style={{display:'inline-block', fontSize:20}}>⟳</span>
          <div>
            <div style={{ fontWeight:700 }}>Scanning 7 platforms…</div>
            <div style={{ fontSize:12, opacity:0.6 }}>LinkedIn · Indeed · Indeed India · Naukri · Glassdoor · Greenhouse · Lever · Workday</div>
          </div>
        </div>
      )}

      {!scanning && filtered.length === 0 && (
        <div className={`glass ${styles.empty}`}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔭</div>
          <h2>No matches found</h2>
          <p>Try lowering the minimum match score or run a new scan.</p>
          <button className="btn btn-primary" onClick={scanJobs} style={{ marginTop:16 }}>🔍 Scan Now</button>
        </div>
      )}

      <div className={styles.jobList}>
        {filtered.map(job => (
          <JobCard key={job.id} job={job} onApply={applyToJob}
            applying={applying ? currentlyApplying : null} profile={profile} />
        ))}
      </div>
    </div>
  );
}
