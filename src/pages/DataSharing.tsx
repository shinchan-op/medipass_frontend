import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as DownloadIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon,
  FileCopy as FileIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { styled } from '@mui/material/styles';
import QRCodeWithFallback from '../components/common/QRCodeWithFallback';

// Mock data for healthcare providers
const mockProviders = [
  { id: 'D1', name: 'Dr. Robert Smith', specialty: 'Cardiology', hospital: 'City General Hospital' },
  { id: 'D2', name: 'Dr. Emily Johnson', specialty: 'Endocrinology', hospital: 'Metro Medical Center' },
  { id: 'H1', name: 'City General Hospital', type: 'Hospital', address: '123 Medical Ave.' },
  { id: 'H2', name: 'Metro Medical Center', type: 'Hospital', address: '456 Health Blvd.' },
  { id: 'P1', name: 'Central Pharmacy', type: 'Pharmacy', address: '789 Drug St.' },
  { id: 'L1', name: 'QuickLab Diagnostics', type: 'Laboratory', address: '321 Test Rd.' },
];

// Mock data for shared accesses
const mockSharedAccess = [
  {
    id: 'SA1',
    recipient: 'Dr. Robert Smith',
    recipientType: 'Doctor',
    accessType: 'Read-Only',
    sharedDate: '2023-04-01',
    expiryDate: '2023-07-01',
    lastAccessed: '2023-04-15',
    records: ['Complete Medical History', 'Latest Lab Results'],
  },
  {
    id: 'SA2',
    recipient: 'City General Hospital',
    recipientType: 'Hospital',
    accessType: 'Read-Only',
    sharedDate: '2023-03-15',
    expiryDate: '2023-06-15',
    lastAccessed: '2023-04-10',
    records: ['Prescriptions', 'Appointments'],
  },
  {
    id: 'SA3',
    recipient: 'QuickLab Diagnostics',
    recipientType: 'Laboratory',
    accessType: 'Read-Only',
    sharedDate: '2023-04-10',
    expiryDate: '2023-05-10',
    lastAccessed: 'Never',
    records: ['Previous Lab Results'],
  },
];

// Mock data for medical records
const mockMedicalRecords = [
  { id: 'R1', type: 'Complete Medical History', date: '2023-04-01', size: '2.5 MB' },
  { id: 'R2', type: 'Prescriptions', date: '2023-03-20', size: '1.2 MB' },
  { id: 'R3', type: 'Lab Results', date: '2023-03-15', size: '3.7 MB' },
  { id: 'R4', type: 'Diagnosis & Treatments', date: '2023-03-10', size: '1.8 MB' },
  { id: 'R5', type: 'Appointments', date: '2023-03-05', size: '0.5 MB' },
  { id: 'R6', type: 'Medical Images', date: '2023-02-28', size: '8.2 MB' },
];

// Styled QR Code container
const QRCodeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  width: 'fit-content',
}));

