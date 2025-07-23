import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    Divider,
    Stack,
    Paper,
    IconButton,
    useTheme,
    Skeleton
} from '@mui/material';
import {
    LocationOn,
    Work,
    School,
    AttachMoney,
    Category,
    Email,
    Person,
    CalendarToday,
    Business,
    ArrowBack,
    Share,
    Bookmark
} from '@mui/icons-material';
import jobAPI from '../../api/jobAPi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

interface JobPost {
    category: string;
    company: string | null;
    created_at: string;
    created_by: string;
    description: string;
    hireremailid: string;
    hirername: string;
    id: string;
    keywords: string[];
    location: string;
    qualification: string;
    salary: string;
    status: string;
    title: string;
}

const JobDetailView: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const jobId = window.location.pathname.split('/').pop();
    const [jobData, setJobData] = useState<JobPost>({
        category: '',
        company: null,
        created_at: '',
        created_by: '',
        description: '',
        hireremailid: '',
        hirername: '',
        id: jobId || '',
        keywords: [],
        location: '',
        qualification: '',
        salary: '',
        status: 'open',
        title: ''
    });

    const fetchJobDetails = async () => {
        try {
            const response = await jobAPI.fetchJobDetails(jobId);
            setJobData(response)
        }
        catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
                    onClick={() => navigate('/')}
                >
                    Back to Jobs
                </Button>
                <Stack direction="row" spacing={1}>
                    <IconButton>
                        <Bookmark />
                    </IconButton>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                {/* Main Content */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card elevation={2}>
                        <CardContent sx={{ p: 4 }}>
                            {/* Job Title and Status */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                {loading ? (
                                    <Skeleton variant="text" width={300} height={40} />
                                ) : (
                                    <Typography
                                        variant="h4"
                                        component="h4"
                                        sx={{
                                            color: theme.palette.primary.main,
                                            fontWeight: 'bold',
                                            mb: 1
                                        }}
                                    >
                                        {jobData.title}
                                    </Typography>
                                )}
                                {/* <Chip
                                    label={jobData.status.toUpperCase()}
                                    color="success"
                                    variant="outlined"
                                /> */}
                            </Box>

                            {/* Company and Location */}
                            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                                {jobData.company && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Business color="action" />
                                        {loading ? (
                                            <Skeleton variant="text" width={200} />
                                        ) : (
                                            <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
                                                {jobData.company}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOn color="action" />
                                    <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
                                        {jobData.location}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Keywords */}
                            <Box sx={{ mb: 3 }}>
                                {loading ? (
                                    <Stack direction="row" spacing={1}>
                                        {[...Array(4)].map((_, i) => (
                                            <Skeleton key={i} variant="rectangular" width={60} height={32} />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {jobData.keywords.map((keyword, index) => (
                                            <Chip
                                                key={index}
                                                label={keyword}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 1 }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Job Description */}
                            <Box sx={{ mb: 4 }}>
                                <Typography
                                    variant="h6"
                                    component="h6"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        mb: 2,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Job Description
                                </Typography>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={200} />
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {jobData.description}
                                    </ReactMarkdown>
                                )}
                            </Box>

                            {/* Apply Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                {
                                    !loading && (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                backgroundColor: theme.palette.secondary.main,
                                                px: 6,
                                                py: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                borderRadius: 2
                                            }}
                                            onClick={() => navigate(`/job/apply/${jobId}`)}
                                        >
                                            Apply Now
                                        </Button>
                                    )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid size={{
                    xs: 12, lg: 4
                }} >
                    <Stack spacing={3}>
                        {/* Job Details Card */}
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography
                                variant="h5"
                                component="h3"
                                sx={{
                                    color: theme.palette.primary.main,
                                    mb: 2,
                                    fontWeight: 'bold'
                                }}
                            >
                                Job Details
                            </Typography>

                            <Stack spacing={2.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="h5" color="textSecondary">
                                        ₹
                                    </Typography>
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Salary
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={150} />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                ₹{jobData.salary}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <School color="action" />
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Qualification
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={150} />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                {jobData.qualification}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Category color="action" />
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Category
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={150} />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                {jobData.category}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CalendarToday color="action" />
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Posted On
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={150} />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatDate(jobData.created_at)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Contact Information Card */}
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography
                                variant="h5"
                                component="h3"
                                sx={{
                                    color: theme.palette.primary.main,
                                    mb: 2,
                                    fontWeight: 'bold'
                                }}
                            >
                                Contact Information
                            </Typography>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Email color="action" />
                                    <Box>
                                        <Typography variant="body2" color="textSecondary">
                                            Email
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={150} />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                {jobData.hireremailid}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {jobData.hirername && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Person color="action" />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                Recruiter
                                            </Typography>
                                            {loading ? (
                                                <Skeleton variant="text" width={150} />
                                            ) : (
                                                <Typography variant="body1" fontWeight="medium">
                                                    {jobData.hirername}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>

                        {/* Quick Apply Card */}
                        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.palette.primary.main,
                                    mb: 2
                                }}
                            >
                                Interested in this position?
                            </Typography>
                            {
                                !loading && (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            borderColor: theme.palette.secondary.main,
                                            color: theme.palette.secondary.main,
                                            '&:hover': {
                                                backgroundColor: theme.palette.secondary.main,
                                                color: 'white'
                                            }
                                        }}
                                        onClick={() => navigate(`/job/apply/${jobId}`)}
                                    >
                                        Quick Apply
                                    </Button>
                                )}
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box >
    );
};

export default JobDetailView;