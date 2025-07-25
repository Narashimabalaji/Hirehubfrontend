import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Grid,
    Paper,
    Divider,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    LocationOn,
    Work,
    School,

    Business,
    Delete,
    Visibility
} from '@mui/icons-material';
import { useAuth } from '../store/auth';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

interface SavedJob {
    id: string;
    title: string;
    company: string | null;
    category: string;
    description: string;
    location: string;
    qualification: string;
    salary: string;
    keywords: string[];
    status: string;
    hireremailid: string;
    hirername: string;
    created_at: string;
    created_by: string;
}

const SavedJobs: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const { savedJobs }: any = useStore();
    const { emailId } = useAuth();
    const { fetchSavedJobs } = useStore();

    useEffect(() => {
        fetchJobs();
    }, [emailId]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = fetchSavedJobs(emailId);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveJob = (jobId: string) => {
        useStore.getState().removeSavedJob(emailId, jobId);
    };

    const handleViewJob = (jobId: string) => {
        console.log('Viewing job:', jobId);
        // Add navigation or modal logic here
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Main Heading */}
            <Typography
                variant="h5"
                component="h1"
                sx={{
                    mb: 2,
                    color: 'primary.main',
                    fontWeight: 'bold',
                    textAlign: 'left'
                }}
            >
                Saved Jobs
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {savedJobs.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No saved jobs found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Start saving jobs to see them here
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {savedJobs.map((job) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={job.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {/* Job Title */}
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{
                                            mb: 2,
                                            color: 'secondary.main',
                                            fontWeight: 'semibold'
                                        }}
                                    >
                                        {job.title}
                                    </Typography>

                                    {/* Company and Category */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {job.company || 'Company not specified'}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={job.category}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    </Box>

                                    {/* Job Details */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {job.location}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <School sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {job.qualification}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Typography sx={{ fontSize: 16, color: 'text.secondary' }}>₹</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {job.salary}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {job.description}
                                    </Typography>

                                    {/* Keywords */}
                                    <Box sx={{ mb: 2 }}>
                                        {job.keywords.map((keyword, index) => (
                                            <Chip
                                                key={index}
                                                label={keyword}
                                                size="small"
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                        ))}
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Action Buttons */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Button
                                            sx={{
                                                fontSize: 14,
                                                color: "secondary.main"
                                            }}
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => navigate(`/job/${job.id}`)}
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
                    ))}
                </Grid>
            )}

        </Box>
    );
};

export default SavedJobs;