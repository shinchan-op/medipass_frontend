import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  FormHelperText,
  Grid,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import dayjs from 'dayjs';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface UploadRecordModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  open,
  onClose,
  onUpload
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [recordType, setRecordType] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [hospital, setHospital] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [recordDate, setRecordDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState<{
    recordType?: string;
    title?: string;
    file?: string;
  }>({});

  const handleRecordTypeChange = (event: SelectChangeEvent) => {
    setRecordType(event.target.value);
    
    // Clear the error when user selects a value
    if (event.target.value) {
      setErrors({ ...errors, recordType: undefined });
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    
    // Clear the error when user types in a value
    if (event.target.value) {
      setErrors({ ...errors, title: undefined });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      
      // Clear the error when user selects a file
      setErrors({ ...errors, file: undefined });
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordDate(event.target.value);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      
      // Clear the error when user drops a file
      setErrors({ ...errors, file: undefined });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    // Validate the form
    const newErrors: {
      recordType?: string;
      title?: string;
      file?: string;
    } = {};
    
    if (!recordType) {
      newErrors.recordType = 'Please select a record type';
    }
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    }
    
    if (!selectedFile) {
      newErrors.file = 'Please upload a file';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, prepare data for upload
    const formData = {
      recordType,
      title,
      doctorName,
      hospital,
      notes,
      date: recordDate,
      file: selectedFile
    };
    
    onUpload(formData);
    handleReset();
  };

  const handleReset = () => {
    setRecordType('');
    setTitle('');
    setDoctorName('');
    setHospital('');
    setNotes('');
    setRecordDate(dayjs().format('YYYY-MM-DD'));
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const getFileIcon = () => {
    if (!selectedFile) return <AttachFileIcon fontSize="large" color="disabled" />;
    
    const fileType = selectedFile.type;
    
    if (fileType.includes('pdf')) {
      return <PictureAsPdfIcon fontSize="large" color="error" />;
    } else if (fileType.includes('image')) {
      return <ImageIcon fontSize="large" color="primary" />;
    } else {
      return <ArticleIcon fontSize="large" color="info" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Upload New Medical Record</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              required 
              margin="normal" 
              error={!!errors.recordType}
              size={isMobile ? "small" : "medium"}
            >
              <InputLabel id="record-type-label">Record Type</InputLabel>
              <Select
                labelId="record-type-label"
                value={recordType}
                label="Record Type"
                onChange={handleRecordTypeChange}
              >
                <MenuItem value="prescription">Prescription</MenuItem>
                <MenuItem value="lab-report">Lab Report</MenuItem>
                <MenuItem value="doctors-note">Doctor's Note</MenuItem>
                <MenuItem value="vaccination">Vaccination Record</MenuItem>
                <MenuItem value="surgery">Surgery/Procedure</MenuItem>
                <MenuItem value="imaging">Imaging (X-ray, MRI, etc.)</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.recordType && (
                <FormHelperText>{errors.recordType}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              label="Title/Description"
              fullWidth
              required
              margin="normal"
              value={title}
              onChange={handleTitleChange}
              error={!!errors.title}
              helperText={errors.title}
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              label="Record Date"
              type="date"
              fullWidth
              margin="normal"
              value={recordDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Doctor's Name"
              fullWidth
              margin="normal"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              label="Hospital/Clinic"
              fullWidth
              margin="normal"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              margin="normal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this record..."
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                p: isMobile ? 2 : 3,
                border: '2px dashed',
                borderColor: errors.file ? 'error.main' : 'divider',
                borderRadius: 1,
                textAlign: 'center',
                bgcolor: 'background.paper',
                cursor: 'pointer'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('upload-file-input')?.click()}
            >
              {selectedFile ? (
                <Box>
                  {getFileIcon()}
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom sx={{ mt: 1 }}>
                    {selectedFile.name}
                  </Typography>
                  <Chip 
                    label={`${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="error" 
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon color="primary" sx={{ fontSize: isMobile ? 36 : 48, mb: 1 }} />
                  <Typography variant={isMobile ? "body1" : "subtitle1"} gutterBottom>
                    {isMobile ? "Tap to upload a file" : "Drag & drop a file here, or click to browse"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supported formats: PDF, JPEG, PNG, DOC/DOCX (Max: 10MB)
                  </Typography>
                  {errors.file && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                      {errors.file}
                    </Typography>
                  )}
                </Box>
              )}
              <Button 
                component="label" 
                sx={{ mt: 2 }}
              >
                <VisuallyHiddenInput 
                  id="upload-file-input" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
        {isMobile ? (
          <>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              startIcon={<CloudUploadIcon />}
              fullWidth
              size="large"
            >
              Upload Record
            </Button>
            <Button onClick={handleReset} color="inherit" fullWidth>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleReset} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              startIcon={<CloudUploadIcon />}
            >
              Upload Record
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadRecordModal; 