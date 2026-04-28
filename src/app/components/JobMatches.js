'use client';
import { useState } from 'react';
import { useApp, generateCoverLetter } from '../context/AppContext';
import styles from './JobMatches.module.css';

const PLATFORM_COLORS = {
  LinkedIn:'#0077b5','Indeed':'#2164f3','Indeed India':'#e31b23',
  Naukri:'#ff7555',Glassdoor:'#0caa41',Greenhouse:'#23a65e',Lever:'#4054b2',Workday:'#f26722',
};

function JobCard({ job, onMarkApplied, onMarkSaved, profile }) {
  const [expanded, setExpanded] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [copied, setCopied] = useState(false);

  const scoreColor = job.matchScore >= 85 ? '#00d4aa' : job.matchScore >= 70 ? '#6c63ff' : job.matchScore >= 55 ? '#ff9f43' : '#ff4757';
  const platColor = PLATFORM_COLORS[job.platform] || '#6c63ff';
  const coverLetter = generateCoverLetter(profile, job);

  const copy = () => navigator.clipboard.writeText(coverLetter).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });

  const statusBadge = () => {
    if (job.status === 'applied') return <span className="badge badge-success">✓ Applied</span>;
    if (job.status === 'saved')   return <span className="badge badge-warning">🔖 Saved</span>;
    return null;
  };

  return (
    <div className={`${styles.jobCard} ${job.status === 'applied' ? styles.appliedCard : ''}`}>
      {job.status === 'applied' && <div className={styles.appliedStripe} />}

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
          <span className="badge" style={{ background:`${platColor}22`, color:platColor, borderColor:`${platColor}44` }}>
            {job.platform}
          </span>
          {statusBadge()}
        </div>
      </div>

      {/* Primary action row */}
      <div className={styles.cardBottom}>
        {/* OPEN & APPLY — real link */}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.applyBtn}
          onClick={() => job.status !== 'applied' && setTimeout(() => onMarkApplied(job.id), 3000)}
        >
          🚀 Open & Apply on {job.platform}
        </a>

        {/* Company careers page */}
        <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          🏢 Careers Page
        </a>

        {/* Save toggle */}
        <button className="btn btn-secondary btn-sm" onClick={() => onMarkSaved(job.id)}>
          {job.status === 'saved' ? '🔖 Saved' : '🔖 Save'}
        </button>

        {/* Mark applied manually */}
        {job.status !== 'applied' && (
          <button className="btn btn-secondary btn-sm" onClick={() => onMarkApplied(job.id)}>
            ✓ Mark Applied
          </button>
        )}

        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Less' : '▼ Details'}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className={styles.expandedPanel}>

          {/* How to Apply guide */}
          <div className={styles.howToBox}>
            <div className={styles.sectionTitle}>📋 How to Apply</div>
            <ol className={styles.stepsList}>
              <li>Click <strong>"Open & Apply on {job.platform}"</strong> above — it opens the real job listing</li>
              <li>Create / log in to your account on {job.platform}</li>
              <li>Click the apply button on the job listing page</li>
              <li>Upload your resume (PDF/DOCX) when prompted</li>
              <li>Paste the pre-written cover letter below if required</li>
              <li>Submit — then come back and click <strong>"✓ Mark Applied"</strong></li>
            </ol>
          </div>

          {/* Cover letter */}
          <div className={styles.coverSection}>
            <div className={styles.coverHeader}>
              <span className={styles.sectionTitle}>📄 Pre-Written Cover Letter</span>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowCover(c => !c)}>
                  {showCover ? 'Hide' : 'Show'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={copy}>
                  {copied ? '✅ Copied!' : '📋 Copy Letter'}
                </button>
              </div>
            </div>
            {showCover && <pre className={styles.coverText}>{coverLetter}</pre>}
          </div>

          {/* Real links */}
          <div className={styles.realLinkBox}>
            <div className={styles.sectionTitle}>🔗 Verified Links</div>
            <div className={styles.realLinks}>
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span>🔗</span>
                <div>
                  <div className={styles.realLinkTitle}>Job Search on {job.platform}</div>
                  <div className={styles.realLinkUrl}>{job.applyUrl}</div>
                </div>
                <span>↗</span>
              </a>
              <a href={job.careerUrl} target="_blank" rel="noopener noreferrer" className={styles.realLink}>
                <span>🏢</span>
                <div>
                  <div className={styles.realLinkTitle}>{job.company} Official Careers</div>
                  <div className={styles.realLinkUrl}>{job.careerUrl}</div>
                </div>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Skills match */}
          <div>
            <div className={styles.sectionTitle}>🧠 Required Skills</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
              {job.description.split(', ').map(s => (
                <span key={s} className="tag"
                  style={profile.skills?.includes(s) ? { borderColor:'#00d4aa', color:'#00d4aa', background:'rgba(0,212,170,0.08)' } : {}}>
                  {profile.skills?.includes(s) ? '✓ ' : ''}{s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobMatches() {
  const { state, scanJobs, markApplied, markSaved } = useApp();
  const { jobs, scanning, profile } = state;
  const [filter, setFilter] = useState('all');
  const [minScore, setMinScore] = useState(50);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');

  const filtered = jobs
    .filter(j => filter === 'all' || j.status === filter)
    .filter(j => j.matchScore >= minScore)
    .filter(j => platform === 'all' || j.platform === platform)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.matchScore - a.matchScore);

  const platforms = [...new Set(jobs.map(j => j.platform))];
  const applied = jobs.filter(j => j.status === 'applied').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🔍 Job Matches</h1>
          <p className={styles.subtitle}>
            {jobs.length} real jobs across {platforms.length} platforms · {applied} applied · {filtered.length} showing
          </p>
        </div>
        <button className="btn btn-primary" onClick={scanJobs} disabled={scanning}>
          {scanning ? '⟳ Searching…' : '🔄 Find Jobs'}
        </button>
      </div>

      {/* Honest disclaimer */}
      <div className={styles.disclaimer}>
        <span>ℹ️</span>
        <div>
          <strong>How this works:</strong> Click <strong>"Open & Apply"</strong> on any job to go directly to the real listing on LinkedIn, Indeed, Naukri etc. and apply yourself.
          The app will auto-track it after 3 seconds, or click <strong>"✓ Mark Applied"</strong> manually.
          Your generated cover letter is ready to copy-paste.
        </div>
      </div>

      {/* Filters */}
      <div className={`glass-sm ${styles.filters}`}>
        <input className="input" placeholder="🔍 Search role or company…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ maxWidth:220 }} />
        <select className="select" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth:140 }}>
          <option value="all">All Jobs</option>
          <option value="pending">Not Applied</option>
          <option value="applied">Applied</option>
          <option value="saved">Saved</option>
        </select>
        <select className="select" value={platform} onChange={e => setPlatform(e.target.value)} style={{ maxWidth:160 }}>
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
          <span style={{ fontSize:20 }}>⟳</span>
          <div>
            <div style={{ fontWeight:700 }}>Searching job boards…</div>
            <div style={{ fontSize:12, opacity:0.6 }}>LinkedIn · Indeed · Indeed India · Naukri · Greenhouse · Lever · Workday</div>
          </div>
        </div>
      )}

      {!scanning && jobs.length === 0 && (
        <div className={`glass ${styles.empty}`}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔭</div>
          <h2>No jobs loaded yet</h2>
          <p>Click "Find Jobs" to load matching opportunities from 7 platforms.</p>
          <button className="btn btn-primary" onClick={scanJobs} style={{ marginTop:16 }}>🔍 Find Jobs Now</button>
        </div>
      )}

      <div className={styles.jobList}>
        {filtered.map(job => (
          <JobCard key={job.id} job={job} onMarkApplied={markApplied}
            onMarkSaved={markSaved} profile={profile} />
        ))}
      </div>
    </div>
  );
}
