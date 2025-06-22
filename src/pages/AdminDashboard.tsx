import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider, AppBar, Toolbar,
  IconButton, Tooltip, Snackbar, Alert
} from '@mui/material';
import { Visibility, Download, Logout, History } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'https://hirehubbackend-5.onrender.com';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        params: { status: statusFilter.toLowerCase() },
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
      setSnackbar({ open: true, message: 'Job approved successfully.', severity: 'success' });
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
      setSnackbar({ open: true, message: 'Job rejected successfully.', severity: 'info' });
      setOpenModal(false);
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
      setOpenLogModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>HireHub Admin Dashboard</Typography>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={logout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box p={4}>
        <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)}>
          <Tab label="Pending" value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Rejected" value="rejected" />
        </Tabs>

        {jobs.map((job) => (
          <Paper key={job._id} sx={{ p: 3, my: 2, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" color="primary.main">{job.title}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{job.description}</Typography>

            {statusFilter === 'pending' && (
              <Box mt={2}>
                <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => handleApprove(job._id)}>Approve</Button>
                <Button variant="outlined" color="error" onClick={() => { setSelectedJob(job); setOpenModal(true); }}>Reject</Button>
              </Box>
            )}

            <Box mt={2}>
              <Button startIcon={<Visibility />} onClick={() => handleViewResumes(job)} sx={{ mr: 2 }}>View Resumes</Button>
              <Button startIcon={<History />} onClick={() => handleViewLogs(job)} color="secondary">View Logs</Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Rejection Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ width: 400, p: 4, mx: 'auto', mt: '20%', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Rejection Reason</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter reason for rejection..."
          />
          <Button variant="contained" color="error" onClick={handleReject}>Submit</Button>
        </Paper>
      </Modal>

      {/* Resumes Modal */}
      <Modal open={!!resumes.length} onClose={() => { setResumes([]); setSelectedJob(null); }}>
        <Paper sx={{ width: 500, p: 4, mx: 'auto', mt: '10%', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Resumes for {selectedJob?.title}</Typography>
          <List>
            {resumes.map((resume, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText primary={resume.name} secondary={resume.email} />
                <IconButton onClick={() => handleDownload(resume)}><Download /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>

      {/* Logs Modal */}
      <Modal open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <Paper sx={{ width: 600, p: 4, mx: 'auto', mt: '5%', maxHeight: '80vh', overflowY: 'auto', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Logs for {selectedJob?.title}</Typography>
          <List>
            {logs.map((log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action} by ${log.adminEmail}`}
                    secondary={new Date(log.timestamp).toLocaleString()}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
