import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import TaskManager from './pages/TaskManager';
import NotFound from './pages/NotFound';

/**
 * Practical 2: React Router & useState State Management
 * - React Router v6 Routes:
 *   "/"         -> Home (Profile, About, Skills)
 *   "/projects" -> Projects (Practical 1 Projects)
 *   "/contact"  -> Contact (Controlled input, character counter, UI toggle)
 *   "*"         -> NotFound (404 Page)
 * - State Management with useState:
 *   isDarkMode  -> Light/Dark Theme toggle
 */
function App() {
  // Theme state: useState hook for toggling between Dark and Light mode
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  // Skill List from Practical 1
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

  // Categorized skills mapped for display
  const categorizedSkills = {
    languages: ['Python', 'C++', 'Java', 'JavaScript'],
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js'],
    backend: ['Django', 'FastAPI', 'Express.js', 'Node.js', 'REST APIs'],
    databases: ['PostgreSQL', 'MySQL'],
    'ai & ml': ['Pandas', 'NumPy', 'Scikit-learn', 'EDA', 'Data Analysis'],
    tools: ['Git', 'GitHub', 'VS Code', 'Postman'],
  };

  // 3 Projects from Practical 1
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
    practical: 'Practical 2: React Router & useState State Management',
  };

  const themeColor = '#06b6d4';

  return (
    <div className={`portfolio-app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* 1. Reusable NavBar Component with Navigation Links and Theme Toggle */}
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* 2. Main Content routed dynamically via React Router (No full-page reload) */}
      <main className="main-container">
        <Routes>
          {/* Route 1: Home Page */}
          <Route
            path="/"
            element={
              <Home
                studentProfile={studentProfile}
                skillList={skillList}
                categorizedSkills={categorizedSkills}
                themeColor={themeColor}
              />
            }
          />

          {/* Route 2: Practical 6 Full Stack Task Manager */}
          <Route path="/tasks" element={<TaskManager />} />

          {/* Route 3: Projects Page */}
          <Route
            path="/projects"
            element={<Projects projectList={projectList} />}
          />

          {/* Route 4: Contact Page with controlled input & UI visibility toggling */}
          <Route
            path="/contact"
            element={<Contact studentProfile={studentProfile} />}
          />

          {/* Route 4: 404 Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* 3. Reusable Footer Component */}
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
