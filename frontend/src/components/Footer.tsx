import { BookOpen, Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h3 className="text-2xl font-bold">BookReview</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover, review, and share your favorite books with a community of passionate readers. 
              Join thousands of book lovers in building the ultimate reading experience.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="mailto:contact@bookreview.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/books" className="text-gray-300 hover:text-white transition-colors">
                  Browse Books
                </a>
              </li>
              <li>
                <a href="/add-book" className="text-gray-300 hover:text-white transition-colors">
                  Add Book
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white transition-colors">
                  My Profile
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} BookReview Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              Made with <Heart className="h-4 w-4 text-red-500" fill="currentColor" /> for book lovers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
