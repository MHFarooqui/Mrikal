// src/App.js
import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import './App.css';
import AllDocuments from './Screens/AllDocuments';

function App() {
  const [currentComponent, setCurrentComponent] = useState('Home');

  const renderComponent = () => {
    switch (currentComponent) {
      case 'Home':
        return <AllDocuments />;
      default:
        return <AllDocuments />;
    }
  };

  return (
    <div className="App">
      <Navbar onNavClick={setCurrentComponent} />
      <div className="content">
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;

