import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './component/pages/Home';
import Edit from './component/pages/Edit';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/edit/:id' element={<Edit/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;