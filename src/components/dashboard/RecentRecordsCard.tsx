import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleIcon from '@mui/icons-material/Article';
import ScienceIcon from '@mui/icons-material/Science';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { TestResult, Prescription } from '../../types';
import dayjs from 'dayjs';

interface Record {
  id: string;
  type: 'test' | 'prescription' | 'document' | 'vaccination';
  title: string;
  date: string;
  doctorName?: string;
  category?: string;
}

interface RecentRecordsCardProps {
  testResults: TestResult[];
  prescriptions: Prescription[];
}

const RecentRecordsCard: React.FC<RecentRecordsCardProps> = ({ testResults, prescriptions }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Convert test results to generic records format
  const testRecords: Record[] = testResults.map(test => ({
    id: test.id,
    type: 'test',
    title: test.testName,
    date: test.date,
    category: test.category,
  }));

  // Convert prescriptions to generic records format
  const prescriptionRecords: Record[] = prescriptions.map(prescription => ({
    id: prescription.id,
    type: 'prescription',
    title: `Prescription (${prescription.medications.length} medications)`,
    date: prescription.date,
    doctorName: prescription.doctorName,
  }));

  // Add some mock document records
  const documentRecords: Record[] = [
    {
      id: 'doc1',
      type: 'document',
      title: 'Annual Health Checkup Report',
      date: '2023-01-15',
      doctorName: 'Dr. Michael Chen',
      category: 'General Health',
    },
    {
      id: 'doc2',
      type: 'vaccination',
      title: 'COVID-19 Vaccination Certificate',
      date: '2022-11-02',
      category: 'Immunization',
    },
  ];

  // Combine all records and sort by date (newest first)
  const allRecords = [...testRecords, ...prescriptionRecords, ...documentRecords]
    .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

  // Only show the 3 or 4 most recent records
  const recentRecords = allRecords.slice(0, isMobile ? 3 : 4);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'test':
        return <ScienceIcon fontSize={isMobile ? "small" : "medium"} color="info" />;
      case 'prescription':
        return <MedicationIcon fontSize={isMobile ? "small" : "medium"} color="secondary" />;
      case 'vaccination':
        return <VaccinesIcon fontSize={isMobile ? "small" : "medium"} color="success" />;
      default:
        return <ArticleIcon fontSize={isMobile ? "small" : "medium"} color="primary" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'test':
        return 'info';
      case 'prescription':
        return 'secondary';
      case 'vaccination':
        return 'success';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  return (
    <Card sx={{ mb: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: isMobile ? 2 : 3, pb: isMobile ? 1.5 : 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              Recent Medical Records
            </Typography>
            <Button 
              component={Link} 
              to="/records" 
              size="small" 
              color="primary"
            >
              View All
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Your latest test results, prescriptions, and documents
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1 }}>
          {recentRecords.length > 0 ? (
            <List disablePadding>
              {recentRecords.map((record, index) => (
                <React.Fragment key={record.id}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ 
                      px: isMobile ? 2 : 3, 
                      py: isMobile ? 1.5 : 2,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    {isMobile ? (
                      // Mobile layout
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getRecordIcon(record.type)}
                          </ListItemIcon>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {record.title}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ pl: 6, display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          <Chip 
                            label={record.type.charAt(0).toUpperCase() + record.type.slice(1)} 
                            size="small" 
                            color={getRecordColor(record.type) as any}
                            sx={{ fontSize: '0.625rem', height: 18 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            {formatDate(record.date)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton size="small" aria-label="download">
                            <FileDownloadIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : (
                      // Tablet and Desktop layout
                      <>
                        <ListItemIcon>
                          <Box 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              bgcolor: `${getRecordColor(record.type)}.light`,
                              color: `${getRecordColor(record.type)}.dark`,
                            }}
                          >
                            {getRecordIcon(record.type)}
                          </Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="bold" component="span">
                                {record.title}
                              </Typography>
                              <Chip 
                                label={record.type.charAt(0).toUpperCase() + record.type.slice(1)} 
                                size="small" 
                                color={getRecordColor(record.type) as any}
                                variant="outlined"
                                sx={{ ml: 1, fontWeight: 500, height: 20, fontSize: '0.625rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" component="span">
                                {formatDate(record.date)}
                              </Typography>
                              {record.doctorName && (
                                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                  • {record.doctorName}
                                </Typography>
                              )}
                              {record.category && (
                                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                  • {record.category}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <IconButton size="small" aria-label="download">
                          <FileDownloadIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No recent medical records
              </Typography>
              <Button 
                component={Link} 
                to="/records/upload" 
                variant="contained" 
                color="primary"
                startIcon={<DescriptionIcon />}
                sx={{ mt: 2 }}
              >
                Upload Records
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentRecordsCard; 