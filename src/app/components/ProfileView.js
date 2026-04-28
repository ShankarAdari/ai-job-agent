'use client';
import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import styles from './ProfileView.module.css';

const TECH_OPTIONS = [
  'React','Next.js','Vue','Angular','TypeScript','JavaScript','Node.js','Python',
  'Django','FastAPI','Go','Rust','Java','AWS','Docker','Kubernetes','PostgreSQL',
  'MongoDB','GraphQL','Redis','Machine Learning','PyTorch','TensorFlow',
];

const ROLE_OPTIONS = [
  'Frontend Engineer','Full Stack Engineer','Backend Engineer','Software Engineer',
  'ML Engineer','Data Scientist','DevOps Engineer','Product Manager',
  'UI/UX Designer','Mobile Developer','Cloud Architect','Developer Advocate',
];

export default function ProfileView() {
  const { state, dispatch, parseResume } = useApp();
  const { profile } = state;
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const update = (key, val) => dispatch({ type: 'UPDATE_PROFILE', payload: { [key]: val } });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulate reading PDF/DOCX as text
    const mockResumeText = `
      Experienced software engineer with 4+ years of professional experience.
      Skills: React, TypeScript, Node.js, PostgreSQL, Docker, AWS, GraphQL, Redis, Python.
      Education: B.S. Computer Science, University of Technology, 2020.
      Projects: Built a scalable microservices platform handling 1M+ daily requests using Node.js, Redis and Docker.
      Experience: Senior Frontend Engineer at TechCorp (2022–present), Full Stack Developer at StartupXYZ (2020–2022).
      Frameworks: Next.js, Express, FastAPI. Databases: PostgreSQL, MongoDB, Redis.
    `;
    parseResume(mockResumeText, file.name);
  };

  const toggleSkill = (skill) => {
    const cur = profile.techStack || [];
    update('techStack', cur.includes(skill) ? cur.filter(s => s !== skill) : [...cur, skill]);
  };

  const toggleRole = (role) => {
    const cur = profile.jobTitles || [];
    update('jobTitles', cur.includes(role) ? cur.filter(r => r !== role) : [...cur, role]);
  };

  const handleSave = () => {
    setSaved(true);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: 'Profile Saved', message: 'Your profile has been updated successfully.' } });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>👤 My Profile</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : '💾 Save Changes'}
        </button>
      </div>

      <div className={styles.grid}>
        {/* Personal Info */}
        <div className={`glass ${styles.section}`}>
          <div className={styles.sectionTitle}>
            <span>🧑 Personal Information</span>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="Alex Johnson" value={profile.fullName}
                onChange={e => update('fullName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Date of Birth</label>
              <input className="input" type="date" value={profile.dob}
                onChange={e => update('dob', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="alex@example.com" value={profile.email}
                onChange={e => update('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" type="tel" placeholder="+1 555 000 0000" value={profile.phone}
                onChange={e => update('phone', e.target.value)} />
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
          <div className="form-group">
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={profile.preferRemote}
                onChange={e => update('preferRemote', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#6c63ff' }} />
              Prefer Remote Work
            </label>
          </div>
        </div>

        {/* Resume Upload */}
        <div className={`glass ${styles.section}`}>
          <div className={styles.sectionTitle}><span>📄 Resume</span></div>

          <div
            className={styles.dropZone}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) { const fake = { target: { files: [f] }}; handleFile(fake); } }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={handleFile} />
            {profile.resumeFileName ? (
              <>
                <div className={styles.fileIcon}>📄</div>
                <div className={styles.fileName}>{profile.resumeFileName}</div>
                <div className={styles.fileHint}>Click to replace</div>
              </>
            ) : (
              <>
                <div className={styles.uploadIcon}>⬆</div>
                <div className={styles.uploadText}>Drop your resume here or click to upload</div>
                <div className={styles.uploadHint}>Supports PDF, DOC, DOCX</div>
              </>
            )}
          </div>

          {profile.skills.length > 0 && (
            <div className={styles.extractedSkills}>
              <div className={styles.extractedTitle}>✨ Extracted Skills ({profile.skills.length})</div>
              <div className={styles.skillTags}>
                {profile.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Job Preferences */}
        <div className={`glass ${styles.section}`}>
          <div className={styles.sectionTitle}><span>🎯 Job Preferences</span></div>

          <div className="form-group">
            <label className="label">Target Roles (select all that apply)</label>
            <div className={styles.toggleGroup}>
              {ROLE_OPTIONS.map(role => (
                <button
                  key={role}
                  className={`${styles.toggleBtn} ${profile.jobTitles?.includes(role) ? styles.toggleActive : ''}`}
                  onClick={() => toggleRole(role)}
                >
                  {role}
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

        {/* Tech Stack */}
        <div className={`glass ${styles.section}`}>
          <div className={styles.sectionTitle}><span>⚙️ Tech Stack</span></div>
          <div className={styles.toggleGroup}>
            {TECH_OPTIONS.map(tech => (
              <button
                key={tech}
                className={`${styles.toggleBtn} ${profile.techStack?.includes(tech) ? styles.toggleActive : ''}`}
                onClick={() => toggleSkill(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
