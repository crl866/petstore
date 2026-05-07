import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import PhotoGallery from '../components/PhotoGallery';
import { petApi } from '../services/apiClient';
import { useCart, Pet } from '../context/CartContext';

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addPet } = useCart();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await petApi.getPetById(parseInt(id));
        setPet(response.data.data);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError('Failed to load pet details');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleAddToCart = () => {
    if (pet) {
      addPet(pet);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Pet not found'}</Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Storefront
        </Button>
      </Container>
    );
  }

  const getHealthStatusColor = (status?: string) => {
    if (!status) return 'default';
    if (status.toLowerCase().includes('healthy')) return 'success';
    if (status.toLowerCase().includes('care')) return 'warning';
    if (status.toLowerCase().includes('pending')) return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>
        ← Back to Storefront
      </Button>

      <Grid container spacing={4}>
        {/* Photo Gallery */}
        <Grid item xs={12} md={6}>
          <PhotoGallery photos={pet.photoUrls} petName={pet.name} />
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            {pet.name}
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            {pet.breed ? `${pet.breed} • ${pet.species}` : pet.species}
          </Typography>

          {pet.age && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Age:</strong> {pet.age} years
            </Typography>
          )}

          {pet.categoryName && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Category:</strong> {pet.categoryName}
            </Typography>
          )}

          {pet.healthStatus && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={pet.healthStatus}
                color={getHealthStatusColor(pet.healthStatus)}
                variant="outlined"
              />
              {pet.healthStatusNotes && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {pet.healthStatusNotes}
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            About {pet.name}
          </Typography>

          <Typography variant="body1" paragraph>
            {pet.bio}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAddToCart}
            >
              Add to Furever Home
            </Button>

            <Button variant="outlined" size="large" onClick={() => navigate('/cart')}>
              View Cart
            </Button>
          </Box>

          {addedToCart && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {pet.name} added to your Furever Home! 🎉
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PetDetailPage;
