import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppointmentStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: AppointmentStatus | PaymentStatus | string;
}

const StyledChip = styled(Chip)<StatusBadgeProps>(({ theme, status }) => {
  let backgroundColor = '';
  let textColor = '';

  // Handle appointment statuses
  if (status === AppointmentStatus.SCHEDULED) {
    backgroundColor = theme.palette.info.light;
    textColor = theme.palette.info.dark;
  } else if (status === AppointmentStatus.COMPLETED) {
    backgroundColor = theme.palette.success.light;
    textColor = theme.palette.success.dark;
  } else if (status === AppointmentStatus.CANCELLED) {
    backgroundColor = theme.palette.error.light;
    textColor = theme.palette.error.dark;
  } else if (status === AppointmentStatus.PENDING) {
    backgroundColor = theme.palette.warning.light;
    textColor = theme.palette.warning.dark;
  }
  // Handle payment statuses
  else if (status === PaymentStatus.PAID) {
    backgroundColor = theme.palette.success.light;
    textColor = theme.palette.success.dark;
  } else if (status === PaymentStatus.PENDING) {
    backgroundColor = theme.palette.warning.light;
    textColor = theme.palette.warning.dark;
  } else if (status === PaymentStatus.OVERDUE) {
    backgroundColor = theme.palette.error.light;
    textColor = theme.palette.error.dark;
  } else if (status === PaymentStatus.CANCELLED) {
    backgroundColor = theme.palette.grey[300];
    textColor = theme.palette.grey[700];
  }
  // Default color
  else {
    backgroundColor = theme.palette.grey[300];
    textColor = theme.palette.grey[700];
  }

  return {
    backgroundColor,
    color: textColor,
    fontWeight: 500,
    fontSize: '0.75rem',
    height: 24,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  // Format the label text to be more readable
  const formatLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return <StyledChip status={status} label={formatLabel(status)} {...props} />;
};

export default StatusBadge; 