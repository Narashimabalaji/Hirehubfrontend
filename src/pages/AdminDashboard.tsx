import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider, Alert
} from '@mui/material';
import axios from 'axios';

const BASE_URL = 'https://hirehubbackend-5.onrender.com';

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
}

interface Resume {
  name: string;
  email: string;
  resume_url: string;
  uploaded_at: string;
}

interface Log {
  email: string;
  job_id: string;
  name: string;
  resume: string;
  action: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminEmail = localStorage.getItem('adminEmail') || 'admin@hirehub.com';
  const accessToken = localStorage.getItem('access_token') || '';

  const authHeader = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const fetchJobs = async () => {
    try {
      setError(null);
      const res = await axios.get(`${BASE_URL}/api/jobs?status=${statusFilter}`, authHeader);
      setJobs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      setError(null);
      await axios.post(`${BASE_URL}/approve-job/${jobId}`, {}, authHeader);
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve job. Please try again.');
      console.error('Error approving job:', err);
    }
  };

  const handleReject = async () => {
    if (!selectedJob) return;
    try {
      setError(null);
      await axios.post(`${BASE_URL}/reject_job/${selectedJob._id}`, {
        reason: rejectionComment,
      }, authHeader);
      setOpenModal(false);
      setRejectionComment('');
      fetchJobs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject job. Please try again.');
      console.error('Error rejecting job:', err);
    }
  };

  const handleViewResumes = async (job: Job) => {
    try {
      setError(null);
      const res = await axios.get(`${BASE_URL}/resumes/${job._id}`, authHeader);
      setSelectedJob(job);
      setResumes(res.data.resumes || []);

      // Log views and open resumes
      for (const resume of res.data.resumes || []) {
        try {
          const viewRes = await axios.get(`${BASE_URL}/admin/view_resume`, {
            params: {
              url: resume.resume_url,
              adminEmail,
              jobId: job._id,
              jobTitle: job.title,
            },
            headers: authHeader.headers,
          });
          if (viewRes.data.resume_url) {
            window.open(viewRes.data.resume_url, '_blank');
          }
        } catch (viewErr: any) {
          console.error('Error logging view for resume:', resume.resume_url, viewErr);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch resumes. Please try again.');
      console.error('Error viewing resumes:', err);
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      setError(null);
      const res = await axios.get(`${BASE_URL}/admin/download_resume`, {
        params: {
          url: resume.resume_url,
          adminEmail,
          jobId: selectedJob?._id,
          jobTitle: selectedJob?.title,
        },
        headers: authHeader.headers,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${resume.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download resume. Please try again.');
      console.error('Error downloading resume:', err);
    }
  };

  const handleViewLogs = async (job: Job) => {
    try {
      setError(null);
      const res = await axios.get(`${BASE_URL}/admin/logs?jobId=${job._id}`, authHeader);
      setLogs(res.data.logs || []);
      setSelectedJob(job);
      setOpenLogModal(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch logs. Please try again.');
      console.error('Error fetching logs:', err);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" mb={3} color="primary">
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)} sx={{ mb: 3 }}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {jobs.length === 0 ? (
        <Typography>No jobs found for {statusFilter} status.</Typography>
      ) : (
        jobs.map((job) => (
          <Paper key={job._id} sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" color="text.primary">{job.title}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {job.description}
            </Typography>

            {statusFilter === 'pending' && (
              <Box display="flex" gap={2} mb={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(job._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedJob(job);
                    setOpenModal(true);
                  }}
                >
                  Reject
                </Button>
              </Box>
            )}

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleViewResumes(job)}
              >
                View Resumes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleViewLogs(job)}
              >
                View Logs
              </Button>
            </Box>
          </Paper>
        ))
      )}

      {/* Rejection Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ width: 400, p: 4, mx: 'auto', mt: '20%', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Rejection Reason for {selectedJob?.title}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            label="Reason for Rejection"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box display="flex" gap={2}>
            <Button variant="contained" color="error" onClick={handleReject}>
              Submit
            </Button>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Resumes Modal */}
      <Modal open={!!resumes.length} onClose={() => setResumes([])}>
        <Paper sx={{ width: 500, p: 4, mx: 'auto', mt: '10%', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Resumes for {selectedJob?.title}
          </Typography>
          <List>
            {resumes.map((resume: Resume, index) => (
              <ListItem
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
              >
                <ListItemText
                  primary={resume.name}
                  secondary={`Email: ${resume.email} | Uploaded: ${new Date(resume.uploaded_at).toLocaleString()}`}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleDownload(resume)}
                >
                  Download
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>

      {/* Logs Modal */}
      <Modal open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <Paper
          sx={{
            width: 600,
            p: 4,
            mx: 'auto',
            mt: '5%',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Logs for {selectedJob?.title}
          </Typography>
          <List>
            {logs.map((log: Log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action.toUpperCase()} by ${log.email}`}
                    secondary={`Resume: ${log.resume.split('/').pop()} | ${new Date(log.timestamp).toLocaleString()}`}
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
