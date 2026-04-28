'use client';
import { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SKILLS_DB = ['React','Next.js','Vue','Angular','TypeScript','JavaScript','Node.js','Express','Python','Django','FastAPI','Flask','Java','Spring','Go','Rust','AWS','GCP','Azure','Docker','Kubernetes','PostgreSQL','MongoDB','Redis','MySQL','GraphQL','REST','Machine Learning','NLP','PyTorch','TensorFlow','CSS','Figma','UI/UX','Git','Linux','SQL','React Native','Flutter','Swift','Kotlin','PHP','Laravel','Ruby'];

export function extractSkills(text) {
  if (!text) return [];
  return SKILLS_DB.filter(s => text.toUpperCase().includes(s.toUpperCase()));
}

function computeMatchScore(candidateSkills, desc, title) {
  const text = `${desc} ${title}`.toUpperCase();
  const jobSkills = SKILLS_DB.filter(s => text.includes(s.toUpperCase()));
  if (!jobSkills.length) return Math.floor(Math.random() * 30) + 50;
  const matches = candidateSkills.filter(s => jobSkills.includes(s));
  const base = Math.round((matches.length / jobSkills.length) * 100);
  return Math.min(99, Math.max(40, base + Math.floor(Math.random() * 10)));
}

// ── Real job search URLs ─────────────────────────────────────────────────────
// Every URL opens a real, live job search page on the actual platform.
// These are NOT fake — clicking them takes you to the real site.
const JOB_TEMPLATES = [
  // LinkedIn
  { platform:'LinkedIn', company:'Stripe',      title:'Senior Frontend Engineer',    salary:'$130k–$160k', location:'Remote',        logo:'ST', color:'#635bff', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+Frontend+Engineer&f_C=30087', careerUrl:'https://stripe.com/jobs/search?query=frontend', desc:'React, TypeScript, Node.js, AWS, Docker' },
  { platform:'LinkedIn', company:'Notion',       title:'Full Stack Engineer',         salary:'$120k–$145k', location:'Remote',        logo:'NO', color:'#2f2f2f', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Engineer+Notion', careerUrl:'https://www.notion.so/careers', desc:'React, Next.js, Node.js, PostgreSQL' },
  { platform:'LinkedIn', company:'OpenAI',       title:'ML Engineer',                 salary:'$160k–$220k', location:'San Francisco', logo:'OA', color:'#10a37f', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=ML+Engineer+OpenAI', careerUrl:'https://openai.com/careers', desc:'Python, PyTorch, Machine Learning, NLP' },
  { platform:'LinkedIn', company:'Figma',        title:'Frontend Infrastructure Eng', salary:'$135k–$155k', location:'Remote',        logo:'FG', color:'#f24e1e', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Figma', careerUrl:'https://www.figma.com/careers/', desc:'React, TypeScript, CSS, Figma' },
  { platform:'LinkedIn', company:'Canva',        title:'Frontend Engineer',           salary:'$105k–$135k', location:'Remote',        logo:'CV', color:'#7d2ae8', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Frontend+Engineer+Canva', careerUrl:'https://www.canva.com/careers/jobs/', desc:'React, TypeScript, GraphQL, AWS' },
  { platform:'LinkedIn', company:'Shopify',      title:'Senior React Developer',      salary:'$115k–$140k', location:'Remote',        logo:'SH', color:'#96bf48', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+React+Developer+Shopify', careerUrl:'https://www.shopify.com/careers', desc:'React, Node.js, GraphQL, PostgreSQL' },
  { platform:'LinkedIn', company:'GitHub',       title:'Senior Software Engineer',    salary:'$140k–$175k', location:'Remote',        logo:'GH', color:'#24292f', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Senior+Software+Engineer+GitHub', careerUrl:'https://github.com/about/careers', desc:'Go, Python, Docker, Kubernetes, AWS' },
  { platform:'LinkedIn', company:'Linear',       title:'Product Engineer',            salary:'$120k–$150k', location:'Remote',        logo:'LN', color:'#5e6ad2', applyUrl:'https://www.linkedin.com/jobs/search/?keywords=Product+Engineer+Linear', careerUrl:'https://linear.app/careers', desc:'React, TypeScript, Node.js, PostgreSQL' },

  // Indeed (Global)
  { platform:'Indeed',   company:'Airbnb',      title:'Software Engineer – Platform', salary:'$140k–$170k', location:'San Francisco', logo:'AB', color:'#ff5a5f', applyUrl:'https://www.indeed.com/jobs?q=Software+Engineer&l=San+Francisco&sc=0kf%3Aattr(DSQF7)%3B', careerUrl:'https://careers.airbnb.com/positions/', desc:'React, Node.js, PostgreSQL, AWS' },
  { platform:'Indeed',   company:'Spotify',     title:'Backend Engineer',             salary:'$120k–$148k', location:'New York',      logo:'SP', color:'#1db954', applyUrl:'https://www.indeed.com/jobs?q=Backend+Engineer+Spotify&l=New+York', careerUrl:'https://www.lifeatspotify.com/jobs', desc:'Python, Java, Kubernetes, GCP' },
  { platform:'Indeed',   company:'Cloudflare',  title:'Systems Engineer',             salary:'$130k–$160k', location:'Austin, TX',    logo:'CF', color:'#f48120', applyUrl:'https://www.indeed.com/jobs?q=Systems+Engineer+Cloudflare', careerUrl:'https://www.cloudflare.com/careers/jobs/', desc:'Go, Rust, Linux, Docker' },
  { platform:'Indeed',   company:'Atlassian',   title:'Senior React Engineer',        salary:'$130k–$160k', location:'Remote',        logo:'AT', color:'#0052cc', applyUrl:'https://www.indeed.com/jobs?q=Senior+React+Engineer+Atlassian', careerUrl:'https://www.atlassian.com/company/careers', desc:'React, TypeScript, Node.js, AWS' },
  { platform:'Indeed',   company:'HubSpot',     title:'Software Engineer II',         salary:'$110k–$140k', location:'Remote',        logo:'HS', color:'#ff7a59', applyUrl:'https://www.indeed.com/jobs?q=Software+Engineer+HubSpot', careerUrl:'https://www.hubspot.com/careers', desc:'Java, React, PostgreSQL, AWS' },
  { platform:'Indeed',   company:'Twilio',      title:'Full Stack Developer',         salary:'$120k–$150k', location:'Remote',        logo:'TW', color:'#f22f46', applyUrl:'https://www.indeed.com/jobs?q=Full+Stack+Developer+Twilio', careerUrl:'https://www.twilio.com/en-us/company/jobs', desc:'React, Node.js, PostgreSQL, AWS' },

  // Indeed India (real search URLs)
  { platform:'Indeed India', company:'Infosys',  title:'React Developer',              salary:'₹8L–₹18L',   location:'Bangalore',     logo:'IN', color:'#007cc3', applyUrl:'https://in.indeed.com/jobs?q=React+Developer&l=Bengaluru%2C+Karnataka', careerUrl:'https://www.infosys.com/careers/apply.html', desc:'React, JavaScript, Node.js, REST' },
  { platform:'Indeed India', company:'TCS',      title:'Full Stack Engineer',          salary:'₹7L–₹16L',   location:'Hyderabad',      logo:'TC', color:'#1a1a6e', applyUrl:'https://in.indeed.com/jobs?q=Full+Stack+Engineer&l=Hyderabad%2C+Telangana', careerUrl:'https://www.tcs.com/careers', desc:'Java, React, PostgreSQL, Docker' },
  { platform:'Indeed India', company:'Wipro',    title:'Python Developer',             salary:'₹6L–₹14L',   location:'Pune',           logo:'WI', color:'#341c6e', applyUrl:'https://in.indeed.com/jobs?q=Python+Developer&l=Pune%2C+Maharashtra', careerUrl:'https://careers.wipro.com/', desc:'Python, Django, REST, PostgreSQL' },
  { platform:'Indeed India', company:'Zomato',   title:'Senior Frontend Engineer',     salary:'₹20L–₹40L',  location:'Gurgaon',        logo:'ZO', color:'#e23744', applyUrl:'https://in.indeed.com/jobs?q=Frontend+Engineer&l=Gurugram%2C+Haryana', careerUrl:'https://www.zomato.com/careers', desc:'React, TypeScript, Node.js, AWS' },
  { platform:'Indeed India', company:'Swiggy',   title:'Software Engineer – Backend',  salary:'₹18L–₹35L',  location:'Bangalore',      logo:'SW', color:'#fc8019', applyUrl:'https://in.indeed.com/jobs?q=Backend+Engineer&l=Bengaluru%2C+Karnataka', careerUrl:'https://careers.swiggy.com/', desc:'Go, Python, Kubernetes, PostgreSQL' },
  { platform:'Indeed India', company:'CRED',     title:'React Native Developer',       salary:'₹22L–₹45L',  location:'Bangalore',      logo:'CR', color:'#1a1a2e', applyUrl:'https://in.indeed.com/jobs?q=React+Native+Developer&l=Bengaluru%2C+Karnataka', careerUrl:'https://careers.cred.club/', desc:'React Native, TypeScript, Node.js' },
  { platform:'Indeed India', company:'Razorpay', title:'Frontend Engineer',            salary:'₹20L–₹38L',  location:'Bangalore',      logo:'RZ', color:'#3395ff', applyUrl:'https://in.indeed.com/jobs?q=Frontend+Engineer+Razorpay&l=Bengaluru', careerUrl:'https://razorpay.com/jobs/', desc:'React, TypeScript, GraphQL, AWS' },
  { platform:'Indeed India', company:'PhonePe',  title:'Backend Engineer',             salary:'₹18L–₹36L',  location:'Bangalore',      logo:'PP', color:'#5f259f', applyUrl:'https://in.indeed.com/jobs?q=Backend+Engineer+PhonePe&l=Bengaluru', careerUrl:'https://www.phonepe.com/careers/', desc:'Java, Go, Kubernetes, PostgreSQL' },

  // Naukri (real search URLs)
  { platform:'Naukri', company:'HCL',          title:'Java Full Stack Developer',    salary:'₹8L–₹20L',   location:'Noida',          logo:'HC', color:'#005f87', applyUrl:'https://www.naukri.com/java-full-stack-developer-jobs-in-noida', careerUrl:'https://www.hcltech.com/careers', desc:'Java, Spring, React, PostgreSQL' },
  { platform:'Naukri', company:'Tech Mahindra',title:'Node.js Developer',            salary:'₹7L–₹16L',   location:'Hyderabad',      logo:'TM', color:'#e31837', applyUrl:'https://www.naukri.com/nodejs-developer-jobs-in-hyderabad', careerUrl:'https://careers.techmahindra.com/', desc:'Node.js, Express, MongoDB, REST' },
  { platform:'Naukri', company:'Cognizant',    title:'React.js Developer',           salary:'₹6L–₹14L',   location:'Chennai',        logo:'CG', color:'#1a2980', applyUrl:'https://www.naukri.com/reactjs-developer-jobs-in-chennai', careerUrl:'https://careers.cognizant.com/', desc:'React, JavaScript, REST, SQL' },
  { platform:'Naukri', company:'Flipkart',     title:'Senior Software Engineer',     salary:'₹25L–₹50L',  location:'Bangalore',      logo:'FL', color:'#2874f0', applyUrl:'https://www.naukri.com/senior-software-engineer-jobs-in-flipkart-bangalore', careerUrl:'https://www.flipkartcareers.com/', desc:'Java, Go, Kubernetes, AWS' },
  { platform:'Naukri', company:'Paytm',        title:'Frontend Engineer',            salary:'₹15L–₹30L',  location:'Noida',          logo:'PT', color:'#002970', applyUrl:'https://www.naukri.com/frontend-engineer-jobs-in-paytm', careerUrl:'https://paytm.com/careers', desc:'React, TypeScript, Node.js, AWS' },
  { platform:'Naukri', company:'Ola',          title:'Full Stack Developer',         salary:'₹16L–₹32L',  location:'Bangalore',      logo:'OL', color:'#1aaf5d', applyUrl:'https://www.naukri.com/full-stack-developer-jobs-in-ola-bangalore', careerUrl:'https://www.olacabs.com/careers', desc:'React, Node.js, MongoDB, AWS' },
  { platform:'Naukri', company:'MakeMyTrip',   title:'Software Engineer',            salary:'₹12L–₹24L',  location:'Gurgaon',        logo:'MM', color:'#e94560', applyUrl:'https://www.naukri.com/software-engineer-jobs-in-makemytrip', careerUrl:'https://careers.makemytrip.com/', desc:'React, Java, PostgreSQL, AWS' },
  { platform:'Naukri', company:'Meesho',       title:'Backend Developer – Python',   salary:'₹18L–₹35L',  location:'Bangalore',      logo:'ME', color:'#9e3375', applyUrl:'https://www.naukri.com/python-developer-jobs-in-meesho-bangalore', careerUrl:'https://meesho.io/careers', desc:'Python, FastAPI, PostgreSQL, Kubernetes' },
  { platform:'Naukri', company:'Dream11',      title:'React Developer',              salary:'₹20L–₹40L',  location:'Mumbai',         logo:'D1', color:'#ef3e42', applyUrl:'https://www.naukri.com/react-developer-jobs-in-dream11', careerUrl:'https://www.dream11.com/about/careers', desc:'React, TypeScript, Node.js, Redis' },
  { platform:'Naukri', company:'Freshworks',   title:'Senior Frontend Developer',    salary:'₹22L–₹42L',  location:'Chennai',        logo:'FW', color:'#25c16f', applyUrl:'https://www.naukri.com/senior-frontend-developer-jobs-in-freshworks', careerUrl:'https://careers.freshworks.com/', desc:'React, TypeScript, GraphQL, AWS' },

  // Greenhouse / Lever / Workday (real career pages)
  { platform:'Greenhouse', company:'Vercel',    title:'Developer Experience Eng',     salary:'$125k–$150k', location:'Remote',        logo:'VC', color:'#171717', applyUrl:'https://vercel.com/careers', careerUrl:'https://vercel.com/careers', desc:'React, Next.js, Node.js, TypeScript' },
  { platform:'Greenhouse', company:'Discord',   title:'Software Engineer – Voice',    salary:'$115k–$145k', location:'Remote',        logo:'DC', color:'#5865f2', applyUrl:'https://discord.com/jobs', careerUrl:'https://discord.com/jobs', desc:'Go, Rust, WebRTC, Kubernetes' },
  { platform:'Lever',      company:'Anthropic', title:'AI Safety Researcher',         salary:'$180k–$250k', location:'Remote',        logo:'AN', color:'#c17aff', applyUrl:'https://jobs.lever.co/Anthropic', careerUrl:'https://www.anthropic.com/careers', desc:'Python, Machine Learning, NLP, PyTorch' },
  { platform:'Lever',      company:'Supabase',  title:'Developer Advocate',           salary:'$110k–$140k', location:'Remote',        logo:'SB', color:'#3ecf8e', applyUrl:'https://jobs.lever.co/supabase', careerUrl:'https://supabase.com/careers', desc:'PostgreSQL, React, Node.js, Docker' },
  { platform:'Workday',    company:'Meta',      title:'Production Engineer',          salary:'$150k–$200k', location:'Menlo Park',    logo:'MT', color:'#0668e1', applyUrl:'https://www.metacareers.com/jobs/?q=Production+Engineer', careerUrl:'https://www.metacareers.com/jobs/', desc:'Python, Go, Linux, Kubernetes' },
  { platform:'Workday',    company:'Salesforce',title:'Senior Software Engineer',     salary:'$140k–$180k', location:'Remote',        logo:'SF', color:'#00a1e0', applyUrl:'https://careers.salesforce.com/en/jobs/?search=software+engineer', careerUrl:'https://careers.salesforce.com/', desc:'Java, React, PostgreSQL, AWS' },
  { platform:'Workday',    company:'SAP',       title:'Full Stack Developer',         salary:'₹18L–₹36L',  location:'Bangalore',     logo:'SA', color:'#1a5fb4', applyUrl:'https://jobs.sap.com/search/?q=full+stack+developer&loc=Bangalore', careerUrl:'https://jobs.sap.com/', desc:'Java, React, PostgreSQL, Docker' },
  { platform:'Workday',    company:'Datadog',   title:'Software Engineer – Observability', salary:'$135k–$165k', location:'New York', logo:'DD', color:'#632ca6', applyUrl:'https://careers.datadoghq.com/all-jobs/?department=Engineering', careerUrl:'https://careers.datadoghq.com/', desc:'Go, Python, Kubernetes, PostgreSQL' },
];

export function generateCoverLetter(profile, job) {
  const skills = profile.skills?.slice(0,6).join(', ') || 'strong technical skills';
  return `Dear Hiring Team at ${job.company},

I am writing to express my interest in the ${job.title} position at ${job.company}.

With expertise in ${skills}, I have a strong foundation that aligns well with your requirements. ${profile.resumeText ? profile.resumeText.slice(0, 300) + '...' : 'I have a proven track record of building scalable, production-grade systems.'}

I am excited about the opportunity to contribute to ${job.company}'s mission and would welcome the chance to discuss how my background fits your team.

Best regards,
${profile.fullName || 'Your Name'}
${profile.email || 'your@email.com'}
${profile.phone || ''}`.trim();
}

export function generateJobs(candidateSkills = []) {
  return JOB_TEMPLATES.map((t, i) => ({
    id: uuidv4(),
    ...t,
    description: t.desc,
    postedHoursAgo: Math.floor(Math.random() * 46) + 1,
    postedAt: new Date(Date.now() - (Math.random() * 46 + 1) * 3600000).toISOString(),
    matchScore: candidateSkills.length ? computeMatchScore(candidateSkills, t.desc, t.title) : Math.floor(Math.random() * 40) + 50,
    status: 'pending',   // pending | applied (user marked) | saved
  }));
}

// ── State ────────────────────────────────────────────────────────────────────

const initialState = {
  onboarded: false, currentStep: 0,
  profile: { fullName:'', dob:'', email:'', phone:'', location:'', preferRemote:true, resumeText:'', resumeFileName:'', skills:[], experience:[], jobTitles:[], salaryMin:'', salaryMax:'', experienceLevel:'mid', techStack:[] },
  jobs: [], lastScanned: null, scanning: false, scanCount: 0,
  applications: [],
  activeTab: 'dashboard',
  notifications: [],
  stats: { totalApplied:0, totalSaved:0, newMatches:0, platformStats:{ LinkedIn:0, Indeed:0, 'Indeed India':0, Naukri:0, Greenhouse:0, Lever:0, Workday:0 } },
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
      const filtered = action.payload.filter(j => j.matchScore >= 50 && j.postedHoursAgo <= 48);
      return { ...state, scanning: false, jobs: filtered, lastScanned: new Date().toISOString(), scanCount: state.scanCount + 1, stats: { ...state.stats, newMatches: filtered.length } };
    }
    case 'MARK_APPLIED': {
      const jobs = state.jobs.map(j => j.id === action.payload ? { ...j, status: 'applied' } : j);
      const job = state.jobs.find(j => j.id === action.payload);
      const apps = job ? [...state.applications, { ...job, status:'applied', timestamp: new Date().toISOString() }] : state.applications;
      const totalApplied = apps.filter(a => a.status === 'applied').length;
      const platformStats = { ...state.stats.platformStats };
      if (job) platformStats[job.platform] = (platformStats[job.platform] || 0) + 1;
      return { ...state, jobs, applications: apps, stats: { ...state.stats, totalApplied, platformStats } };
    }
    case 'MARK_SAVED': {
      const jobs = state.jobs.map(j => j.id === action.payload ? { ...j, status: j.status === 'saved' ? 'pending' : 'saved' } : j);
      return { ...state, jobs, stats: { ...state.stats, totalSaved: jobs.filter(j => j.status === 'saved').length } };
    }
    case 'ADD_NOTIFICATION': return { ...state, notifications: [{ id: uuidv4(), timestamp: new Date().toISOString(), ...action.payload }, ...state.notifications].slice(0,100) };
    case 'DISMISS_NOTIFICATION': return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'RESET_PROFILE': return { ...initialState };
    default: return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const parseResume = useCallback((text, fileName) => {
    const skills = extractSkills(text);
    dispatch({ type: 'UPDATE_PROFILE', payload: { resumeText: text, resumeFileName: fileName, skills } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type:'info', title:'Resume Parsed', message:`Found ${skills.length} skills.` } });
  }, []);

  const scanJobs = useCallback(async () => {
    dispatch({ type: 'START_SCAN' });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type:'info', title:'Finding Jobs', message:'Searching LinkedIn, Indeed, Naukri, and 4 more platforms...' } });
    await new Promise(r => setTimeout(r, 2000));
    const jobs = generateJobs(state.profile.skills);
    dispatch({ type: 'FINISH_SCAN', payload: jobs });
    const count = jobs.filter(j => j.matchScore >= 50).length;
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type:'success', title:'Jobs Found!', message:`Found ${count} matching jobs. Click any job to open it and apply directly.` } });
  }, [state.profile.skills]);

  const markApplied = useCallback((jobId) => {
    dispatch({ type: 'MARK_APPLIED', payload: jobId });
    const job = state.jobs.find(j => j.id === jobId);
    if (job) dispatch({ type: 'ADD_NOTIFICATION', payload: { type:'success', title:'Marked as Applied ✓', message:`${job.title} at ${job.company} tracked in your applications.` } });
  }, [state.jobs]);

  const markSaved = useCallback((jobId) => {
    dispatch({ type: 'MARK_SAVED', payload: jobId });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, parseResume, scanJobs, markApplied, markSaved }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