const DataSharing: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for tab control in main page
  const [tabValue, setTabValue] = useState(0);
  
  // State for the QR code generation
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrExpiry, setQrExpiry] = useState('1h');
  const [medipassId] = useState('MP1234567890');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // State for sharing records
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [accessDuration, setAccessDuration] = useState('24h');
  const [pinVerification, setPinVerification] = useState('');
  
  // State for Record Download
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDownloadRecords, setSelectedDownloadRecords] = useState<string[]>([]);
  
  // State for Access Management
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<any>(null);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle QR code generation
  const handleGenerateQR = () => {
    try {
      setShowQRCode(true);
    } catch (error) {
      console.error('Error generating QR code: ', error);
      alert('Failed to generate QR code. Please try again later.');
    }
  };
  
  // Handle expiry time change
  const handleExpiryChange = (event: SelectChangeEvent<string>) => {
    try {
      setQrExpiry(event.target.value);
    } catch (error) {
      console.error('Error setting expiry time: ', error);
      // Set default value
      setQrExpiry('1h');
    }
  };
  
  // Handle MedipassID copy
  const handleCopyMedipassId = () => {
    try {
      navigator.clipboard.writeText(medipassId)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Could not copy to clipboard. Please try again or copy manually.');
        });
    } catch (error) {
      console.error('Clipboard API not available: ', error);
      alert('Clipboard functionality not available in your browser.');
    }
  };
  
  // Handle share dialog
  const handleOpenShareDialog = () => {
    setShareDialogOpen(true);
  };
  
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
    // Reset form
    setSelectedProvider('');
    setSelectedRecords([]);
    setAccessDuration('24h');
    setPinVerification('');
  };
  
  const handleSelectRecord = (recordId: string) => {
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId));
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };
  
  const handleSelectAllRecords = () => {
    if (selectedRecords.length === mockMedicalRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(mockMedicalRecords.map(record => record.id));
    }
  };
  
  const handleShareRecords = () => {
    // In a real app, this would send the data to the backend
    console.log({
      provider: selectedProvider,
      records: selectedRecords,
      duration: accessDuration,
      pin: pinVerification
    });
    
    // Close dialog and reset form
    handleCloseShareDialog();
  };
  
  // Handle download dialog
  const handleOpenDownloadDialog = () => {
    setDownloadDialogOpen(true);
  };
  
  const handleCloseDownloadDialog = () => {
    setDownloadDialogOpen(false);
    setSelectedDownloadRecords([]);
  };
  
  const handleSelectDownloadRecord = (recordId: string) => {
    if (selectedDownloadRecords.includes(recordId)) {
      setSelectedDownloadRecords(selectedDownloadRecords.filter(id => id !== recordId));
    } else {
      setSelectedDownloadRecords([...selectedDownloadRecords, recordId]);
    }
  };
  
  const handleDownloadRecords = () => {
    // In a real app, this would trigger a file download
    console.log('Downloading records:', selectedDownloadRecords);
    handleCloseDownloadDialog();
  };
  
  // Handle access management dialog
  const handleOpenAccessDialog = (access: any) => {
    setSelectedAccess(access);
    setAccessDialogOpen(true);
  };
  
  const handleCloseAccessDialog = () => {
    setAccessDialogOpen(false);
    setSelectedAccess(null);
  };
  
  const handleRevokeAccess = () => {
    // In a real app, this would call the backend to revoke access
    console.log('Revoking access for:', selectedAccess?.recipient);
    handleCloseAccessDialog();
  };
  
  const handleExtendAccess = (newDuration: string) => {
    // In a real app, this would call the backend to extend access
    console.log('Extending access for:', selectedAccess?.recipient, 'to', newDuration);
    handleCloseAccessDialog();
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <PageHeader
        title="Data Sharing"
        subtitle="Control who can access your medical records"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleOpenShareDialog}
          >
            Share Records
          </Button>
        }
      />
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="data sharing tabs"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant={isMobile ? 'fullWidth' : 'standard'}
      >
        <Tab label="Quick Access" />
        <Tab label="Shared Access" />
        <Tab label="Export Records" />
      </Tabs>
      
      {/* Quick Access Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* QR Code Generation */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generate Temporary QR Code
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create a temporary QR code that healthcare providers can scan to access your selected records.
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Expiry Time</InputLabel>
                    <Select
                      value={qrExpiry}
                      onChange={handleExpiryChange}
                      label="Expiry Time"
                    >
                      <MenuItem value="10m">10 Minutes</MenuItem>
                      <MenuItem value="1h">1 Hour</MenuItem>
                      <MenuItem value="1d">24 Hours</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCodeIcon />}
                  onClick={handleGenerateQR}
                  fullWidth
                >
                  Generate QR Code
                </Button>
                
                {showQRCode && (
                  <QRCodeContainer>
                    <QRCodeWithFallback 
                      value={`https://medipass.health/share/${medipassId}?expiry=${qrExpiry}`} 
                      size={180} 
                      level="H"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Expires in: {qrExpiry === '10m' ? '10 minutes' : qrExpiry === '1h' ? '1 hour' : '24 hours'}
                    </Typography>
                  </QRCodeContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Medipass ID Sharing */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Share Medipass ID
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Healthcare providers can request access using your Medipass ID. You'll receive a notification to approve access.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}>
                  <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                    {medipassId}
                  </Typography>
                  <IconButton onClick={handleCopyMedipassId} color={copySuccess ? "success" : "default"}>
                    {copySuccess ? <CheckIcon /> : <CopyIcon />}
                  </IconButton>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Access Requests
                </Typography>
                <List disablePadding>
                  <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}>
                    <ListItemText
                      primary="Dr. Emily Johnson"
                      secondary="Metro Medical Center • Requested 10 minutes ago"
                    />
                    <Box>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small" 
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                      >
                        Deny
                      </Button>
                    </Box>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Shared Access Tab */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Shared Access
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage who has access to your medical records and for how long.
            </Typography>
            
            <List>
              {mockSharedAccess.map((access) => (
                <React.Fragment key={access.id}>
                  <ListItem 
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {access.recipient}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {access.recipientType} • {access.accessType}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box display="flex" alignItems="center">
                          <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Expires
                            </Typography>
                            <Typography variant="body2">
                              {access.expiryDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} md={3}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Shared Records:
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            {access.records.map((record) => (
                              <Chip 
                                key={record} 
                                label={record} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={2} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <IconButton onClick={() => handleOpenAccessDialog(access)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      
      {/* Export Records Tab */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Download Medical Records
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Download your medical records for personal use or to share with healthcare providers.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleOpenDownloadDialog}
              >
                Select Records to Download
              </Button>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Recently Downloaded
            </Typography>
            
            <List>
              <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary="Complete Medical History.pdf"
                  secondary="Downloaded on April 10, 2023 • 2.5 MB"
                />
                <IconButton size="small">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </ListItem>
              
              <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary="Lab Results (Last 3 months).pdf"
                  secondary="Downloaded on April 5, 2023 • 1.8 MB"
                />
                <IconButton size="small">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </ListItem>
              
              <ListItem sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary="Prescription History.pdf"
                  secondary="Downloaded on March 28, 2023 • 1.2 MB"
                />
                <IconButton size="small">
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
      
      {/* Share Records Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={handleCloseShareDialog}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle>
          Share Medical Records
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Provider Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select Recipient
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Healthcare Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as string)}
                  label="Healthcare Provider"
                >
                  {mockProviders.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="body1">{provider.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            {provider.specialty || provider.type} • {provider.hospital || provider.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Record Selection */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">
                  Select Records to Share
                </Typography>
                <Button 
                  size="small" 
                  onClick={handleSelectAllRecords}
                >
                  {selectedRecords.length === mockMedicalRecords.length ? 'Deselect All' : 'Select All'}
                </Button>
              </Box>
              
              <Grid container spacing={1}>
                {mockMedicalRecords.map((record) => (
                  <Grid item xs={12} sm={6} key={record.id}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        bgcolor: selectedRecords.includes(record.id) ? 'primary.light' : 'background.paper',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.2)',
                        }
                      }}
                      onClick={() => handleSelectRecord(record.id)}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid',
                          borderColor: selectedRecords.includes(record.id) ? 'primary.main' : 'divider',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: selectedRecords.includes(record.id) ? 'primary.main' : 'transparent',
                        }}
                      >
                        {selectedRecords.includes(record.id) && (
                          <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">{record.type}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updated: {record.date} • {record.size}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            {/* Access Duration */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Set Access Duration
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Access Duration</InputLabel>
                <Select
                  value={accessDuration}
                  onChange={(e) => setAccessDuration(e.target.value as string)}
                  label="Access Duration"
                >
                  <MenuItem value="once">One-time View</MenuItem>
                  <MenuItem value="24h">24 Hours</MenuItem>
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="perm">Until Revoked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Security Verification */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Security Verification
              </Typography>
              <TextField
                label="Enter Your PIN"
                type="password"
                fullWidth
                value={pinVerification}
                onChange={(e) => setPinVerification(e.target.value)}
                helperText="Enter your 4-digit security PIN to confirm"
                inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseShareDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleShareRecords}
            disabled={!selectedProvider || selectedRecords.length === 0 || pinVerification.length !== 4}
            startIcon={<ShareIcon />}
          >
            Share Records
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Download Records Dialog */}
      <Dialog 
        open={downloadDialogOpen} 
        onClose={handleCloseDownloadDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Download Medical Records
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select records to download. Files will be downloaded as PDF documents.
          </Typography>
          
          <List>
            {mockMedicalRecords.map((record) => (
              <ListItem 
                key={record.id}
                onClick={() => handleSelectDownloadRecord(record.id)}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: selectedDownloadRecords.includes(record.id) ? 'action.selected' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: selectedDownloadRecords.includes(record.id) ? 'primary.main' : 'divider',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: selectedDownloadRecords.includes(record.id) ? 'primary.main' : 'transparent',
                  }}
                >
                  {selectedDownloadRecords.includes(record.id) && (
                    <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />
                  )}
                </Box>
                <ListItemText
                  primary={record.type}
                  secondary={`Updated: ${record.date} • ${record.size}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDownloadDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleDownloadRecords}
            disabled={selectedDownloadRecords.length === 0}
            startIcon={<DownloadIcon />}
          >
            Download Selected ({selectedDownloadRecords.length})
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Access Management Dialog */}
      <Dialog 
        open={accessDialogOpen} 
        onClose={handleCloseAccessDialog}
        fullWidth
        maxWidth="sm"
      >
        {selectedAccess && (
          <>
            <DialogTitle>
              Manage Access: {selectedAccess.recipient}
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Access Details</Typography>
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Recipient Type
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccess.recipientType}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Access Type
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccess.accessType}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Shared Date
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccess.sharedDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Expiry Date
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccess.expiryDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Last Accessed
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccess.lastAccessed}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Shared Records</Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedAccess.records.map((record: string) => (
                      <Chip 
                        key={record} 
                        label={record} 
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Extend Access</Typography>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleExtendAccess('7d')}
                      sx={{ mr: 1 }}
                    >
                      +7 Days
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleExtendAccess('30d')}
                      sx={{ mr: 1 }}
                    >
                      +30 Days
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleExtendAccess('perm')}
                    >
                      Indefinite
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleRevokeAccess}
                startIcon={<DeleteIcon />}
              >
                Revoke Access
              </Button>
              <Button 
                onClick={handleCloseAccessDialog}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DataSharing;
