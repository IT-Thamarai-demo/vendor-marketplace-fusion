
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package, User, Heart } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { getTotalItems, getTotalPrice } = useCart();

  const stats = [
    {
      title: 'Cart Items',
      value: getTotalItems(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Cart Total',
      value: `$${getTotalPrice().toFixed(2)}`,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Browse Products</span>
              </CardTitle>
              <CardDescription>
                Discover amazing products from our verified vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/products">
                <Button className="w-full">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>My Cart</span>
              </CardTitle>
              <CardDescription>
                {getTotalItems() > 0 
                  ? `You have ${getTotalItems()} items in your cart` 
                  : 'Your cart is empty'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/cart">
                <Button variant="outline" className="w-full">
                  View Cart ({getTotalItems()})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to VendorHub!
              </h3>
              <p className="text-gray-600">
                Discover unique products from our community of trusted vendors. 
                Start shopping and find exactly what you're looking for.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
