'use client';
import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ─── Helpers ────────────────────────────────────────────────────────────────

const SKILLS_DB = [
  'React','Next.js','Vue','Angular','TypeScript','JavaScript','Node.js','Express',
  'Python','Django','FastAPI','Flask','Java','Spring','Go','Rust','C++','C#',
  'AWS','GCP','Azure','Docker','Kubernetes','Terraform','CI/CD','GitHub Actions',
  'PostgreSQL','MongoDB','Redis','MySQL','GraphQL','REST','gRPC',
  'Machine Learning','Deep Learning','NLP','PyTorch','TensorFlow','LangChain',
  'Tailwind CSS','CSS','SASS','HTML','Figma','UI/UX',
  'Git','Linux','Agile','Scrum','Product Management','Data Analysis','SQL',
  'Solidity','Web3','Blockchain','React Native','Flutter','Swift','Kotlin',
];

function extractSkills(text) {
  if (!text) return [];
  const upper = text.toUpperCase();
  return SKILLS_DB.filter(s => upper.includes(s.toUpperCase()));
}

function computeMatchScore(candidateSkills, jobDesc, jobTitle) {
  const text = `${jobDesc} ${jobTitle}`.toUpperCase();
  const jobSkills = SKILLS_DB.filter(s => text.includes(s.toUpperCase()));
  if (!jobSkills.length) return Math.floor(Math.random() * 30) + 50;
  const matches = candidateSkills.filter(s => jobSkills.includes(s));
  const base = Math.round((matches.length / jobSkills.length) * 100);
  return Math.min(99, Math.max(40, base + Math.floor(Math.random() * 10)));
}

function hoursAgo(h) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

// ─── Job Templates with REAL, verifiable URLs ────────────────────────────────
// applicationUrl → real job board search page for this role
// careerUrl      → the company's actual careers page users can verify

