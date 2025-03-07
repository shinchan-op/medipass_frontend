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
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
  Phone as PhoneIcon,
  Lock as LockIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  const handleSendOTP = () => {
    // Validate mobile number
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    // TODO: Integrate with backend to send OTP
    setShowOTPDialog(true);
    setTimer(30);
    setError('');

    // Start countdown timer
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
    // Validate OTP
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // TODO: Integrate with backend to verify OTP
    // For now, simulate a successful login with a mock Medipass ID
    const mockMedipassId = `MED-${mobileNumber.substring(6)}`;
    login(mockMedipassId);
    navigate('/');
  };

  const handleResendOTP = () => {
    setTimer(30);
    // TODO: Implement resend OTP logic
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Medipass
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center">
            Login to access your healthcare dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box component="form" width="100%" noValidate>
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

              <Typography variant="body2" align="center">
                Don't have an account?{' '}
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Box>
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

export default Login; 