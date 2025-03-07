import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Lock as PrivacyIcon,
  Notifications as NotificationsIcon,
  Settings as PreferencesIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

// Import section components
import AccountSettings from '../components/settings/AccountSettings';
import PrivacySettings from '../components/settings/PrivacySettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AppPreferences from '../components/settings/AppPreferences';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your account, privacy, and preferences"
      />
      
      <Paper elevation={2} sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant={isTablet ? "scrollable" : "fullWidth"}
            scrollButtons={isTablet ? "auto" : false}
            aria-label="settings tabs"
          >
            <Tab 
              icon={<AccountIcon />} 
              label="Account" 
              {...a11yProps(0)}
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<PrivacyIcon />} 
              label="Privacy & Access" 
              {...a11yProps(1)}
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Security" 
              {...a11yProps(2)}
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label="Notifications" 
              {...a11yProps(3)}
              sx={{ minHeight: 72 }}
            />
            <Tab 
              icon={<PreferencesIcon />} 
              label="Preferences" 
              {...a11yProps(4)}
              sx={{ minHeight: 72 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <AccountSettings />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <PrivacySettings />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <SecuritySettings />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <NotificationSettings />
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <AppPreferences />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Settings; 