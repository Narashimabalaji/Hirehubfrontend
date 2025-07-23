import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  InputLabel,
  FormControl,
  CircularProgress,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload,
  Person,
  Email,
  Description,
  Send,
  ArrowBack,
  CheckCircle,
  ErrorOutline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import jobAPI from '../../api/jobAPi';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  background: "transparent",
  maxWidth: "60vw",
  margin: "0 auto"
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(54, 169, 228, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#36a9e4',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#36a9e4',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#00254e',
    '&.Mui-focused': {
      color: '#36a9e4',
    },
  },
  '& .MuiInputBase-input': {
    color: '#00254e',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(54, 169, 228, 0.1)',
  color: '#36a9e4',
  border: '2px dashed #36a9e4',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(54, 169, 228, 0.15)',
    borderColor: '#00254e',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#36a9e4',
  color: 'white',
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1.1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#00254e',
  },
  '&:disabled': {
    backgroundColor: 'rgba(54, 169, 228, 0.5)',
    color: 'white',
  },
}));

function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please upload a PDF or DOC file only');
        setMessageType('error');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        setMessageType('error');
        return;
      }

      setResumeFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !resumeFile) {
      setMessage('Please fill all fields and upload resume');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call since uploadResumeAPI is not available in this environment
      // const data = await uploadResumeAPI(jobId, { name, email, resumeFile });

      // Simulate loading time
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const data = await jobAPI.uploadResumeAPI(jobId, { name, email, resumeFile });

      setMessage('Application submitted successfully!');
      setMessageType('success');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error || 'Failed to submit application';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return null;
    return file.type.includes('pdf') ? '📄' : '📝';
  };

  return (
    <Container maxWidth="xl" sx={{ position: "relative", px: 3 }}>
      {/* Back Button - Positioned absolutely to the left */}
      <StyledPaper elevation={0}>
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Tooltip title="Go back">
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: '#36a9e4',
                  m: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(54, 169, 228, 0.1)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  color: '#00254e',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Apply for Position
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#36a9e4',
                  fontSize: '1.1rem'
                }}
              >
                Submit your application and let's get started!
              </Typography>
            </Box>

          </Box>
        </Box>

        <Divider sx={{ mt: 2, backgroundColor: 'rgba(54, 169, 228, 0.2)' }} />


        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <Box>
              <StyledTextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: '#36a9e4', mr: 1 }} />
                  ),
                }}
                placeholder="Enter your full name"
              />
            </Box>

            <Box>
              <StyledTextField
                fullWidth
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: '#36a9e4', mr: 1 }} />
                  ),
                }}
                placeholder="Enter your email address"
              />
            </Box>

            <Box>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: '#00254e',
                    '&.Mui-focused': { color: '#36a9e4' }
                  }}
                >
                </InputLabel>
                <Box sx={{ mt: 1 }}>
                  <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="resume-upload"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  <label htmlFor="resume-upload">
                    <UploadButton
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {resumeFile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{getFileIcon(resumeFile)}</span>
                          <Typography variant="body2" sx={{ color: '#00254e' }}>
                            {resumeFile.name}
                          </Typography>
                        </Box>
                      ) : (
                        'Upload Resume (PDF, DOC, DOCX)'
                      )}
                    </UploadButton>
                  </label>
                  {resumeFile && (
                    <Chip
                      label={`${(resumeFile.size / 1024 / 1024).toFixed(2)} MB`}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor: 'rgba(54, 169, 228, 0.1)',
                        color: '#36a9e4'
                      }}
                    />
                  )}
                </Box>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SubmitButton
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                sx={{ height: 44, width: '250px', fontSize: "15px" }}
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </SubmitButton>
            </Box>
          </Stack>
        </Box>

        {message && (
          <Box sx={{ mt: 3 }}>
            <Alert
              severity={messageType}
              icon={messageType === 'success' ? <CheckCircle /> : <ErrorOutline />}
              sx={{
                '& .MuiAlert-icon': {
                  color: messageType === 'success' ? '#36a9e4' : undefined
                },
                backgroundColor: messageType === 'success' ? 'rgba(54, 169, 228, 0.1)' : undefined,
                border: messageType === 'success' ? '1px solid rgba(54, 169, 228, 0.3)' : undefined
              }}
            >
              {message}
            </Alert>
          </Box>
        )}
      </StyledPaper>
    </Container >
  );
}

export default ApplyJobPage;