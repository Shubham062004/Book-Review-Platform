import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookCard from '@/components/BookCard';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { Heart, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WishlistItem {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    genre: string;
    year?: number;
    averageRating?: number;
    description?: string;
    addedBy: {
      name: string;
    };
  };
  addedAt: string;
}

const Wishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/api/wishlist');
      setWishlist(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch wishlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">
                Please login to view your wishlist and save your favorite books.
              </p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <p className="text-lg text-gray-600">
              Books you want to read later
            </p>
          </div>

          {/* Wishlist Content */}
          {wishlist.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Start building your reading list by adding books you're interested in.
                </p>
                <Button asChild>
                  <Link to="/books">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Books
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats */}
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {wishlist.length} book{wishlist.length !== 1 ? 's' : ''} in your wishlist
                </p>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {wishlist.map((item) => (
                  <div key={item._id} className="relative">
                    <BookCard book={item.book} showWishlist={true} />
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="text-center">
                <Button asChild variant="outline">
                  <Link to="/books">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse More Books
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
