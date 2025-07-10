import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Tabs, Tab, Paper, Modal,
  TextField, List, ListItem, ListItemText, Divider, Alert
} from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface Job {
  _id: string;
  id: string;
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
      const res = await axios.get(`${BASE_URL}/api/fetchjobs?status=${statusFilter}`, authHeader);
      setJobs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch jobs.');
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      await axios.post(`${BASE_URL}/approve-job/${jobId}`, {}, authHeader);
      fetchJobs();
    } catch (err: any) {
      setError('Failed to approve job.');
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
    } catch {
      setError('Failed to reject job.');
    }
  };

  const handleViewResumes = async (job: Job) => {
    try {
      const res = await axios.get(`${BASE_URL}/resumes/${job.id}`, authHeader);
      setSelectedJob(job);
      setResumes(res.data.resumes || []);

      for (const resume of res.data.resumes || []) {
        await axios.get(`${BASE_URL}/admin/view_resume`, {
          params: {
            url: resume.resume_url,
            adminEmail,
            jobId: job._id,
            id:job.id,
            jobTitle: job.title,
          },
          ...authHeader,
        });
      }
    } catch {
      setError('Failed to fetch resumes.');
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/download_resume`, {
        params: {
          url: resume.resume_url,
          adminEmail,
          jobId: selectedJob?._id,
          id:selectedJob?.id,
          jobTitle: selectedJob?.title,
        },
        ...authHeader,
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
    } catch {
      setError('Failed to download resume.');
    }
  };

  const handleViewLogs = async (job: Job) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/logs`, {
        params: { jobId: job._id },
        ...authHeader,
      });
      setLogs(res.data.logs || []);
      setSelectedJob(job);
      setOpenLogModal(true);
    } catch {
      setError('Failed to fetch logs.');
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={statusFilter} onChange={(e, val) => setStatusFilter(val)}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {jobs.length === 0 ? (
        <Typography mt={3}>No jobs found.</Typography>
      ) : (
        jobs.map((job) => (
          <Paper key={job._id} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography color="text.secondary" mb={2}>
              {job.description}
            </Typography>

            {statusFilter === 'pending' && (
              <Box display="flex" gap={2} mb={2}>
                <Button variant="contained" color="success" onClick={() => handleApprove(job.id)}>
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
              <Button variant="contained" onClick={() => handleViewResumes(job)}>
                View Resumes
              </Button>
              <Button variant="outlined" onClick={() => handleViewLogs(job)}>
                View Logs
              </Button>
            </Box>
          </Paper>
        ))
      )}

      {/* Reject Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ width: 400, p: 4, mx: 'auto', mt: '15%', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Rejection Reason for {selectedJob?.title}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            label="Reason"
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
            {resumes.map((resume, index) => (
              <ListItem
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
              >
                <ListItemText
                  primary={resume.name}
                  secondary={`Email: ${resume.email} | Uploaded: ${new Date(
                    resume.uploaded_at
                  ).toLocaleString()}`}
                />
                <Button variant="outlined" onClick={() => handleDownload(resume)}>
                  Download
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>

      {/* Logs Modal */}
      <Modal open={openLogModal} onClose={() => setOpenLogModal(false)}>
        <Paper sx={{ width: 600, p: 4, mx: 'auto', mt: '5%', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" mb={2}>
            Logs for {selectedJob?.title}
          </Typography>
          <List>
            {logs.map((log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${log.action.toUpperCase()} by ${log.email}`}
                    secondary={`${log.resume.split('/').pop()} | ${new Date(log.timestamp).toLocaleString()}`}
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
