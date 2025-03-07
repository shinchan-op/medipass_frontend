import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Help as HelpIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DocumentIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

const AppPreferences = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportMessage, setSupportMessage] = useState({
    subject: '',
    message: '',
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
  ];

  const supportResources = [
    {
      title: 'Help Center',
      description: 'Browse through our comprehensive help articles',
      icon: <HelpIcon />,
      action: () => window.open('/help-center', '_blank'),
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <ChatIcon />,
      action: () => setShowSupportDialog(true),
    },
    {
      title: 'Contact Support',
      description: 'Email: support@medipass.com\nPhone: +1 234 567 8900',
      icon: <EmailIcon />,
      action: () => window.location.href = 'mailto:support@medipass.com',
    },
  ];

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // TODO: Implement theme change
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
    // TODO: Implement language change
  };

  const handleSupportSubmit = () => {
    // TODO: Implement support message submission
    setShowSupportDialog(false);
    setSupportMessage({ subject: '', message: '' });
  };

  return (
    <Box>
      {/* Theme Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" component="h2">
                Theme Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customize your app appearance
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <DarkModeIcon color={darkMode ? 'primary' : 'disabled'} />
              <Switch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                color="primary"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Language Settings
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageIcon color="primary" />
            <FormControl fullWidth>
              <InputLabel id="language-select-label">Select Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label="Select Language"
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Support & Help */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Support & Help
          </Typography>
          <List>
            {supportResources.map((resource, index) => (
              <React.Fragment key={resource.title}>
                <ListItem onClick={resource.action}>
                  <ListItemIcon>{resource.icon}</ListItemIcon>
                  <ListItemText
                    primary={resource.title}
                    secondary={resource.description}
                  />
                </ListItem>
                {index < supportResources.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Legal Documents
          </Typography>
          <Stack spacing={2}>
            <Button
              startIcon={<DocumentIcon />}
              variant="text"
              component={Link}
              href="/terms"
              target="_blank"
              sx={{ justifyContent: 'flex-start' }}
            >
              Terms & Conditions
            </Button>
            <Button
              startIcon={<DocumentIcon />}
              variant="text"
              component={Link}
              href="/privacy"
              target="_blank"
              sx={{ justifyContent: 'flex-start' }}
            >
              Privacy Policy
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Support Dialog */}
      <Dialog open={showSupportDialog} onClose={() => setShowSupportDialog(false)}>
        <DialogTitle>Contact Support</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              label="Subject"
              fullWidth
              value={supportMessage.subject}
              onChange={(e) => setSupportMessage({ ...supportMessage, subject: e.target.value })}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={supportMessage.message}
              onChange={(e) => setSupportMessage({ ...supportMessage, message: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSupportDialog(false)}>Cancel</Button>
          <Button onClick={handleSupportSubmit} variant="contained">
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppPreferences; 