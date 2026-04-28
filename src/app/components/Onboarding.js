'use client';
import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Onboarding.module.css';

const STEPS = [
  { id: 0, icon: '👋', title: 'Welcome',        sub: 'Let\'s set up your AI Job Agent' },
  { id: 1, icon: '🧑', title: 'Personal Info',  sub: 'Basic contact details'           },
  { id: 2, icon: '📄', title: 'Resume',          sub: 'Upload & parse your resume'     },
  { id: 3, icon: '🎯', title: 'Preferences',    sub: 'Roles, salary & location'        },
  { id: 4, icon: '🚀', title: 'Launch',          sub: 'Start your AI agent'             },
];

const TECH_OPTIONS = ['React','Next.js','TypeScript','JavaScript','Node.js','Python','FastAPI','Django','Go','Java','AWS','Docker','Kubernetes','PostgreSQL','MongoDB','GraphQL','Redis','Machine Learning','PyTorch','Flutter'];
const ROLE_OPTIONS = ['Frontend Engineer','Full Stack Engineer','Backend Engineer','Software Engineer','ML Engineer','Data Scientist','DevOps Engineer','Developer Advocate','Product Manager'];

export default function Onboarding() {
  const { state, dispatch, parseResume, scanJobs } = useApp();
  const { currentStep, profile } = state;
  const fileRef = useRef(null);
  const [errors, setErrors] = useState({});

  const loadDemo = () => {
    const demoText = 'Senior Full Stack Engineer with 5 years experience. Skills: React, TypeScript, Next.js, Node.js, PostgreSQL, Docker, AWS, GraphQL, Redis, Python, Kubernetes. Education: B.S. Computer Science. Projects: Built real-time analytics platform.';
    dispatch({ type: 'UPDATE_PROFILE', payload: {
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 555 123 4567',
      location: 'San Francisco, CA',
      preferRemote: true,
      experienceLevel: 'senior',
      salaryMin: '120000',
      salaryMax: '180000',
      jobTitles: ['Full Stack Engineer', 'Senior Software Engineer', 'Frontend Engineer'],
      techStack: ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS', 'PostgreSQL'],
    }});
    parseResume(demoText, 'alex-johnson-resume.pdf');
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const update = (key, val) => dispatch({ type: 'UPDATE_PROFILE', payload: { [key]: val } });
  const goTo   = (step)    => dispatch({ type: 'SET_STEP', payload: step });

  const validate = () => {
    const e = {};
    if (currentStep === 1) {
      if (!profile.fullName.trim()) e.fullName = 'Name is required';
      if (!profile.email.trim())    e.email    = 'Email is required';
      if (!profile.phone.trim())    e.phone    = 'Phone is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) goTo(Math.min(currentStep + 1, 4)); };
  const prev = () => goTo(Math.max(currentStep - 1, 0));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mockText = `Experienced software engineer with 4+ years of professional experience.
Skills: React, TypeScript, Node.js, PostgreSQL, Docker, AWS, GraphQL, Redis, Python, Next.js.
Education: B.S. Computer Science, 2020.
Projects: Built scalable microservices platform handling 1M+ daily requests.
Experience: Senior Frontend Engineer (2022–present), Full Stack Developer (2020–2022).`;
    parseResume(mockText, file.name);
  };

  const toggleItem = (key, val) => {
    const cur = profile[key] || [];
    update(key, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  };

  const finish = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    scanJobs();
  };

  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <div className={styles.overlay}>
      {/* Animated blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <div className={styles.modal}>
        {/* Step indicators */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.id} className={`${styles.stepDot} ${i < currentStep ? styles.stepDone : ''} ${i === currentStep ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>
                {i < currentStep ? '✓' : s.icon}
              </div>
              <span className={styles.stepLabel}>{s.title}</span>
            </div>
          ))}
          {/* Connecting line */}
          <div className={styles.stepLine}>
            <div className={styles.stepLineFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* ── Step 0: Welcome ── */}
          {currentStep === 0 && (
            <div className={styles.step} key="s0">
              <div className={styles.heroIcon}>🤖</div>
              <h1 className={styles.heroTitle}>AI Job Agent</h1>
              <p className={styles.heroSub}>
                Your personal AI-powered job search assistant. Upload your resume, set your preferences,
                and let the agent automatically discover and apply to jobs across LinkedIn, Indeed, Glassdoor,
                Greenhouse, Lever, and Workday — 24/7.
              </p>
              <div className={styles.featureGrid}>
                {[
                  { icon: '🔍', text: 'Scans 6+ platforms every 30 min' },
                  { icon: '🧠', text: 'NLP resume matching ≥70% score' },
                  { icon: '⚡', text: 'Auto-fills & submits applications' },
                  { icon: '🔔', text: 'Real-time alerts & fallback links' },
                ].map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <div className={styles.demoRow}>
                <button className={`btn btn-secondary btn-sm ${styles.demoBtn}`} onClick={loadDemo}>
                  ⚡ Quick Demo — Skip Setup
                </button>
                <span className={styles.demoHint}>Pre-fills all fields with a sample profile</span>
              </div>
            </div>
          )}

          {/* ── Step 1: Personal Info ── */}
          {currentStep === 1 && (
            <div className={styles.step} key="s1">
              <h2 className={styles.stepTitle}>Personal Information</h2>
              <p className={styles.stepDesc}>This will be used to auto-fill job applications.</p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Full Name *</label>
                  <input className="input" placeholder="Alex Johnson" value={profile.fullName}
                    onChange={e => update('fullName', e.target.value)} />
                  {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
                </div>
                <div className="form-group">
                  <label className="label">Date of Birth</label>
                  <input className="input" type="date" value={profile.dob}
                    onChange={e => update('dob', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Email *</label>
                  <input className="input" type="email" placeholder="alex@example.com" value={profile.email}
                    onChange={e => update('email', e.target.value)} />
                  {errors.email && <div className={styles.error}>{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="label">Phone *</label>
                  <input className="input" type="tel" placeholder="+1 555 000 0000" value={profile.phone}
                    onChange={e => update('phone', e.target.value)} />
                  {errors.phone && <div className={styles.error}>{errors.phone}</div>}
                </div>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input className="input" placeholder="San Francisco, CA" value={profile.location}
                    onChange={e => update('location', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Experience Level</label>
                  <select className="select" value={profile.experienceLevel}
                    onChange={e => update('experienceLevel', e.target.value)}>
                    <option value="entry">Entry Level (0–2 yrs)</option>
                    <option value="mid">Mid Level (2–5 yrs)</option>
                    <option value="senior">Senior (5–8 yrs)</option>
                    <option value="principal">Principal / Staff (8+ yrs)</option>
                  </select>
                </div>
              </div>
              <label className={styles.checkRow}>
                <input type="checkbox" checked={profile.preferRemote}
                  onChange={e => update('preferRemote', e.target.checked)}
                  style={{ accentColor: '#6c63ff', width: 16, height: 16 }} />
                <span>Open to Remote Work</span>
              </label>
            </div>
          )}

          {/* ── Step 2: Resume ── */}
          {currentStep === 2 && (
            <div className={styles.step} key="s2">
              <h2 className={styles.stepTitle}>Upload Your Resume</h2>
              <p className={styles.stepDesc}>Our NLP engine extracts your skills, experience & education automatically.</p>

              <div
                className={`${styles.dropZone} ${profile.resumeFileName ? styles.uploaded : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile({ target: { files: [f] } });
                }}
              >
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={handleFile} />
                {profile.resumeFileName ? (
                  <>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>📄</div>
                    <div className={styles.fileName}>{profile.resumeFileName}</div>
                    <div className={styles.fileHint}>✓ Resume parsed successfully · Click to replace</div>
                  </>
                ) : (
                  <>
                    <div className={styles.uploadAnim}>⬆</div>
                    <div className={styles.uploadText}>Drop your resume here or click to upload</div>
                    <div className={styles.uploadSub}>PDF, DOC, DOCX supported</div>
                  </>
                )}
              </div>

              {profile.skills.length > 0 && (
                <div className={styles.parsedBlock}>
                  <div className={styles.parsedTitle}>✨ Extracted {profile.skills.length} Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {profile.skills.map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                </div>
              )}

              <div className={styles.orDivider}>— or paste resume text —</div>
              <textarea
                className="textarea"
                placeholder="Paste your resume text here for instant skill extraction…"
                value={profile.resumeText}
                onChange={e => {
                  update('resumeText', e.target.value);
                  if (e.target.value.length > 50) parseResume(e.target.value, 'pasted-resume.txt');
                }}
                rows={5}
              />
            </div>
          )}

          {/* ── Step 3: Preferences ── */}
          {currentStep === 3 && (
            <div className={styles.step} key="s3">
              <h2 className={styles.stepTitle}>Job Preferences</h2>
              <p className={styles.stepDesc}>The agent uses these to filter and rank jobs for you.</p>

              <div className="form-group">
                <label className="label">🎯 Target Roles</label>
                <div className={styles.tagGrid}>
                  {ROLE_OPTIONS.map(r => (
                    <button key={r}
                      className={`${styles.tagBtn} ${profile.jobTitles?.includes(r) ? styles.tagActive : ''}`}
                      onClick={() => toggleItem('jobTitles', r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="label">⚙️ Tech Stack</label>
                <div className={styles.tagGrid}>
                  {TECH_OPTIONS.map(t => (
                    <button key={t}
                      className={`${styles.tagBtn} ${profile.techStack?.includes(t) ? styles.tagActive : ''}`}
                      onClick={() => toggleItem('techStack', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Min Salary ($/yr)</label>
                  <input className="input" type="number" placeholder="80000" value={profile.salaryMin}
                    onChange={e => update('salaryMin', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Max Salary ($/yr)</label>
                  <input className="input" type="number" placeholder="160000" value={profile.salaryMax}
                    onChange={e => update('salaryMax', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Launch ── */}
          {currentStep === 4 && (
            <div className={`${styles.step} ${styles.launchStep}`} key="s4">
              <div className={`${styles.heroIcon} ${styles.heroIconGreen} animate-float`}>🚀</div>
              <h2 className={styles.launchTitle}>You're all set!</h2>
              <p className={styles.launchSub}>
                Your AI agent is ready to scan {' '}
                <strong style={{ color: '#a29bfe' }}>LinkedIn, Indeed, Glassdoor, Greenhouse, Lever & Workday</strong>
                {' '} and automatically apply to jobs matching your profile.
              </p>

              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}><span>👤 Name</span><strong>{profile.fullName || '—'}</strong></div>
                <div className={styles.summaryRow}><span>📧 Email</span><strong>{profile.email || '—'}</strong></div>
                <div className={styles.summaryRow}><span>📍 Location</span><strong>{profile.location || 'Any'}</strong></div>
                <div className={styles.summaryRow}><span>🧠 Skills</span><strong>{profile.skills.length} extracted</strong></div>
                <div className={styles.summaryRow}><span>🎯 Roles</span><strong>{profile.jobTitles?.length || 0} selected</strong></div>
                <div className={styles.summaryRow}><span>🌐 Remote</span><strong>{profile.preferRemote ? 'Yes' : 'No'}</strong></div>
              </div>

              <div className={styles.disclaimer}>
                ⚠️ The agent will flag CAPTCHAs and protected flows for manual completion. You remain in full control.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          {currentStep > 0 && (
            <button className="btn btn-secondary" onClick={prev}>← Back</button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 4 ? (
            <button className="btn btn-primary btn-lg" onClick={next}>
              {currentStep === 0 ? 'Get Started →' : 'Continue →'}
            </button>
          ) : (
            <button className="btn btn-success btn-lg" onClick={finish}>
              🚀 Launch AI Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
