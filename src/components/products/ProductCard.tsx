
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  vendor: {
    name: string;
    _id: string;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (user.role !== 'user') {
      toast({
        title: "Access denied",
        description: "Only customers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <Badge variant="secondary" className="text-xs">
              {product.quantity} left
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By {product.vendor.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.quantity === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
