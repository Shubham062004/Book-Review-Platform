import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/StarRating';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { 
  BookOpen, 
  Users, 
  Star, 
  ArrowRight, 
  PlusCircle,
  UserPlus,
  LogIn
} from 'lucide-react';

interface Book {
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
}

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏠 Fetching featured books...');
      const response = await api.get('/api/books?limit=6');
      console.log('🏠 API Response:', response.data);
      
      // Safely access books with fallback
      const books = response.data?.books || [];
      console.log('🏠 Books array:', books);
      
      // Filter out books with invalid data and add null checks
      const validBooks = books.filter((book: any) => {
        if (!book || !book._id || !book.title || !book.author) {
          console.warn('🏠 Invalid book data:', book);
          return false;
        }
        return true;
      }).map((book: any) => ({
        ...book,
        addedBy: book.addedBy || { name: 'Unknown User' }
      }));

      console.log('🏠 Valid books:', validBooks);
      setFeaturedBooks(validBooks);
      
      setStats({
        totalBooks: response.data?.pagination?.totalBooks || validBooks.length,
        totalReviews: 0,
        totalUsers: 0
      });

    } catch (error: any) {
      console.error('❌ Failed to fetch featured books:', error);
      setError('Failed to load books. Please try again later.');
      
      // Don't show toast if it's just empty data
      if (error.response?.status !== 404) {
        toast({
          title: 'Error',
          description: 'Failed to load featured books',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleReviewPrompt = () => {
    toast({
      title: 'Login Required',
      description: 'Please login to write reviews and add books',
      variant: 'default',
    });
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchFeaturedBooks}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-blue-600"> Great Read</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of book lovers in the ultimate reading community. 
            Discover, review, and share amazing books with fellow readers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-3">
                  <Link to="/books">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Browse Books
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                  <Link to="/add-book">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Book
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild className="text-lg px-8 py-3">
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                  <Link to="/signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Join Community
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalBooks}+</div>
              <div className="text-gray-600">Books Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600">Reviews Written</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Active Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-lg text-gray-600">
              Discover popular books from our community
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : featuredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books available yet</p>
              {user && (
                <Button className="mt-4" asChild>
                  <Link to="/add-book">Add the first book</Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredBooks.map((book) => (
                  <Card 
                    key={book._id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleBookClick(book._id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {book.genre || 'Unknown Genre'}
                        </Badge>
                        {book.year && (
                          <span className="text-xs text-gray-500">{book.year}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {book.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {book.averageRating !== undefined && book.averageRating > 0 ? (
                              <>
                                <StarRating rating={book.averageRating} readonly size="sm" />
                                <span className="text-xs text-gray-500">
                                  ({book.averageRating.toFixed(1)})
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">No reviews yet</span>
                            )}
                          </div>
                          
                          {!user && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReviewPrompt();
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Login to Review
                            </Button>
                          )}
                        </div>
                        
                        {/* FIXED: Safe access to addedBy.name with fallback */}
                        <div className="text-xs text-gray-500">
                          Added by {book.addedBy?.name || 'Unknown User'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" asChild variant="outline">
                  <Link to="/books">
                    View All Books
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BookReview?</h2>
            <p className="text-lg text-gray-600">
              Everything you need for the perfect reading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Discover Books</h3>
                <p className="text-gray-600">
                  Browse through thousands of books across all genres. Find your next favorite read easily.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Write Reviews</h3>
                <p className="text-gray-600">
                  Share your thoughts and help others discover great books. Rate and review your reads.
                </p>
                {!user && (
                  <Button 
                    size="sm" 
                    className="mt-3"
                    onClick={handleReviewPrompt}
                  >
                    Login to Review
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Join Community</h3>
                <p className="text-gray-600">
                  Connect with fellow book lovers. Share recommendations and discover new perspectives.
                </p>
                {!user && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3"
                    asChild
                  >
                    <Link to="/signup">Join Now</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community of passionate readers today. It's free and always will be!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
                <Link to="/signup">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3 text-black border-white hover:bg-white hover:text-blue-600">
                <Link to="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;