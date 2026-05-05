import React, { useState } from 'react';
import { Box, IconButton, MobileStepper, Paper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface PhotoGalleryProps {
  photos: string[];
  petName: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, petName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = photos.length || 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const currentPhoto = photos[activeStep] || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
      <Paper
        square
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 500,
          backgroundColor: '#f5f5f5',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={currentPhoto}
          alt={`${petName} - Photo ${activeStep + 1}`}
          sx={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />

        {maxSteps > 1 && (
          <>
            <IconButton
              size="large"
              onClick={handleBack}
              sx={{
                position: 'absolute',
                left: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <KeyboardArrowLeft />
            </IconButton>

            <IconButton
              size="large"
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
      </Paper>

      {maxSteps > 1 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
          {photos.map((photo, index) => (
            <Box
              key={index}
              component="img"
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setActiveStep(index)}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                cursor: 'pointer',
                border: activeStep === index ? '3px solid #0ea5e9' : '2px solid #ccc',
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PhotoGallery;
