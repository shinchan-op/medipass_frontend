import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, styled, useTheme, useMediaQuery } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
  },
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

const MobileActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const actions = [
    {
      title: 'Scan Doctor\'s QR',
      description: 'Share medical history with doctor',
      icon: <QrCodeScannerIcon />,
      color: 'primary',
      onClick: () => navigate('/qr-scanner'),
    },
    {
      title: 'Upload Records',
      description: 'Add new medical documents',
      icon: <UploadFileIcon />,
      color: 'secondary',
      onClick: () => navigate('/records/upload'),
    },
    {
      title: 'Book Appointment',
      description: 'Schedule with doctors',
      icon: <EventIcon />,
      color: 'info',
      onClick: () => navigate('/appointments/new'),
    },
    {
      title: 'Emergency Info',
      description: 'View critical medical data',
      icon: <LocalHospitalIcon />,
      color: 'error',
      onClick: () => navigate('/emergency'),
    },
  ] as const;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: isMobile ? 1.5 : 3 }}>
          Access commonly used features to manage your healthcare
        </Typography>
        
        <Grid container spacing={isMobile ? 1 : 2}>
          {actions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              {isMobile ? (
                <MobileActionButton 
                  variant="contained" 
                  color={action.color}
                  onClick={action.onClick}
                  sx={{ 
                    backgroundColor: (theme) => 
                      theme.palette[action.color].light,
                    color: (theme) => 
                      theme.palette[action.color].dark,
                    '&:hover': {
                      backgroundColor: (theme) => 
                        theme.palette[action.color].main,
                      color: (theme) => 
                        theme.palette[action.color].contrastText,
                    }
                  }}
                >
                  <Box>
                    {action.icon}
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="caption" 
                      component="div" 
                      fontWeight="bold"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {action.title}
                    </Typography>
                  </Box>
                </MobileActionButton>
              ) : (
                <ActionButton 
                  variant="contained" 
                  color={action.color}
                  onClick={action.onClick}
                  sx={{ 
                    backgroundColor: (theme) => 
                      theme.palette[action.color].light,
                    color: (theme) => 
                      theme.palette[action.color].dark,
                    '&:hover': {
                      backgroundColor: (theme) => 
                        theme.palette[action.color].main,
                      color: (theme) => 
                        theme.palette[action.color].contrastText,
                    }
                  }}
                >
                  <Box>
                    {action.icon}
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="subtitle2" 
                      component="div" 
                      fontWeight="bold"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {action.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="inherit" 
                      sx={{ opacity: 0.8, display: { xs: 'none', sm: 'block' } }}
                    >
                      {action.description}
                    </Typography>
                  </Box>
                </ActionButton>
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 