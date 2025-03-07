import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Tabs, 
  Tab, 
  Divider, 
  Button, 
  TextField, 
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Drawer,
  Fab
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import LoadingState from '../components/common/LoadingState';
import UploadRecordModal from '../components/records/UploadRecordModal';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import ScienceIcon from '@mui/icons-material/Science';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { fetchPrescriptions, fetchTestResults } from '../services/api';
import { Prescription, TestResult } from '../types';
import dayjs from 'dayjs';

// Mock data for overview stats
const overviewStats = [
  { label: 'Total Records', value: 46, icon: <DescriptionIcon color="primary" /> },
  { label: 'Last Updated', value: 'Today', icon: <TrendingUpIcon color="success" /> },
  { label: 'Doctors Consulted', value: 8, icon: <LocalHospitalIcon color="info" /> },
  { label: 'Pending Uploads', value: 2, icon: <CloudUploadIcon color="warning" /> },
];

// Mock data for additional medical record types
interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  doctorName: string;
  hospitalName: string;
  date: string;
  fileType: string;
  fileUrl: string;
  isImportant: boolean;
}

// Mock vaccination records
const vaccinationRecords: MedicalRecord[] = [
  {
    id: 'vac1',
    type: 'vaccination',
    title: 'COVID-19 Vaccination (Dose 1)',
    doctorName: 'Dr. Emily Walker',
    hospitalName: 'City General Hospital',
    date: '2022-05-15',
    fileType: 'PDF',
    fileUrl: '/path/to/vaccination1.pdf',
    isImportant: true
  },
  {
    id: 'vac2',
    type: 'vaccination',
    title: 'COVID-19 Vaccination (Dose 2)',
    doctorName: 'Dr. Emily Walker',
    hospitalName: 'City General Hospital',
    date: '2022-06-15',
    fileType: 'PDF',
    fileUrl: '/path/to/vaccination2.pdf',
    isImportant: true
  },
  {
    id: 'vac3',
    type: 'vaccination',
    title: 'Influenza Vaccine',
    doctorName: 'Dr. Mark Johnson',
    hospitalName: 'MediCare Clinic',
    date: '2022-11-10',
    fileType: 'PDF',
    fileUrl: '/path/to/vaccination3.pdf',
    isImportant: false
  }
];

// Mock surgeries records
const surgeryRecords: MedicalRecord[] = [
  {
    id: 'sur1',
    type: 'surgery',
    title: 'Appendectomy',
    doctorName: 'Dr. Sarah Chen',
    hospitalName: 'Memorial Hospital',
    date: '2018-06-22',
    fileType: 'PDF',
    fileUrl: '/path/to/surgery1.pdf',
    isImportant: true
  }
];

// Mock doctor's notes
const doctorNotes: MedicalRecord[] = [
  {
    id: 'note1',
    type: 'note',
    title: 'Cardiovascular Checkup Notes',
    doctorName: 'Dr. Robert Smith',
    hospitalName: 'Heart & Vascular Institute',
    date: '2023-01-15',
    fileType: 'PDF',
    fileUrl: '/path/to/note1.pdf',
    isImportant: false
  },
  {
    id: 'note2',
    type: 'note',
    title: 'Diabetes Management Plan',
    doctorName: 'Dr. Emily Johnson',
    hospitalName: 'Endocrine Specialists',
    date: '2023-02-20',
    fileType: 'PDF',
    fileUrl: '/path/to/note2.pdf',
    isImportant: true
  }
];

// Mock allergies and conditions
const allergiesAndConditions = {
  allergies: [
    { name: 'Penicillin', severity: 'High', notes: 'Causes rash and difficulty breathing' },
    { name: 'Peanuts', severity: 'Medium', notes: 'Skin irritation' }
  ],
  conditions: [
    { name: 'Hypertension', diagnosedDate: '2020-03-15', treatedBy: 'Dr. Robert Smith' },
    { name: 'Type 2 Diabetes', diagnosedDate: '2020-03-15', treatedBy: 'Dr. Emily Johnson' }
  ]
};

