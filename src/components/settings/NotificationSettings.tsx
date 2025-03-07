import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Stack,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsOff as MuteIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  MedicalServices as MedicalIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

type NotificationCategory = 'appointments' | 'medicalRecords' | 'dataSharing' | 'security';

interface NotificationSetting {
  enabled: boolean;
  [key: string]: boolean;
}

interface NotificationPreferences {
  appointments: NotificationSetting;
  medicalRecords: NotificationSetting;
  dataSharing: NotificationSetting;
  security: NotificationSetting;
}

type SettingsByCategory = {
  appointments: keyof Omit<NotificationSetting, 'enabled'>;
  medicalRecords: keyof Omit<NotificationSetting, 'enabled'>;
  dataSharing: keyof Omit<NotificationSetting, 'enabled'>;
  security: keyof Omit<NotificationSetting, 'enabled'>;
};

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showMuteDialog, setShowMuteDialog] = useState(false);
  const [muteDuration, setMuteDuration] = useState('1h');
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    appointments: {
      enabled: true,
      reminders: true,
      cancellations: true,
      rescheduling: true,
    },
    medicalRecords: {
      enabled: true,
      newRecords: true,
      updates: true,
      reports: true,
    },
    dataSharing: {
      enabled: true,
      requests: true,
      approvals: true,
      accessExpiry: true,
    },
    security: {
      enabled: true,
      loginAlerts: true,
      passwordChanges: true,
      deviceChanges: true,
    },
  });

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handlePreferenceChange = (category: NotificationCategory, setting: string) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleMuteNotifications = () => {
    // TODO: Implement mute notifications
    setShowMuteDialog(false);
  };

  const renderPreferenceSection = (
    title: string,
    category: NotificationCategory,
    icon: React.ReactNode,
    settings: { [key: string]: string }
  ) => (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={preferences[category].enabled}
              onChange={() => handlePreferenceChange(category, 'enabled')}
            />
          }
          label="Enable notifications"
        />
        {preferences[category].enabled && (
          <Box sx={{ ml: 3 }}>
            {Object.entries(settings).map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={preferences[category][key]}
                    onChange={() => handlePreferenceChange(category, key)}
                    size="small"
                  />
                }
                label={label}
              />
            ))}
          </Box>
        )}
      </FormGroup>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <Box>
      {/* Global Notification Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" component="h2">
                Notification Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage how you receive notifications
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                startIcon={<MuteIcon />}
                variant="outlined"
                onClick={() => setShowMuteDialog(true)}
                disabled={!notificationsEnabled}
              >
                Mute
              </Button>
              <Switch
                checked={notificationsEnabled}
                onChange={handleNotificationToggle}
                color="primary"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Notification Preferences
          </Typography>

          {notificationsEnabled && (
            <Box sx={{ mt: 2 }}>
              {renderPreferenceSection(
                'Appointment Notifications',
                'appointments',
                <ScheduleIcon color="primary" />,
                {
                  reminders: 'Appointment reminders',
                  cancellations: 'Cancellation notices',
                  rescheduling: 'Rescheduling updates',
                }
              )}

              {renderPreferenceSection(
                'Medical Record Updates',
                'medicalRecords',
                <MedicalIcon color="primary" />,
                {
                  newRecords: 'New medical records',
                  updates: 'Record updates',
                  reports: 'Test reports',
                }
              )}

              {renderPreferenceSection(
                'Data Sharing Alerts',
                'dataSharing',
                <ShareIcon color="primary" />,
                {
                  requests: 'Access requests',
                  approvals: 'Request approvals',
                  accessExpiry: 'Access expiry alerts',
                }
              )}

              {renderPreferenceSection(
                'Security Alerts',
                'security',
                <SecurityIcon color="primary" />,
                {
                  loginAlerts: 'New login alerts',
                  passwordChanges: 'Password changes',
                  deviceChanges: 'Device changes',
                }
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Mute Dialog */}
      <Dialog open={showMuteDialog} onClose={() => setShowMuteDialog(false)}>
        <DialogTitle>Mute Notifications</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <Typography variant="body2">
              Choose how long you want to mute notifications
            </Typography>
            <TextField
              select
              fullWidth
              value={muteDuration}
              onChange={(e) => setMuteDuration(e.target.value)}
              label="Duration"
            >
              <MenuItem value="1h">1 hour</MenuItem>
              <MenuItem value="4h">4 hours</MenuItem>
              <MenuItem value="8h">8 hours</MenuItem>
              <MenuItem value="24h">24 hours</MenuItem>
              <MenuItem value="permanent">Permanently</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMuteDialog(false)}>Cancel</Button>
          <Button onClick={handleMuteNotifications} variant="contained">
            Mute Notifications
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationSettings; 