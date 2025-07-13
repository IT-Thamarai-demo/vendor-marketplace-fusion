
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Check, X, Loader2, Shield } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  vendor: {
    name: string;
    _id: string;
  };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vendorbakend.onrender.com';

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching pending products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    setProcessingId(productId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products/approve/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product approved successfully!",
        });
        fetchPendingProducts();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to approve product');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve product",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (productId: string) => {
    setProcessingId(productId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product rejected successfully!",
        });
        fetchPendingProducts();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reject product');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject product",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Products</CardTitle>
            <CardDescription>
              Review and approve or reject products submitted by vendors
            </CardDescription>
          </CardHeader>
        </Card>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending products</h3>
            <p className="text-gray-600">All products have been reviewed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id}>
                <CardContent className="p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xl">${product.price}</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Quantity: {product.quantity}</p>
                  <p className="text-sm text-gray-500 mb-4">Vendor: {product.vendor.name}</p>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleApprove(product._id)}
                      disabled={processingId === product._id}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {processingId === product._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(product._id)}
                      disabled={processingId === product._id}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processingId === product._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
