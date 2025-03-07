import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
  CircularProgress,
  Paper
} from '@mui/material';
import { HealthMetric, VitalSigns } from '../../types';

interface HealthMetricsCardProps {
  vitalSigns: VitalSigns[];
  bloodPressureData: any[];
  glucoseData: HealthMetric[];
  heartRateData: HealthMetric[];
  weightData: HealthMetric[];
}

// Lazy loaded chart components for better performance
const BloodPressureChart = lazy(() => import('./charts/BloodPressureChart'));
const SingleMetricChart = lazy(() => import('./charts/SingleMetricChart'));

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({
  vitalSigns,
  bloodPressureData,
  glucoseData,
  heartRateData,
  weightData
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [tabValue, setTabValue] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [isChartVisible, setIsChartVisible] = useState(false);

  // Make chart visible after component is fully rendered
  useEffect(() => {
    // Delay chart rendering to improve initial page load performance
    const timer = setTimeout(() => {
      setIsChartVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Filter data based on selected time range
  const filterDataByTimeRange = useMemo(() => {
    return (data: any[]) => {
      if (!data || data.length === 0) return [];
      
      const now = new Date();
      const pastDate = new Date();
      
      switch(timeRange) {
        case '7d':
          pastDate.setDate(now.getDate() - 7);
          break;
        case '14d':
          pastDate.setDate(now.getDate() - 14);
          break;
        case '30d':
          pastDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          pastDate.setDate(now.getDate() - 90);
          break;
        default:
          pastDate.setDate(now.getDate() - 7);
      }
      
      return data.filter(item => new Date(item.date) >= pastDate);
    };
  }, [timeRange]);

  // Get the most recent vital signs
  const latestVitalSigns = useMemo(() => {
    if (!vitalSigns || vitalSigns.length === 0) return null;
    return vitalSigns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [vitalSigns]);

  // Memoize filtered data to avoid recalculating on every render
  const filteredBloodPressureData = useMemo(() => 
    filterDataByTimeRange(bloodPressureData || []), 
    [bloodPressureData, filterDataByTimeRange]
  );
  
  const filteredGlucoseData = useMemo(() => 
    filterDataByTimeRange(glucoseData || []), 
    [glucoseData, filterDataByTimeRange]
  );
  
  const filteredHeartRateData = useMemo(() => 
    filterDataByTimeRange(heartRateData || []), 
    [heartRateData, filterDataByTimeRange]
  );
  
  const filteredWeightData = useMemo(() => 
    filterDataByTimeRange(weightData || []), 
    [weightData, filterDataByTimeRange]
  );

  // Limit the number of data points for mobile view to prevent overcrowding
  const limitDataForMobile = (data: any[]) => {
    if (!data || data.length === 0) return [];
    
    if (isMobile && data.length > 7) {
      // Get every nth item to reduce to around 7 data points
      const step = Math.floor(data.length / 7);
      return data.filter((_, index) => index % step === 0 || index === data.length - 1);
    }
    return data;
  };

  // Get the current chart data based on selected tab
  const getCurrentChartData = () => {
    switch (tabValue) {
      case 0: return limitDataForMobile(filteredBloodPressureData);
      case 1: return limitDataForMobile(filteredGlucoseData);
      case 2: return limitDataForMobile(filteredHeartRateData);
      case 3: return limitDataForMobile(filteredWeightData);
      default: return limitDataForMobile(filteredBloodPressureData);
    }
  };

  // Get current chart configuration
  const getCurrentChartConfig = () => {
    switch (tabValue) {
      case 0:
        return {
          name: 'Blood Pressure',
          unit: 'mmHg',
          lines: [
            { dataKey: 'systolic', stroke: theme.palette.error.main },
            { dataKey: 'diastolic', stroke: theme.palette.primary.main }
          ],
          yAxisDomain: [40, 180]
        };
      case 1:
        return {
          name: 'Blood Glucose',
          unit: 'mg/dL',
          lines: [
            { dataKey: 'value', stroke: theme.palette.warning.main }
          ],
          yAxisDomain: [60, 200]
        };
      case 2:
        return {
          name: 'Heart Rate',
          unit: 'bpm',
          lines: [
            { dataKey: 'value', stroke: theme.palette.error.main }
          ],
          yAxisDomain: [40, 120]
        };
      case 3:
        return {
          name: 'Weight',
          unit: 'lbs',
          lines: [
            { dataKey: 'value', stroke: theme.palette.info.main }
          ],
          yAxisDomain: [100, 200]
        };
      default:
        return {
          name: 'Blood Pressure',
          unit: 'mmHg',
          lines: [
            { dataKey: 'systolic', stroke: theme.palette.error.main },
            { dataKey: 'diastolic', stroke: theme.palette.primary.main }
          ],
          yAxisDomain: [40, 180]
        };
    }
  };

  // Calculate the appropriate chart height based on device size
  const getChartHeight = () => {
    if (isMobile) return 170;
    if (isTablet) return 200;
    return 250;
  };

  return (
    <Card 
      sx={{ 
        mb: 3, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxWidth: '100%'
      }}
    >
      <CardContent 
        sx={{ 
          p: isMobile ? 2 : 3, 
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: isMobile ? 1 : 0 }}>
            Health Metrics
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="time-range-label">Range</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Range"
            >
              <MenuItem value="7d">1 Week</MenuItem>
              <MenuItem value="14d">2 Weeks</MenuItem>
              <MenuItem value="30d">1 Month</MenuItem>
              <MenuItem value="90d">3 Months</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {latestVitalSigns && (
          <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: isMobile ? 1 : 1.5, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.dark' }}>
                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                  BLOOD PRESSURE
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {latestVitalSigns.bloodPressure || 'N/A'}
                </Typography>
                <Typography variant="caption" component="div">
                  mmHg
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: isMobile ? 1 : 1.5, bgcolor: 'warning.light', borderRadius: 1, color: 'warning.dark' }}>
                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                  GLUCOSE
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {latestVitalSigns.glucose || 'N/A'}
                </Typography>
                <Typography variant="caption" component="div">
                  mg/dL
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: isMobile ? 1 : 1.5, bgcolor: 'error.light', borderRadius: 1, color: 'error.dark' }}>
                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                  HEART RATE
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {latestVitalSigns.heartRate || 'N/A'}
                </Typography>
                <Typography variant="caption" component="div">
                  bpm
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ p: isMobile ? 1 : 1.5, bgcolor: 'info.light', borderRadius: 1, color: 'info.dark' }}>
                <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
                  WEIGHT
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} component="div" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                  {latestVitalSigns.weight || 'N/A'}
                </Typography>
                <Typography variant="caption" component="div">
                  lbs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 1, 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': { 
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              minWidth: isMobile ? 'auto' : 90,
              p: isMobile ? '6px 10px' : '12px 16px',
            }
          }}
        >
          <Tab label="Blood Pressure" />
          <Tab label="Glucose" />
          <Tab label="Heart Rate" />
          <Tab label="Weight" />
        </Tabs>

        <Paper 
          elevation={0} 
          sx={{ 
            height: getChartHeight(),
            width: '100%',
            mt: 1,
            mb: 1,
            flexGrow: 0,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: 1,
            bgcolor: 'background.paper',
            zIndex: 1
          }}
        >
          {!isChartVisible ? (
            <CircularProgress size={30} color="primary" />
          ) : (
            <Suspense fallback={<CircularProgress size={30} color="primary" />}>
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tabValue === 0 ? (
                  <BloodPressureChart 
                    data={getCurrentChartData()} 
                    config={getCurrentChartConfig()} 
                    isMobile={isMobile} 
                    theme={theme}
                  />
                ) : (
                  <SingleMetricChart 
                    data={getCurrentChartData()} 
                    config={getCurrentChartConfig()} 
                    isMobile={isMobile} 
                    theme={theme}
                  />
                )}
              </Box>
            </Suspense>
          )}
        </Paper>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard; 