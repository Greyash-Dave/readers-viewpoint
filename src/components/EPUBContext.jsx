import React, { createContext, useState, useRef, useCallback } from 'react';
import ePub from 'epubjs';

export const EPUBContext = createContext();

export const EPUBProvider = ({ children }) => {
  const [book, setBook] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [BGImage, setBGImage] = useState('');
  const [hideBGImage, setHideBGImage] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);

  const initBook = useCallback((newBook) => {
    setBook(newBook);
    newBook.loaded.navigation.then(nav => {
      const toc = nav.toc;
      setSections(toc);
      if (toc.length > 0) {
        displaySection(0);
      }
    });
  }, []);

  const displaySection = useCallback((sectionIndex) => {
    if (renditionRef.current && sections[sectionIndex]) {
      renditionRef.current.display(sections[sectionIndex].href).then(() => {
        console.log(`Displaying section: ${sections[sectionIndex].label}`);
        setCurrentSection(sectionIndex);
      });
    }
  }, [renditionRef, sections, setCurrentSection]);

  const value = {
    book, setBook, initBook,
    currentSection, setCurrentSection,
    sections, setSections,
    fontSize, setFontSize,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    sidebarOpen, setSidebarOpen,
    hamburgerOpen, setHamburgerOpen,
    youtubeUrl, setYoutubeUrl,
    BGImage, setBGImage,
    hideBGImage, setHideBGImage,
    isVideoPlaying, setIsVideoPlaying,
    viewerRef,
    renditionRef,
    displaySection
  };

  return (
    <EPUBContext.Provider value={value}>
      {children}
    </EPUBContext.Provider>
  );
};