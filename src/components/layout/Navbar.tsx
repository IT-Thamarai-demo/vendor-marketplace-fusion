
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/vendor';
      default:
        return '/products';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VendorHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link 
                to={getDashboardLink()} 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1"
              >
                {user?.role === 'admin' && <Shield className="h-4 w-4" />}
                {user?.role === 'vendor' && <Package className="h-4 w-4" />}
                {user?.role === 'user' && <User className="h-4 w-4" />}
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart for users */}
                {user?.role === 'user' && (
                  <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <ShoppingCart className="h-6 w-6" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                )}

                {/* User menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
