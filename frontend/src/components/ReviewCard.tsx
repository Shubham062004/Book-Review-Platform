import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { Edit2, Trash2, User, Save, X } from 'lucide-react';

interface ReviewCardProps {
  review: {
    _id: string;
    userId: {
      _id: string;
      name: string;
    };
    rating: number;
    reviewText: string;
    createdAt: string;
  };
  currentUserId?: string;
  onEdit?: (reviewId: string, rating: number, reviewText: string) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }: ReviewCardProps) => {
  console.log('📝 ReviewCard data:', review); // Debug log
  
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editReviewText, setEditReviewText] = useState(review.reviewText);
  const [isSaving, setIsSaving] = useState(false);
  
  const isOwner = currentUserId === review.userId._id;
  const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleSaveEdit = async () => {
    if (!editReviewText.trim()) {
      alert('Review text cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      if (onEdit) {
        await onEdit(review._id, editRating, editReviewText);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Edit failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditRating(review.rating);
    setEditReviewText(review.reviewText);
    setIsEditing(false);
  };

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
          
          <div className="flex items-center gap-2">
            {/* Rating Display/Edit */}
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <StarRating
                  rating={editRating}
                  onRatingChange={setEditRating}
                />
                <span className="text-xs text-gray-600">({editRating}/5)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <StarRating rating={review.rating} readonly />
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
            )}

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex gap-1 ml-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(review._id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Review Text Display/Edit */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editReviewText}
              onChange={(e) => setEditReviewText(e.target.value)}
              placeholder="Update your review..."
              rows={3}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              {editReviewText.length}/500 characters
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">
            {review.reviewText || 'No review text provided'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
