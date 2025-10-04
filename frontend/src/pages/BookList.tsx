import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BookCard from '@/components/BookCard';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  year?: number;
  averageRating?: number;
  description?: string;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/books?page=${page}&limit=6`);
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch books',
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
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Books</h1>
          <p className="text-lg text-muted-foreground">
            Explore our collection and find your next great read
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No books found</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;
