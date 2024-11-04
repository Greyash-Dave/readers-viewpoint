import React, { useContext, useEffect, useRef } from 'react';
import { EPUBContext } from './EPUBContext';
import './Reader.css';

const Reader = () => {
  const {
    book,
    currentSection,
    setCurrentSection,
    sections,
    setSections,
    fontSize,
    textColor,
    backgroundColor,
    youtubeUrl,
    BGImage, setBGImage,
    isVideoPlaying,
    viewerRef,
    renditionRef
  } = useContext(EPUBContext);

  const iframeRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      goToPreviousSection();
    } else if (e.key === 'ArrowRight') {
      goToNextSection();
    }
  };

  function getYoutubeEmbedUrl(url) {
    const videoId = getVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
    }

    function getVideoId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    }

    const extractImages = () => {
      if (viewerRef.current) {
        const iframes = viewerRef.current.getElementsByTagName('iframe');
        if (iframes.length > 0) {
          const iframeDocument = iframes[0].contentDocument;
          if (iframeDocument) {
            const imgElements = iframeDocument.getElementsByTagName('img');
            const imgSrcArray = Array.from(imgElements)
              .filter(img => img.src && !img.src.includes('titlepage800.png')) // Exclude the title image
              .map(img => img.src);
            
            if (imgSrcArray.length > 0) {
              setBGImage(imgSrcArray[0]);
              console.log("Background image set to:", imgSrcArray[0]);
            } else {
              console.log("No suitable images found in the current section");
            }
          }
        }
      }
    };

    useEffect(() => {
        if (iframeRef.current) {
          if (isVideoPlaying) {
            iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } else {
            iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        }
      }, [isVideoPlaying]);

  useEffect(() => {
    if (book) {
      window.addEventListener('keyup', handleKeyPress);
      return () => {
        window.removeEventListener('keyup', handleKeyPress);
      };
    }
  }, [book, currentSection]);

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

    // const imgElements = viewerRef.current.querySelectorAll('img');

    // const imgSrcArray = Array.from(imgElements).map(img => img.src);

    // setBGImage(imgSrcArray[0]);
    // console.log(viewerRef);

      renditionRef.current = rendition;

      book.loaded.navigation.then(nav => {
        const toc = nav.toc;
        setSections(toc);
        if (toc.length > 0) {
          displaySection(0);
        }
      });

      // Apply initial styles
      applyStyles();

      // Add locationChanged event listener
      rendition.on('locationChanged', (location) => {
        updateCurrentSection(location);
      });
      
      // Add rendered event listener to extract images
      rendition.on('rendered', (section) => {
      console.log("Section rendered:", section.href);
      extractImages();
    });
    }
  }, [book]);

  useEffect(() => {
    applyStyles();
  }, [fontSize, textColor, backgroundColor]);

  const applyStyles = () => {
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
  };

  const updateCurrentSection = (location) => {
    if (renditionRef.current && book) {
      const currentHref = location.start.href;
      const sectionIndex = sections.findIndex(section => section.href.includes(currentHref));
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
      }
    }
  };

  const displaySection = (sectionIndex) => {
    if (renditionRef.current && sections[sectionIndex]) {
      renditionRef.current.display(sections[sectionIndex].href).then(() => {
        console.log(`Displaying section: ${sections[sectionIndex].label}`);
        applyStyles();
        setCurrentSection(sectionIndex);
      });
    }
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      displaySection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      displaySection(currentSection - 1);
    }
  };

  return (
    <div className="reader-container">
      <div ref={viewerRef} className="reader-content" />
      {youtubeUrl && (
        <div className="youtube-container">
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`${getYoutubeEmbedUrl(youtubeUrl)}?autoplay=1&loop=1&enablejsapi=1&controls=0&playlist=${getVideoId(youtubeUrl)}`} // Add autoplay, mute, and loop parameters
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {BGImage && (
        <div className="bg-image-container">
          <img src={BGImage} alt="BG-Image" />
        </div>
      )}
    </div>
  );
};

export default Reader;
