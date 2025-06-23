import React, { useState, useEffect } from 'react';
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

const JobFeed = () => {
  const theme = useTheme();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  
  // Get data and actions from our store
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
  
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  // Apply filters when search inputs change
  useEffect(() => {
    filterJobs({
      search: searchTerm,
      location: locationFilter,
      skills: skillsFilter
    });
  }, [searchTerm, locationFilter, skillsFilter, filterJobs]);
  
  // Handle adding skill to filter
  const handleAddSkill = () => {
    if (selectedSkill && !skillsFilter.includes(selectedSkill)) {
      setSkillsFilter([...skillsFilter, selectedSkill]);
      setSelectedSkill('');
    }
  };
  
  // Handle removing skill from filter
  const handleRemoveSkill = (skill) => {
    setSkillsFilter(skillsFilter.filter(s => s !== skill));
  };
  
  // Check if a job is saved
  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };
  
  // Check if a job is liked
  const isJobLiked = (jobId) => {
    return likedJobs.includes(jobId);
  };
  
  // Toggle job save status
  const toggleSaveJob = (jobId) => {
    if (isJobSaved(jobId)) {
      useStore.getState().removeSavedJob(jobId);
    } else {
      saveJob(jobId);
    }
  };
  
  // Toggle job like status
  const toggleLikeJob = (jobId) => {
    if (isJobLiked(jobId)) {
      useStore.getState().removeLikedJob(jobId);
    } else {
      likeJob(jobId);
    }
  };
  
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      {/* Search and filter section */}
      <Box mb={4}>
        <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary" mb={2}>
          Find Your Dream Job
        </Typography>
        
        <Grid container spacing={2} mb={2}>
          {/* Search by title/description */}
          <Grid size={{xs:12, md:4}} >
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
          
          {/* Filter by location */}
          <Grid  size={{xs:12, md:4}}>
            <TextField
              fullWidth
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              size="small"
            />
          </Grid>
          
          {/* Filter by skills */}
          <Grid size={{xs:12, md:4}}>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                placeholder="Add skill"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSkill}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Skills filter tags */}
        {skillsFilter.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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
      
      {/* Job listings */}
      <Stack spacing={2}>
        {jobsLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={32} color="primary" />
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>Loading jobs...</Typography>
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No jobs found matching your criteria.</Typography>
          </Box>
        ) : (
          filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              sx={{ 
                bgcolor: 'grey.50', 
                '&:hover': { 
                  boxShadow: 3, 
                  transition: 'box-shadow 0.3s ease-in-out' 
                } 
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" component="h3" color="text.primary">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {job.company} • {job.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={() => toggleLikeJob(job.id)}
                      sx={{ 
                        bgcolor: isJobLiked(job.id) ? 'primary.50' : 'grey.200',
                        color: isJobLiked(job.id) ? 'primary.main' : 'text.secondary',
                        '&:hover': { bgcolor: 'primary.100' } 
                      }}
                      size="small"
                    >
                      <Heart size={20} fill={isJobLiked(job.id) ? "currentColor" : "none"} />
                    </IconButton>
                    <IconButton 
                      onClick={() => toggleSaveJob(job.id)}
                      sx={{ 
                        bgcolor: isJobSaved(job.id) ? 'primary.50' : 'grey.200',
                        color: isJobSaved(job.id) ? 'primary.main' : 'text.secondary',
                        '&:hover': { bgcolor: 'primary.100' } 
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {job.description}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Salary: {job.salary}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                  {job.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.50', 
                        color: 'primary.800', 
                        fontSize: '0.75rem' 
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Posted on {job.postedDate}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                  >
                    Apply Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
};

export default JobFeed;
