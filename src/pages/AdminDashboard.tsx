import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider
} from '@mui/material';
import axios from 'axios';

const BASE_URL = 'https://hirehubbackend-5.onrender.com'; // ✅ Make sure this points to your backend

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [openLogModal, setOpenLogModal] = useState(false);

  const adminEmail = localStorage.getItem('adminEmail') || 'admin@hirehub.com';
  const accessToken = localStorage.getItem('access_token');

  const authHeader = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/jobs?status=${statusFilter}`, authHeader);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      await axios.post(`${BASE_URL}/approve-job/${jobId}`, {}, authHeader);
      fetchJobs();
    } catch (err) {
      console.error('Error approving job:', err);
    }
  };

  const handleReject = async () => {
    if (!selectedJob) return;
    try {
      await axios.post(`${BASE_URL}/reject_job/${selectedJob._id}`, {
        reason: rejectionComment,
      }, authHeader);
      setOpenModal(false);
      setRejectionComment('');
      fetchJobs();
    } catch (err) {
      console.error('Error rejecting job:', err);
    }
  };

  const handleViewResumes = async (job: any) => {
    try {
      const res = await axios.get(`${BASE_URL}/resumes/${job._id}`, authHeader);
      setSelectedJob(job);
      setResumes(res.data.resumes || []);

      // Log views
      for (const resume of res.data.resumes || []) {
        await axios.get(`${BASE_URL}/admin/view_resume`, {
          params: {
            url: resume.resume_url,
            adminEmail,
            jobId: job._id,
            jobTitle: job.title
          },
          ...authHeader
        });
      }
    } catch (err) {
      console.error('Error viewing resumes:', err);
    }
  };

  const handleDownload = async (resume: any) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/download_resume`, {
        params: {
          url: resume.resume_url,
          adminEmail,
          jobId: selectedJob._id,
          jobTitle: selectedJob.title
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${resume.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading resume:', err);
    }
  };

  const handleViewLogs = async (job: any) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/logs?jobId=${job._id}`, authHeader);
      setLogs(res.data.logs || []);
      setSelectedJob(job);
      setOpenLogModal(true);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

      <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {jobs.map((job: any) => (
        <Paper key={job._id} sx={{ p: 2, my: 2 }}>
          <Typography variant="h6">{job.title}</Typography>
          <Typography variant="body2" gutterBottom>{job.description}</Typography>

          {statusFilter === 'pending' && (
            <Box mt={1}>
              <Button
                variant="contained"
                color="success"
                sx={{ mr: 2 }}
                onClick={() => handleApprove(job._id)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => { setSelectedJob(job); setOpenModal(true); }}
              >
                Reject
              </Button>
            </Box>
          )}

          <Box mt={2}>
            <Button onClick={() => handleViewResumes(job)} sx={{ mr: 2 }}>
              View Resumes
            </Button>
            <Button onClick={() => handleViewLogs(job)} color="secondary">
              View Logs
            </Button>
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
      <Modal open={!!resumes.length} onClose={() => setResumes([])}>
        <Paper sx={{ width: 500, p: 4, mx: 'auto', mt: '10%' }}>
          <Typography variant="h6" gutterBottom>
            Resumes for {selectedJob?.title}
          </Typography>
          <List>
            {resumes.map((resume: any, index: number) => (
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
          <Typography variant="h6" gutterBottom>
            Logs for {selectedJob?.title}
          </Typography>
          <List>
            {logs.map((log: any, index: number) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action.toUpperCase()} by ${log.adminEmail}`}
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
