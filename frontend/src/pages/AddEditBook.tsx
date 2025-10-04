import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import Loader from '@/components/Loader';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: '',
  });

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      console.log('🚀 Fetching book for edit:', id);
      const response = await api.get(`/api/books/${id}`);
      console.log('✅ Book data:', response.data);
      const book = response.data;
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        genre: book.genre,
        year: book.year?.toString() || '',
      });
    } catch (error: any) {
      console.error('❌ Fetch book error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch book',
        variant: 'destructive',
      });
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : undefined,
    };

    try {
      if (isEdit) {
        console.log('🚀 Updating book:', id, payload);
        await api.put(`/api/books/${id}`, payload);
        toast({
          title: 'Success',
          description: 'Book updated successfully',
        });
      } else {
        console.log('🚀 Creating new book:', payload);
        await api.post('/api/books', payload);
        toast({
          title: 'Success',
          description: 'Book added successfully',
        });
      }
      navigate('/books');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="shadow-card-hover animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl">
              {isEdit ? 'Edit Book' : 'Add New Book'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g., Fiction, Mystery, Romance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Publication Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2023"
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter book description"
                  rows={5}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/books')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditBook;
