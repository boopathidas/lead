import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Navigate directly to the admin dashboard without backend check
        navigate('/admin-dashboard');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-gradient">
            <div className="card shadow-lg p-5 custom-card">
                <h2 className="text-center mb-4 custom-title">Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control custom-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control custom-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-lg btn-primary w-100 custom-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
