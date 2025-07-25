import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import {
    LocationPin,
    AttachMoney,
    School,
    Label,
    CalendarToday,
    Visibility,
    Edit,
    Delete,
    Work,
    AccessTime,
} from '@mui/icons-material';
import jobAPI from '../../api/jobAPi';
import { useAuth } from '../../store/auth';

interface Job {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    salary: string;
    qualification: string;
    keywords: string[];
    status: 'approved' | 'pending' | 'rejected';
    created_at: string;
    hireremailid: string;
    hirername: string;
    company: string | null;
    created_by: string;
}

const HirerJobsComponent: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { emailId } = useAuth();

    useEffect(() => {
        fetchJobs();
    }, [emailId]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const jobs = await jobAPI.fetchHirerJobs(emailId);
            setJobs(jobs);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box maxWidth="xl" mx="auto" mt={4} px={2}>
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box maxWidth="xl" mx="auto" mt={4} mb={4} px={2}>
            <Box mb={2}>
                <Typography variant="h5" fontWeight="bold" color="primary.dark">
                    My Posted Jobs
                </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {jobs.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Work sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Typography variant="h6" color="text.secondary">
                        No jobs posted yet
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {jobs.map((job) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job.id}>
                            <Card
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 400 // Set minimum height for consistency
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6"
                                            fontWeight="bold"
                                            color="secondary.main"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '3em' // Reserve space for 2 lines
                                            }}
                                        >
                                            {job.title}
                                        </Typography>
                                        <Chip label={job.status} color={getStatusColor(job.status)} size="small" />
                                    </Box>

                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <Box display="flex" alignItems="center">
                                                <Label fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {job.category}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box display="flex" alignItems="center">
                                                <LocationPin fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {job.location}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Box display="flex" alignItems="center">
                                                <Typography fontSize="medium" sx={{ color: 'primary.main', mr: 1 }}> ₹</Typography>
                                                <Typography variant="body2" color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {job.salary}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Box display="flex" alignItems="center">
                                                <School fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
                                                <Typography variant="body2" color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {job.qualification}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box mt={2}>
                                        <Typography variant="body2" color="text.secondary"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            {job.description}
                                        </Typography>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            Keywords:
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={0.5}
                                            sx={{
                                                maxHeight: '60px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {job.keywords.slice(0, 6).map((keyword, index) => (
                                                <Chip
                                                    key={index}
                                                    label={keyword.trim()}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                                                />
                                            ))}
                                            {job.keywords.length > 6 && (
                                                <Chip
                                                    label={`+${job.keywords.length - 6}`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ color: 'text.secondary', borderColor: 'text.secondary' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ flexGrow: 1 }} />

                                    <Divider sx={{ my: 2 }} />

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" color="text.secondary">
                                            <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 0.5 }} />
                                            <Typography variant="caption">{formatDate(job.created_at)}</Typography>
                                        </Box>

                                        <Box>
                                            {/* <Tooltip title="View Details">
                                                <IconButton>
                                                    <Visibility sx={{ color: 'primary.main' }} fontSize="small" />
                                                </IconButton>
                                            </Tooltip>*/}
                                            <Tooltip title="Edit Job">
                                                <IconButton>
                                                    <Edit sx={{ color: 'primary.main' }} fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {/* <Tooltip title="Delete Job">
                                                <IconButton>
                                                    <Delete sx={{ color: 'error.main' }} fontSize="small" />
                                                </IconButton>
                                            </Tooltip>*/}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )
            }
        </Box >
    );
};

export default HirerJobsComponent;
