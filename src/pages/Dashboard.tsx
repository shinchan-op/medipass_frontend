import React, { useEffect, useState } from 'react';
import { Grid, Box, useTheme, useMediaQuery, Container, Divider } from '@mui/material';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import QuickActions from '../components/dashboard/QuickActions';
import AppointmentsCard from '../components/dashboard/AppointmentsCard';
import RecentRecordsCard from '../components/dashboard/RecentRecordsCard';
import HealthMetricsCard from '../components/dashboard/HealthMetricsCard';
import LoadingState from '../components/common/LoadingState';
import { 
  fetchPatientProfile,
  fetchAppointments,
  fetchPrescriptions,
  fetchTestResults,
  fetchVitalSigns,
  fetchBloodPressureData,
  fetchGlucoseData,
  fetchHeartRateData,
  fetchWeightData
} from '../services/api';
import { 
  Patient, 
  Appointment, 
  Prescription, 
  TestResult, 
  VitalSigns,
  HealthMetric 
} from '../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [bloodPressureData, setBloodPressureData] = useState<any[]>([]);
  const [glucoseData, setGlucoseData] = useState<HealthMetric[]>([]);
  const [heartRateData, setHeartRateData] = useState<HealthMetric[]>([]);
  const [weightData, setWeightData] = useState<HealthMetric[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel for better performance
        const [
          patientData,
          appointmentsData,
          prescriptionsData,
          testResultsData,
          vitalSignsData,
          bloodPressureResults,
          glucoseResults,
          heartRateResults,
          weightResults
        ] = await Promise.all([
          fetchPatientProfile(),
          fetchAppointments(),
          fetchPrescriptions(),
          fetchTestResults(),
          fetchVitalSigns(),
          fetchBloodPressureData(),
          fetchGlucoseData(),
          fetchHeartRateData(),
          fetchWeightData()
        ]);

        setPatient(patientData);
        setAppointments(appointmentsData);
        setPrescriptions(prescriptionsData);
        setTestResults(testResultsData);
        setVitalSigns(vitalSignsData);
        setBloodPressureData(bloodPressureResults);
        setGlucoseData(glucoseResults);
        setHeartRateData(heartRateResults);
        setWeightData(weightResults);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Here you would normally handle the error (show error message, etc.)
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !patient) {
    return <LoadingState message="Loading your health dashboard..." />;
  }

  return (
    <Container maxWidth="lg" disableGutters={isMobile} sx={{ 
      px: isMobile ? 1.5 : 3,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Welcome section with patient info and QR code */}
      <WelcomeCard patient={patient} />

      {/* Quick Action buttons */}
      <QuickActions />

      {/* Main dashboard content */}
      <Grid 
        container 
        spacing={isMobile ? 2 : 3}
        sx={{ 
          mb: 4,
          position: 'relative',
          '& .MuiPaper-root': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }
        }}
      >
        {/* For mobile: Stack all components vertically with clear separation */}
        {isMobile ? (
          <>
            <Grid item xs={12}>
              <AppointmentsCard appointments={appointments} />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <HealthMetricsCard 
                vitalSigns={vitalSigns}
                bloodPressureData={bloodPressureData}
                glucoseData={glucoseData}
                heartRateData={heartRateData}
                weightData={weightData}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <RecentRecordsCard testResults={testResults} prescriptions={prescriptions} />
            </Grid>
          </>
        ) : (
          <>
            {/* For tablets and desktop: Two-column layout */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <AppointmentsCard appointments={appointments} />
                <Box sx={{ mt: 3 }}>
                  <RecentRecordsCard testResults={testResults} prescriptions={prescriptions} />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <HealthMetricsCard 
                  vitalSigns={vitalSigns}
                  bloodPressureData={bloodPressureData}
                  glucoseData={glucoseData}
                  heartRateData={heartRateData}
                  weightData={weightData}
                />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard; 