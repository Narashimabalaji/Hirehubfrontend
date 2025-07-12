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
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  InputAdornment,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Work,
  Business,
  Person,
  Email,
  LocationOn,
  Category,
  School,
  CurrencyRupee,
  Description,
  Add,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { generateJobDescription, postJobAPI } from '../api/jobAPi';

const emailid = localStorage.getItem('Emailid');

const JOB_CATEGORIES = [
  'Technology & IT',
  'Healthcare & Medical',
  'Finance & Banking',
  'Education & Training',
  'Sales & Marketing',
  'Human Resources',
  'Engineering',
  'Design & Creative',
  'Customer Service',
  'Manufacturing',
  'Retail & E-commerce',
  'Consulting',
  'Real Estate',
  'Legal',
  'Media & Communications',
  'Transportation & Logistics',
  'Agriculture',
  'Government & Public Sector',
  'Non-Profit',
  'Other'
];

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Surat',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivli',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Howrah',
  'Ranchi',
  'Gwalior',
  'Jabalpur',
  'Coimbatore',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Chandigarh',
  'Gurgaon',
  'Noida',
  'Mysore',
  'Thiruvananthapuram',
  'Kochi',
  'Bhubaneswar',
  'Salem',
  'Tiruchirappalli',
  'Guntur',
  'Warangal',
  'Nellore',
  'Dehradun',
  'Pondicherry',
  'Jammu',
  'Mangalore',
  'Erode',
  'Ambattur',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Jalgaon',
  'Udaipur',
  'Kozhikode',
  'Remote'
];

interface JobPostFormData {
  title: string;
  description: string;
  qualification: string;
  category: string;
  keywords: string[];
  keywordInput: string;
  company: string;
  salary: string;
  location: string;
  company_name: string;
  hireremailid: string;
  hirername: string;
}



