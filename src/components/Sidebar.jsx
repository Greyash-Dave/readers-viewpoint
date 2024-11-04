import React, { useContext, useCallback } from 'react';
import { EPUBContext } from './EPUBContext';
import './Sidebar.css';  // Import the CSS file

const Sidebar = () => {
  const { sidebarOpen, sections, renditionRef, setCurrentSection } = useContext(EPUBContext);

  const displaySection = useCallback((sectionIndex) => {
    if (renditionRef.current && sections[sectionIndex]) {
      renditionRef.current.display(sections[sectionIndex].href).then(() => {
        console.log(`Displaying section: ${sections[sectionIndex].label}`);
        setCurrentSection(sectionIndex);
      });
    }
  }, [renditionRef, sections, setCurrentSection]);

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <h2>Table of Contents</h2>
      <ul>
        {sections.map((section, index) => (
          <li key={index} onClick={() => displaySection(index)}>
            {section.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
