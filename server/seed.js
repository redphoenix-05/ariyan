/**
 * Seed script — run once to create admin and sample data
 * Usage: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Profile = require('./models/Profile');
const Education = require('./models/Education');
const Experience = require('./models/Experience');
const Project = require('./models/Project');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Admin (set ADMIN_USERNAME and ADMIN_PASSWORD in .env before seeding)
  const existing = await Admin.findOne();
  if (!existing && process.env.ADMIN_PASSWORD) {
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD,
    });
    console.log('✅ Admin created from environment variables');
  } else {
    console.log('ℹ️  Admin seed skipped');
  }

  // Profile
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      name: 'Ariyan Aftab',
      title: 'Full-Stack Developer & CSE Student',
      bio: 'Third-year CSE student at KUET with a passion for building full-stack web applications, AI systems, and compiler design. I love turning complex ideas into clean, functional software.',
      email: 'ariyan@example.com',
      github: 'https://github.com/ariyanaftab',
      linkedin: 'https://linkedin.com/in/ariyanaftab',
      location: 'Khulna, Bangladesh',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Flutter', 'Python', 'C', 'Java', 'PostgreSQL', 'Supabase', 'Git', 'Docker'],
      seoKeywords: 'Ariyan Aftab, Ariyan Aftab portfolio, KUET CSE developer, full-stack developer Bangladesh, Ariyan Aftab KUET',
    });
    console.log('✅ Profile created');
  }

  // Education
  const edCount = await Education.countDocuments();
  if (edCount === 0) {
    await Education.insertMany([
      { institution: 'Khulna University of Engineering & Technology', degree: 'B.Sc. in Computer Science & Engineering', field: 'Computer Science and Engineering', startYear: '2021', endYear: 'Present', grade: 'Ongoing', description: 'Studying core CS topics including algorithms, AI, compiler design, systems, and full-stack development.', order: 0 },
      { institution: 'Your College Name', degree: 'Higher Secondary Certificate (HSC)', field: 'Science', startYear: '2018', endYear: '2020', grade: 'GPA 5.00', description: 'Science group with Physics, Chemistry, Mathematics, Biology.', order: 1 },
      { institution: 'Your School Name', degree: 'Secondary School Certificate (SSC)', field: 'Science', startYear: '2016', endYear: '2018', grade: 'GPA 5.00', description: '', order: 2 },
    ]);
    console.log('✅ Education seeded');
  }

  // Experience
  const expCount = await Experience.countDocuments();
  if (expCount === 0) {
    await Experience.insertMany([
      {
        company: 'Open Source / Freelance',
        role: 'Full-Stack Developer',
        type: 'Freelance',
        startDate: new Date('2023-01-01'),
        isCurrent: true,
        description: 'Building web applications and contributing to open-source projects. Worked with MERN stack, Flutter, and AI integrations.',
        location: 'Remote',
        technologies: ['React', 'Node.js', 'MongoDB', 'Flutter'],
        order: 0,
      },
    ]);
    console.log('✅ Experience seeded');
  }

  // Projects
  const projCount = await Project.countDocuments();
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: 'VoxMed Connect',
        description: 'Dual-platform healthcare management system with Flutter mobile app and React web dashboard backed by Supabase PostgreSQL.',
        technologies: ['Flutter', 'React', 'Node.js', 'Supabase', 'PostgreSQL'],
        category: 'Mobile',
        featured: true,
        status: 'completed',
        order: 0,
      },
      {
        title: 'ChronoScript Compiler',
        description: 'Custom domain-specific language compiler with time/physics theme, implementing all six compiler phases in C.',
        technologies: ['C', 'Flex', 'Bison', 'LLVM IR'],
        category: 'CLI',
        featured: true,
        githubUrl: '',
        status: 'completed',
        order: 1,
      },
      {
        title: 'Neuron Bot Wars',
        description: 'MERN stack AI combat simulation game with Python AI engine (Minimax/A*) bridged via Express, Three.js rendering.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Three.js', 'Python'],
        category: 'Web',
        featured: false,
        status: 'completed',
        order: 2,
      },
    ]);
    console.log('✅ Projects seeded');
  }

  console.log('\n🎉 Seed complete! Start the server with: node index.js');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
