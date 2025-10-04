import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { BookOpen, Edit2, Trash2, Calendar } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year?: number;
  description?: string;
  averageRating?: number;
  userId: string;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      console.log('🚀 Fetching book details for ID:', id);
      const [bookRes, reviewsRes] = await Promise.all([
        api.get(`/api/books/${id}`),
        api.get(`/api/reviews/${id}`),
      ]);
      console.log('✅ Book response:', bookRes.data);
      console.log('✅ Reviews response:', reviewsRes.data);
      
      // Debug each review
      reviewsRes.data.forEach((review: any, index: number) => {
        console.log(`📝 Review ${index}:`, {
          id: review._id,
          rating: review.rating,
          reviewText: review.reviewText,
          textLength: review.reviewText?.length,
          user: review.userId?.name
        });
      });
      
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
    } catch (error: any) {
      console.error('❌ Fetch book details error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch book details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Review submission data:', {
      bookId: id,
      rating: newRating,
      reviewText: newReview,
      user: user
    });

    if (!newRating || !newReview.trim()) {
      toast({
        title: 'Invalid input',
        description: 'Please provide both rating and review',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookId: id,
        rating: newRating,
        reviewText: newReview, // Fixed: was 'review', now 'reviewText'
      };

      console.log('📝 Sending payload:', payload);

      const response = await api.post('/api/reviews', payload);
      
      console.log('✅ Review response:', response.data);

      toast({
        title: 'Success',
        description: 'Your review has been added',
      });

      setNewRating(0);
      setNewReview('');
      fetchBookDetails();
    } catch (error: any) {
      console.error('❌ Review submission error:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/api/books/${id}`);
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
      navigate('/books');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete book',
        variant: 'destructive',
      });
    }
  };

  const handleEditReview = async (reviewId: string, rating: number, reviewText: string) => {
    try {
      console.log('📝 Editing review:', { reviewId, rating, reviewText });
      
      const response = await api.put(`/api/reviews/${reviewId}`, {
        rating,
        reviewText
      });

      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });

      // Update the review in state
      setReviews(reviews.map(review => 
        review._id === reviewId 
          ? { ...review, rating, reviewText }
          : review
      ));

      await fetchBookDetails(); // Refresh to get updated average rating
    } catch (error: any) {
      console.error('❌ Edit review error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update review',
        variant: 'destructive',
      });
      throw error; // Re-throw so ReviewCard can handle loading state
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/api/reviews/${reviewId}`);
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      fetchBookDetails();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Book not found</p>
      </div>
    );
  }

  const isBookOwner = user?.id === book.userId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Book Info Card */}
        <Card className="mb-8 shadow-card-hover animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle className="text-3xl">{book.title}</CardTitle>
                </div>
                <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
                
                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {book.genre}
                  </Badge>
                  {book.year && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {book.year}
                    </div>
                  )}
                </div>

                {book.averageRating !== undefined && (
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={book.averageRating} size="lg" />
                    <span className="text-lg font-medium">
                      {book.averageRating.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>

              {isBookOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/books/edit/${id}`)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteBook}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          {book.description && (
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Add Review Form */}
        {user && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating</label>
                  <StarRating
                    rating={newRating}
                    interactive
                    onRatingChange={setNewRating}
                    size="lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <Textarea
                    placeholder="Share your thoughts about this book..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => {
              console.log('📝 Mapping review:', review); // Debug log
              return (
                <ReviewCard
                  key={review._id}
                  review={review}
                  currentUserId={user?.id}
                  onEdit={user?.id === review.userId._id ? handleEditReview : undefined}
                  onDelete={user?.id === review.userId._id ? handleDeleteReview : undefined}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
