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
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Timer as TimerIcon,
  Check as ApproveIcon,
  Close as DenyIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const PrivacySettings = () => {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [addContactDialog, setAddContactDialog] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  
  const [emergencyContacts] = useState([
    { id: 1, name: 'Jane Doe', phone: '+1 234 567 8901', relation: 'Spouse' },
    { id: 2, name: 'Mike Smith', phone: '+1 234 567 8902', relation: 'Brother' },
  ]);

  const [pendingRequests] = useState([
    { id: 1, hospital: 'City General Hospital', requestDate: '2024-03-15', type: 'Full Access' },
    { id: 2, hospital: 'Specialist Clinic', requestDate: '2024-03-14', type: 'Limited Access' },
  ]);

  const [accessHistory] = useState([
    { 
      id: 1, 
      provider: 'Dr. Smith Clinic',
      accessDate: '2024-03-10',
      recordsAccessed: ['Blood Tests', 'X-Ray Reports'],
      status: 'Active'
    },
    {
      id: 2,
      provider: 'City General Hospital',
      accessDate: '2024-02-15',
      recordsAccessed: ['Medical History'],
      status: 'Expired'
    },
  ]);

  const handleEmergencyModeToggle = () => {
    setEmergencyMode(!emergencyMode);
  };

  const handleAddContact = () => {
    // TODO: Implement contact addition
    setAddContactDialog(false);
    setNewContact({ name: '', phone: '', relation: '' });
  };

  const handleRemoveContact = (contactId: number) => {
    // TODO: Implement contact removal
  };

  const handleApproveRequest = (requestId: number) => {
    // TODO: Implement request approval
  };

  const handleDenyRequest = (requestId: number) => {
    // TODO: Implement request denial
  };

  const handleRevokeAccess = (accessId: number) => {
    // TODO: Implement access revocation
  };

  return (
    <Box>
      {/* Data Sharing Permissions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Emergency Access Settings
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1">Emergency Mode</Typography>
                <Typography variant="body2" color="text.secondary">
                  When enabled, emergency responders can access vital medical information
                </Typography>
              </Box>
              <Switch
                checked={emergencyMode}
                onChange={handleEmergencyModeToggle}
                color="warning"
              />
            </Box>
            
            <Divider />
            
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">Emergency Contacts</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setAddContactDialog(true)}
                  size="small"
                >
                  Add Contact
                </Button>
              </Stack>
              <List>
                {emergencyContacts.map((contact) => (
                  <ListItem key={contact.id}>
                    <ListItemText
                      primary={contact.name}
                      secondary={`${contact.relation} • ${contact.phone}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Consent Management */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Pending Access Requests
          </Typography>
          <List>
            {pendingRequests.map((request) => (
              <ListItem key={request.id}>
                <ListItemText
                  primary={request.hospital}
                  secondary={`Requested on ${request.requestDate} • ${request.type}`}
                />
                <Stack direction="row" spacing={1}>
                  <IconButton
                    color="success"
                    onClick={() => handleApproveRequest(request.id)}
                  >
                    <ApproveIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDenyRequest(request.id)}
                  >
                    <DenyIcon />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Access History */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Access History
          </Typography>
          <List>
            {accessHistory.map((access) => (
              <ListItem key={access.id}>
                <ListItemText
                  primary={access.provider}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        Accessed on {access.accessDate}
                      </Typography>
                      <br />
                      {access.recordsAccessed.join(', ')}
                    </React.Fragment>
                  }
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={access.status}
                    color={access.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                  {access.status === 'Active' && (
                    <IconButton
                      color="error"
                      onClick={() => handleRevokeAccess(access.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Add Emergency Contact Dialog */}
      <Dialog open={addContactDialog} onClose={() => setAddContactDialog(false)}>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <TextField
              label="Relation"
              fullWidth
              value={newContact.relation}
              onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddContactDialog(false)}>Cancel</Button>
          <Button onClick={handleAddContact} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrivacySettings; 