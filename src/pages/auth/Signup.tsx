import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
  Phone as PhoneIcon,
  Lock as LockIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Mobile Verification', 'Personal Details', 'Additional Information'];

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  
  // Mobile verification state
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  // Personal details state
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
  });

  // Additional information state
  const [additionalInfo, setAdditionalInfo] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    bloodGroup: '',
  });

  const handleSendOTP = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    // TODO: Integrate with backend to send OTP
    setShowOTPDialog(true);
    setTimer(30);
    setError('');

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // TODO: Integrate with backend to verify OTP
    setShowOTPDialog(false);
    setActiveStep(1);
  };

  const handleResendOTP = () => {
    setTimer(30);
    // TODO: Implement resend OTP logic
  };

  const handlePersonalDetailsSubmit = () => {
    // Validate personal details
    if (!personalDetails.fullName || !personalDetails.dateOfBirth || !personalDetails.gender) {
      setError('Please fill in all required fields');
      return;
    }

    setActiveStep(2);
  };

  const handleSignup = () => {
    // Validate additional information
    if (!additionalInfo.address || !additionalInfo.city || !additionalInfo.state || !additionalInfo.pincode) {
      setError('Please fill in all required fields');
      return;
    }

    // TODO: Integrate with backend to create account
    // For now, simulate account creation with a mock Medipass ID
    const mockMedipassId = `MED-${mobileNumber.substring(6)}`;
    
    // The backend should:
    // 1. Verify mobile number uniqueness
    // 2. Generate unique Medipass ID
    // 3. Generate unique QR code
    // 4. Create user account with all details
    // 5. Send welcome message
    
    login(mockMedipassId);
    navigate('/');
  };

  const renderMobileVerification = () => (
    <Stack spacing={3}>
      <TextField
        fullWidth
        required
        label="Mobile Number"
        value={mobileNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            setMobileNumber(value);
            setError('');
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Enter 10-digit mobile number"
        error={!!error}
        helperText={error}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSendOTP}
        disabled={mobileNumber.length !== 10}
      >
        Send OTP
      </Button>
    </Stack>
  );

  const renderPersonalDetails = () => (
    <Stack spacing={3}>
      <TextField
        fullWidth
        required
        label="Full Name"
        value={personalDetails.fullName}
        onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        required
        type="date"
        label="Date of Birth"
        value={personalDetails.dateOfBirth}
        onChange={(e) => setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarIcon />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        required
        select
        label="Gender"
        value={personalDetails.gender}
        onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value })}
      >
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={personalDetails.email}
        onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handlePersonalDetailsSubmit}
      >
        Continue
      </Button>
    </Stack>
  );

  const renderAdditionalInfo = () => (
    <Stack spacing={3}>
      <TextField
        fullWidth
        required
        label="Address"
        value={additionalInfo.address}
        onChange={(e) => setAdditionalInfo({ ...additionalInfo, address: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HomeIcon />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          label="City"
          value={additionalInfo.city}
          onChange={(e) => setAdditionalInfo({ ...additionalInfo, city: e.target.value })}
        />
        <TextField
          fullWidth
          required
          label="State"
          value={additionalInfo.state}
          onChange={(e) => setAdditionalInfo({ ...additionalInfo, state: e.target.value })}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          required
          label="Pincode"
          value={additionalInfo.pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 6) {
              setAdditionalInfo({ ...additionalInfo, pincode: value });
            }
          }}
        />
        <TextField
          fullWidth
          required
          select
          label="Blood Group"
          value={additionalInfo.bloodGroup}
          onChange={(e) => setAdditionalInfo({ ...additionalInfo, bloodGroup: e.target.value })}
        >
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
        </TextField>
      </Stack>

      <TextField
        fullWidth
        required
        label="Emergency Contact"
        value={additionalInfo.emergencyContact}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (value.length <= 10) {
            setAdditionalInfo({ ...additionalInfo, emergencyContact: value });
          }
        }}
        placeholder="Enter 10-digit mobile number"
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSignup}
      >
        Create Account
      </Button>
    </Stack>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={4}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Create Your Medipass Account
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box>
            {activeStep === 0 && renderMobileVerification()}
            {activeStep === 1 && renderPersonalDetails()}
            {activeStep === 2 && renderAdditionalInfo()}
          </Box>

          {activeStep === 0 && (
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* OTP Verification Dialog */}
      <Dialog open={showOTPDialog} onClose={() => setShowOTPDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: 300 }}>
            <Typography variant="body2">
              Please enter the 6-digit OTP sent to {mobileNumber}
            </Typography>

            <TextField
              fullWidth
              required
              label="OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setOtp(value);
                  setError('');
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error}
            />

            {timer > 0 && (
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <TimerIcon fontSize="small" />
                <Typography variant="body2">
                  Resend OTP in {timer} seconds
                </Typography>
              </Stack>
            )}

            {timer === 0 && (
              <Button
                variant="text"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOTPDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleVerifyOTP}
            variant="contained"
            disabled={otp.length !== 6}
          >
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Signup; 