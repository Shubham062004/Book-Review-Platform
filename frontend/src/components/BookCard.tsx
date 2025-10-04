import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    genre: string;
    year?: number;
    averageRating?: number;
    description?: string;
  };
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover animate-fade-in">
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
            {book.genre}
          </Badge>
          {book.year && (
            <Badge variant="outline" className="text-xs">
              {book.year}
            </Badge>
          )}
        </div>

        {book.averageRating !== undefined && (
          <div className="flex items-center gap-2">
            <StarRating rating={book.averageRating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({book.averageRating.toFixed(1)})
            </span>
          </div>
        )}

        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {book.description}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link to={`/books/${book._id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
