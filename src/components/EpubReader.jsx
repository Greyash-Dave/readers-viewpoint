import React, { useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import Controls from './Controls';
import Reader from './Reader';
import { EPUBContext } from './EPUBContext';
import './EpubReader.css';

const EPUBReader = () => {
  const { 
    book,
    currentSection, 
    sections,
    displaySection,
    setHamburgerOpen
  } = useContext(EPUBContext);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Always allow toggling controls with 'm'
      if (event.key === 'm' || event.key === 'M') {
        if (typeof setHamburgerOpen === 'function') {
          setHamburgerOpen(prev => !prev);
        }
        return;
      }

      // Only process navigation keys if a book is loaded
      if (!book) return;

      switch (event.key) {
        case 'ArrowRight':
          // Move to next chapter if not at the last section
          if (currentSection < sections.length - 1) {
            displaySection(currentSection + 1);
          }
          break;
        case 'ArrowLeft':
          // Move to previous chapter if not at the first section
          if (currentSection > 0) {
            displaySection(currentSection - 1);
          }
          break;
        default:
          break;
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [book, currentSection, sections, displaySection, setHamburgerOpen]); // Dependencies for the effect

  return (
    <>
      <Sidebar />
      <Controls />
      <div className="epub-reader">
        <div className="main-content">
          <Reader />
        </div>
      </div>
    </>
  );
};

export default EPUBReader;