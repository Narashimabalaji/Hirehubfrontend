import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  InputAdornment,
  Tooltip,
  Alert,
  Snackbar,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Work,
  Business,
  Category,
  LocationOn,
  Description,
  Person,
  School,
  Email,
  Add,
  Close,
  CurrencyRupee,
  NavigateNext,
  NavigateBefore,
  ExpandMore,
  LocationCity,
  MyLocation,
  Map,
  Title,
  AccountBalance
} from '@mui/icons-material';
import jobApi from '../api/jobAPi';
import { MapPicker } from './MapPicker';
import getAddressFromCoords from '../utils/getAddress'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

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

const INDIAN_CITIES_WITH_SUBCITIES = {
  'Mumbai': ['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Ghatkopar', 'Juhu', 'Malad', 'Powai', 'Thane', 'Vashi'],
  'Delhi': ['Connaught Place', 'Dwarka', 'Gurgaon', 'Karol Bagh', 'Lajpat Nagar', 'Noida', 'Paharganj', 'Rajouri Garden', 'Rohini', 'Vasant Kunj'],
  'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'Jayanagar', 'Malleshwaram', 'BTM Layout', 'HSR Layout', 'Electronic City', 'Sarjapur', 'Marathahalli'],
  'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Secunderabad', 'Gachibowli', 'Hitec City', 'Kukatpally', 'Madhapur', 'Begumpet', 'Ameerpet', 'Kondapur'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Chrompet', 'Porur', 'OMR', 'Guindy', 'Mylapore'],
  'Pune': ['Kothrud', 'Aundh', 'Baner', 'Hinjewadi', 'Wakad', 'Magarpatta', 'Koregaon Park', 'Camp', 'Deccan', 'Pimpri'],
  'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Howrah', 'Behala', 'Jadavpur', 'Tollygunge', 'Rajarhat', 'Garia'],
  'Ahmedabad': ['Satellite', 'Vastrapur', 'Bopal', 'Prahlad Nagar', 'Navrangpura', 'CG Road', 'Maninagar', 'Nikol', 'Chandkheda', 'Gota'],
  'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Civil Lines', 'Raja Park', 'Ganesh Nagar', 'Shyam Nagar', 'Sodala'],
  'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Rajajipuram', 'Aminabad', 'Chowk', 'Alambagh', 'Nirala Nagar'],
  'Kochi': ['Ernakulam', 'Fort Kochi', 'Kakkanad', 'Palarivattom', 'Edapally', 'Kaloor', 'Panampilly Nagar', 'Marine Drive', 'Vyttila', 'Aluva'],
  'Coimbatore': ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saravanampatti', 'Vadavalli', 'Singanallur', 'Hopes College', 'Town Hall', 'Ukkadam', 'Thudiyalur'],
  'Remote': ['Work from Home', 'Hybrid', 'Flexible Location']
};

const INDIAN_CITIES = Object.keys(INDIAN_CITIES_WITH_SUBCITIES);

const steps = [
  'Basic Information',
  'Job Details & Skills',
  'Additional Details',
  'Review & Submit'
];

interface JobPostFormData {
  GST: number;
  title: string;
  description: string;
  qualification: string;
  category: string;
  keywords: string[];
  keywordInput: string;
  company: string;
  salary: string;
  location: string;
  subLocation: string[];
  company_name?: string;
  hireremailid: string;
  hirername: string;
  experience: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

const HirerJobPost = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<JobPostFormData>({
    GST: 0,
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
    subLocation: [],
    hireremailid: '',
    hirername: ''
  });

  const { emailId } = useAuth();

  const navigate = useNavigate();

