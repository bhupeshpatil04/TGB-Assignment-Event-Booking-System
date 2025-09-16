import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
export default function App(){
  return (
    <BrowserRouter>
      <div style={{padding:20}}>
        <h2>TGB Event Booking (Demo)</h2>
        <nav><Link to='/'>Home</Link> | <Link to='/login'>Login</Link></nav>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<CustomerDashboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
