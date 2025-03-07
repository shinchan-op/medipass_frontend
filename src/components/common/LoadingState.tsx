import React from 'react';
import { Box, CircularProgress, Typography, SxProps, Theme } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  size?: number;
  sx?: SxProps<Theme>;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 40,
  sx
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        ...sx
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingState; 