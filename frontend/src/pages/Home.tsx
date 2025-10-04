import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-books.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/15 via-transparent to-primary/15 animate-fade-in" />
        </div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Discover Your Next
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Favorite Book
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join our community of readers. Share reviews, discover new books, 
                and connect with fellow book lovers.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Get Started
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/books">
                    Browse Books
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-3xl opacity-20" />
              <img
                src={heroImage}
                alt="Books collection"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose BookReview?</h2>
            <p className="text-lg text-muted-foreground">Everything you need for your reading journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Vast Collection',
                description: 'Access thousands of books across all genres',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Connect with readers who share your interests',
              },
              {
                icon: Star,
                title: 'Honest Reviews',
                description: 'Read and write genuine book reviews',
              },
              {
                icon: TrendingUp,
                title: 'Trending',
                description: 'Discover what\'s popular in the reading community',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of readers and share your love for books
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">
                Create Free Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
