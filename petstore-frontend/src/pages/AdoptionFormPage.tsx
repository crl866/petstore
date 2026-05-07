import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { applicationApi } from '../services/apiClient';
import { useCart } from '../context/CartContext';

const steps = ['Personal Info', 'Home Environment', 'Pet Care Commitment', 'Review & Submit'];

interface FormData {
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  homeType: string;
  ownsPets: string;
  petExperience: string;
  references: string;
  timeAvailable: string;
}

const AdoptionFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    applicantName: '',
    email: '',
    phone: '',
    address: '',
    homeType: '',
    ownsPets: '',
    petExperience: '',
    references: '',
    timeAvailable: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationApi.createApplication({
        applicantName: formData.applicantName,
        email: formData.email,
        address: formData.address,
        homeType: formData.homeType,
        formAnswers: {
          phone: formData.phone,
          ownsPets: formData.ownsPets,
          petExperience: formData.petExperience,
          references: formData.references,
          timeAvailable: formData.timeAvailable,
          petIds: cartItems.map((p) => p.id),
        },
      });

      setApplicationId(response.data.data.id);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Your cart is empty. Please add pets before starting an adoption application.
        </Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Browse Pets
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">Application Submitted! 🎉</Typography>
          <Typography>
            Your adoption application has been received. Application ID: {applicationId}
          </Typography>
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Storefront
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Adoption Application
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, mb: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange('applicantName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Home Environment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Home Type (Apartment, House, etc.)"
                  value={formData.homeType}
                  onChange={(e) => handleInputChange('homeType', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Do you own other pets? If yes, describe them."
                  value={formData.ownsPets}
                  onChange={(e) => handleInputChange('ownsPets', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pet Care Commitment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pet Care Experience"
                  value={formData.petExperience}
                  onChange={(e) => handleInputChange('petExperience', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Tell us about your experience with pets"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="References (names and contact info)"
                  value={formData.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="How much time can you dedicate to pet care daily?"
                  value={formData.timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Review Your Application
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography><strong>Name:</strong> {formData.applicantName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Phone:</strong> {formData.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Address:</strong> {formData.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Home Type:</strong> {formData.homeType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Applying for {cartItems.length} pet(s)
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>

        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default AdoptionFormPage;
