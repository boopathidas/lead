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
        location: '',  // Added location field for lead
    });
    const [newUser, setNewUser] = useState({
        partnerName: '',
        contactName: '',
        email: '',
        phoneNumber: '',
        location: '',
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
                setNewLead({ name: '', email: '', phone_number: '', company: '', description: '', location: '' });
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
            const response = await axios.post(`${apiBaseUrl}/create-user/`, newUser, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            if (response.status === 201) {
                alert('User created successfully!');
                setNewUser({ partnerName: '', contactName: '', email: '', phoneNumber: '', location: '' });
                setShowUserForm(false); // Hide form after submission
                navigate('/partner-dashboard');  // Navigate to Partner Dashboard after creating the user
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
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input name="name" id="name" placeholder="Enter Name" onChange={handleLeadInputChange} value={newLead.name} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input name="email" id="email" type="email" placeholder="Enter Email" onChange={handleLeadInputChange} value={newLead.email} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone_number">Phone Number</label>
                            <input name="phone_number" id="phone_number" placeholder="Enter Phone Number" onChange={handleLeadInputChange} value={newLead.phone_number} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company">Company</label>
                            <input name="company" id="company" placeholder="Enter Company" onChange={handleLeadInputChange} value={newLead.company} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Lead Details</label>
                            <textarea name="description" id="description" placeholder="Enter Lead Details" onChange={handleLeadInputChange} value={newLead.description} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input name="location" id="location" placeholder="Enter Location" onChange={handleLeadInputChange} value={newLead.location} required />
                        </div>
                        <button type="submit">Submit Lead</button>
                    </form>
                </div>
            )}

            {/* Show User Form only when showUserForm is true */}
            {showUserForm && (
                <div>
                    <h2>Create User</h2>
                    <form className="user-form" onSubmit={handleSubmitUser}>
                        <div className="form-group">
                            <label htmlFor="partnerName">Partner Name</label>
                            <input 
                                name="partnerName" 
                                id="partnerName" 
                                placeholder="Enter Partner Name" 
                                onChange={handleUserInputChange} 
                                value={newUser.partnerName} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactName">Contact Name</label>
                            <input 
                                name="contactName" 
                                id="contactName" 
                                placeholder="Enter Contact Name" 
                                onChange={handleUserInputChange} 
                                value={newUser.contactName} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                name="email" 
                                id="email" 
                                type="email" 
                                placeholder="Enter Email" 
                                onChange={handleUserInputChange} 
                                value={newUser.email} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input 
                                name="phoneNumber" 
                                id="phoneNumber" 
                                placeholder="Enter Phone Number" 
                                onChange={handleUserInputChange} 
                                value={newUser.phoneNumber} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input 
                                name="location" 
                                id="location" 
                                placeholder="Enter Location" 
                                onChange={handleUserInputChange} 
                                value={newUser.location} 
                                required 
                            />
                        </div>
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
                        <th>Location</th>
                        <th>Status</th>
                        <th>Partner</th>
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
