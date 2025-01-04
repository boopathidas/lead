import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PartnerDashboard from './components/PartnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/partner-dashboard" element={<PartnerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
