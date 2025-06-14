import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HirerJobPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualification: '',
    category: '',
    keywords: [],
    keywordInput: '',
    company: '',
    salary: '',
    location: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddKeyword = () => {
    if (formData.keywordInput && !formData.keywords.includes(formData.keywordInput)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.keywordInput],
        keywordInput: ''
      });
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    const hirer_id = localStorage.getItem('userId') || '62145';

    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    const payload = {
      ...formData,
      hirer_id,
      keywords: formData.keywords
    };

    try {
      const res = await fetch('http://localhost:5000/post-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbarOpen(true);
        setTimeout(() => navigate('/hirer'), 2000);
      } else {
        alert('Error: ' + (data?.message || 'Unknown error occurred.'));
      }
    } catch (error) {
      alert('Error posting job: ' + error.message);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={3}>Post a New Job</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                name="company"
                fullWidth
                value={formData.company}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Qualification"
                name="qualification"
                fullWidth
                value={formData.qualification}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                fullWidth
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expected Salary"
                name="salary"
                fullWidth
                value={formData.salary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex">
                <TextField
                  label="Add Skill Keyword"
                  value={formData.keywordInput}
                  onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                  fullWidth
                />
                <Button onClick={handleAddKeyword} sx={{ ml: 1 }} variant="contained">Add</Button>
              </Box>
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                {formData.keywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => handleRemoveKeyword(keyword)}
                    color="primary"
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Submit Job for Approval
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Job submitted successfully!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default HirerJobPost;
