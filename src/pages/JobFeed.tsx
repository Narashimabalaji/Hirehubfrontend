import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  Container,
  useMediaQuery
} from '@mui/material';
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  Search,
  X,
  MapPin,
  Plus,
  Filter
} from 'lucide-react';
import useStore from '../store/store';
import NavaBot from '../components/NavaBot';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const JobFeed = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown Date";
  
    const date = new Date(dateStr);
  
    if (isNaN(date.getTime())) return "Unknown Date";
  
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // e.g., "11 Jul 2025"
  };


  useEffect(() => {
    const storedType = localStorage.getItem('userType');
    if (storedType) setUserType(storedType);
  }, []);

  return (
    <Box sx={{ width: '100%', px: 0, py: 3 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar - Filters */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ p: 3, position: 'sticky', top: 20, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Filter size={20} color={"#36a9e4"} />
              <Typography variant="h6" fontWeight="bold" ml={1} color='
#00254e'>
                Filters
              </Typography>
            </Box>

            <Stack spacing={3}>
              {/* Search Filter */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Search Jobs
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Job title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Location Filter */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Location
                </Typography>
                <TextField
                  fullWidth
                  placeholder="City, State, or Remote"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin size={18} color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Skills Filter */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Add skill"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <IconButton
                    onClick={handleAddSkill}
                    sx={{
                      ml: 1,
                      bgcolor: '#36a9e4',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      borderRadius: 2
                    }}
                  >
                    <Plus size={18} />
                  </IconButton>
                </Box>

                {/* Skill Tags */}
                {skillsFilter.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skillsFilter.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={<X size={14} />}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Side - Job Feed */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ p: 3, minHeight: '80vh' }}>
            {/* Header with Action Buttons */}
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent="space-between"
              alignItems={isMobile ? 'flex-start' : 'center'}
              gap={isMobile ? 2 : 0}
              mb={3}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#00254e">
                  Find Your Dream Job
                </Typography>
                <Typography variant="body2" color="#00254e">
                  Discover opportunities that match your skills and interests
                </Typography>
              </Box>

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                alignItems={isMobile ? 'stretch' : 'center'}
                width={isMobile ? '100%' : 'auto'}
              >
                {userType === 'admin' && (
                  <Button
                    variant="outlined"
                    fullWidth={isMobile}
                    onClick={() => navigate('/admin')}
                    sx={{
                      borderRadius: 2,
                      color: "#36a9e4",
                      borderColor: "#36a9e4"
                    }}
                  >
                    Admin Dashboard
                  </Button>
                )}

                {(userType === 'hirer' || userType === 'admin') && (
                  <Button
                    variant="contained"
                    fullWidth={isMobile}
                    onClick={() => navigate('/hirer/job-post')}
                    sx={{
                      borderRadius: 2,
                      bgcolor: "#36a9e4",
                      '&:hover': {
                        bgcolor: "#2b93c7"
                      }
                    }}
                  >
                    Post
                  </Button>
                )}
              </Stack>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Job Listings */}
            <Stack spacing={3}>
              {jobsLoading ? (
                <Box textAlign="center" py={8}>
                  <CircularProgress size={48} />
                  <Typography mt={2} color="text.secondary" variant="h6">
                    Finding opportunities...
                  </Typography>
                </Box>
              ) : filteredJobs.length === 0 ? (
                <Card
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    textAlign: 'center',
                    py: 8
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      No jobs found matching your criteria
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or search terms
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <Grid container spacing={3}>
                  {filteredJobs.map((job, index) => {
                    // Define color variants for different cards
                    const cardColors = [
                      { bg: '#FFF3E0', accent: '#FF9800', company: '#E65100' }, // Orange
                      { bg: '#E8F5E8', accent: '#4CAF50', company: '#2E7D32' }, // Green
                      { bg: '#F3E5F5', accent: '#9C27B0', company: '#6A1B9A' }, // Purple
                      { bg: '#E3F2FD', accent: '#2196F3', company: '#1565C0' }, // Blue
                      { bg: '#FCE4EC', accent: '#E91E63', company: '#AD1457' }, // Pink
                      { bg: '#FFF8E1', accent: '#FFC107', company: '#F57F17' }, // Amber
                    ];

                    const colorScheme = cardColors[index % cardColors.length];

                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job.id}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'grey.400',
                            transition: 'all 0.3s ease-in-out',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                              // boxShadow: 4,
                            },
                          }}
                        >
                          <CardContent sx={{
                            p: 0.7,
                            pb: 0,
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            '&:last-child': {
                              paddingBottom: 1.4,
                            },
                          }}>
                            {/* Header with Date and Action Icons */}
                            <Box sx={{ bgcolor: colorScheme.bg, p: 1, borderRadius: 3 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ bgcolor: "white", borderRadius: 10, px: 1 }}>
                                  {formatDate(job.postedDate)}
                                </Typography>
                                <Box display="flex" gap={0.5}>
                                  <IconButton
                                    onClick={() => toggleSaveJob(job.id)}
                                    sx={{
                                      bgcolor: isJobSaved(job.id) ? 'rgba(0,0,0,0.8)' : 'white',
                                      color: isJobSaved(job.id) ? 'white' : 'text.secondary',
                                      '&:hover': {
                                        bgcolor: isJobSaved(job.id) ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)',
                                      },
                                      width: 32,
                                      height: 32,
                                      borderRadius: "100%"
                                    }}
                                    size="small"
                                  >
                                    {isJobSaved(job.id) ? (
                                      <BookmarkCheck size={16} />
                                    ) : (
                                      <Bookmark size={16} />
                                    )}
                                  </IconButton>
                                  {/* <IconButton
                                  onClick={() => toggleLikeJob(job.id)}
                                  sx={{
                                    bgcolor: isJobLiked(job.id) ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)',
                                    color: isJobLiked(job.id) ? 'white' : 'text.secondary',
                                    '&:hover': {
                                      bgcolor: isJobLiked(job.id) ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)',
                                    },
                                    width: 32,
                                    height: 32,
                                    borderRadius: 1.5
                                  }}
                                  size="small"
                                >
                                  <Heart size={16} fill={isJobLiked(job.id) ? 'currentColor' : 'none'} />
                                </IconButton> */}
                                </Box>
                              </Box>

                              {/* Company with Logo Placeholder */}
                              <Box display="flex" alignItems="center" mb={2}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: colorScheme.company,

                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2
                                  }}
                                >
                                  <Typography variant="h6" color="white" fontWeight="bold" sx={{ lineHeight: 1 }}>
                                    {job?.company
                                      ? job.company.charAt(0).toUpperCase()
                                      : <WorkOutlineIcon />}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                  {job?.company}
                                </Typography>
                              </Box>

                              {/* Job Title */}
                              <Typography variant="h6" fontWeight="bold" color="text.primary" mb={1} sx={{ lineHeight: 1.3 }}>
                                {job.title}
                              </Typography>

                              {/* Job Type and Level Tags */}
                              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                <Chip
                                  label="Full time"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    color: 'text.secondary',
                                    fontSize: '0.7rem',
                                    height: 24,
                                    borderRadius: 1.5,
                                    fontWeight: 'medium'
                                  }}
                                />
                                <Chip
                                  label="Senior level"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(255,255,255,0.8)',
                                    color: 'text.secondary',
                                    fontSize: '0.7rem',
                                    height: 24,
                                    borderRadius: 1.5,
                                    fontWeight: 'medium'
                                  }}
                                />
                              </Box>

                              {/* Skills */}
                              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                {job.skills.slice(0, 2).map((skill) => (
                                  <Chip
                                    key={skill}
                                    label={skill}
                                    size="small"
                                    sx={{
                                      bgcolor: colorScheme.accent,
                                      color: 'white',
                                      fontSize: '0.7rem',
                                      height: 24,
                                      borderRadius: 1.5,
                                      fontWeight: 'medium'
                                    }}
                                  />
                                ))}
                                {job.skills.length > 2 && (
                                  <Chip
                                    label={`+${job.skills.length - 2} more`}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(255,255,255,0.8)',
                                      color: 'text.secondary',
                                      fontSize: '0.7rem',
                                      height: 24,
                                      borderRadius: 1.5,
                                      fontWeight: 'medium'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Spacer to push content to bottom */}
                            <Box sx={{ flexGrow: 1 }} />

                            {/* Bottom section with salary and button */}
                            {/* Bottom section with salary and button */}
                            <Box
                              sx={{
                                mt: 2,
                                px: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: "row"
                              }}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight="bold" color="text.primary">
                                  ₹{job.salary}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  {job.location}
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => navigate(`/apply/${job.id}`)}
                                sx={{
                                  bgcolor: 'rgba(0,0,0,0.8)',
                                  color: 'white',
                                  borderRadius: 5,
                                  fontWeight: 'bold',
                                  textTransform: 'none',
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.9)',
                                    transform: 'translateY(-1px)'
                                  }
                                }}
                              >
                                Details
                              </Button>
                            </Box>

                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <NavaBot />
    </Box>
  );
};

export default JobFeed; 