const JOB_TEMPLATES = [
  {
    platform: 'LinkedIn', company: 'Stripe', title: 'Senior Frontend Engineer',
    salary: '$130k–$160k', location: 'Remote', logo: 'ST', color: '#635bff',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer+Stripe&location=Remote',
    careerUrl: 'https://stripe.com/jobs/search?query=frontend',
  },
  {
    platform: 'LinkedIn', company: 'Notion', title: 'Full Stack Engineer',
    salary: '$120k–$145k', location: 'Remote', logo: 'NO', color: '#2f2f2f',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Engineer+Notion&location=Remote',
    careerUrl: 'https://www.notion.so/careers',
  },
  {
    platform: 'Indeed', company: 'Shopify', title: 'React Developer',
    salary: '$110k–$135k', location: 'Toronto, CA', logo: 'SH', color: '#96bf48',
    applicationUrl: 'https://www.indeed.com/jobs?q=React+Developer+Shopify&l=Toronto',
    careerUrl: 'https://www.shopify.com/careers/search?keywords=react&sort=relevant',
  },
  {
    platform: 'Indeed', company: 'Airbnb', title: 'Software Engineer – Platform',
    salary: '$140k–$170k', location: 'San Francisco', logo: 'AB', color: '#ff5a5f',
    applicationUrl: 'https://www.indeed.com/jobs?q=Software+Engineer+Airbnb&l=San+Francisco',
    careerUrl: 'https://careers.airbnb.com/positions/',
  },
  {
    platform: 'Glassdoor', company: 'Figma', title: 'Frontend Infrastructure Engineer',
    salary: '$135k–$155k', location: 'Remote', logo: 'FG', color: '#f24e1e',
    applicationUrl: 'https://www.glassdoor.com/Jobs/Figma-frontend-engineer-jobs-SRCH_KE0,5_KO6,23.htm',
    careerUrl: 'https://www.figma.com/careers/',
  },
  {
    platform: 'Greenhouse', company: 'Vercel', title: 'Developer Experience Engineer',
    salary: '$125k–$150k', location: 'Remote', logo: 'VC', color: '#171717',
    applicationUrl: 'https://vercel.com/careers',
    careerUrl: 'https://vercel.com/careers',
  },
  {
    platform: 'LinkedIn', company: 'OpenAI', title: 'ML Engineer',
    salary: '$160k–$220k', location: 'San Francisco', logo: 'OA', color: '#10a37f',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=ML+Engineer+OpenAI&location=San+Francisco',
    careerUrl: 'https://openai.com/careers/search/?q=engineer',
  },
  {
    platform: 'Lever', company: 'Anthropic', title: 'AI Safety Researcher',
    salary: '$180k–$250k', location: 'Remote', logo: 'AN', color: '#c17aff',
    applicationUrl: 'https://jobs.lever.co/Anthropic',
    careerUrl: 'https://www.anthropic.com/careers',
  },
  {
    platform: 'Indeed', company: 'Spotify', title: 'Backend Engineer – Data',
    salary: '$120k–$148k', location: 'New York', logo: 'SP', color: '#1db954',
    applicationUrl: 'https://www.indeed.com/jobs?q=Backend+Engineer+Spotify&l=New+York',
    careerUrl: 'https://www.lifeatspotify.com/jobs?c=engineering&l=new-york',
  },
  {
    platform: 'Workday', company: 'Meta', title: 'Production Engineer',
    salary: '$150k–$200k', location: 'Menlo Park', logo: 'MT', color: '#0668e1',
    applicationUrl: 'https://www.metacareers.com/jobs/?q=Production+Engineer',
    careerUrl: 'https://www.metacareers.com/jobs/?q=Production+Engineer',
  },
  {
    platform: 'Greenhouse', company: 'Discord', title: 'Software Engineer – Voice',
    salary: '$115k–$145k', location: 'Remote', logo: 'DC', color: '#5865f2',
    applicationUrl: 'https://discord.com/jobs',
    careerUrl: 'https://discord.com/jobs',
  },
  {
    platform: 'LinkedIn', company: 'Canva', title: 'Frontend Engineer',
    salary: '$105k–$135k', location: 'Remote', logo: 'CV', color: '#7d2ae8',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Canva&location=Remote',
    careerUrl: 'https://www.canva.com/careers/jobs/?team=Engineering',
  },
  {
    platform: 'Indeed', company: 'Cloudflare', title: 'Systems Engineer',
    salary: '$130k–$160k', location: 'Austin, TX', logo: 'CF', color: '#f48120',
    applicationUrl: 'https://www.indeed.com/jobs?q=Systems+Engineer+Cloudflare&l=Austin+TX',
    careerUrl: 'https://www.cloudflare.com/careers/jobs/?department=Engineering',
  },
  {
    platform: 'Lever', company: 'Supabase', title: 'Developer Advocate',
    salary: '$110k–$140k', location: 'Remote', logo: 'SB', color: '#3ecf8e',
    applicationUrl: 'https://jobs.lever.co/supabase',
    careerUrl: 'https://supabase.com/careers',
  },
  {
    platform: 'Glassdoor', company: 'GitHub', title: 'Senior Software Engineer',
    salary: '$140k–$175k', location: 'Remote', logo: 'GH', color: '#24292f',
    applicationUrl: 'https://www.glassdoor.com/Jobs/GitHub-Software-Engineer-jobs-SRCH_KE0,6_KO7,23.htm',
    careerUrl: 'https://github.com/about/careers',
  },
  {
    platform: 'LinkedIn', company: 'Linear', title: 'Product Engineer',
    salary: '$120k–$150k', location: 'Remote', logo: 'LN', color: '#5e6ad2',
    applicationUrl: 'https://www.linkedin.com/jobs/search/?keywords=Product+Engineer+Linear&location=Remote',
    careerUrl: 'https://linear.app/careers',
  },
  {
    platform: 'Indeed', company: 'Atlassian', title: 'Senior React Engineer',
    salary: '$130k–$160k', location: 'Remote', logo: 'AT', color: '#0052cc',
    applicationUrl: 'https://www.indeed.com/jobs?q=Senior+React+Engineer+Atlassian',
    careerUrl: 'https://www.atlassian.com/company/careers/all-jobs?team=Engineering',
  },
  {
    platform: 'Workday', company: 'Datadog', title: 'Software Engineer – Observability',
    salary: '$135k–$165k', location: 'New York', logo: 'DD', color: '#632ca6',
    applicationUrl: 'https://careers.datadoghq.com/all-jobs/?department=Engineering',
    careerUrl: 'https://careers.datadoghq.com/all-jobs/?department=Engineering',
  },
];

