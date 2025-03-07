import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Avatar, 
  Badge, 
  Divider, 
  useTheme, 
  useMediaQuery,
  Menu,
  MenuItem,
  Container,
  SwipeableDrawer,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import EventIcon from '@mui/icons-material/Event';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Close drawer when route changes (for mobile)
  useEffect(() => {
    if (isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [location, isMobile, mobileOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };

  const handleLogout = () => {
    // Handle logout functionality
    handleProfileMenuClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isSmallScreen) {
      setMobileOpen(false);
    }
  };

  const navigationItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/' 
    },
    { 
      text: 'Medical Records', 
      icon: <FolderIcon />, 
      path: '/records' 
    },
    { 
      text: 'Appointments', 
      icon: <EventIcon />, 
      path: '/appointments' 
    },
    { 
      text: 'Data Sharing', 
      icon: <ShareIcon />, 
      path: '/sharing' 
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings' 
    },
  ];

  const notifications = [
    { id: 1, message: 'Appointment reminder: Dr. Smith tomorrow at 10:00 AM', read: false },
    { id: 2, message: 'New lab results are available', read: false },
    { id: 3, message: 'Time to take your medication', read: true },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        backgroundColor: theme.palette.primary.main, 
        color: 'white' 
      }}>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          MediPass
        </Typography>
        {isSmallScreen && (
          <IconButton sx={{ ml: 'auto', color: 'white' }} onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText,
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              borderRadius: 1, 
              backgroundColor: theme.palette.error.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
              '& .MuiListItemIcon-root': {
                color: 'white',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LocalHospitalIcon />
            </ListItemIcon>
            <ListItemText primary="Emergency Mode" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ pr: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* App logo for mobile view */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <LocalHospitalIcon color="primary" sx={{ mr: 0.5 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
                MediPass
              </Typography>
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton 
            color="inherit" 
            aria-label="notifications"
            onClick={handleNotificationMenuOpen}
            size={isMobile ? "small" : "medium"}
          >
            <Badge badgeContent={2} color="error">
              <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
            </Badge>
          </IconButton>
          
          <IconButton 
            color="inherit" 
            edge="end" 
            aria-label="account" 
            onClick={handleProfileMenuOpen}
            sx={{ ml: 1 }}
            size={isMobile ? "small" : "medium"}
          >
            <Avatar sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, bgcolor: theme.palette.primary.main, fontSize: isMobile ? 14 : 16 }}>
              JD
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        {isMobile ? (
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </SwipeableDrawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'none', sm: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </Drawer>
        )}
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Profile menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 0.5, minWidth: 180 }
        }}
      >
        <MenuItem onClick={() => { handleNavigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Notifications menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 0.5, width: { xs: 280, sm: 320 }, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id} 
            sx={{ 
              whiteSpace: 'normal', 
              py: 1.5,
              backgroundColor: notification.read ? undefined : 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: notification.read ? undefined : 'rgba(25, 118, 210, 0.12)',
              }
            }}
          >
            <ListItemText 
              primary={notification.message} 
              primaryTypographyProps={{ 
                variant: 'body2', 
                fontWeight: notification.read ? 'normal' : 'bold' 
              }}
            />
          </MenuItem>
        ))}
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography 
            component={Link} 
            to="/notifications" 
            variant="body2" 
            color="primary" 
            sx={{ textDecoration: 'none' }}
            onClick={() => {
              handleNavigate('/notifications');
              handleNotificationMenuClose();
            }}
          >
            View All Notifications
          </Typography>
        </Box>
      </Menu>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: { xs: '56px', sm: '64px' },
          backgroundColor: theme.palette.background.default,
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" disableGutters={isMobile} sx={{ overflow: 'hidden' }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 