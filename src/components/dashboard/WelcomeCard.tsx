import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip, Button, Grid, styled, useTheme, useMediaQuery } from '@mui/material';
import QRCode from 'react-qr-code';
import { Patient } from '../../types';

interface WelcomeCardProps {
  patient: Patient;
}

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}));

const MobileProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[1],
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1),
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const WelcomeCard: React.FC<WelcomeCardProps> = ({ patient }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        {isMobile ? (
          // Mobile layout: Profile info at top, health info and QR code below
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MobileProfileAvatar src="/path/to/profile.jpg" alt={patient.name}>
                {patient.name.charAt(0)}
              </MobileProfileAvatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Hello, {patient.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MediPass ID: {patient.id}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5 }}>
              Basic Health Information
            </Typography>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <InfoItem>
                  <InfoLabel>Blood Group</InfoLabel>
                  <InfoValue>{patient.bloodGroup}</InfoValue>
                </InfoItem>
              </Grid>

              <Grid item xs={6}>
                <InfoItem>
                  <InfoLabel>Age</InfoLabel>
                  <InfoValue>{patient.age} years</InfoValue>
                </InfoItem>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <InfoLabel>Allergies</InfoLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {patient.medicalHistory?.allergies.length ? (
                  patient.medicalHistory.allergies.map((allergy, index) => (
                    <Chip 
                      key={index} 
                      label={allergy} 
                      size="small" 
                      color="error" 
                      sx={{ fontWeight: 500, mb: 0.5 }} 
                    />
                  ))
                ) : (
                  <Typography variant="body2">No known allergies</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InfoLabel>Chronic Conditions</InfoLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {patient.medicalHistory?.chronicConditions.length ? (
                  patient.medicalHistory.chronicConditions.map((condition, index) => (
                    <Chip 
                      key={index} 
                      label={condition} 
                      size="small" 
                      color="warning" 
                      sx={{ fontWeight: 500, mb: 0.5 }} 
                    />
                  ))
                ) : (
                  <Typography variant="body2">No chronic conditions</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center', p: 1.5, border: '1px dashed #ddd', borderRadius: 2, maxWidth: 200 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  MediPass QR Code
                </Typography>
                <Box sx={{ bgcolor: 'white', p: 1, borderRadius: 1, display: 'inline-block', mb: 1 }}>
                  <QRCode value={`medipass:patient:${patient.id}`} size={100} />
                </Box>
                <Button variant="outlined" size="small" fullWidth>
                  Download
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          // Tablet and Desktop layout
          <Grid container spacing={isTablet ? 2 : 3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ProfileAvatar src="/path/to/profile.jpg" alt={patient.name}>
                  {patient.name.charAt(0)}
                </ProfileAvatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Hello, {patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MediPass ID: {patient.id}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Basic Health Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <InfoItem>
                    <InfoLabel>Blood Group</InfoLabel>
                    <InfoValue>{patient.bloodGroup}</InfoValue>
                  </InfoItem>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <InfoItem>
                    <InfoLabel>Age</InfoLabel>
                    <InfoValue>{patient.age} years</InfoValue>
                  </InfoItem>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <InfoItem>
                    <InfoLabel>Gender</InfoLabel>
                    <InfoValue>{patient.gender}</InfoValue>
                  </InfoItem>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <InfoLabel>Allergies</InfoLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {patient.medicalHistory?.allergies.length ? (
                    patient.medicalHistory.allergies.map((allergy, index) => (
                      <Chip 
                        key={index} 
                        label={allergy} 
                        size="small" 
                        color="error" 
                        sx={{ fontWeight: 500 }} 
                      />
                    ))
                  ) : (
                    <Typography variant="body2">No known allergies</Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <InfoLabel>Chronic Conditions</InfoLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {patient.medicalHistory?.chronicConditions.length ? (
                    patient.medicalHistory.chronicConditions.map((condition, index) => (
                      <Chip 
                        key={index} 
                        label={condition} 
                        size="small" 
                        color="warning" 
                        sx={{ fontWeight: 500 }} 
                      />
                    ))
                  ) : (
                    <Typography variant="body2">No chronic conditions</Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed #ddd', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Your MediPass QR Code
                </Typography>
                <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, display: 'inline-block', mb: 2 }}>
                  <QRCode value={`medipass:patient:${patient.id}`} size={150} />
                </Box>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                  Scan this code to share your medical information with healthcare providers
                </Typography>
                <Button variant="outlined" size="small" fullWidth>
                  Download QR Code
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeCard; 