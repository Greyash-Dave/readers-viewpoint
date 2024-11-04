import React, { useContext, useCallback, useEffect } from 'react';
import { EPUBContext } from './EPUBContext';
import ePub from 'epubjs';
import './Controls.css';

const Controls = () => {
  const {
    book,
    initBook,
    setSidebarOpen,
    hamburgerOpen, setHamburgerOpen,
    fontSize, setFontSize,
    textColor, setTextColor,
    backgroundColor, setBackgroundColor,
    youtubeUrl, setYoutubeUrl,
    BGImage, setBGImage,
    hideBGImage, setHideBGImage,
    isVideoPlaying, setIsVideoPlaying,
    currentSection, setCurrentSection,
    sections,
    viewerRef,
    renditionRef,
    displaySection
  } = useContext(EPUBContext);

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const bookData = e.target.result;
        const newBook = ePub(bookData);
        initBook(newBook);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [initBook]);

  const handleBGImageChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
        const reader = new FileReader();

        // Define what happens when the file is read
        reader.onload = (e) => {
            setBGImage(e.target.result); // Set the image source to the file's data URL
            setHideBGImage(false); // UnHide the background image
        };

        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

  useEffect(() => {
    if (book && viewerRef.current) {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }

      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'scrolled-doc',
        spread: 'none',
      });

      renditionRef.current = rendition;

      applyStyles();

      rendition.on('locationChanged', (location) => {
        updateCurrentSection(location);
      });

      if (sections.length > 0) {
        displaySection(0);
      }
    }
  }, [book, viewerRef, renditionRef, sections, displaySection]);

  const applyStyles = useCallback(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.default({
        'body': {
          'font-size': `${fontSize}px`,
          'color': textColor,
          'background-color': backgroundColor
        }
      });
      renditionRef.current.views().forEach(view => view.pane ? view.pane.render() : null);
    }
  }, [fontSize, textColor, backgroundColor]);

  useEffect(() => {
    applyStyles();
  }, [applyStyles]);

  const updateCurrentSection = useCallback((location) => {
    if (renditionRef.current && book) {
      const currentHref = location.start.href;
      const sectionIndex = sections.findIndex(section => section.href.includes(currentHref));
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
      }
    }
  }, [book, sections, currentSection]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, [setSidebarOpen]);

  const toggleVideoPlayPause = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const goToNextSection = useCallback(() => {
    if (currentSection < sections.length - 1) {
      displaySection(currentSection + 1);
    }
  }, [currentSection, sections.length, displaySection]);

  const goToPreviousSection = useCallback(() => {
    if (currentSection > 0) {
      displaySection(currentSection - 1);
    }
  }, [currentSection, displaySection]);


    // Convert hex color to RGBA
    const hexToRGBA = (hex, alpha = 1) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
    
      // Handle background color change with transparency
      const handleBackgroundColorChange = (e) => {
        const hex = e.target.value;
        const alpha = parseFloat(document.getElementById('bgAlpha').value);
        setBackgroundColor(hexToRGBA(hex, alpha));
      };
    
      // Handle alpha value change
      const handleAlphaChange = (e) => {
        const hex = document.getElementById('bgColor').value;
        const alpha = parseFloat(e.target.value);
        setBackgroundColor(hexToRGBA(hex, alpha));
      };
    
      // Extract hex color and alpha from RGBA
      const rgbaToHexAndAlpha = (rgba) => {
        const parts = rgba.match(/[\d.]+/g);
        if (parts && parts.length === 4) {
          const r = parseInt(parts[0]).toString(16).padStart(2, '0');
          const g = parseInt(parts[1]).toString(16).padStart(2, '0');
          const b = parseInt(parts[2]).toString(16).padStart(2, '0');
          return { hex: `#${r}${g}${b}`, alpha: parseFloat(parts[3]) };
        }
        return { hex: '#ffffff', alpha: 1 };
      };
    
      const { hex: bgHex, alpha: bgAlpha } = rgbaToHexAndAlpha(backgroundColor);
    

  return (
    <>
    <div className={`controls ${hamburgerOpen ? 'open' : ''}`}>
        {hamburgerOpen ?
        <img src="/x.png" alt="Hamburger Menu" className="hamburger-menu" onClick={() => setHamburgerOpen(false)} />
        : <img src="/hamburger.png" alt="Hamburger Menu" className="hamburger-menu" onClick={() => setHamburgerOpen(true)} />}
        <h1>Reader's Viewpoint</h1>
        <div className="general-controls">
        <button onClick={toggleSidebar}>Toggle Sidebar</button>
        <input type="file" onChange={handleFileChange} accept=".epub" />
        </div>
        <div className="style-controls">
        <label>
          Font Size:
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            min="8"
            max="32"
          />
        </label>
        <label>
          Text Color:
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>
        <label>
          Background Color:
          <input
            id="bgColor"
            type="color"
            value={bgHex}
            onChange={handleBackgroundColorChange}
          />
        </label>
        <label>
          Background Opacity:
          <input
            id="bgAlpha"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bgAlpha}
            onChange={handleAlphaChange}
          />
        </label>
      </div>
      <div className="youtube-controls">
        <label>
          YouTube URL:
          <input
            type="text"
            value={youtubeUrl}
            onChange={handleYoutubeUrlChange}
            placeholder="Enter YouTube URL"
          />
        </label>
        {(
          <button onClick={toggleVideoPlayPause}>
            {youtubeUrl && isVideoPlaying ? 'Pause Video' : 'Play Video'}
          </button>
        )}
        </div>
        <div className="bg-image-controls">
        <label>
          BG Image:
          <input type="file" onChange={handleBGImageChange} accept="image/*" />
        </label>
        {BGImage && 
        !hideBGImage ? (
          <button onClick={() => setHideBGImage(true)}>
            Hide BG Image
          </button>
        ): (
          <button onClick={() => setHideBGImage(false)}>
            Show BG Image
          </button>
        )}
        </div>
        <div className="navigation-controls">
            <button onClick={goToPreviousSection} disabled={!book || currentSection === 0}>
                Previous Chapter
            </button>
            <button onClick={goToNextSection} disabled={!book || currentSection === sections.length - 1}>
                Next Chapter
            </button>
            <span>
                Chapter {currentSection + 1} of {sections.length}
            </span>
        </div>
        {/* <p>Use left and right arrow keys to navigate between sections</p> */}
    </div>
    </>
  );
};

export default Controls;
