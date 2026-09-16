import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';

// Home page component: Displays Hero, About, and Skills sections from Practical 1
function Home({ studentProfile, skillList, categorizedSkills, themeColor }) {
  return (
    <div className="page-container home-page">
      {/* Hero Header */}
      <Header
        name={studentProfile.name}
        role={studentProfile.role}
        university={studentProfile.university}
        themeColor={themeColor}
        targetRoles={studentProfile.targetRoles}
      />

      {/* Quick Navigation Cards */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        <Link to="/projects" className="btn-primary" style={{ backgroundColor: themeColor }}>
          🚀 Explore My Projects Page
        </Link>
        <Link to="/contact" className="btn-secondary">
          💬 Send Me a Message (Interactive Contact)
        </Link>
      </div>

      {/* About Me Section */}
      <About
        summary={studentProfile.summary}
        education={studentProfile.education}
        experience={studentProfile.internship}
        strengths={studentProfile.strengths}
      />

      {/* Skills Section */}
      <Skills
        skillList={skillList}
        categorizedSkills={categorizedSkills}
      />
    </div>
  );
}

export default Home;
