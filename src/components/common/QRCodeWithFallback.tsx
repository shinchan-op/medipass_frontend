import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface QRCodeWithFallbackProps {
  value: string;
  size: number;
  level?: 'L' | 'M' | 'Q' | 'H';
}

const QRCodeWithFallback: React.FC<QRCodeWithFallbackProps> = ({ value, size, level = 'H' }) => {
  const [qrCode, setQrCode] = useState<React.ReactNode | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        // Dynamically import the QRCodeSVG component
        const { QRCodeSVG } = await import('qrcode.react');
        setQrCode(
          <QRCodeSVG
            value={value}
            size={size}
            level={level}
            includeMargin={true}
          />
        );
      } catch (error) {
        console.error('Failed to load QR code component:', error);
        setHasError(true);
      }
    };

    loadQRCode();
  }, [value, size, level]);

  if (hasError) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          textAlign: 'center',
          border: '1px solid #ddd'
        }}
      >
        <Typography variant="body2" color="error" gutterBottom>
          Could not generate QR code
        </Typography>
        <Typography variant="caption">
          {value.length > 30 ? `${value.substring(0, 25)}...` : value}
        </Typography>
      </Box>
    );
  }

  if (!qrCode) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2">Loading QR code...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      {qrCode}
    </Box>
  );
};

export default QRCodeWithFallback; 