  const [errors, setErrors] = useState<Partial<Record<keyof JobPostFormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const canGenerateDescription = formData.title && formData.category && formData.experience && formData.keywords.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof JobPostFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (event: any, newValue: string | null) => {
    setFormData(prev => ({
      ...prev,
      location: newValue || '',
      subLocation: [] // Reset sub-locations when main location changes
    }));
    if (errors.location) {
      setErrors({ ...errors, location: '' });
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const address = await getAddressFromCoords(latitude, longitude);

          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            address,
            location: 'Current Location'
          }));
        } catch (error) {
          alert('Failed to get address for the location.');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied by user.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out.');
            break;
          default:
            alert('An unknown error occurred.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };


  const handleSubLocationChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, subLocation: newValue }));
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

  const validateStep = (step: number) => {
    const newErrors: Partial<Record<keyof JobPostFormData, string>> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.GST) {
          newErrors.GST = 'GST Number is required';
        } else if (formData.GST.toString().length !== 15) {
          newErrors.GST = 'GST Number must be exactly 15 characters long';
        }
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.location) newErrors.location = 'Location is required';
        break;
      case 1: // Job Details & Skills
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (formData.keywords.length === 0) newErrors.keywords = 'At least one skill is required';
        break;
      case 2: // Additional Details
        // Optional fields, no validation needed
        break;
      case 3: // Review & Submit
        // Final validation
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.location) newErrors.location = 'Location is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGenerateWithAI = async () => {
    const canGenerateDescription = formData.title && formData.category && formData.experience && formData.keywords.length > 0;

    if (!canGenerateDescription) {
      alert('Please fill in Job Title, Category, Experience, and at least one skill before generating with AI.');
      return;
    }

    setIsGenerating(true);

    try {
      const description = await jobApi.generateJobDescription({
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

    if (!validateStep(3)) return;

    try {
      // await new Promise(resolve => setTimeout(resolve, 1000));

      await jobApi.postJob({ formData, emailid: emailId });
      setTimeout(() => {
        navigate('/');
        // console.log('Job submitted successfully!');
      }, 2000);
    } catch (error: any) {
      alert('Error submitting job. Please try again.');
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="GST No."
                name="GST"
                onChange={handleChange}
                fullWidth
                error={!!errors.GST}
                helperText={errors.GST}
                required
                inputProps={{ maxLength: 15 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance sx={{ color: "#36a9e4" }} />
                    </InputAdornment>
                  ),
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
              {/* <Autocomplete
                options={INDIAN_CITIES}
                value={formData.location}
                onChange={handleLocationChange}
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
                          <LocationOn sx={{ color: "#36a9e4" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              /> */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Autocomplete
                  options={INDIAN_CITIES}
                  value={INDIAN_CITIES.includes(formData.location) ? formData.location : formData.address || ''}
                  onChange={handleLocationChange}
                  sx={{ flexGrow: 1 }}
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
                            <LocationOn sx={{ color: "#36a9e4" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Tooltip title="Use Current Location">
                  <Button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    variant="outlined"
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      borderColor: '#36a9e4',
                      color: '#36a9e4',
                      '&:hover': {
                        borderColor: '#2196F3',
                        bgcolor: 'rgba(54, 169, 228, 0.04)'
                      }
                    }}
                  >
                    {isGettingLocation ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        📍
                      </Box>
                    ) : (
                      <MyLocation />
                    )}
                  </Button>
                </Tooltip>
              </Box>
            </Grid>

            {formData.latitude && formData.longitude && (
              <MapPicker
                center={{ lat: formData.latitude, lng: formData.longitude }}
                onSelectLocation={async (lat, lng) => {
                  try {
                    const address = await getAddressFromCoords(lat, lng);
                    setFormData(prev => ({
                      ...prev,
                      latitude: lat,
                      longitude: lng,
                      address,
                      location: 'Current Location'
                    }));
                  } catch {
                    alert('Failed to fetch address for selected location');
                  }
                }}
              />

            )}

            {formData.location && INDIAN_CITIES_WITH_SUBCITIES[formData.location] && (
              <Grid size={{ xs: 12 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationCity sx={{ mr: 1, color: "#36a9e4" }} />
                      Specific Areas in {formData.location} (Optional)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Autocomplete
                      multiple
                      options={INDIAN_CITIES_WITH_SUBCITIES[formData.location]}
                      value={formData.subLocation}
                      onChange={handleSubLocationChange}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            color="primary"
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select specific areas"
                          helperText="Choose specific areas within the city where the job is located"
                          placeholder="Type to search areas..."
                        />
                      )}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Job Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title || "e.g., Frontend Developer, Marketing Intern"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Title sx={{ color: "#36a9e4" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Required Experience */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Required Experience"
                name="experience"
                fullWidth
                value={formData.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience || "e.g., 2+ years, 5-8 years, Fresher"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work sx={{ color: "#36a9e4" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Skills & Keywords */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" color="#00254e" gutterBottom>
                Required Skills & Keywords
              </Typography>
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
                      '&:hover': { bgcolor: '#2196F3' },
                    }}
                  >
                    <Add />
                  </Button>
                </Tooltip>
              </Box>

              {formData.keywords.length > 0 && (
                <Box sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  mb: 3
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
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* Job Description */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="Job Description"
                  name="description"
                  fullWidth
                  multiline
                  minRows={6}
                  maxRows={12}
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
                    },
                    zIndex: 1,
                  }}
                >
                  {isGenerating ? '🔄 Generating...' : 'Generate with AI'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
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
                      <School sx={{ color: "#36a9e4" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

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
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" color="#00254e" gutterBottom>
              Review Your Job Posting
            </Typography>
            <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Job Title</Typography>
                  <Typography variant="body1">{formData.title || 'Not specified'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Company</Typography>
                  <Typography variant="body1">{formData.company || 'Not specified'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{formData.category || 'Not specified'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">
                    {formData.location || 'Not specified'}
                    {formData.latitude && formData.longitude && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(54, 169, 228, 0.1)', borderRadius: 1 }}>
                        <Typography variant="caption" color="#36a9e4">
                          📍 GPS: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </Typography>
                      </Box>
                    )}
                    {formData.subLocation.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">Areas: </Typography>
                        {formData.subLocation.map((area, index) => (
                          <Chip
                            key={index}
                            label={area}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                  <Box sx={{ mt: 1 }}>
                    {formData.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                    {formData.description || 'Not specified'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
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

        {/* Stepper */}
        <Box sx={{ px: 4, pb: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<NavigateBefore />}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: '#00254e',
                    px: 4,
                    '&:hover': { background: '#36a9e4' },
                  }}
                >
                  Submit Job for Approval
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  endIcon={<NavigateNext />}
                  variant="contained"
                  sx={{
                    background: '#00254e',
                    '&:hover': { background: '#36a9e4' },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Paper>

    </Box>
  );
};

export default HirerJobPost;