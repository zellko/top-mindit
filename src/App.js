import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import User from './components/User/User';
import './App.css';
import { testWrite, testRead } from './firebase/firebase';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

testWrite('testid156489', 'ZellTest');
testRead();

export default App;
