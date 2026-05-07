import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import StorefrontPage from './pages/StorefrontPage';
import PetDetailPage from './pages/PetDetailPage';
import CartPage from './pages/CartPage';
import AdoptionFormPage from './pages/AdoptionFormPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './styles/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0284c7',
    },
    secondary: {
      main: '#ec4899',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<StorefrontPage />} />
                <Route path="/pet/:id" element={<PetDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/adoption-form" element={<AdoptionFormPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
