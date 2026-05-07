import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          © 2026 Petstore. Give a pet a forever home.
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Contact
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};
