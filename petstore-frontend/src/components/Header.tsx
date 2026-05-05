import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header: React.FC = () => {
  const { getCartCount } = useCart();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#0284c7' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            🐾 Petstore
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/">
              Browse Pets
            </Button>

            <Button
              color="inherit"
              component={RouterLink}
              to="/cart"
              startIcon={
                <Badge badgeContent={getCartCount()} color="error">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Cart
            </Button>

            <Button color="inherit" component={RouterLink} to="/admin">
              Admin
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
