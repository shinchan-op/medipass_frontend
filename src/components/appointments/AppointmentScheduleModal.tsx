import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
  FormHelperText,
  SelectChangeEvent,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { Dayjs } from 'dayjs';
import { Doctor } from '../../types';

// Appointments types
type AppointmentType = 'in-person' | 'telehealth';
type TimeSlot = {
  time: string;
  available: boolean;
};

interface AppointmentScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (appointmentData: any) => void;
  doctors: Doctor[];
}

const AppointmentScheduleModal: React.FC<AppointmentScheduleModalProps> = ({
  open,
  onClose,
  onSchedule,
  doctors
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AppointmentType>('in-person');
  const [purpose, setPurpose] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [hospital, setHospital] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Available time slots (would be fetched from API based on doctor and date in a real app)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: false }, // Already booked example
    { time: '04:00 PM', available: true },
  ]);
  
  // Reset form when modal is opened
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);
  
  // Handle doctor selection
  const handleDoctorChange = (event: SelectChangeEvent) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
    
    // In a real app, you would fetch the available time slots for this doctor
    // and update the hospital/address based on doctor info
    const doctor = doctors.find(doc => doc.id === doctorId);
    if (doctor) {
      setHospital(doctor.hospital);
    }
    
    setErrors({...errors, doctor: ''});
  };
  
  // Handle appointment type change
  const handleTypeChange = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value as AppointmentType);
    
    // If telehealth, clear hospital and address
    if (event.target.value === 'telehealth') {
      setHospital('Virtual Consultation');
      setAddress('');
    } else {
      // Restore hospital info from selected doctor
      const doctor = doctors.find(doc => doc.id === selectedDoctor);
      if (doctor) {
        setHospital(doctor.hospital);
      }
    }
  };
  
  // Handle time selection
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setErrors({...errors, time: ''});
  };
  
  // Handle date selection
  const handleDateSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setErrors({...errors, date: ''});
    
    // In a real app, you would fetch available time slots for this date
  };
  
  // Reset the form
  const resetForm = () => {
    setSelectedDoctor('');
    setSelectedDate(dayjs().add(1, 'day').format('YYYY-MM-DD'));
    setSelectedTime('');
    setSelectedType('in-person');
    setPurpose('');
    setNotes('');
    setHospital('');
    setAddress('');
    setErrors({});
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!selectedDoctor) {
      newErrors.doctor = 'Please select a doctor';
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    if (!selectedTime) {
      newErrors.time = 'Please select a time';
    }
    
    if (!purpose.trim()) {
      newErrors.purpose = 'Please enter a purpose for the visit';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSchedule = () => {
    if (validateForm()) {
      // Convert selectedDate and selectedTime to a combined dateTime
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      const hour24 = isPM && hours !== '12' ? parseInt(hours) + 12 : (hours === '12' && !isPM ? 0 : parseInt(hours));
      
      const dateTime = dayjs(selectedDate)
        .hour(hour24)
        .minute(parseInt(minutes))
        .format('YYYY-MM-DDTHH:mm:00');
      
      const appointmentData = {
        doctorId: selectedDoctor,
        doctorName: doctors.find(doc => doc.id === selectedDoctor)?.name || '',
        specialty: doctors.find(doc => doc.id === selectedDoctor)?.specialty || '',
        dateTime: dateTime,
        type: selectedType,
        purpose: purpose,
        notes: notes,
        hospital: hospital,
        address: selectedType === 'in-person' ? address : 'N/A'
      };
      
      onSchedule(appointmentData);
      onClose();
    }
  };
  
  // Simple time formatter for converting time slot strings
  const formatTimeForInput = (timeStr: string): string => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      return `${parseInt(hours) + 12}:${minutes}`;
    } else if (period === 'AM' && hours === '12') {
      return `00:${minutes}`;
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md" 
      fullScreen={isMobile}
      aria-labelledby="schedule-appointment-dialog"
    >
      <DialogTitle id="schedule-appointment-dialog" sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            Schedule New Appointment
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Doctor Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.doctor}>
              <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
              <Select
                labelId="doctor-select-label"
                id="doctor-select"
                value={selectedDoctor}
                label="Select Doctor"
                onChange={handleDoctorChange}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    <Box>
                      <Typography variant="body1">{doctor.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doctor.specialty}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.doctor && <FormHelperText>{errors.doctor}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Appointment Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
              <Select
                labelId="appointment-type-label"
                id="appointment-type"
                value={selectedType}
                label="Appointment Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="in-person">In-person Consultation</MenuItem>
                <MenuItem value="telehealth">Online Video Consultation</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Date Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Appointment Date"
              type="date"
              fullWidth
              value={selectedDate}
              onChange={handleDateSelection}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date}
              inputProps={{
                min: dayjs().format('YYYY-MM-DD')
              }}
            />
          </Grid>
          
          {/* Time Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Appointment Time"
              type="time"
              fullWidth
              value={selectedTime ? formatTimeForInput(selectedTime) : ''}
              onChange={(e) => {
                const timeValue = e.target.value;
                const [hours, minutes] = timeValue.split(':');
                const hour = parseInt(hours);
                const isPM = hour >= 12;
                const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
                const formattedTime = `${hour12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
                handleTimeSelection(formattedTime);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.time}
              helperText={errors.time}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Grid>
          
          {/* Available Time Slots */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Available Time Slots
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {availableTimeSlots.map((slot, index) => (
                <Chip 
                  key={index} 
                  label={slot.time} 
                  color={slot.available ? "primary" : "default"}
                  variant={selectedTime === slot.time ? "filled" : "outlined"}
                  disabled={!slot.available}
                  onClick={() => {
                    if (slot.available) {
                      handleTimeSelection(slot.time);
                    }
                  }}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>
          
          {/* Purpose */}
          <Grid item xs={12}>
            <TextField
              label="Purpose of Visit"
              fullWidth
              value={purpose}
              onChange={(e) => {
                setPurpose(e.target.value);
                setErrors({...errors, purpose: ''});
              }}
              error={!!errors.purpose}
              helperText={errors.purpose}
            />
          </Grid>
          
          {/* Hospital/Clinic */}
          <Grid item xs={12} md={selectedType === 'in-person' ? 6 : 12}>
            <TextField
              label="Hospital/Clinic"
              fullWidth
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              disabled={selectedType === 'telehealth'}
            />
          </Grid>
          
          {/* Address (only for in-person) */}
          {selectedType === 'in-person' && (
            <Grid item xs={12} md={6}>
              <TextField
                label="Address"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
          )}
          
          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Additional Notes (Optional)"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSchedule} variant="contained" color="primary">
          Schedule Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentScheduleModal; 