// const HirerJobPost = () => {
//   const [formData, setFormData] = useState<JobPostFormData>({
//     title: '',
//     description: '',
//     qualification: '',
//     category: '',
//     keywords: [],
//     keywordInput: '',
//     company: '',
//     salary: '',
//     location: '',
//     company_name: '',
//     hireremailid: '',
//     hirername: ''
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [errors, setErrors] = useState<Partial<Record<keyof JobPostFormData, string>>>({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value as string });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const handleAddKeyword = () => {
//     if (formData.keywordInput && !formData.keywords.includes(formData.keywordInput)) {
//       setFormData({
//         ...formData,
//         keywords: [...formData.keywords, formData.keywordInput],
//         keywordInput: ''
//       });
//     }
//   };

//   const handleKeywordKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddKeyword();
//     }
//   };

//   const handleRemoveKeyword = (keyword) => {
//     setFormData({
//       ...formData,
//       keywords: formData.keywords.filter((k) => k !== keyword)
//     });
//   };
//   const validateForm = () => {
//     const newErrors: Partial<Record<keyof JobPostFormData, string>> = {};

//     if (!formData.title.trim()) newErrors.title = 'Job title is required';
//     if (!formData.company.trim()) newErrors.company = 'Company name is required';
//     if (!formData.description.trim()) newErrors.description = 'Job description is required';
//     if (!formData.category) newErrors.category = 'Category is required';
//     if (!formData.location) newErrors.location = 'Location is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const token = localStorage.getItem('access_token');
//     const hirerId = localStorage.getItem('userId');

//     if (!token || !hirerId) {
//       alert("You are not authenticated. Please log in again.");
//       return;
//     }

//     try {
//       await postJobAPI({ formData, emailid, hirerId });
//       setSnackbarOpen(true);
//       setTimeout(() => navigate('/hirer'), 2000);
//     } catch (error) {
//       const errorMsg = error?.response?.data?.message || 'Unknown error occurred.';
//       alert('Error: ' + errorMsg);
//     }
//   };

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       py: 0,
//       px: 0
//     }}>
//       <Paper
//         elevation={0}
//         sx={{
//           maxWidth: 1000,
//           mx: 'auto',
//           borderRadius: 3,
//           overflow: 'hidden',
//           boxShadow: 0
//         }}
//       >
//         {/* Header */}
//         <Box sx={{
//           color: '#00254e',
//           p: 4,
//           textAlign: 'left'
//         }}>
//           <Work sx={{ fontSize: 40, mb: 2 }} />
//           <Typography variant="h4" fontWeight="bold" mb={1}>
//             Post a New Job
//           </Typography>
//           <Typography variant="body1" sx={{ opacity: 0.9 }}>
//             Fill in the details below to attract the best candidates
//           </Typography>
//         </Box>

//         <CardContent sx={{ p: 4 }}>
//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* Basic Information Section */}
//               <Grid size={{ xs: 12 }}>
//                 <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
//                   Basic Information
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Job Title"
//                   name="title"
//                   fullWidth
//                   value={formData.title}
//                   onChange={handleChange}
//                   error={!!errors.title}
//                   helperText={errors.title}
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Work color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       '&:hover fieldset': {
//                         borderColor: 'primary.main',
//                       },
//                     },
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Company Name"
//                   name="company"
//                   fullWidth
//                   value={formData.company}
//                   onChange={handleChange}
//                   error={!!errors.company}
//                   helperText={errors.company}
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Business color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <FormControl fullWidth error={!!errors.category}>
//                   <InputLabel>Job Category *</InputLabel>
//                   <Select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     label="Job Category *"
//                     startAdornment={
//                       <InputAdornment position="start">
//                         <Category color="primary" />
//                       </InputAdornment>
//                     }
//                   >
//                     {JOB_CATEGORIES.map((category) => (
//                       <MenuItem key={category} value={category}>
//                         {category}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                   {errors.category && (
//                     <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                       {errors.category}
//                     </Typography>
//                   )}
//                 </FormControl>
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Autocomplete
//                   options={INDIAN_CITIES}
//                   value={formData.location}
//                   onChange={(event, newValue) => {
//                     setFormData({ ...formData, location: newValue || '' });
//                     if (errors.location) {
//                       setErrors({ ...errors, location: '' });
//                     }
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Location *"
//                       error={!!errors.location}
//                       helperText={errors.location}
//                       InputProps={{
//                         ...params.InputProps,
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <LocationOn color="primary" />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <TextField
//                   label="Job Description"
//                   name="description"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   value={formData.description}
//                   onChange={handleChange}
//                   error={!!errors.description}
//                   helperText={errors.description || "Describe the role, responsibilities, and requirements"}
//                   required
//                 />
//               </Grid>

//               {/* Additional Details Section */}
//               <Grid size={{ xs: 12 }}>
//                 <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
//                   <Person sx={{ mr: 1 }} />
//                   Additional Details
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Required Qualification"
//                   name="qualification"
//                   fullWidth
//                   value={formData.qualification}
//                   onChange={handleChange}
//                   helperText="e.g., Bachelor's degree, 2+ years experience"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <School color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Expected Salary"
//                   name="salary"
//                   fullWidth
//                   value={formData.salary}
//                   onChange={handleChange}
//                   helperText="e.g., ₹5-8 LPA, ₹50,000/month"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <AttachMoney color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Hirer Name"
//                   name="hirername"
//                   fullWidth
//                   value={formData.hirername}
//                   onChange={handleChange}
//                   helperText="Your name as the hiring manager"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Person color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, md: 6 }}>
//                 <TextField
//                   label="Hirer Email"
//                   name="hireremailid"
//                   fullWidth
//                   type="email"
//                   value={formData.hireremailid}
//                   onChange={handleChange}
//                   helperText="Contact email for applications"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Email color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>

//               {/* Skills Section */}
//               <Grid size={{ xs: 12 }}>
//                 <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
//                   Required Skills & Keywords
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />
//               </Grid>

//               <Grid size={{ xs: 6 }}>
//                 <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//                   <TextField
//                     label="Add Skill/Keyword"
//                     value={formData.keywordInput}
//                     onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
//                     onKeyPress={handleKeywordKeyPress}
//                     helperText="Press Enter or click Add to include skills"
//                     sx={{ flexGrow: 1 }}
//                   />
//                   <Tooltip title="Add Skill">
//                     <IconButton
//                       onClick={handleAddKeyword}
//                       color="primary"
//                       size="small"
//                       sx={{
//                         color: 'white',
//                         py:0.1,
//                         px:2,
//                         bgcolor:"#36a9e4"
//                       }}
//                     >
//                       <Add sx={{ fontSize: 16 }} /> 
//                     </IconButton>
//                   </Tooltip>

//                 </Box>

//                 {formData.keywords.length > 0 && (
//                   <Box sx={{
//                     p: 2,
//                     bgcolor: 'grey.50',
//                     borderRadius: 2,
//                     border: '1px solid',
//                     borderColor: 'grey.200'
//                   }}>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       Selected Skills:
//                     </Typography>
//                     <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//                       {formData.keywords.map((keyword, index) => (
//                         <Chip
//                           key={index}
//                           label={keyword}
//                           onDelete={() => handleRemoveKeyword(keyword)}
//                           deleteIcon={<Close />}
//                           color="primary"
//                           variant="outlined"
//                           sx={{
//                             mb: 1,
//                             '& .MuiChip-deleteIcon': {
//                               color: 'primary.main',
//                               '&:hover': { color: 'primary.dark' }
//                             }
//                           }}
//                         />
//                       ))}
//                     </Stack>
//                   </Box>
//                 )}
//               </Grid>

//               {/* Submit Button */}
//               <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   fullWidth
//                   size="medium" // Or "small" if you want it even smaller
//                   sx={{
//                     py: 1.2, // Reduced padding
//                     fontSize: '1rem', // Smaller text
//                     fontWeight: 'bold',
//                     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//                     boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
//                     '&:hover': {
//                       background: 'linear-gradient(45deg, #1976D2 30%, #1BA8D9 90%)',
//                       transform: 'translateY(-2px)',
//                       boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
//                     },
//                     transition: 'all 0.3s ease'
//                   }}
//                 >
//                   Submit Job for Approval
//                 </Button>
//               </Grid>

//             </Grid>
//           </Box>
//         </CardContent>
//       </Paper>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           severity="success"
//           variant="filled"
//           sx={{
//             width: '100%',
//             fontSize: '1rem',
//             '& .MuiAlert-icon': {
//               fontSize: '1.5rem'
//             }
//           }}
//           onClose={() => setSnackbarOpen(false)}
//         >
//           Job submitted successfully! Redirecting to dashboard...
//         </Alert>
//       </Snackbar>
//     </Box >
//   );
// };

// export default HirerJobPost;

const HirerJobPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    qualification: '',
    experience: '',
    category: '',
    keywords: [],
    keywordInput: '',
    company: '',
    salary: '',
    location: '',
    company_name: '',
    hireremailid: '',
    hirername: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof JobPostFormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const canGenerateDescription = formData.title && formData.category && formData.experience && formData.keywords.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof JobPostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddKeyword = () => {
    const newKeyword = formData.keywordInput.trim();
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword],
        keywordInput: ''
      }));
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword)
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof JobPostFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateWithAI = async () => {
    const canGenerateDescription = formData.title && formData.category && formData.experience && formData.keywords.length > 0;
  
    if (!canGenerateDescription) {
      alert('Please fill in Job Title, Category, Experience, and at least one skill before generating with AI.');
      return;
    }
  
    setIsGenerating(true);
  
    try {
      const description = await generateJobDescription({
        title: formData.title,
        category: formData.category,
        experience: formData.experience,
        keywords: formData.keywords,
      });

  
      setFormData((prev) => ({ ...prev, description: description }));
    } catch (err) {
      console.error('API error:', err);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem('access_token');
    const hirerId = localStorage.getItem('userType');
    const emailid = formData.hireremailid;

    if (!token || !hirerId) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    try {
      // Replace this with actual API call
      await postJobAPI({ formData, emailid, hirerId });
      setSnackbarOpen(true);
      setTimeout(() => navigate('/hirer'), 2000);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Unknown error occurred.';
      alert('Error: ' + errorMsg);
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 0,
          bgcolor: "transparent"

        }}
      >
        {/* Header */}
        <Box sx={{
          color: '#00254e',
          p: 4,
          textAlign: 'left'
        }}>
          <Work sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Post a New Job
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Fill in the details below to attract the best candidates
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="#00254e" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Job Title"
                  name="title"
                  fullWidth
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Company Name"
                  name="company"
                  fullWidth
                  value={formData.company}
                  onChange={handleChange}
                  error={!!errors.company}
                  helperText={errors.company}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Job Category *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Job Category *"
                    startAdornment={
                      <InputAdornment position="start">
                        <Category sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    }
                  >
                    {JOB_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  options={INDIAN_CITIES}
                  value={formData.location}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, location: newValue || '' });
                    if (errors.location) {
                      setErrors({ ...errors, location: '' });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location *"
                      error={!!errors.location}
                      helperText={errors.location}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: "#36a9e4" }}/>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Required Experience (moved here) */}
              <Grid size={{ xs: 12, md: 6 }} >
                <TextField
                  label="Required Experience"
                  name="experience"
                  fullWidth
                  value={formData.experience}
                  onChange={handleChange}
                  helperText="e.g., 2+ years, 5-8 years, Fresher"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work sx={{ color: "#36a9e4" }}  />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Skills Section (moved here, before Description) */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="#00254e" gutterBottom sx={{ mt: 3 }}>
                  Required Skills & Keywords
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Add Skill/Keyword"
                    value={formData.keywordInput}
                    onChange={(e) => setFormData({ ...formData, keywordInput: e.target.value })}
                    onKeyPress={handleKeywordKeyPress}
                    helperText="Press Enter or click Add to include skills"
                    sx={{ flexGrow: 1 }}
                  />
                  <Tooltip title="Add Skill">
                    <Button
                      onClick={handleAddKeyword}
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        bgcolor: '#36a9e4',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2196F3',
                        },
                      }}
                    >
                      <Add sx={{ fontSize: 20 }} />
                    </Button>
                  </Tooltip>
                </Box>

                {formData.keywords.length > 0 && (
                  <Box sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Selected Skills:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {formData.keywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          onDelete={() => handleRemoveKeyword(keyword)}
                          deleteIcon={<Close />}
                          color="primary"
                          variant="outlined"
                          sx={{
                            mb: 1,
                            '& .MuiChip-deleteIcon': {
                              color: 'primary.main',
                              '&:hover': { color: 'primary.dark' }
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Grid>

              {/* Job Description Section (moved after mandatory AI fields) */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    label="Job Description"
                    name="description"
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description || "Describe the role, responsibilities, and requirements"}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <Description sx={{ color: "#36a9e4" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleGenerateWithAI}
                    disabled={!canGenerateDescription || isGenerating}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5,
                      fontSize: '0.75rem',
                      background: canGenerateDescription && !isGenerating
                        ? 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)'
                        : 'rgba(0, 0, 0, 0.12)',
                      color: canGenerateDescription && !isGenerating ? 'white' : 'rgba(0, 0, 0, 0.26)',
                      border: 'none',
                      '&:hover': {
                        background: canGenerateDescription && !isGenerating
                          ? 'linear-gradient(45deg, #FF5252 30%, #26A69A 90%)'
                          : 'rgba(0, 0, 0, 0.12)',
                        border: 'none',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                      },
                      zIndex: 1,
                    }}
                  >
                    {isGenerating ? '🔄 Generating...' : 'Generate with AI'}
                  </Button>
                </Box>
              </Grid>

              {/* Additional Details Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" color="#00254e" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                  <Person sx={{ mr: 1 }} />
                  Additional Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Required Qualification"
                  name="qualification"
                  fullWidth
                  value={formData.qualification}
                  onChange={handleChange}
                  helperText="e.g., Bachelor's degree, MBA, Certification"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Experience field was here originally, but moved up */}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Expected Salary"
                  name="salary"
                  fullWidth
                  value={formData.salary}
                  onChange={handleChange}
                  helperText="e.g., ₹5-8 LPA, ₹50,000/month"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupee sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Hirer Name"
                  name="hirername"
                  fullWidth
                  value={formData.hirername}
                  onChange={handleChange}
                  helperText="Your name as the hiring manager"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Hirer Email"
                  name="hireremailid"
                  fullWidth
                  type="email"
                  value={formData.hireremailid}
                  onChange={handleChange}
                  helperText="Contact email for applications"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#36a9e4" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{
                    py: 1.2,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: '#00254e',
                    minWidth: '250px',
                    maxWidth: '400px',
                    '&:hover': {
                      background: '#36a9e4',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Submit Job for Approval
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
          onClose={() => setSnackbarOpen(false)}
        >
          Job submitted successfully! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HirerJobPost;
