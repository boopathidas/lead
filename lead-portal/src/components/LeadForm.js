import React, { useState } from 'react';
import axios from 'axios';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    course: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('YOUR_BACKEND_API_URL', formData);
      console.log('Lead data submitted:', response.data);
      // You can handle success (e.g., show a confirmation message, clear the form, etc.)
    } catch (error) {
      console.error('Error submitting lead data:', error);
      // You can handle error (e.g., show an error message)
    }
  };

  return (
    <div className="lead-form">
      <h2>Lead Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="course">Course</label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LeadForm;
