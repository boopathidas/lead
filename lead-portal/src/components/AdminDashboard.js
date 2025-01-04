import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [newLead, setNewLead] = useState({
        name: '',
        email: '',
        phone_number: '',
        company: '',
        description: '',
    });
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone_number: '',
    });
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);  // Toggle User form visibility
    const apiBaseUrl = 'http://localhost:8000/api';
    const navigate = useNavigate();  // Hook to navigate to another page

    // Fetch leads
    const fetchLeads = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/leads/`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            setLeads(response.data);
            setFilteredLeads(response.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleLeadInputChange = (e) => {
        setNewLead({ ...newLead, [e.target.name]: e.target.value });
    };

    const handleUserInputChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmitLead = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/leads/`, newLead, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            if (response.status === 201) {
                alert('Lead submitted successfully!');
                setNewLead({ name: '', email: '', phone_number: '', company: '', description: '' });
                fetchLeads();
                setShowLeadForm(false); // Hide form after submission
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Error submitting lead');
        }
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        navigate('/partner-dashboard');
        try {
            // Assuming a similar endpoint for creating users
            const response = await axios.post(`${apiBaseUrl}/create-user/`, newUser, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            if (response.status === 201) {
                alert('User created successfully!');
                setNewUser({ name: '', email: '', phone_number: '' });
                setShowUserForm(false); // Hide form after submission

                // Navigate to Partner Dashboard after creating the user
                navigate('/partner-dashboard');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user');
        }
    };

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>

            {/* Button to toggle Add Lead Form */}
            <button onClick={() => setShowLeadForm(!showLeadForm)} className="btn btn-primary mb-4">
                {showLeadForm ? 'Cancel Lead' : 'Add Lead'}
            </button>

            {/* Button to toggle User Form */}
            <button onClick={() => setShowUserForm(!showUserForm)} className="btn btn-secondary mb-4 ml-2">
                {showUserForm ? 'Cancel User' : 'Create User'}
            </button>

            {/* Show Lead Form only when showLeadForm is true */}
            {showLeadForm && (
                <div>
                    <h2>Submit Lead</h2>
                    <form className="lead-form" onSubmit={handleSubmitLead}>
                        <input name="name" placeholder="Name" onChange={handleLeadInputChange} value={newLead.name} required />
                        <input name="email" placeholder="Email" type="email" onChange={handleLeadInputChange} value={newLead.email} required />
                        <input name="phone_number" placeholder="Phone Number" onChange={handleLeadInputChange} value={newLead.phone_number} required />
                        <input name="company" placeholder="Company" onChange={handleLeadInputChange} value={newLead.company} required />
                        <textarea name="description" placeholder="Lead Details" onChange={handleLeadInputChange} value={newLead.description} required />
                        <button type="submit">Submit Lead</button>
                    </form>
                </div>
            )}

            {/* Show User Form only when showUserForm is true */}
            {showUserForm && (
                <div>
                    <h2>Create User</h2>
                    <form className="user-form" onSubmit={handleSubmitUser}>
                        <input name="name" placeholder="Name" onChange={handleUserInputChange} value={newUser.name} required />
                        <input name="email" placeholder="Email" type="email" onChange={handleUserInputChange} value={newUser.email} required />
                        <input name="phone_number" placeholder="Phone Number" onChange={handleUserInputChange} value={newUser.phone_number} required />
                        <button type="submit">Create User</button>
                    </form>
                </div>
            )}

            {/* Leads Table */}
            <h2>Leads Overview</h2>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeads.map((lead) => (
                        <tr key={lead.id}>
                            <td>{lead.name}</td>
                            <td>{lead.email}</td>
                            <td>{lead.phone_number}</td>
                            <td>{lead.company}</td>
                            <td>{lead.status}</td>
                            <td>
                                <button onClick={() => alert('Accept this lead')} className="btn btn-success btn-sm">Accept</button>
                                <button onClick={() => alert('Reject this lead')} className="btn btn-danger btn-sm">Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
