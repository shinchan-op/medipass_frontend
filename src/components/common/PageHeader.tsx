import React from 'react';
import { Box, Typography, Breadcrumbs, Link, SxProps, Theme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: {
    label: string;
    link?: string;
  }[];
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
  sx
}) => {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return isLast || !crumb.link ? (
              <Typography key={index} color="text.primary" variant="body2">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                component={RouterLink}
                to={crumb.link}
                underline="hover"
                color="inherit"
                variant="body2"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom={!!subtitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
    </Box>
  );
};

export default PageHeader; 