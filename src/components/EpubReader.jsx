import React from 'react';
import Sidebar from './Sidebar';
import Controls from './Controls';
import Reader from './Reader';
import './EpubReader.css';  // Import the CSS file

const EPUBReader = () => {
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
