import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookCard from '@/components/BookCard';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { User, BookOpen, Star } from 'lucide-react';

interface UserBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year?: number;
  averageRating?: number;
  description?: string;
}

interface UserReview {
  _id: string;
  bookId: {
    _id: string;
    title: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [booksRes, reviewsRes] = await Promise.all([
        api.get('/books/user/me'),
        api.get('/reviews/user/me'),
      ]);
      setUserBooks(booksRes.data);
      setUserReviews(reviewsRes.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* User Info Card */}
        <Card className="mb-8 shadow-card-hover animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-1">{user?.name}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{userBooks.length}</p>
                <p className="text-sm text-muted-foreground">Books Added</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <Star className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">{userReviews.length}</p>
                <p className="text-sm text-muted-foreground">Reviews Written</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Books */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            My Books
          </h2>
          {userBooks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't added any books yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* User's Reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="h-6 w-6 text-accent" />
            My Reviews
          </h2>
          {userReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't written any reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <Card key={review._id} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{review.bookId.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {review.rating} ★
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{review.review}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
