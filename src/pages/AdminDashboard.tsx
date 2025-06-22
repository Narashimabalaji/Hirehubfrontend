import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://hirehubbackend-5.onrender.com';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [message, setMessage] = useState('');

  const accessToken = localStorage.getItem('access_token');
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@hirehub.com';

  useEffect(() => {
    if (!accessToken) {
      window.location.href = '/login';
    } else {
      fetchJobs();
    }
  }, [statusFilter]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/jobs`, {
        params: { status: statusFilter },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await axios.post(`${API_BASE_URL}/approve-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessage('Job approved successfully.');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${API_BASE_URL}/reject_job/${selectedJob._id}`, {
        reason: rejectionComment,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessage('Job rejected successfully.');
      setShowRejectModal(false);
      setRejectionComment('');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResumes = async (job) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/resumes/${job._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedJob(job);
      setResumes(res.data.resumes || []);
      await logAction('Viewed Resumes', job);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (resume) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/download_resume`, {
        params: { url: resume.resume_url },
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${resume.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      await logAction('Downloaded Resume', selectedJob);
    } catch (err) {
      console.error(err);
    }
  };

  const logAction = async (action, job) => {
    try {
      await axios.post(`${API_BASE_URL}/log`, {
        adminEmail,
        jobId: job._id,
        jobTitle: job.title,
        action,
        timestamp: new Date().toISOString(),
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewLogs = async (job) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/logs`, {
        params: { jobId: job._id },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setLogs(res.data.logs || []);
      setSelectedJob(job);
      setShowLogModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
        <h2>HireHub Admin Dashboard</h2>
        <button onClick={logout} style={{ padding: '6px 12px' }}>Logout</button>
      </header>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setStatusFilter('pending')}>Pending</button>
        <button onClick={() => setStatusFilter('approved')} style={{ marginLeft: 10 }}>Approved</button>
        <button onClick={() => setStatusFilter('rejected')} style={{ marginLeft: 10 }}>Rejected</button>
      </div>

      {message && <div style={{ background: '#def', padding: 10, marginBottom: 10 }}>{message}</div>}

      {jobs.map((job) => (
        <div key={job._id} style={{ border: '1px solid #ccc', padding: 20, marginBottom: 15, borderRadius: 5 }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>

          {statusFilter === 'pending' && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleApprove(job._id)} style={{ marginRight: 10 }}>Approve</button>
              <button onClick={() => { setSelectedJob(job); setShowRejectModal(true); }}>Reject</button>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <button onClick={() => handleViewResumes(job)} style={{ marginRight: 10 }}>View Resumes</button>
            <button onClick={() => handleViewLogs(job)}>View Logs</button>
          </div>
        </div>
      ))}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={modalStyle}>
          <h3>Rejection Reason</h3>
          <textarea
            rows="4"
            style={{ width: '100%', marginBottom: 10 }}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            placeholder="Enter reason..."
          />
          <button onClick={handleReject}>Submit</button>
          <button onClick={() => setShowRejectModal(false)} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      )}

      {/* Resumes Modal */}
      {resumes.length > 0 && (
        <div style={modalStyle}>
          <h3>Resumes for {selectedJob?.title}</h3>
          <ul>
            {resumes.map((resume, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span>{resume.name} ({resume.email})</span>
                <button onClick={() => handleDownload(resume)}>Download</button>
              </li>
            ))}
          </ul>
          <button onClick={() => setResumes([])}>Close</button>
        </div>
      )}

      {/* Logs Modal */}
      {showLogModal && (
        <div style={modalStyle}>
          <h3>Logs for {selectedJob?.title}</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                {log.action} by {log.adminEmail} on {new Date(log.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
          <button onClick={() => setShowLogModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

const modalStyle = {
  position: 'fixed',
  top: '10%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#fff',
  padding: 20,
  border: '1px solid #ccc',
  borderRadius: 8,
  zIndex: 1000,
  width: 400,
};

export default AdminDashboard;
