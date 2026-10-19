/**
 * Seed 30 fictional Japan-based job listings into Firestore.
 * Run from your Ionic project's root after installing firebase-admin.
 * Authentication: GOOGLE_APPLICATION_CREDENTIALS pointing to a service account JSON.
 * The script requires SEED_JOBS_CONFIRM=yes to prevent accidental writes.
 * Upserts only docs with IDs demo-job-001 .. demo-job-030.
 */
const {
  initializeApp,
  applicationDefault
} = require('firebase-admin/app');

const { getFirestore } = require('firebase-admin/firestore');

if (process.env.SEED_JOBS_CONFIRM !== 'yes') {
  console.error('Set SEED_JOBS_CONFIRM=yes to seed 30 placeholder jobs.');
  process.exit(1);
}


initializeApp({
  credential: applicationDefault(),
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

const db = getFirestore();

// All entries below are synthetic demo data, not real vacancies.
const samples = [
  ['Frontend Developer', 'Sakura Digital Studio', 'Tokyo', 'Technology', 'Engineering', 'Full-time', '¥5,000,000–¥7,500,000', 'React, TypeScript, HTML/CSS'],
  ['Backend Engineer', 'Kumo Cloud Labs', 'Osaka', 'Technology', 'Engineering', 'Full-time', '¥5,500,000–¥8,000,000', 'Node.js, REST APIs, PostgreSQL'],
  ['English Language Instructor', 'Maple Learning Center', 'Kyoto', 'Education', 'Teaching', 'Full-time', '¥3,000,000–¥4,000,000', 'English fluency, classroom communication'],
  ['UX/UI Designer', 'Hinode Creative', 'Fukuoka', 'Design', 'Design', 'Full-time', '¥4,200,000–¥6,000,000', 'Figma, user research, prototyping'],
  ['Data Analyst', 'Blue River Analytics', 'Yokohama', 'Technology', 'Data', 'Full-time', '¥4,800,000–¥6,800,000', 'SQL, Excel, dashboards'],
  ['DevOps Engineer', 'Kitsune Systems', 'Tokyo', 'Technology', 'Infrastructure', 'Full-time', '¥6,500,000–¥9,500,000', 'AWS, Docker, CI/CD'],
  ['Customer Success Specialist', 'Harbor Connect', 'Kobe', 'Services', 'Customer Success', 'Full-time', '¥3,600,000–¥5,000,000', 'Customer communication, CRM'],
  ['Mobile App Developer', 'Momiji Mobile', 'Nagoya', 'Technology', 'Engineering', 'Full-time', '¥5,000,000–¥7,800,000', 'Angular, Ionic, mobile development'],
  ['Hotel Front Desk Associate', 'Northern Lights Hospitality', 'Sapporo', 'Hospitality', 'Guest Services', 'Full-time', '¥2,800,000–¥3,800,000', 'Hospitality, basic Japanese communication'],
  ['Digital Marketing Coordinator', 'Neko Media Group', 'Tokyo', 'Marketing', 'Marketing', 'Full-time', '¥3,800,000–¥5,200,000', 'SEO, analytics, content planning'],
  ['QA Automation Engineer', 'Shinkansen Software Works', 'Osaka', 'Technology', 'Quality Assurance', 'Full-time', '¥4,700,000–¥6,800,000', 'Playwright, automated testing'],
  ['Technical Writer', 'Pacific Documentation Co.', 'Sendai', 'Technology', 'Documentation', 'Contract', '¥3,800,000–¥5,000,000', 'Technical writing, Markdown'],
  ['Product Manager', 'Yuzu Product House', 'Tokyo', 'Technology', 'Product', 'Full-time', '¥7,000,000–¥10,000,000', 'Roadmaps, stakeholder management'],
  ['Graphic Designer', 'Hana Branding', 'Hiroshima', 'Design', 'Design', 'Full-time', '¥3,400,000–¥4,800,000', 'Adobe Creative Cloud, visual design'],
  ['IT Support Technician', 'Fuji Office Solutions', 'Shizuoka', 'IT Services', 'Support', 'Full-time', '¥3,400,000–¥4,900,000', 'Windows, networking, troubleshooting'],
  ['Mechanical Design Engineer', 'Aoba Manufacturing', 'Nagoya', 'Manufacturing', 'Engineering', 'Full-time', '¥4,800,000–¥7,000,000', 'CAD, mechanical drawings'],
  ['Sales Development Representative', 'Orbit Business Japan', 'Tokyo', 'Sales', 'Sales', 'Full-time', '¥3,800,000–¥5,500,000', 'Lead generation, CRM, communication'],
  ['Cybersecurity Analyst', 'Tora Security', 'Yokohama', 'Technology', 'Security', 'Full-time', '¥5,500,000–¥8,000,000', 'SIEM, incident response'],
  ['Recruitment Coordinator', 'Bridge Talent Partners', 'Osaka', 'Human Resources', 'Recruiting', 'Full-time', '¥3,300,000–¥4,600,000', 'Scheduling, interviewing, ATS'],
  ['Localization Specialist', 'Kotoba Interactive', 'Kyoto', 'Media', 'Localization', 'Contract', '¥3,600,000–¥5,200,000', 'English-Japanese localization, proofreading'],
  ['Operations Associate', 'Nami Logistics', 'Chiba', 'Logistics', 'Operations', 'Full-time', '¥3,200,000–¥4,400,000', 'Spreadsheets, logistics coordination'],
  ['Business Analyst', 'Sora Consulting', 'Tokyo', 'Consulting', 'Business Analysis', 'Full-time', '¥5,000,000–¥7,200,000', 'Requirements analysis, documentation'],
  ['Game Programmer', 'Pixel Tanuki Studio', 'Fukuoka', 'Gaming', 'Engineering', 'Full-time', '¥4,800,000–¥7,400,000', 'Unity, C#, game development'],
  ['Research Assistant', 'Mizu Research Institute', 'Tsukuba', 'Research', 'Research', 'Contract', '¥3,000,000–¥4,200,000', 'Research methods, data collection'],
  ['Cloud Solutions Architect', 'Hikari Cloud Partners', 'Tokyo', 'Technology', 'Architecture', 'Full-time', '¥8,000,000–¥12,000,000', 'AWS architecture, networking'],
  ['Content Editor', 'Bamboo Publishing', 'Kawasaki', 'Publishing', 'Editorial', 'Part-time', '¥1,800–¥2,500/hour', 'Editing, proofreading, CMS'],
  ['Account Manager', 'Tsubaki Client Services', 'Osaka', 'Business Services', 'Account Management', 'Full-time', '¥4,500,000–¥6,200,000', 'Client relationships, reporting'],
  ['Full Stack Developer', 'Akari Web Products', 'Tokyo', 'Technology', 'Engineering', 'Full-time', '¥5,800,000–¥8,500,000', 'Angular, Node.js, Firebase'],
  ['Tour Experience Coordinator', 'Kansai Travel Collective', 'Nara', 'Tourism', 'Operations', 'Part-time', '¥1,500–¥2,200/hour', 'Guest support, itinerary planning'],
  ['Database Administrator', 'Shiro Data Services', 'Nagoya', 'Technology', 'Database Administration', 'Full-time', '¥5,200,000–¥7,600,000', 'SQL databases, backups, performance tuning']
];

async function main() {
  const batch = db.batch();
  samples.forEach(([jobTitle, companyName, location, industry, func, workType, salary, requirements], index) => {
    const number = String(index + 1).padStart(3, '0');
    const id = `demo-job-${number}`;
    batch.set(db.collection('jobs').doc(id), {
      isBookmarked: 'false',
      isHot: index % 5 === 0 ? 'true' : 'false',
      jobTitle,
      companyName,
      jobID: `DEMO-${number}`,
      location: `${location}, Japan`,
      industry,
      function: func,
      workType,
      salary,
      requirements,
      description: `DEMO LISTING — NOT A REAL VACANCY. ${companyName} is a fictional employer looking for a ${jobTitle} based in ${location}, Japan. This record is intended for testing job discovery, details, filters, and bookmarks in Japan Info Jobs.`,
      positions: '1'
    });
  });
  await batch.commit();
  console.log(`Seeded ${samples.length} fictional listings to Firestore /jobs (demo-job-001 through demo-job-030).`);
}
main().catch(err => { console.error(err); process.exitCode = 1; });
