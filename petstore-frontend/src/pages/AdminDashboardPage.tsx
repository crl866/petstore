import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography, Alert } from '@mui/material';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Admin features (Inventory Management, Application Tracking) will be implemented in Phase 2.
      </Alert>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Inventory" />
          <Tab label="Health Status" />
          <Tab label="Applications" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 3 }}>
        {activeTab === 0 && (
          <Typography variant="body1">
            Inventory Management - Coming Soon in Phase 2
          </Typography>
        )}

        {activeTab === 1 && (
          <Typography variant="body1">
            Health Status Management - Coming Soon in Phase 2
          </Typography>
        )}

        {activeTab === 2 && (
          <Typography variant="body1">
            Application Tracking - Coming Soon in Phase 3
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
