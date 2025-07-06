import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  Search,
  X
} from 'lucide-react';
import useStore from '../store/store';
import NavaBot from '../components/NavaBot';

; // Adjust the path if needed


const JobFeed = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  // Zustand store
  const {
    filteredJobs,
    fetchJobs,
    filterJobs,
    likeJob,
    saveJob,
    savedJobs,
    likedJobs,
    jobsLoading
  } = useStore();

  useEffect(() => {
    fetchJobs(); // Fetch jobs from backend
  }, [fetchJobs]);

  useEffect(() => {
    filterJobs({
      search: searchTerm,
      location: locationFilter,
      skills: skillsFilter
    });
  }, [searchTerm, locationFilter, skillsFilter, filterJobs]);

  const handleAddSkill = () => {
    if (selectedSkill && !skillsFilter.includes(selectedSkill)) {
      setSkillsFilter([...skillsFilter, selectedSkill]);
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkillsFilter(skillsFilter.filter(s => s !== skill));
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);
  const isJobLiked = (jobId) => likedJobs.includes(jobId);

  const toggleSaveJob = (jobId) => {
    if (isJobSaved(jobId)) {
      useStore.getState().removeSavedJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  const toggleLikeJob = (jobId) => {
    if (isJobLiked(jobId)) {
      useStore.getState().removeLikedJob(jobId);
    } else {
      likeJob(jobId);
    }
  };
  
  
const [userType, setUserType] = useState('');

useEffect(() => {
  const storedType = localStorage.getItem('userType');
  if (storedType) setUserType(storedType);
}, []);
console.log("User type:", userType);

  return (
  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
    
      {(userType === 'hirer' || userType === 'admin') && (
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/hirer/job-post')}
        >
          Post a Job
        </Button>
      </Box>
    )}

    {/* Admin Only: Dashboard Button */}
    {userType === 'admin' && (
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/admin')}
        >
          Admin Dashboard
        </Button>
      </Box>
)}


    {/* Filter Section */}
    <Box mb={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Find Your Dream Job
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search job title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              placeholder="Add skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleAddSkill} sx={{ ml: 1 }}>
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Skill Filter Tags */}
      {skillsFilter.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {skillsFilter.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              color="primary"
              onDelete={() => handleRemoveSkill(skill)}
              deleteIcon={<X size={14} />}
            />
          ))}
        </Box>
      )}
    </Box>

    {/* Job Listings */}
    <Stack spacing={2}>
      {jobsLoading ? (
        <Box textAlign="center" py={4}>
          <CircularProgress size={32} />
          <Typography mt={1} color="text.secondary">
            Loading jobs...
          </Typography>
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No jobs found matching your criteria.
          </Typography>
        </Box>
      ) : (
        filteredJobs.map((job) => (
          <Card
            key={job.id}
            sx={{
              bgcolor: 'grey.50',
              '&:hover': {
                boxShadow: 3,
                transition: 'box-shadow 0.3s ease-in-out',
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company} {job.location}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    onClick={() => toggleLikeJob(job.id)}
                    sx={{
                      bgcolor: isJobLiked(job.id) ? 'primary.50' : 'grey.200',
                      color: isJobLiked(job.id) ? 'primary.main' : 'text.secondary',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                    size="small"
                  >
                    <Heart size={20} fill={isJobLiked(job.id) ? 'currentColor' : 'none'} />
                  </IconButton>
                  <IconButton
                    onClick={() => toggleSaveJob(job.id)}
                    sx={{
                      bgcolor: isJobSaved(job.id) ? 'primary.50' : 'grey.200',
                      color: isJobSaved(job.id) ? 'primary.main' : 'text.secondary',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                    size="small"
                  >
                    {isJobSaved(job.id) ? (
                      <BookmarkCheck size={20} />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" mt={2}>
                {job.description}
              </Typography>

              <Typography variant="subtitle2" mt={2} fontWeight="medium">
                Salary: {job.salary}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={0.5} mt={2}>
                {job.skills.length > 0 ? (
                  job.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{
                        bgcolor: 'primary.50',
                        color: 'primary.800',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))
                ) : (
                  <Chip label="No skills listed" size="small" />
                )}
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="caption" color="text.secondary">
                  Posted on {job.postedDate}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/apply/${job.id}`)}

                >
                  Apply Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>

    <NavaBot />
  </Paper>
)};

export default JobFeed;
