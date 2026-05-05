import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © 2026 Petstore. Give a pet a forever home.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Link href="#" color="textSecondary" underline="hover">
            About
          </Link>
          <Link href="#" color="textSecondary" underline="hover">
            Contact
          </Link>
          <Link href="#" color="textSecondary" underline="hover">
            Privacy Policy
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
