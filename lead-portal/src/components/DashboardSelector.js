import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './DashboardSelector.css'; // Custom CSS for additional styling

const DashboardSelector = () => {
    const navigate = useNavigate();

    const handleDashboardSelect = (role) => {
        if (role === 'admin') {
            navigate('/admin-dashboard');
        } 
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light custom-bg">
            <div className="card shadow-lg p-4 custom-card">
                <h2 className="text-center mb-4 custom-title">Select Your Dashboard</h2>
                <div className="d-grid gap-3">
                    <button
                        className="btn btn-lg btn-outline-primary custom-btn"
                        onClick={() => handleDashboardSelect('admin')}
                    >
                        Admin Dashboard
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default DashboardSelector;
