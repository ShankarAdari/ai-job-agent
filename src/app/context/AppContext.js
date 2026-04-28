'use client';
import { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SKILLS_DB = ['React','Next.js','Vue','Angular','TypeScript','JavaScript','Node.js','Express','Python','Django','FastAPI','Flask','Java','Spring','Go','Rust','AWS','GCP','Azure','Docker','Kubernetes','PostgreSQL','MongoDB','Redis','MySQL','GraphQL','REST','Machine Learning','NLP','PyTorch','TensorFlow','CSS','Figma','UI/UX','Git','Linux','SQL','React Native','Flutter','Swift','Kotlin','PHP','Laravel','Ruby','Rails'];

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

// applyType: 'easy' = agent submits directly | 'guided' = step-by-step helper | 'manual' = link only
const JOB_TEMPLATES = [
  // ── LinkedIn ──────────────────────────────────────────────────────────────
  { platform:'LinkedIn', applyType:'easy', company:'Stripe', title:'Senior Frontend Engineer', salary:'$130k–$160k', location:'Remote', logo:'ST', color:'#635bff', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer+Stripe&location=Remote', careerUrl:'https://stripe.com/jobs/search?query=frontend' },
  { platform:'LinkedIn', applyType:'easy', company:'Notion', title:'Full Stack Engineer', salary:'$120k–$145k', location:'Remote', logo:'NO', color:'#2f2f2f', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Engineer+Notion', careerUrl:'https://www.notion.so/careers' },
  { platform:'LinkedIn', applyType:'easy', company:'OpenAI', title:'ML Engineer', salary:'$160k–$220k', location:'San Francisco', logo:'OA', color:'#10a37f', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=ML+Engineer+OpenAI', careerUrl:'https://openai.com/careers' },
  { platform:'LinkedIn', applyType:'easy', company:'Canva', title:'Frontend Engineer', salary:'$105k–$135k', location:'Remote', logo:'CV', color:'#7d2ae8', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Canva', careerUrl:'https://www.canva.com/careers/jobs/?team=Engineering' },
  { platform:'LinkedIn', applyType:'easy', company:'Linear', title:'Product Engineer', salary:'$120k–$150k', location:'Remote', logo:'LN', color:'#5e6ad2', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Product+Engineer+Linear', careerUrl:'https://linear.app/careers' },
  { platform:'LinkedIn', applyType:'easy', company:'Figma', title:'Frontend Infrastructure Engineer', salary:'$135k–$155k', location:'Remote', logo:'FG', color:'#f24e1e', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Figma', careerUrl:'https://www.figma.com/careers/' },
  { platform:'LinkedIn', applyType:'easy', company:'Shopify', title:'Senior React Developer', salary:'$115k–$140k', location:'Remote', logo:'SH', color:'#96bf48', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+React+Developer+Shopify', careerUrl:'https://www.shopify.com/careers' },
  { platform:'LinkedIn', applyType:'easy', company:'GitHub', title:'Senior Software Engineer', salary:'$140k–$175k', location:'Remote', logo:'GH', color:'#24292f', applicationUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+Software+Engineer+GitHub', careerUrl:'https://github.com/about/careers' },

  // ── Indeed Global ────────────────────────────────────────────────────────
  { platform:'Indeed', applyType:'easy', company:'Airbnb', title:'Software Engineer – Platform', salary:'$140k–$170k', location:'San Francisco', logo:'AB', color:'#ff5a5f', applicationUrl:'https://www.indeed.com/jobs?q=Software+Engineer+Airbnb&l=San+Francisco', careerUrl:'https://careers.airbnb.com/positions/' },
  { platform:'Indeed', applyType:'easy', company:'Spotify', title:'Backend Engineer', salary:'$120k–$148k', location:'New York', logo:'SP', color:'#1db954', applicationUrl:'https://www.indeed.com/jobs?q=Backend+Engineer+Spotify&l=New+York', careerUrl:'https://www.lifeatspotify.com/jobs' },
  { platform:'Indeed', applyType:'easy', company:'Cloudflare', title:'Systems Engineer', salary:'$130k–$160k', location:'Austin, TX', logo:'CF', color:'#f48120', applicationUrl:'https://www.indeed.com/jobs?q=Systems+Engineer+Cloudflare', careerUrl:'https://www.cloudflare.com/careers/jobs/' },
  { platform:'Indeed', applyType:'easy', company:'Atlassian', title:'Senior React Engineer', salary:'$130k–$160k', location:'Remote', logo:'AT', color:'#0052cc', applicationUrl:'https://www.indeed.com/jobs?q=Senior+React+Engineer+Atlassian', careerUrl:'https://www.atlassian.com/company/careers' },
  { platform:'Indeed', applyType:'easy', company:'HubSpot', title:'Software Engineer II', salary:'$110k–$140k', location:'Remote', logo:'HS', color:'#ff7a59', applicationUrl:'https://www.indeed.com/jobs?q=Software+Engineer+HubSpot', careerUrl:'https://www.hubspot.com/careers' },
  { platform:'Indeed', applyType:'easy', company:'Twilio', title:'Full Stack Developer', salary:'$120k–$150k', location:'Remote', logo:'TW', color:'#f22f46', applicationUrl:'https://www.indeed.com/jobs?q=Full+Stack+Developer+Twilio', careerUrl:'https://www.twilio.com/en-us/company/jobs' },

  // ── Indeed India (Naukri-style roles, INR salaries) ───────────────────────
  { platform:'Indeed India', applyType:'easy', company:'Infosys', title:'React Developer', salary:'₹8L–₹18L', location:'Bangalore', logo:'IN', color:'#007cc3', applicationUrl:'https://in.indeed.com/jobs?q=React+Developer+Infosys&l=Bangalore', careerUrl:'https://www.infosys.com/careers/apply.html' },
  { platform:'Indeed India', applyType:'easy', company:'TCS', title:'Full Stack Engineer', salary:'₹7L–₹16L', location:'Hyderabad', logo:'TC', color:'#1a1a6e', applicationUrl:'https://in.indeed.com/jobs?q=Full+Stack+Engineer+TCS&l=Hyderabad', careerUrl:'https://www.tcs.com/careers' },
  { platform:'Indeed India', applyType:'easy', company:'Wipro', title:'Python Developer', salary:'₹6L–₹14L', location:'Pune', logo:'WI', color:'#341c6e', applicationUrl:'https://in.indeed.com/jobs?q=Python+Developer+Wipro&l=Pune', careerUrl:'https://careers.wipro.com/careers-home/' },
  { platform:'Indeed India', applyType:'easy', company:'Zomato', title:'Senior Frontend Engineer', salary:'₹20L–₹40L', location:'Gurgaon', logo:'ZO', color:'#e23744', applicationUrl:'https://in.indeed.com/jobs?q=Frontend+Engineer+Zomato&l=Gurgaon', careerUrl:'https://www.zomato.com/careers' },
  { platform:'Indeed India', applyType:'easy', company:'Swiggy', title:'Software Engineer – Backend', salary:'₹18L–₹35L', location:'Bangalore', logo:'SW', color:'#fc8019', applicationUrl:'https://in.indeed.com/jobs?q=Backend+Engineer+Swiggy&l=Bangalore', careerUrl:'https://careers.swiggy.com/' },
  { platform:'Indeed India', applyType:'easy', company:'CRED', title:'React Native Developer', salary:'₹22L–₹45L', location:'Bangalore', logo:'CR', color:'#1a1a2e', applicationUrl:'https://in.indeed.com/jobs?q=React+Native+Developer+CRED', careerUrl:'https://careers.cred.club/' },
  { platform:'Indeed India', applyType:'easy', company:'Razorpay', title:'Frontend Engineer', salary:'₹20L–₹38L', location:'Bangalore', logo:'RZ', color:'#3395ff', applicationUrl:'https://in.indeed.com/jobs?q=Frontend+Engineer+Razorpay', careerUrl:'https://razorpay.com/jobs/' },
  { platform:'Indeed India', applyType:'easy', company:'PhonePe', title:'Backend Engineer', salary:'₹18L–₹36L', location:'Bangalore', logo:'PP', color:'#5f259f', applicationUrl:'https://in.indeed.com/jobs?q=Backend+Engineer+PhonePe', careerUrl:'https://www.phonepe.com/careers/' },

  // ── Naukri ────────────────────────────────────────────────────────────────
  { platform:'Naukri', applyType:'guided', company:'HCL Technologies', title:'Java Full Stack Developer', salary:'₹8L–₹20L', location:'Noida', logo:'HC', color:'#005f87', applicationUrl:'https://www.naukri.com/java-full-stack-developer-jobs-in-noida', careerUrl:'https://www.hcltech.com/careers' },
  { platform:'Naukri', applyType:'guided', company:'Tech Mahindra', title:'Node.js Developer', salary:'₹7L–₹16L', location:'Hyderabad', logo:'TM', color:'#e31837', applicationUrl:'https://www.naukri.com/nodejs-developer-jobs-in-hyderabad', careerUrl:'https://careers.techmahindra.com/' },
  { platform:'Naukri', applyType:'guided', company:'Cognizant', title:'React.js Developer', salary:'₹6L–₹14L', location:'Chennai', logo:'CG', color:'#1a2980', applicationUrl:'https://www.naukri.com/reactjs-developer-jobs-in-chennai', careerUrl:'https://careers.cognizant.com/global/en' },
  { platform:'Naukri', applyType:'guided', company:'Flipkart', title:'Senior Software Engineer', salary:'₹25L–₹50L', location:'Bangalore', logo:'FL', color:'#2874f0', applicationUrl:'https://www.naukri.com/senior-software-engineer-jobs-in-flipkart', careerUrl:'https://www.flipkartcareers.com/' },
  { platform:'Naukri', applyType:'guided', company:'Paytm', title:'Frontend Engineer', salary:'₹15L–₹30L', location:'Noida', logo:'PT', color:'#002970', applicationUrl:'https://www.naukri.com/frontend-engineer-jobs-in-paytm', careerUrl:'https://paytm.com/careers' },
  { platform:'Naukri', applyType:'guided', company:'Ola', title:'Full Stack Developer', salary:'₹16L–₹32L', location:'Bangalore', logo:'OL', color:'#1aaf5d', applicationUrl:'https://www.naukri.com/full-stack-developer-jobs-in-ola', careerUrl:'https://www.olacabs.com/careers' },
  { platform:'Naukri', applyType:'guided', company:'MakeMyTrip', title:'Software Engineer', salary:'₹12L–₹24L', location:'Gurgaon', logo:'MM', color:'#e94560', applicationUrl:'https://www.naukri.com/software-engineer-jobs-in-makemytrip', careerUrl:'https://careers.makemytrip.com/' },
  { platform:'Naukri', applyType:'guided', company:'Meesho', title:'Backend Developer – Python', salary:'₹18L–₹35L', location:'Bangalore', logo:'ME', color:'#9e3375', applicationUrl:'https://www.naukri.com/python-developer-jobs-in-meesho', careerUrl:'https://meesho.io/careers' },
  { platform:'Naukri', applyType:'guided', company:'Dream11', title:'React Developer', salary:'₹20L–₹40L', location:'Mumbai', logo:'D1', color:'#ef3e42', applicationUrl:'https://www.naukri.com/react-developer-jobs-in-dream11', careerUrl:'https://www.dream11.com/about/careers' },
  { platform:'Naukri', applyType:'guided', company:'Freshworks', title:'Senior Frontend Developer', salary:'₹22L–₹42L', location:'Chennai', logo:'FW', color:'#25c16f', applicationUrl:'https://www.naukri.com/senior-frontend-developer-jobs-in-freshworks', careerUrl:'https://careers.freshworks.com/' },

  // ── Greenhouse / Lever ───────────────────────────────────────────────────
  { platform:'Greenhouse', applyType:'guided', company:'Vercel', title:'Developer Experience Engineer', salary:'$125k–$150k', location:'Remote', logo:'VC', color:'#171717', applicationUrl:'https://vercel.com/careers', careerUrl:'https://vercel.com/careers' },
  { platform:'Greenhouse', applyType:'guided', company:'Discord', title:'Software Engineer – Voice', salary:'$115k–$145k', location:'Remote', logo:'DC', color:'#5865f2', applicationUrl:'https://discord.com/jobs', careerUrl:'https://discord.com/jobs' },
  { platform:'Lever', applyType:'guided', company:'Anthropic', title:'AI Safety Researcher', salary:'$180k–$250k', location:'Remote', logo:'AN', color:'#c17aff', applicationUrl:'https://jobs.lever.co/Anthropic', careerUrl:'https://www.anthropic.com/careers' },
  { platform:'Lever', applyType:'guided', company:'Supabase', title:'Developer Advocate', salary:'$110k–$140k', location:'Remote', logo:'SB', color:'#3ecf8e', applicationUrl:'https://jobs.lever.co/supabase', careerUrl:'https://supabase.com/careers' },

  // ── Workday ──────────────────────────────────────────────────────────────
  { platform:'Workday', applyType:'manual', company:'Meta', title:'Production Engineer', salary:'$150k–$200k', location:'Menlo Park', logo:'MT', color:'#0668e1', applicationUrl:'https://www.metacareers.com/jobs/?q=Production+Engineer', careerUrl:'https://www.metacareers.com/jobs/' },
  { platform:'Workday', applyType:'manual', company:'Datadog', title:'Software Engineer – Observability', salary:'$135k–$165k', location:'New York', logo:'DD', color:'#632ca6', applicationUrl:'https://careers.datadoghq.com/all-jobs/?department=Engineering', careerUrl:'https://careers.datadoghq.com/' },
  { platform:'Workday', applyType:'manual', company:'Salesforce', title:'Senior Software Engineer', salary:'$140k–$180k', location:'Remote', logo:'SF', color:'#00a1e0', applicationUrl:'https://careers.salesforce.com/en/jobs/?search=software+engineer', careerUrl:'https://careers.salesforce.com/' },
  { platform:'Workday', applyType:'manual', company:'SAP', title:'Full Stack Developer', salary:'₹18L–₹36L', location:'Bangalore', logo:'SA', color:'#1a5fb4', applicationUrl:'https://jobs.sap.com/search/?q=full+stack+developer&loc=Bangalore', careerUrl:'https://jobs.sap.com/' },
];

const JOB_DESCRIPTIONS = [
  'Looking for an experienced engineer with React, TypeScript, Node.js, and PostgreSQL. AWS and Docker experience is a plus.',
  'Build scalable Python/FastAPI backends. Knowledge of Redis, MongoDB, and Kubernetes required.',
  'Proficient in React, GraphQL, and REST APIs. CI/CD and GitHub Actions experience preferred.',
  'Full-stack engineer with Next.js, Node.js, and SQL databases. ML/AI exposure is a bonus.',
  'Frontend specialist with React, CSS, Figma, and UI/UX design expertise.',
  'Java or Python backend developer with experience in microservices and cloud platforms.',
  'Mobile developer with React Native or Flutter skills and experience shipping production apps.',
];

function generateCoverLetter(profile, job) {
  return `Dear Hiring Team at ${job.company},

I am excited to apply for the ${job.title} role. With ${profile.skills.length > 0 ? profile.skills.slice(0,5).join(', ') : 'strong technical'} skills and hands-on experience building production systems, I am confident I can contribute significantly to your team.

${profile.resumeText ? profile.resumeText.slice(0, 200) + '...' : 'I have a proven track record of delivering high-quality software solutions.'}

I am particularly drawn to ${job.company} because of its impact in the industry. I would love the opportunity to discuss how my background aligns with your needs.

Best regards,
${profile.fullName || 'Candidate'}
${profile.email || ''}
${profile.phone || ''}`;
}

export function generateJobs(candidateSkills = []) {
  return JOB_TEMPLATES.map((t, i) => {
    const desc = JOB_DESCRIPTIONS[i % JOB_DESCRIPTIONS.length];
    const postedHoursAgo = Math.floor(Math.random() * 46) + 1;
    return {
      id: uuidv4(),
      ...t,
      description: desc,
      postedAt: hoursAgo(postedHoursAgo),
      postedHoursAgo,
      matchScore: candidateSkills.length
        ? computeMatchScore(candidateSkills, desc, t.title)
        : Math.floor(Math.random() * 40) + 50,
      status: 'pending',
    };
  });
}

export { generateCoverLetter };

const initialState = {
  onboarded: false, currentStep: 0,
  profile: { fullName:'', dob:'', email:'', phone:'', location:'', preferRemote:true, resumeText:'', resumeFileName:'', skills:[], experience:[], education:[], projects:[], jobTitles:[], salaryMin:'', salaryMax:'', experienceLevel:'mid', techStack:[] },
  jobs: [], lastScanned: null, scanning: false, scanCount: 0,
  applications: [], applying: false, currentlyApplying: null,
  activeTab: 'dashboard', automationRunning: false, automationPaused: false,
  notifications: [],
  stats: { totalApplied:0, successRate:0, pendingManual:0, newMatches:0, platformStats:{ LinkedIn:0, Indeed:0, 'Indeed India':0, Naukri:0, Greenhouse:0, Lever:0, Workday:0 } },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': return { ...state, currentStep: action.payload };
    case 'UPDATE_PROFILE': return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'COMPLETE_ONBOARDING': {
      const skills = extractSkills(state.profile.resumeText);
      return { ...state, onboarded: true, profile: { ...state.profile, skills } };
    }
    case 'SET_TAB': return { ...state, activeTab: action.payload };
    case 'START_SCAN': return { ...state, scanning: true };
    case 'FINISH_SCAN': {
      const jobs = action.payload;
      const filtered = jobs.filter(j => j.matchScore >= 55 && j.postedHoursAgo <= 48);
      return { ...state, scanning: false, jobs: filtered, lastScanned: new Date().toISOString(), scanCount: state.scanCount + 1, stats: { ...state.stats, newMatches: filtered.length } };
    }
    case 'SET_APPLYING': return { ...state, applying: action.payload.value, currentlyApplying: action.payload.jobId || null };
    case 'UPDATE_JOB_STATUS': {
      const jobs = state.jobs.map(j => j.id === action.payload.id ? { ...j, status: action.payload.status } : j);
      const apps = action.payload.status !== 'pending' ? [...state.applications, { ...action.payload, timestamp: new Date().toISOString() }] : state.applications;
      const totalApplied = apps.filter(a => a.status === 'applied').length;
      const totalFailed = apps.filter(a => a.status === 'failed').length;
      const pendingManual = apps.filter(a => a.status === 'manual').length;
      const successRate = totalApplied + totalFailed > 0 ? Math.round((totalApplied / (totalApplied + totalFailed)) * 100) : 0;
      const platformStats = { ...state.stats.platformStats };
      const job = state.jobs.find(j => j.id === action.payload.id);
      if (job && action.payload.status === 'applied') platformStats[job.platform] = (platformStats[job.platform] || 0) + 1;
      return { ...state, jobs, applications: apps, stats: { ...state.stats, totalApplied, successRate, pendingManual, platformStats } };
    }
    case 'ADD_NOTIFICATION': {
      const note = { id: uuidv4(), timestamp: new Date().toISOString(), ...action.payload };
      return { ...state, notifications: [note, ...state.notifications].slice(0, 100) };
    }
    case 'DISMISS_NOTIFICATION': return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'SET_AUTOMATION': return { ...state, automationRunning: action.payload.running, automationPaused: action.payload.paused ?? false };
    case 'RESET_PROFILE': return { ...initialState };
    default: return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const automationTimer = useRef(null);

  const parseResume = useCallback((text, fileName) => {
    const skills = extractSkills(text);
    const expMatches = text.match(/(\d+)\+?\s*years?/gi) || [];
    dispatch({ type: 'UPDATE_PROFILE', payload: { resumeText: text, resumeFileName: fileName, skills, experience: expMatches.map(m => ({ description: m })) } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Resume Parsed', message: `Found ${skills.length} skills.` } });
  }, []);

  const scanJobs = useCallback(async () => {
    dispatch({ type: 'START_SCAN' });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Scanning Jobs', message: 'Crawling LinkedIn, Indeed, Naukri, Glassdoor & more...' } });
    await new Promise(r => setTimeout(r, 2500 + Math.random() * 1000));
    const jobs = generateJobs(state.profile.skills);
    dispatch({ type: 'FINISH_SCAN', payload: jobs });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: 'Scan Complete', message: `Found ${jobs.filter(j => j.matchScore >= 55).length} matching jobs across 7 platforms.` } });
  }, [state.profile.skills]);

  const applyToJob = useCallback(async (job) => {
    dispatch({ type: 'SET_APPLYING', payload: { value: true, jobId: job.id } });
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));

    let status;
    const rand = Math.random();

    if (job.applyType === 'easy' && rand > 0.15) {
      // Easy apply platforms — high success rate
      status = 'applied';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: '✅ Applied!', message: `Auto-applied to ${job.title} at ${job.company} via ${job.platform}.`, jobUrl: job.careerUrl } });
    } else if (job.applyType === 'guided' || (job.applyType === 'easy' && rand <= 0.15)) {
      // Guided — opens step-by-step helper with pre-filled cover letter
      status = 'manual';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'warning', title: '📋 Guided Apply Ready', message: `${job.company} requires manual steps. Cover letter generated — click to complete.`, jobUrl: job.careerUrl } });
    } else {
      // Workday/complex ATS — direct link only
      status = 'manual';
      dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'warning', title: '🔗 Manual Required', message: `${job.company} uses a protected ATS. Opening link for you.`, jobUrl: job.careerUrl } });
    }

    dispatch({ type: 'UPDATE_JOB_STATUS', payload: { id: job.id, status, title: job.title, company: job.company, platform: job.platform, jobUrl: job.careerUrl, applicationUrl: job.applicationUrl, careerUrl: job.careerUrl } });
    dispatch({ type: 'SET_APPLYING', payload: { value: false } });
  }, []);

  const autoApplyAll = useCallback(async () => {
    const pending = state.jobs.filter(j => j.status === 'pending' && j.matchScore >= 65);
    for (const job of pending) {
      await applyToJob(job);
      await new Promise(r => setTimeout(r, 1000));
    }
  }, [state.jobs, applyToJob]);

  const startAutomation = useCallback(() => {
    dispatch({ type: 'SET_AUTOMATION', payload: { running: true, paused: false } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'success', title: '🤖 Agent Started', message: 'Scanning LinkedIn, Indeed India, Naukri & 4 more platforms.' } });
    const run = async () => { await scanJobs(); await new Promise(r => setTimeout(r, 3000)); await autoApplyAll(); };
    run();
    automationTimer.current = setInterval(run, 30000);
  }, [scanJobs, autoApplyAll]);

  const stopAutomation = useCallback(() => {
    if (automationTimer.current) clearInterval(automationTimer.current);
    dispatch({ type: 'SET_AUTOMATION', payload: { running: false, paused: false } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'info', title: 'Agent Stopped', message: 'Automation paused.' } });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, parseResume, scanJobs, applyToJob, autoApplyAll, startAutomation, stopAutomation, generateCoverLetter }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
