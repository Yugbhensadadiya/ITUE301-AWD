import React, { useState, useEffect } from 'react';
// import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, []);

  // Student Portfolio Data (Sourced directly from Yug Bhensadadiya's Resume)
  const studentProfile = {
    name: 'Yug Bhensadadiya',
    role: 'Full Stack Developer | Backend Developer | AI/ML Engineer',
    university: 'CHARUSAT University',
    targetRoles: [
      'Full Stack Development',
      'Backend Architecture',
      'AI/ML Solutions',
      'Data Science',
    ],
    summary:
      'Motivated B.Tech Information Technology student at CHARUSAT with a strong interest in Full Stack Development, Backend Development, Artificial Intelligence, and Machine Learning. Hands-on experience building scalable web applications and AI-powered solutions using Django, FastAPI, React, Next.js, Node.js, and PostgreSQL. Strong analytical, problem-solving, and teamwork skills with a continuous learning mindset.',
    education: {
      degree: 'Bachelor of Technology (B.Tech) – Information Technology',
      university: 'CHARUSAT University',
      status: 'Current Student • 5th Semester',
    },
    internship: {
      role: 'Software Development Intern',
      company: '9SERIES',
      project: 'DataSense',
      description:
        'Developed DataSense using Python, FastAPI, and PostgreSQL. Worked on API development, database design, data processing pipelines, and collaborative software development.',
    },
    strengths: [
      'Problem Solving',
      'Fast Learner',
      'Analytical Thinking',
      'Team Collaboration',
      'Adaptability',
      'Continuous Learning',
    ],
  };

  // Step 4 & 6: Array of skills passed as prop to Skills component
  const skillList = [
    'Python',
    'C++',
    'Java',
    'JavaScript',
    'React.js',
    'Next.js',
    'Django',
    'FastAPI',
    'Express.js',
    'REST APIs',
    'PostgreSQL',
    'MySQL',
    'Pandas',
    'NumPy',
    'Scikit-learn',
    'Git',
    'GitHub',
    'Docker & Tools',
  ];

  // Categorized skills mapped for rich display
  const categorizedSkills = {
    languages: ['Python', 'C++', 'Java', 'JavaScript'],
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js'],
    backend: ['Django', 'FastAPI', 'Express.js', 'Node.js', 'REST APIs'],
    databases: ['PostgreSQL', 'MySQL'],
    'ai & ml': ['Pandas', 'NumPy', 'Scikit-learn', 'EDA', 'Data Analysis'],
    tools: ['Git', 'GitHub', 'VS Code', 'Postman'],
  };

  // Post Lab Work: 3 projects list passed as prop to Projects component
  const projectList = [
    {
      id: 1,
      title: 'Complaint Civic Issue Reporting System',
      category: 'Full Stack Web Platform',
      description:
        'A comprehensive full-stack platform empowering citizens to report civic issues and enabling administrative workflows with role-based access.',
      highlights: [
        'Citizen & Admin secure authentication portals using JWT',
        'Interactive real-time complaint tracking dashboard',
        'Scalable REST APIs integrated with PostgreSQL relational database',
      ],
      technologies: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'JWT'],
    },
    {
      id: 2,
      title: 'DataSense (Analytics Platform)',
      category: 'Backend & Data Engineering',
      description:
        'Analytics engine built during internship at 9SERIES for fast processing, data cleaning, and automated insights generation.',
      highlights: [
        'Engineered high-performance backend microservices with FastAPI',
        'Data cleaning & automated insight pipelines using Pandas and NumPy',
        'Normalized relational schemas and query optimizations in PostgreSQL',
      ],
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Pandas', 'NumPy'],
    },
    {
      id: 3,
      title: 'CHARUSAT Informative Website',
      category: 'Frontend Engineering',
      description:
        'Responsive multi-page informational portal designed for university stakeholders with structured hierarchy and cross-browser support.',
      highlights: [
        'Modular multi-page responsive architecture with semantic markup',
        'Interactive navigation menus with accessibility considerations',
        'Clean layout designed with modern CSS3 Flexbox and Grid',
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
    },
  ];

  const courseInfo = {
    code: 'ITUE301',
    title: 'Advanced Web Development',
    practical: 'Practical 1: Introduction to React and Component Architecture',
  };

  // Permanent Cyan theme color
  const themeColor = '#06b6d4';

  return (
    <div className="portfolio-app">
      {/* 1. Reusable Navbar Component */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        studentName={studentProfile.name}
      />

      <main className="main-container">
        {/* 2. Reusable Header Component with themeColor inline style prop */}
        <Header
          name={studentProfile.name}
          role={studentProfile.role}
          university={studentProfile.university}
          themeColor={themeColor}
          targetRoles={studentProfile.targetRoles}
        />

        {/* 3. Reusable About Component */}
        <About
          summary={studentProfile.summary}
          education={studentProfile.education}
          experience={studentProfile.internship}
          strengths={studentProfile.strengths}
        />

        {/* 4. Reusable Skills Component with skillList prop */}
        <Skills
          skillList={skillList}
          categorizedSkills={categorizedSkills}
        />

        {/* 5. Reusable Projects Component (Post Lab Requirement) */}
        <Projects projectList={projectList} />
      </main>

      {/* 6. Reusable Footer Component */}
      <Footer
        author={studentProfile.name}
        github="https://github.com/YugBhensadadiya"
        linkedin="https://www.linkedin.com/in/yug-bhensadadiya"
        email="yugbhensadadiya@gmail.com"
        courseInfo={courseInfo}
      />
    </div>
  );
}

export default App;
