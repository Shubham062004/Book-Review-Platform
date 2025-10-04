import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { Edit2, Trash2, User } from 'lucide-react';

interface ReviewCardProps {
  review: {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
    rating: number;
    review: string;
    createdAt: string;
  };
  currentUserId?: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }: ReviewCardProps) => {
  const isOwner = currentUserId === review.userId._id;
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{review.userId.name}</p>
              <p className="text-xs text-muted-foreground">{reviewDate}</p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{review.review}</p>
        
        {isOwner && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit?.(review._id)}
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete?.(review._id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
