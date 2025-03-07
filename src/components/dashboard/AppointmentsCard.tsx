import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  useTheme, 
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Appointment } from '../../types';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StatusBadge from '../common/StatusBadge';
import dayjs from 'dayjs';

interface AppointmentsCardProps {
  appointments: Appointment[];
}

const AppointmentsCard: React.FC<AppointmentsCardProps> = ({ appointments }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === 'scheduled' && dayjs(appointment.dateTime).isAfter(dayjs())
  ).sort((a, b) => dayjs(a.dateTime).diff(dayjs(b.dateTime)));

  // Only show the next 3 appointments (or 2 on mobile)
  const displayAppointments = upcomingAppointments.slice(0, isMobile ? 2 : 3);

  const formatAppointmentTime = (dateTime: string) => {
    const date = dayjs(dateTime);
    return {
      date: date.format('MMM D, YYYY'),
      time: date.format('h:mm A'),
      isToday: date.isSame(dayjs(), 'day'),
      isTomorrow: date.isSame(dayjs().add(1, 'day'), 'day')
    };
  };

  return (
    <Card sx={{ mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: isMobile ? 2 : 3, pb: isMobile ? 1.5 : 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Upcoming Appointments
            </Typography>
            <Button 
              component={Link} 
              to="/appointments" 
              size="small" 
              color="primary"
            >
              View All
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your next scheduled consultations
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1 }}>
          {displayAppointments.length > 0 ? (
            <List disablePadding>
              {displayAppointments.map((appointment, index) => {
                const { date, time, isToday, isTomorrow } = formatAppointmentTime(appointment.dateTime);
                const displayDate = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : date;
                
                return (
                  <React.Fragment key={appointment.id}>
                    {index > 0 && <Divider />}
                    <ListItem 
                      sx={{ 
                        px: isMobile ? 2 : 3, 
                        py: isMobile ? 1.5 : 2, 
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    >
                      {isMobile ? (
                        // Mobile layout
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                mr: 1.5
                              }}
                            >
                              <EventIcon />
                            </Box>
                            <Box>
                              <Typography 
                                variant="subtitle2" 
                                fontWeight="bold"
                              >
                                {displayDate} • {time}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.purpose}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ pl: 6.5, mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <PersonIcon sx={{ fontSize: '0.75rem', mr: 0.75, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {appointment.doctorName}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocalHospitalIcon sx={{ fontSize: '0.75rem', mr: 0.75, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {appointment.specialty}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <StatusBadge status={appointment.status} size="small" />
                            {isToday && (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<VideocamIcon />}
                              >
                                Join
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        // Tablet and Desktop layout
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              mr: 2,
                              minWidth: '60px'
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 60, 
                                height: 60, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                mb: 1
                              }}
                            >
                              <EventIcon fontSize="large" />
                            </Box>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                textTransform: 'uppercase', 
                                fontWeight: 'bold',
                                textAlign: 'center'
                              }}
                            >
                              {displayDate}
                            </Typography>
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {appointment.purpose}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {time}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PersonIcon sx={{ fontSize: '0.875rem', mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {appointment.doctorName}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocalHospitalIcon sx={{ fontSize: '0.875rem', mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {appointment.specialty}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                              <StatusBadge status={appointment.status} sx={{ mr: 1 }} />
                              {isToday && (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="primary" 
                                  startIcon={<VideocamIcon />}
                                  sx={{ ml: 1 }}
                                >
                                  Join
                                </Button>
                              )}
                            </Box>
                          </Box>

                          <Box>
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No upcoming appointments
              </Typography>
              <Button 
                component={Link} 
                to="/appointments/new" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Book Appointment
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard; 