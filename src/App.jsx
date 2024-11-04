import React from 'react';
import EPUBReader from './components/EpubReader';
import { EPUBProvider } from './components/EPUBContext';

const App = () => {
  return (
    <EPUBProvider>
      <EPUBReader />    
    </EPUBProvider>
  );
};

export default App;
