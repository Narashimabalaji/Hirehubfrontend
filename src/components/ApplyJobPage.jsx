import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !resumeFile) {
      setMessage('Please fill all fields and upload resume');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resumeFile);
  
    const token = localStorage.getItem('access_token');
  
    try {
      const res = await fetch(`https://hirehubbackend-5.onrender.com/upload_resume/${jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage('Application submitted successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setMessage('An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: '1rem' }}>
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Resume (PDF or DOC):</label><br />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ApplyJobPage;
