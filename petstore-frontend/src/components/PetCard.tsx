import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../context/CartContext';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate(`/pet/${pet.id}`);
  };

  const getHealthStatusColor = (status?: string) => {
    if (!status) return 'default';
    if (status.toLowerCase().includes('healthy')) return 'success';
    if (status.toLowerCase().includes('care')) return 'warning';
    if (status.toLowerCase().includes('pending')) return 'error';
    return 'default';
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 },
        transition: 'box-shadow 0.3s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', paddingTop: '100%' }}>
        <CardMedia
          component="img"
          height="200"
          image={pet.photoUrls[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={pet.name}
          onLoad={() => setIsLoading(false)}
          sx={{
            position: 'absolute',
            top: 0,
            objectFit: 'cover',
            animation: isLoading ? 'pulse 2s' : 'none',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {pet.name}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {pet.breed || pet.species}
        </Typography>

        {pet.age && (
          <Typography variant="body2" color="textSecondary">
            Age: {pet.age} years
          </Typography>
        )}

        {pet.healthStatus && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={pet.healthStatus}
              size="small"
              color={getHealthStatusColor(pet.healthStatus)}
              variant="outlined"
            />
          </Box>
        )}

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mt: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {pet.bio}
        </Typography>
      </CardContent>

      <Box sx={{ p: 1 }}>
        <Button size="small" fullWidth variant="contained" color="primary">
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default PetCard;
