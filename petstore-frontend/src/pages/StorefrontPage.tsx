import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import PetCard from '../components/PetCard';
import { petApi } from '../services/apiClient';
import { Pet } from '../context/CartContext';

interface Category {
  id: number;
  name: string;
  speciesType: string;
}

const StorefrontPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await petApi.getCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch pets
  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await petApi.getPets(page, 20, selectedCategory || undefined, debouncedSearch || undefined);
      const { data, totalCount, pageSize } = response.data;
      setPets(data);
      setTotalPages(Math.ceil(totalCount / pageSize));
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets');
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Find Your Perfect Companion
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>
            <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedCategory === null}
                  onClick={() => {
                    setSelectedCategory(null);
                    setPage(0);
                  }}
                >
                  All Pets
                </ListItemButton>
              </ListItem>
              {categories.map((cat) => (
                <ListItem key={cat.id} disablePadding>
                  <ListItemButton
                    selected={selectedCategory === cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPage(0);
                    }}
                  >
                    {cat.name}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} sm={9}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search pets by name, breed, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ bgcolor: 'white' }}
            />
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : pets.length === 0 ? (
            <Alert severity="info">No pets found. Try adjusting your filters.</Alert>
          ) : (
            <>
              <Grid container spacing={2}>
                {pets.map((pet) => (
                  <Grid item xs={12} sm={6} md={4} key={pet.id}>
                    <PetCard pet={pet} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default StorefrontPage;
