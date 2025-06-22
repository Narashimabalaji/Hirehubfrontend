import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider, InputAdornment
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
  const [search, setSearch] = useState('');
  const [logFilter, setLogFilter] = useState('');

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
      const res = await axios.get(`/admin/jobs?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (jobId) => {
    await axios.post(`/approve-job/${jobId}`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    fetchJobs();
  };

  const handleReject = async () => {
    await axios.post(`/reject_job/${selectedJob._id}`, {
      reason: rejectionComment,
    }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setOpenModal(false);
    setRejectionComment('');
    fetchJobs();
  };

  const handleViewResumes = async (job) => {
    const res = await axios.get(`/resumes/${job._id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setSelectedJob(job);
    setResumes(res.data.resumes || []);

    for (const resume of res.data.resumes || []) {
      await axios.get('/admin/view_resume', {
        params: {
          url: resume.resume_url,
          adminEmail,
          jobId: job._id,
          jobTitle: job.title,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  };

  const handleDownload = async (resume) => {
    const res = await axios.get('/admin/download_resume', {
      params: {
        url: resume.resume_url,
        adminEmail,
        jobId: selectedJob._id,
        jobTitle: selectedJob.title,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume-${resume.name}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleViewLogs = async (job) => {
    const res = await axios.get(`/admin/logs?jobId=${job._id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setLogs(res.data.logs || []);
    setSelectedJob(job);
    setOpenLogModal(true);
  };

  const getStats = (resume, type) => {
    return logs.filter(log =>
      log.resumeUrl === resume.resume_url &&
      log.action === type
    ).length;
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLogs = logs.filter(log =>
    !logFilter || log.action.toLowerCase() === logFilter.toLowerCase()
  );

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>

      <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)} sx={{ mb: 2 }}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      <TextField
        placeholder="Search job titles..."
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredJobs.map((job) => (
        <Paper key={job._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{job.title}</Typography>
          <Typography variant="body2" gutterBottom>{job.description}</Typography>
          {statusFilter === 'rejected' && (
            <Typography variant="body2" color="error" mb={1}>
              Rejection Reason: {job.rejection_reason || 'Not provided'}
            </Typography>
          )}
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

      <Modal open={!!resumes.length} onClose={() => { setResumes([]); setSelectedJob(null); }}>
        <Paper sx={{ width: 600, p: 4, mx: 'auto', mt: '5%' }}>
          <Typography variant="h6" gutterBottom>Resumes for {selectedJob?.title}</Typography>
          <List>
            {resumes.map((resume, index) => (
              <ListItem key={index} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <ListItemText
                  primary={`${resume.name} (${resume.email})`}
                  secondary={
                    <>
                      Views: {getStats(resume, 'view')} | Downloads: {getStats(resume, 'download')}
                    </>
                  }
                />
                <Button variant="outlined" onClick={() => handleDownload(resume)}>Download</Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>

      <Modal open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <Paper sx={{ width: 600, p: 4, mx: 'auto', mt: '5%', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>Logs for {selectedJob?.title}</Typography>

          <TextField
            label="Filter by Action (view/download)"
            value={logFilter}
            onChange={(e) => setLogFilter(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <List>
            {filteredLogs.map((log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action.toUpperCase()} by ${log.adminEmail}`}
                    secondary={`${new Date(log.timestamp).toLocaleString()} | Resume: ${log.resumeUrl}`}
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
