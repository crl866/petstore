import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removePet, clearCart, getCartCount } = useCart();

  const handleRemovePet = (petId: number) => {
    removePet(petId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Your Furever Home 🏠
      </Typography>

      {getCartCount() === 0 ? (
        <Alert severity="info">
          Your cart is empty.{' '}
          <Button onClick={() => navigate('/')} sx={{ ml: 2 }}>
            Browse Pets
          </Button>
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Species</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cartItems.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={pet.photoUrls[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => navigate(`/pet/${pet.id}`)}
                      >
                        {pet.name}
                      </Button>
                    </TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.breed || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleRemovePet(pet.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClearCart}>
              Clear Cart
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/adoption-form')}
            >
              Proceed to Adoption Form
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;