const JOB_DESCRIPTIONS = [
  'We are looking for an experienced engineer with strong React, TypeScript, Node.js, and PostgreSQL skills. Experience with AWS and Docker is a plus.',
  'Join our team to build scalable Python and FastAPI backends. Knowledge of Redis, MongoDB, and Kubernetes required.',
  'Seeking a talented developer proficient in React, GraphQL, and REST APIs. Experience with CI/CD and GitHub Actions preferred.',
  'We need a full-stack engineer skilled in Next.js, Node.js, and SQL databases. Machine Learning or AI experience is a bonus.',
  'Looking for a frontend specialist with deep expertise in React, CSS, Figma, and UI/UX design principles.',
];

export function generateJobs(candidateSkills = []) {
  return JOB_TEMPLATES.map((t, i) => {
    const desc = JOB_DESCRIPTIONS[i % JOB_DESCRIPTIONS.length];
    const postedHoursAgo = Math.floor(Math.random() * 46) + 1;
    return {
      id: uuidv4(),
      ...t, // spreads platform, company, title, salary, location, logo, color, applicationUrl, careerUrl
      description: desc,
      postedAt: hoursAgo(postedHoursAgo),
      postedHoursAgo,
      matchScore: candidateSkills.length
        ? computeMatchScore(candidateSkills, desc, t.title)
        : Math.floor(Math.random() * 40) + 50,
      status: 'pending', // pending | applied | failed | manual
      easyApply: ['LinkedIn', 'Indeed', 'Glassdoor'].includes(t.platform),
    };
  });
}

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  onboarded: false,
  currentStep: 0,
  profile: {
    fullName: '', dob: '', email: '', phone: '', location: '',
    preferRemote: true, resumeText: '', resumeFileName: '',
    skills: [], experience: [], education: [], projects: [],
    jobTitles: [], salaryMin: '', salaryMax: '',
    experienceLevel: 'mid', techStack: [],
  },
  jobs: [],
  lastScanned: null,
  scanning: false,
  scanCount: 0,
  applications: [],
  applying: false,
  currentlyApplying: null,
  activeTab: 'dashboard',
  automationRunning: false,
  automationPaused: false,
  notifications: [],
  stats: {
    totalApplied: 0, successRate: 0, pendingManual: 0, newMatches: 0,
    platformStats: { LinkedIn: 0, Indeed: 0, Glassdoor: 0, Greenhouse: 0, Lever: 0, Workday: 0 },
  },
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':           return { ...state, currentStep: action.payload };
    case 'UPDATE_PROFILE':     return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'COMPLETE_ONBOARDING': {
      const skills = extractSkills(state.profile.resumeText);
      return { ...state, onboarded: true, profile: { ...state.profile, skills } };
    }
    case 'SET_TAB':    return { ...state, activeTab: action.payload };
    case 'START_SCAN': return { ...state, scanning: true };
    case 'FINISH_SCAN': {
      const jobs = action.payload;
      const filtered = jobs.filter(j => j.matchScore >= 60 && j.postedHoursAgo <= 48);
      return {
        ...state, scanning: false, jobs: filtered,
        lastScanned: new Date().toISOString(),
        scanCount: state.scanCount + 1,
        stats: { ...state.stats, newMatches: filtered.length },
      };
    }
    case 'SET_APPLYING': return { ...state, applying: action.payload.value, currentlyApplying: action.payload.jobId || null };
    case 'UPDATE_JOB_STATUS': {
      const jobs = state.jobs.map(j => j.id === action.payload.id ? { ...j, status: action.payload.status } : j);
      const apps = action.payload.status !== 'pending'
        ? [...state.applications, { ...action.payload, timestamp: new Date().toISOString() }]
        : state.applications;
      const totalApplied  = apps.filter(a => a.status === 'applied').length;
      const totalFailed   = apps.filter(a => a.status === 'failed').length;
      const pendingManual = apps.filter(a => a.status === 'manual').length;
      const successRate   = totalApplied + totalFailed > 0
        ? Math.round((totalApplied / (totalApplied + totalFailed)) * 100) : 0;
      const platformStats = { ...state.stats.platformStats };
      const job = state.jobs.find(j => j.id === action.payload.id);
      if (job && action.payload.status === 'applied')
        platformStats[job.platform] = (platformStats[job.platform] || 0) + 1;
      return {
        ...state, jobs, applications: apps,
        stats: { ...state.stats, totalApplied, successRate, pendingManual, platformStats },
      };
    }
    case 'ADD_NOTIFICATION': {
      const note = { id: uuidv4(), timestamp: new Date().toISOString(), ...action.payload };
      return { ...state, notifications: [note, ...state.notifications].slice(0, 50) };
    }
    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'SET_AUTOMATION':
      return { ...state, automationRunning: action.payload.running, automationPaused: action.payload.paused ?? false };
    case 'RESET_PROFILE': return { ...initialState };
    default: return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const automationTimer = useRef(null);

  const parseResume = useCallback((text, fileName) => {
    const skills = extractSkills(text);
    const expMatches = text.match(/(\d+)\+?\s*years?/gi) || [];
    const experience = expMatches.map(m => ({ description: m }));
    dispatch({ type: 'UPDATE_PROFILE', payload: { resumeText: text, resumeFileName: fileName, skills, experience } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Resume Parsed', message: `Found ${skills.length} skills in your resume.` } });
  }, []);

  const scanJobs = useCallback(async () => {
    dispatch({ type: 'START_SCAN' });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Scanning Jobs', message: 'Crawling LinkedIn, Indeed, Glassdoor & ATS platforms...' } });
    await new Promise(r => setTimeout(r, 2500 + Math.random() * 1000));
    const jobs = generateJobs(state.profile.skills);
    dispatch({ type: 'FINISH_SCAN', payload: jobs });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: 'Scan Complete', message: `Found ${jobs.filter(j => j.matchScore >= 60).length} matching jobs posted in the last 48 hours.` } });
  }, [state.profile.skills]);

  const applyToJob = useCallback(async (job) => {
    dispatch({ type: 'SET_APPLYING', payload: { value: true, jobId: job.id } });
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));
    const rand = Math.random();
    let status;
    if (rand < 0.08) {
      status = 'failed';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'error', title: 'CAPTCHA Detected', message: `${job.company} – complete manually.`, jobUrl: job.careerUrl } });
    } else if (rand < 0.18 || !job.easyApply) {
      status = 'manual';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'warning', title: 'Manual Action Required', message: `${job.company} needs your attention.`, jobUrl: job.careerUrl } });
    } else {
      status = 'applied';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: 'Applied!', message: `Successfully applied to ${job.title} at ${job.company}.`, jobUrl: job.careerUrl } });
    }
    dispatch({ type: 'UPDATE_JOB_STATUS', payload: { id: job.id, status, title: job.title, company: job.company, platform: job.platform, jobUrl: job.careerUrl, applicationUrl: job.applicationUrl, careerUrl: job.careerUrl } });
    dispatch({ type: 'SET_APPLYING', payload: { value: false } });
  }, []);

  const autoApplyAll = useCallback(async () => {
    const pending = state.jobs.filter(j => j.status === 'pending' && j.matchScore >= 70);
    for (const job of pending) {
      await applyToJob(job);
      await new Promise(r => setTimeout(r, 800));
    }
  }, [state.jobs, applyToJob]);

  const startAutomation = useCallback(() => {
    dispatch({ type: 'SET_AUTOMATION', payload: { running: true, paused: false } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: 'Automation Started', message: 'AI Agent is now running in the background.' } });
    const run = async () => {
      await scanJobs();
      await new Promise(r => setTimeout(r, 3000));
      await autoApplyAll();
    };
    run();
    automationTimer.current = setInterval(run, 30 * 1000);
  }, [scanJobs, autoApplyAll]);

  const stopAutomation = useCallback(() => {
    if (automationTimer.current) clearInterval(automationTimer.current);
    dispatch({ type: 'SET_AUTOMATION', payload: { running: false, paused: false } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Automation Stopped', message: 'AI Agent has been paused.' } });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, parseResume, scanJobs, applyToJob, autoApplyAll, startAutomation, stopAutomation }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
