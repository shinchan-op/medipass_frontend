import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VideocamIcon from '@mui/icons-material/Videocam';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Appointment, AppointmentStatus, Doctor } from '../types';
import AppointmentScheduleModal from '../components/appointments/AppointmentScheduleModal';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import dayjs from 'dayjs';
import { fetchAppointments } from '../services/api';

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: "D001",
    name: "Dr. Robert Smith",
    specialty: "Cardiology",
    hospital: "City General Hospital",
    contact: "+1 (555) 123-8901",
    email: "robert.smith@cityhospital.com"
  },
  {
    id: "D002",
    name: "Dr. Emily Johnson",
    specialty: "Endocrinology",
    hospital: "Metro Medical Center",
    contact: "+1 (555) 123-8902",
    email: "emily.johnson@metromedical.com"
  },
  {
    id: "D003",
    name: "Dr. David Wilson",
    specialty: "Neurology",
    hospital: "City General Hospital",
    contact: "+1 (555) 123-8903",
    email: "david.wilson@cityhospital.com"
  },
  {
    id: "D004",
    name: "Dr. Lisa Chen",
    specialty: "Dermatology",
    hospital: "Wellness Medical Plaza",
    contact: "+1 (555) 123-8904",
    email: "lisa.chen@wellnessplaza.com"
  }
];

