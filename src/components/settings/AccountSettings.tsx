import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  MenuItem,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode2 as QrCodeIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const AccountSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    age: '30',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Medical Street, Healthcare City',
  });

  const [linkedProviders] = useState([
    { id: 1, name: 'City General Hospital', accessUntil: '2024-12-31' },
    { id: 2, name: 'Dr. Smith Clinic', accessUntil: '2024-10-15' },
  ]);

  const handleProfileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [field]: event.target.value,
    });
  };

  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  const handleRegenerateQR = () => {
    // TODO: Implement QR code regeneration
  };

  const handleRevokeAccess = (providerId: number) => {
    // TODO: Implement provider access revocation
  };

  return (
    <Box>
      {/* Profile Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" component="h2">
              Personal Information
            </Typography>
            <Button
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              color={isEditing ? "success" : "primary"}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Stack>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={handleProfileChange('name')}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Age"
                value={profileData.age}
                onChange={handleProfileChange('age')}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={profileData.gender}
                onChange={handleProfileChange('gender')}
                disabled={!isEditing}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                onChange={handleProfileChange('email')}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={handleProfileChange('phone')}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={profileData.address}
                onChange={handleProfileChange('address')}
                disabled={!isEditing}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Linked Providers Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Linked Healthcare Providers
          </Typography>
          <List>
            {linkedProviders.map((provider) => (
              <React.Fragment key={provider.id}>
                <ListItem>
                  <ListItemText
                    primary={provider.name}
                    secondary={`Access until: ${provider.accessUntil}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="revoke access"
                      onClick={() => handleRevokeAccess(provider.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Medical ID & QR Code Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Medical ID & QR Code
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>
              Your Medical ID: <strong>MED-123456</strong>
            </Typography>
            <Button
              startIcon={<QrCodeIcon />}
              variant="contained"
              onClick={handleRegenerateQR}
            >
              Regenerate QR Code
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use this ID for quick access to your medical records. The QR code can be regenerated for security purposes.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountSettings; 