// Mock access logs
const accessLogs = [
  { doctorName: 'Dr. Robert Smith', hospitalName: 'City General Hospital', dateAccessed: '2023-02-15', recordsAccessed: 'Prescriptions, Lab Reports' },
  { doctorName: 'Dr. Emily Johnson', hospitalName: 'Endocrine Specialists', dateAccessed: '2023-02-20', recordsAccessed: 'Medical History' },
  { doctorName: 'Dr. James Wilson', hospitalName: 'City Emergency Center', dateAccessed: '2023-01-10', recordsAccessed: 'Allergies, Medications' }
];

const MedicalRecords: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<string>('all');
  
  // State for upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  
  // State for success snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      setFilterDrawerOpen(true);
    } else {
      setFilterAnchorEl(event.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterDrawerOpen(false);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterBy(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleUploadModalOpen = () => {
    setUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setUploadModalOpen(false);
  };
  
  const handleRecordUpload = (formData: any) => {
    // In a real application, this would make an API call to the server
    console.log('Uploading record:', formData);
    
    // Mock successful upload
    setTimeout(() => {
      setSnackbarMessage('Medical record uploaded successfully!');
      setSnackbarOpen(true);
      
      // In a real application, you would refresh the data here
      // or add the new record to the state directly
    }, 1000);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Format a date string to a readable format
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  // Toggle important flag for a record
  const toggleImportant = (id: string, type: string) => {
    // This would update the state in a real application
    console.log(`Toggled important for ${type} record ${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prescriptionsData, testResultsData] = await Promise.all([
          fetchPrescriptions(),
          fetchTestResults()
        ]);

        setPrescriptions(prescriptionsData);
        setTestResults(testResultsData);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort records based on current settings
  const getFilteredAndSortedRecords = (records: any[]) => {
    let filteredRecords = [...records];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRecords = filteredRecords.filter(record => 
        record.title?.toLowerCase().includes(query) || 
        record.doctorName?.toLowerCase().includes(query) ||
        record.hospitalName?.toLowerCase().includes(query)
      );
    }

    // Filter by file type
    if (filterBy !== 'all') {
      filteredRecords = filteredRecords.filter(record => 
        record.fileType?.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Sort records
    filteredRecords.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'doctor') {
        comparison = a.doctorName.localeCompare(b.doctorName);
      } else if (sortBy === 'hospital') {
        comparison = a.hospitalName.localeCompare(b.hospitalName);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filteredRecords;
  };

  // Convert prescriptions to the common MedicalRecord format
  const prescriptionRecords: MedicalRecord[] = prescriptions.map(prescription => ({
    id: prescription.id,
    type: 'prescription',
    title: `Prescription (${prescription.medications.length} medications)`,
    doctorName: prescription.doctorName,
    hospitalName: 'N/A',
    date: prescription.date,
    fileType: 'PDF',
    fileUrl: `/prescriptions/${prescription.id}.pdf`,
    isImportant: false
  }));

  // Convert test results to the common MedicalRecord format
  const testRecords: MedicalRecord[] = testResults.map(test => ({
    id: test.id,
    type: 'test',
    title: test.testName,
    doctorName: 'N/A',
    hospitalName: 'N/A',
    date: test.date,
    fileType: 'PDF',
    fileUrl: test.reportUrl || `/tests/${test.id}.pdf`,
    isImportant: false
  }));

  // Get the records for the active tab
  const getRecordsForActiveTab = () => {
    switch (activeTab) {
      case 0: // All Records
        return getFilteredAndSortedRecords([
          ...prescriptionRecords, 
          ...testRecords,
          ...doctorNotes,
          ...vaccinationRecords,
          ...surgeryRecords
        ]);
      case 1: // Prescriptions
        return getFilteredAndSortedRecords(prescriptionRecords);
      case 2: // Lab Reports
        return getFilteredAndSortedRecords(testRecords);
      case 3: // Doctor's Notes
        return getFilteredAndSortedRecords(doctorNotes);
      case 4: // Vaccinations
        return getFilteredAndSortedRecords(vaccinationRecords);
      case 5: // Surgeries
        return getFilteredAndSortedRecords(surgeryRecords);
      case 6: // Allergies & Conditions
        return []; // Special case, handled separately
      default:
        return [];
    }
  };

  // Render the records table with responsive design
  const renderRecordsTable = () => {
    const records = getRecordsForActiveTab();

    if (records.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No records found in this category
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadModalOpen}
            sx={{ mt: 1 }}
          >
            Upload New Record
          </Button>
        </Paper>
      );
    }

    // Use card-based layout for mobile devices
    if (isMobile) {
      return (
        <Box>
          {records.map((record) => (
            <Card key={record.id} sx={{ mb: 2, overflow: 'visible' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      bgcolor: `${getChipColor(record.type)}.light`,
                      color: `${getChipColor(record.type)}.dark`,
                      mr: 1.5
                    }}
                  >
                    {getRecordIcon(record.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {record.title}
                    </Typography>
                    <Chip 
                      label={capitalizeFirstLetter(record.type)} 
                      size="small" 
                      color={getChipColor(record.type)}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ pl: 6.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Date:</strong> {formatDate(record.date)}
                  </Typography>
                  
                  {record.doctorName && record.doctorName !== 'N/A' && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Doctor:</strong> {record.doctorName}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>File:</strong> {record.fileType}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button size="small" startIcon={<VisibilityIcon />}>View</Button>
                  <Button size="small" startIcon={<FileDownloadIcon />}>Download</Button>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleImportant(record.id, record.type)}
                  >
                    {record.isImportant ? 
                      <StarIcon fontSize="small" color="warning" /> : 
                      <StarBorderIcon fontSize="small" />
                    }
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      );
    }

    // Use table layout for tablets and desktops
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Title/Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'date'}
                  direction={sortDirection}
                  onClick={handleSortDirectionChange}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              {!isTablet && <TableCell sx={{ fontWeight: 'bold' }}>Doctor/Provider</TableCell>}
              {!isTablet && <TableCell sx={{ fontWeight: 'bold' }}>File Type</TableCell>}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRecordIcon(record.type)}
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {record.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={capitalizeFirstLetter(record.type)} 
                    size="small" 
                    color={getChipColor(record.type)}
                  />
                </TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                {!isTablet && <TableCell>{record.doctorName}</TableCell>}
                {!isTablet && <TableCell>{record.fileType}</TableCell>}
                <TableCell>
                  <Box>
                    <IconButton size="small" title="View">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Download">
                      <FileDownloadIcon fontSize="small" />
                    </IconButton>
                    {!isTablet && (
                      <IconButton size="small" title="Share">
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      title={record.isImportant ? "Remove from important" : "Mark as important"}
                      onClick={() => toggleImportant(record.id, record.type)}
                    >
                      {record.isImportant ? 
                        <StarIcon fontSize="small" color="warning" /> : 
                        <StarBorderIcon fontSize="small" />
                      }
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render the allergies and conditions tab
  const renderAllergiesAndConditions = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ mr: 1 }} color="error" />
                  Allergies
                </Box>
              </Typography>
              <Divider sx={{ my: 2 }} />
              {allergiesAndConditions.allergies.length > 0 ? (
                allergiesAndConditions.allergies.map((allergy, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {allergy.name}
                      </Typography>
                      <Chip 
                        label={`Severity: ${allergy.severity}`}
                        size="small"
                        color={allergy.severity === 'High' ? 'error' : 'warning'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {allergy.notes}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No allergies recorded
                </Typography>
              )}
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Allergy
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MedicalInformationIcon sx={{ mr: 1 }} color="primary" />
                  Chronic Conditions
                </Box>
              </Typography>
              <Divider sx={{ my: 2 }} />
              {allergiesAndConditions.conditions.length > 0 ? (
                allergiesAndConditions.conditions.map((condition, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {condition.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Diagnosed on {formatDate(condition.diagnosedDate)} by {condition.treatedBy}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No chronic conditions recorded
                </Typography>
              )}
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Condition
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render the data sharing section
  const renderDataSharing = () => {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 1 }} color="primary" />
              Data Sharing & Permissions
            </Box>
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Grant Access
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Share your medical records securely with healthcare providers
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<QrCodeScannerIcon />}
                  size="medium"
                >
                  Share via QR Code
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<LocalHospitalIcon />}
                  size="medium"
                >
                  Grant Doctor Access
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Access Logs
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Recent accesses to your medical records
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {accessLogs.map((log, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 1,
                    borderBottom: index < accessLogs.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    <HistoryIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {log.doctorName} ({log.hospitalName})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(log.dateAccessed)} • Accessed: {log.recordsAccessed}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Render the filter content
  const renderFilterContent = () => {
    return (
      <Box sx={{ p: 2, minWidth: isMobile ? 'auto' : 250 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Sort & Filter
          </Typography>
          {isMobile && (
            <IconButton edge="end" onClick={handleFilterClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="hospital">Hospital/Provider</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="sort-direction-label">Direction</InputLabel>
          <Select
            labelId="sort-direction-label"
            value={sortDirection}
            label="Direction"
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="desc">Newest First</MenuItem>
            <MenuItem value="asc">Oldest First</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel id="filter-by-label">File Type</InputLabel>
          <Select
            labelId="filter-by-label"
            value={filterBy}
            label="File Type"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="doc">Document</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="text" 
            size="small" 
            onClick={handleFilterClose}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    );
  };

  // Helper function to get appropriate icon for record type
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <DescriptionIcon fontSize="small" color="secondary" />;
      case 'test':
        return <ScienceIcon fontSize="small" color="info" />;
      case 'note':
        return <MedicalInformationIcon fontSize="small" color="primary" />;
      case 'vaccination':
        return <VaccinesIcon fontSize="small" color="success" />;
      case 'surgery':
        return <LocalHospitalIcon fontSize="small" color="error" />;
      default:
        return <DescriptionIcon fontSize="small" color="action" />;
    }
  };

  // Helper function to get appropriate chip color for record type
  const getChipColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
    switch (type) {
      case 'prescription':
        return 'secondary';
      case 'test':
        return 'info';
      case 'note':
        return 'primary';
      case 'vaccination':
        return 'success';
      case 'surgery':
        return 'error';
      default:
        return 'default';
    }
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return <LoadingState message="Loading medical records..." />;
  }

  return (
    <Box>
      <PageHeader
        title="Medical Records"
        subtitle="View and manage all your healthcare documents"
        breadcrumbs={[
          { label: 'Dashboard', link: '/' },
          { label: 'Medical Records' }
        ]}
        action={
          !isMobile && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadModalOpen}
            >
              Upload New Record
            </Button>
          )
        }
      />

      {/* Overview Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {overviewStats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs and Filters */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          borderBottom: 1, 
          borderColor: 'divider',
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: isMobile ? 2 : 0 }}
          >
            <Tab label="All Records" />
            <Tab label="Prescriptions" />
            <Tab label="Lab Reports" />
            <Tab label="Doctor's Notes" />
            <Tab label="Vaccinations" />
            <Tab label="Surgeries" />
            <Tab label="Allergies & Conditions" />
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 1, mb: isMobile ? 1 : 0 }}>
            <TextField
              placeholder="Search records..."
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: isMobile ? '100%' : 200 }}
            />
            
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
            
            {/* Desktop filter menu */}
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              {renderFilterContent()}
            </Menu>
            
            {/* Mobile filter drawer */}
            <Drawer
              anchor="bottom"
              open={filterDrawerOpen}
              onClose={handleFilterClose}
            >
              {renderFilterContent()}
            </Drawer>
          </Box>
        </Box>
      </Box>

      {/* Records Content */}
      <Box sx={{ mb: 3 }}>
        {activeTab === 6 ? renderAllergiesAndConditions() : renderRecordsTable()}
      </Box>

      {/* Data Sharing Section */}
      {renderDataSharing()}
      
      {/* Mobile upload button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleUploadModalOpen}
        >
          <CloudUploadIcon />
        </Fab>
      )}

      {/* Upload Record Modal */}
      <UploadRecordModal 
        open={uploadModalOpen}
        onClose={handleUploadModalClose}
        onUpload={handleRecordUpload}
      />
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicalRecords; 