const Appointments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State management
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-asc');
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Load appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
        // Would show error notification in a real app
      } finally {
        setLoading(false);
      }
    };
    
    loadAppointments();
  }, []);
  
  // Filtered and sorted appointments based on current tab, search, and filters
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by tab (upcoming vs past)
    if (tabValue === 0) {
      // Upcoming: scheduled or pending appointments with date in the future
      if (appointment.status !== AppointmentStatus.SCHEDULED && 
          appointment.status !== AppointmentStatus.PENDING) {
        return false;
      }
      if (dayjs(appointment.dateTime).isBefore(dayjs())) {
        return false;
      }
    } else {
      // Past: completed or cancelled appointments or past date
      if ((appointment.status === AppointmentStatus.SCHEDULED || 
           appointment.status === AppointmentStatus.PENDING) && 
          dayjs(appointment.dateTime).isAfter(dayjs())) {
        return false;
      }
    }
    
    // Filter by status
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.doctorName.toLowerCase().includes(query) ||
        appointment.specialty.toLowerCase().includes(query) ||
        appointment.purpose.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return dayjs(a.dateTime).diff(dayjs(b.dateTime));
      case 'date-desc':
        return dayjs(b.dateTime).diff(dayjs(a.dateTime));
      case 'doctor-asc':
        return a.doctorName.localeCompare(b.doctorName);
      case 'doctor-desc':
        return b.doctorName.localeCompare(a.doctorName);
      default:
        return 0;
    }
  });
  
  // Upcoming appointments for overview
  const upcomingAppointments = appointments.filter(
    app => app.status === AppointmentStatus.SCHEDULED && dayjs(app.dateTime).isAfter(dayjs())
  ).sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)));
  
  // Past appointments for overview
  const pastAppointments = appointments.filter(
    app => app.status === AppointmentStatus.COMPLETED
  ).sort((a, b) => dayjs(b.dateTime).diff(dayjs(a.dateTime)));
  
  // Next appointment
  const nextAppointment = upcomingAppointments[0];
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle filter status change
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };
  
  // Format appointment date and time
  const formatDateTime = (dateTime: string) => {
    const date = dayjs(dateTime);
    return {
      date: date.format('MMM D, YYYY'),
      day: date.format('ddd'),
      time: date.format('h:mm A'),
      isToday: date.isSame(dayjs(), 'day'),
      isTomorrow: date.isSame(dayjs().add(1, 'day'), 'day'),
      isPast: date.isBefore(dayjs())
    };
  };
  
  // Handle opening action menu for an appointment
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedAppointment(appointment);
  };
  
  // Handle closing action menu
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedAppointment(null);
  };
  
  // Handle scheduling new appointment
  const handleScheduleAppointment = (appointmentData: any) => {
    // In a real app, this would make an API call to create the appointment
    const newAppointment: Appointment = {
      id: `A${Math.floor(Math.random() * 10000)}`,
      patientId: "P12345", // Would come from current user
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      specialty: appointmentData.specialty,
      dateTime: appointmentData.dateTime,
      status: AppointmentStatus.SCHEDULED,
      purpose: appointmentData.purpose,
      notes: appointmentData.notes
    };
    
    setAppointments([...appointments, newAppointment]);
  };
  
  // Handle rescheduling appointment
  const handleRescheduleAppointment = () => {
    handleActionMenuClose();
    // Would open a reschedule modal in a real app
    alert('Reschedule functionality would open a modal');
  };
  
  // Handle cancelling appointment
  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      // In a real app, this would make an API call to update the appointment
      const updatedAppointments = appointments.map(app => 
        app.id === selectedAppointment.id 
          ? { ...app, status: AppointmentStatus.CANCELLED } 
          : app
      );
      setAppointments(updatedAppointments);
    }
    handleActionMenuClose();
  };
  
  if (loading) {
    return <LoadingState message="Loading your appointments..." />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader 
        title="Appointments" 
        subtitle="Manage your healthcare appointments"
        action={
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => setScheduleModalOpen(true)}
          >
            New Appointment
          </Button>
        }
      />
      
      {/* Overview Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Overview
          </Typography>
          
          <Grid container spacing={3}>
            {/* Total Upcoming */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {upcomingAppointments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Appointments
                </Typography>
              </Box>
            </Grid>
            
            {/* Next Appointment */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                {nextAppointment ? (
                  <>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                      {formatDateTime(nextAppointment.dateTime).isToday ? 'Today' : 
                       formatDateTime(nextAppointment.dateTime).isTomorrow ? 'Tomorrow' :
                       formatDateTime(nextAppointment.dateTime).date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Appointment
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" fontWeight="bold" color="text.secondary">
                      None
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Appointment
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            
            {/* Recent Visits */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {pastAppointments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Past Appointments
                </Typography>
              </Box>
            </Grid>
            
            {/* Follow-ups */}
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {pastAppointments.filter(a => a.notes?.includes('follow-up')).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Follow-ups
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Main Appointments Section */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="appointment tabs"
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label="Upcoming" />
            <Tab label="Past" />
          </Tabs>
        </Box>
        
        {/* Search and Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search by doctor, specialty, etc."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: isMobile ? '100%' : 250 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="filter-status-label">Status</InputLabel>
              <Select
                labelId="filter-status-label"
                id="filter-status"
                value={filterStatus}
                label="Status"
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={AppointmentStatus.SCHEDULED}>Scheduled</MenuItem>
                <MenuItem value={AppointmentStatus.PENDING}>Pending</MenuItem>
                <MenuItem value={AppointmentStatus.COMPLETED}>Completed</MenuItem>
                <MenuItem value={AppointmentStatus.CANCELLED}>Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="date-asc">Date ↑</MenuItem>
                <MenuItem value="date-desc">Date ↓</MenuItem>
                <MenuItem value="doctor-asc">Doctor (A-Z)</MenuItem>
                <MenuItem value="doctor-desc">Doctor (Z-A)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider />
        
        {/* Appointments List */}
        <Box sx={{ p: 0 }}>
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment, index) => {
              const { date, day, time, isToday, isTomorrow, isPast } = formatDateTime(appointment.dateTime);
              const displayDate = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `${day}, ${date}`;
              
              return (
                <React.Fragment key={appointment.id}>
                  {index > 0 && <Divider />}
                  <Box sx={{ 
                    p: isMobile ? 2 : 3, 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2,
                    alignItems: isMobile ? 'flex-start' : 'center',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.01)'
                    }
                  }}>
                    {/* Date and Time */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: isMobile ? '100%' : 100,
                      p: isMobile ? 1 : 0,
                      mb: isMobile ? 1 : 0,
                      borderBottom: isMobile ? `1px solid ${theme.palette.divider}` : 'none'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isPast ? 'action.disabledBackground' : (
                          isToday ? 'primary.light' : 'background.paper'
                        ),
                        border: '1px solid',
                        borderColor: isPast ? 'action.disabled' : (
                          isToday ? 'primary.main' : theme.palette.divider
                        ),
                        borderRadius: 1,
                        p: 1,
                        width: isMobile ? '100%' : 70,
                        height: isMobile ? 'auto' : 70,
                      }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={isPast ? 'text.disabled' : (
                              isToday ? 'primary.main' : 'text.primary'
                            )}
                          >
                            {displayDate}
                          </Typography>
                          <Typography 
                            variant="body2"
                            color={isPast ? 'text.disabled' : 'text.secondary'}
                          >
                            {time}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Appointment Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {appointment.purpose}
                        </Typography>
                        
                        {/* Mobile Actions */}
                        {isMobile && (
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleActionMenuOpen(e, appointment)}
                            aria-label="appointment actions"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {appointment.doctorName} • {appointment.specialty}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                        <StatusBadge status={appointment.status} />
                        
                        {appointment.status === AppointmentStatus.SCHEDULED && !isPast && (
                          <Chip 
                            icon={<VideocamIcon fontSize="small" />} 
                            label="Join Video Call" 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                            clickable
                          />
                        )}
                        
                        {appointment.status === AppointmentStatus.COMPLETED && (
                          <Chip 
                            icon={<CheckCircleIcon fontSize="small" />} 
                            label="View Summary" 
                            color="success" 
                            variant="outlined" 
                            size="small"
                            clickable
                          />
                        )}
                      </Box>
                    </Box>
                    
                    {/* Desktop Actions */}
                    {!isMobile && (
                      <Box>
                        <IconButton 
                          onClick={(e) => handleActionMenuOpen(e, appointment)}
                          aria-label="appointment actions"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </React.Fragment>
              );
            })
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No appointments found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {tabValue === 0 
                  ? "You don't have any upcoming appointments." 
                  : "You don't have any past appointments."}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => setScheduleModalOpen(true)}
              >
                Book an Appointment
              </Button>
            </Box>
          )}
        </Box>
      </Card>
      
      {/* Appointment Actions Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        {selectedAppointment && selectedAppointment.status === AppointmentStatus.SCHEDULED && 
         !dayjs(selectedAppointment.dateTime).isBefore(dayjs()) && (
          <MenuItem onClick={handleRescheduleAppointment}>Reschedule</MenuItem>
        )}
        {selectedAppointment && selectedAppointment.status === AppointmentStatus.SCHEDULED && 
         !dayjs(selectedAppointment.dateTime).isBefore(dayjs()) && (
          <MenuItem onClick={handleCancelAppointment}>Cancel</MenuItem>
        )}
        <MenuItem onClick={handleActionMenuClose}>View Details</MenuItem>
      </Menu>
      
      {/* Schedule Appointment Modal */}
      <AppointmentScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleScheduleAppointment}
        doctors={mockDoctors}
      />
    </Container>
  );
};

export default Appointments; 