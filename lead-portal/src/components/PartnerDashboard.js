import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const PartnerDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [newLead, setNewLead] = useState({
        name: '',
        email: '',
        phone_number: '',
        company: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    // Fetching leads from the API
    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/leads/', {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                });
                setLeads(response.data);
                setFilteredLeads(response.data);
            } catch (error) {
                console.error('Error fetching leads:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    // Handle input field changes for new lead
    const handleInputChange = (e) => {
        setNewLead({ ...newLead, [e.target.name]: e.target.value });
    };

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        filterLeads(e.target.value);
    };

    // Filter leads based on search query
    const filterLeads = (query) => {
        const lowercasedQuery = query.toLowerCase();
        const filtered = leads.filter(
            (lead) =>
                lead.name.toLowerCase().includes(lowercasedQuery) ||
                lead.email.toLowerCase().includes(lowercasedQuery) ||
                lead.phone_number.includes(lowercasedQuery) ||
                lead.company.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredLeads(filtered);
    };

    // Handle form submission for new lead
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const leadData = { ...newLead, status: 'Pending' };

        try {
            // Submit the lead to the backend
            await axios.post('http://localhost:8000/api/leads/', leadData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            // Send email notification to admin (assuming you have a backend to handle this)
            await axios.post('http://localhost:8000/api/send-lead-email/', leadData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });

            alert('Lead submitted successfully!');
            setNewLead({ name: '', email: '', phone_number: '', company: '', description: '' });

            // Fetch updated leads list after submission
            const response = await axios.get('http://localhost:8000/api/leads/', {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            setLeads(response.data);
            setFilteredLeads(response.data);
        } catch (error) {
            console.error('Error submitting lead:', error);
            alert('Error submitting lead');
        } finally {
            setLoading(false);
        }
    };

    // Reset the form fields
    const handleReset = () => {
        setNewLead({ name: '', email: '', phone_number: '', company: '', description: '' });
    };

    // Navigate back to the Admin Dashboard
    const goToAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    return (
        <div className="dashboard">
            <h1>Partner Dashboard</h1>

            {/* Button to toggle Add Lead Form */}
            <button onClick={() => setShowLeadForm(!showLeadForm)} className="btn btn-primary mb-4">
                {showLeadForm ? 'Cancel Lead' : 'Add Lead'}
            </button>

            {/* Back/Home Button */}
            <button onClick={goToAdminDashboard} className="btn btn-secondary mb-4 ml-2">
                Back to Admin Dashboard
            </button>

            {/* Show Lead Form only when showLeadForm is true */}
            {showLeadForm && (
                <div>
                    <h2>Submit Lead</h2>
                    <form className="lead-form" onSubmit={handleSubmit}>
                        <input
                            name="name"
                            placeholder="Name"
                            onChange={handleInputChange}
                            value={newLead.name}
                            required
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            type="email"
                            onChange={handleInputChange}
                            value={newLead.email}
                            required
                        />
                        <input
                            name="phone_number"
                            placeholder="Phone Number"
                            onChange={handleInputChange}
                            value={newLead.phone_number}
                            required
                        />
                        <input
                            name="company"
                            placeholder="Company"
                            onChange={handleInputChange}
                            value={newLead.company}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Lead Details"
                            onChange={handleInputChange}
                            value={newLead.description}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                    </form>
                </div>
            )}

            {/* Search and Filter Input */}
            <div>
                <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input mb-4"
                />
            </div>

            {/* Leads Table */}
            {loading ? (
                <p>Loading leads...</p>
            ) : (
                <>
                    <h2>Your Leads</h2>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Status</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default PartnerDashboard;
