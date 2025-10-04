import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { BookOpen, Heart, Eye } from 'lucide-react';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    genre: string;
    year?: number;
    averageRating?: number;
    description?: string;
    addedBy?: {
      _id?: string;
      name?: string;
    } | null;
  };
  showWishlist?: boolean;
}

const BookCard = ({ book, showWishlist = true }: BookCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (user && showWishlist && book._id) {
      checkWishlistStatus();
    }
  }, [user, book._id, showWishlist]);

  const checkWishlistStatus = async () => {
    try {
      const response = await api.get(`/api/wishlist/check/${book._id}`);
      setInWishlist(response.data.inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add books to wishlist',
        variant: 'default',
      });
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/api/wishlist/${book._id}`);
        setInWishlist(false);
        toast({
          title: '💔 Removed from Wishlist',
          description: `${book.title} removed from your wishlist`,
        });
      } else {
        await api.post(`/api/wishlist/${book._id}`);
        setInWishlist(true);
        toast({
          title: '❤️ Added to Wishlist',
          description: `${book.title} added to your wishlist`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Ensure we have valid book data
  if (!book || !book._id || !book.title || !book.author) {
    return null;
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in relative">
      {/* Wishlist Heart Button */}
      {showWishlist && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
            inWishlist 
              ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
              : 'text-gray-400 hover:text-red-500 bg-white/80 hover:bg-red-50'
          }`}
        >
          <Heart 
            className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} 
          />
        </Button>
      )}

      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
          </div>
          <BookOpen className="h-8 w-8 text-primary/20 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {book.genre || 'Unknown Genre'}
            </Badge>
          {book.year && (
            <Badge variant="outline" className="text-xs">
              {book.year}
            </Badge>
          )}
        </div>

        {book.averageRating !== undefined && book.averageRating > 0 ? (
          <div className="flex items-center gap-2">
            <StarRating rating={book.averageRating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({book.averageRating.toFixed(1)})
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No reviews yet</span>
        )}

        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>
        )}

        {/* FIXED: Safe access to addedBy.name with fallback */}
        <div className="text-xs text-muted-foreground">
          Added by {book.addedBy?.name || 'Unknown User'}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link to={`/books/${book._id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
