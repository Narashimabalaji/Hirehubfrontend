import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider
} from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [openLogModal, setOpenLogModal] = useState(false);

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
      const res = await axios.get(`/admin/jobs?status=${statusFilter.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await axios.post(`/approve-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`/reject_job/${selectedJob._id}`, {
        reason: rejectionComment,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOpenModal(false);
      setRejectionComment('');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResumes = async (job) => {
    try {
      const res = await axios.get(`/resumes/${job._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedJob(job);
      setResumes(res.data.resumes || []);
      await logAction('Viewed', job);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (resume) => {
    try {
      const res = await axios.get(`/admin/download_resume`, {
        params: {
          url: resume.resume_url,
          adminEmail,
          jobId: selectedJob._id,
          jobTitle: selectedJob.title
        },
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

      await logAction('Downloaded', selectedJob);
    } catch (err) {
      console.error(err);
    }
  };

  const logAction = async (action, job) => {
    try {
      await axios.post('/log', {
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
      const res = await axios.get(`/admin/logs?jobId=${job._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setLogs(res.data.logs || []);
      setSelectedJob(job);
      setOpenLogModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>

      <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {jobs.map((job) => (
        <Paper key={job._id} sx={{ p: 2, my: 2 }}>
          <Typography variant="h6">{job.title}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>{job.description}</Typography>

          {statusFilter === 'pending' && (
            <Box mt={1}>
              <Button onClick={() => handleApprove(job._id)} variant="contained" color="success" sx={{ mr: 2 }}>
                Approve
              </Button>
              <Button onClick={() => { setSelectedJob(job); setOpenModal(true); }} variant="outlined" color="error">
                Reject
              </Button>
            </Box>
          )}

          <Box mt={2}>
            <Button onClick={() => handleViewResumes(job)} sx={{ mr: 2 }}>View Resumes</Button>
            <Button onClick={() => handleViewLogs(job)} color="secondary">View Logs</Button>
          </Box>
        </Paper>
      ))}

      {/* Rejection Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ width: 400, p: 4, mx: 'auto', mt: '20%' }}>
          <Typography variant="h6">Rejection Reason</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleReject}>Submit</Button>
        </Paper>
      </Modal>

      {/* Resumes Modal */}
      <Modal open={!!resumes.length} onClose={() => { setResumes([]); setSelectedJob(null); }}>
        <Paper sx={{ width: 500, p: 4, mx: 'auto', mt: '10%' }}>
          <Typography variant="h6" gutterBottom>Resumes for {selectedJob?.title}</Typography>
          <List>
            {resumes.map((resume, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText primary={resume.name} secondary={resume.email} />
                <Button variant="outlined" onClick={() => handleDownload(resume)}>Download</Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>

      {/* Logs Modal */}
      <Modal open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <Paper sx={{ width: 600, p: 4, mx: 'auto', mt: '5%', maxHeight: '80vh', overflowY: 'auto' }}>
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
    </Box>
  );
};

export default AdminDashboard;
