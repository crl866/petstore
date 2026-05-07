import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailPage = location.pathname.startsWith('/pets/') && location.pathname !== '/pets';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {isDetailPage && (
              <button
                onClick={handleBack}
                className="text-2xl hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                aria-label="Back"
              >
                ←
              </button>
            )}
            <RouterLink
              to="/"
              className="text-2xl font-bold hover:text-blue-100 transition-colors"
            >
              🐾 Petstore
            </RouterLink>
          </div>

          <nav className="flex items-center gap-4">
            <RouterLink
              to="/"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Browse Pets
            </RouterLink>

            <RouterLink
              to="/cart"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Cart
            </RouterLink>

            <RouterLink
              to="/admin"
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Admin
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
