import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  PhoneAndroid as DeviceIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Message as MessageIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const SecuritySettings = () => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPINDialog, setShowPINDialog] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pinData, setPinData] = useState({
    currentPIN: '',
    newPIN: '',
    confirmPIN: '',
  });

  const [devices] = useState([
    { id: 1, name: 'iPhone 13', lastAccess: '2024-03-15 10:30 AM', location: 'New York, USA' },
    { id: 2, name: 'Windows PC', lastAccess: '2024-03-15 09:15 AM', location: 'New York, USA' },
    { id: 3, name: 'iPad Pro', lastAccess: '2024-03-14 06:45 PM', location: 'New York, USA' },
  ]);

  const handlePasswordChange = () => {
    // TODO: Implement password change
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePINChange = () => {
    // TODO: Implement PIN change
    setShowPINDialog(false);
    setPinData({ currentPIN: '', newPIN: '', confirmPIN: '' });
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // TODO: Implement 2FA toggle
  };

  const handleBiometricToggle = () => {
    setBiometricEnabled(!biometricEnabled);
    // TODO: Implement biometric toggle
  };

  const handleDeviceRemoval = (deviceId: number) => {
    // TODO: Implement device removal
  };

  const handleLogoutAllDevices = () => {
    // TODO: Implement logout from all devices
  };

  return (
    <Box>
      {/* Password & PIN Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Password & PIN
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => setShowPINDialog(true)}
            >
              Change PIN
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Two-Factor Authentication (2FA)
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1">Enable 2FA</Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive verification codes via SMS or Email
                </Typography>
              </Box>
              <Switch
                checked={twoFactorEnabled}
                onChange={handleTwoFactorToggle}
                color="primary"
              />
            </Box>
            {twoFactorEnabled && (
              <Stack direction="row" spacing={2}>
                <Button startIcon={<MessageIcon />} variant="outlined" size="small">
                  Use SMS
                </Button>
                <Button startIcon={<EmailIcon />} variant="outlined" size="small">
                  Use Email
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Biometric Login */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" component="h2">Biometric Login</Typography>
              <Typography variant="body2" color="text.secondary">
                Use Face ID or Fingerprint for quick access
              </Typography>
            </Box>
            <Switch
              checked={biometricEnabled}
              onChange={handleBiometricToggle}
              color="primary"
              icon={<FingerprintIcon />}
              checkedIcon={<FingerprintIcon />}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">Device Management</Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogoutAllDevices}
              >
                Logout All Devices
              </Button>
            </Box>
            <List>
              {devices.map((device) => (
                <React.Fragment key={device.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DeviceIcon />
                          <Typography>{device.name}</Typography>
                        </Stack>
                      }
                      secondary={`Last access: ${device.lastAccess} • ${device.location}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove device"
                        onClick={() => handleDeviceRemoval(device.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Stack>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              type="password"
              label="Current Password"
              fullWidth
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
            <TextField
              type="password"
              label="New Password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
            <TextField
              type="password"
              label="Confirm New Password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Change PIN Dialog */}
      <Dialog open={showPINDialog} onClose={() => setShowPINDialog(false)}>
        <DialogTitle>Change PIN</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              type="password"
              label="Current PIN"
              fullWidth
              value={pinData.currentPIN}
              onChange={(e) => setPinData({ ...pinData, currentPIN: e.target.value })}
              inputProps={{ maxLength: 6 }}
            />
            <TextField
              type="password"
              label="New PIN"
              fullWidth
              value={pinData.newPIN}
              onChange={(e) => setPinData({ ...pinData, newPIN: e.target.value })}
              inputProps={{ maxLength: 6 }}
            />
            <TextField
              type="password"
              label="Confirm New PIN"
              fullWidth
              value={pinData.confirmPIN}
              onChange={(e) => setPinData({ ...pinData, confirmPIN: e.target.value })}
              inputProps={{ maxLength: 6 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPINDialog(false)}>Cancel</Button>
          <Button onClick={handlePINChange} variant="contained">Change PIN</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecuritySettings; 