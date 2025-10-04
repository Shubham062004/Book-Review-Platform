# 📚 BookReview Platform

A full-stack web application for discovering, reviewing, and managing books with a passionate reading community.

![BookReview Platform](https://img.shields.io/badge/BookReview-Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🌟 Features

### 📖 **Core Features**
- **Browse Books**: Discover books across all genres
- **User Authentication**: Secure signup/login with JWT
- **Book Management**: Add, edit, and delete books
- **Reviews & Ratings**: Rate and review books (1-5 stars)
- **Wishlist**: Save books for later reading
- **User Profiles**: Manage personal book collections

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach
- **Guest Browsing**: View books without registration
- **Real-time Search**: Find books instantly
- **Password Toggle**: Show/hide password fields
- **Toast Notifications**: User-friendly feedback
- **Loading States**: Smooth user interactions

### 🔧 **Technical Features**
- **RESTful API**: Clean backend architecture
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing
- **Environment Config**: Secure configuration management

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **Axios** for API requests
- **React Query** for state management

### **Backend**
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for validation
- **CORS** for cross-origin requests

### **Deployment**
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- MongoDB Atlas account
- Git installed

### **1. Clone Repository**
```
git clone https://github.com/yourusername/book-review-platform.git
cd book-review-platform
```

### **2. Backend Setup**
```
cd backend
npm install

# Create .env file
echo "NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_characters
PORT=5000" > .env

# Start backend
npm run dev
```

### **3. Frontend Setup**
```
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev
```

### **4. Seed Database (Optional)**
```
cd backend
npm run seed
```

## 📱 API Endpoints

### **Authentication**
```
POST /api/auth/signup    - User registration
POST /api/auth/login     - User login
```

### **Books**
```
GET    /api/books        - Get all books (with pagination)
GET    /api/books/:id    - Get single book
POST   /api/books        - Add new book (auth required)
PUT    /api/books/:id    - Update book (auth required)
DELETE /api/books/:id    - Delete book (auth required)
```

### **Reviews**
```
GET    /api/reviews/:bookId  - Get book reviews
POST   /api/reviews          - Add review (auth required)
PUT    /api/reviews/:id      - Update review (auth required)
DELETE /api/reviews/:id      - Delete review (auth required)
```

### **Wishlist**
```
GET    /api/wishlist         - Get user wishlist (auth required)
POST   /api/wishlist/:bookId - Add to wishlist (auth required)
DELETE /api/wishlist/:bookId - Remove from wishlist (auth required)
```

## 🔧 Environment Variables

### **Backend (.env)**
```
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_characters
PORT=5000
```

### **Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## 📦 Project Structure

```
book-review-platform/
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utilities
│   │   └── App.tsx         # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Deployment

### **Deploy Backend to Render**
1. Push code to GitHub
2. Create web service on Render
3. Connect GitHub repository
4. Add environment variables
5. Deploy automatically

### **Deploy Frontend to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in frontend directory
3. Add environment variables
4. Deploy with `vercel --prod`

## 🧪 Testing

### **Backend Testing**
```
cd backend
npm run test-endpoints  # Test API endpoints
npm run test-db         # Test database connection
```

### **Frontend Testing**
```
cd frontend
npm run test           # Run unit tests
npm run e2e           # Run end-to-end tests
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MongoDB** for the database solution
- **Vercel & Render** for free hosting
- **Shadcn/ui** for beautiful components
- **TailwindCSS** for utility-first styling

## 📞 Support

For support, email your-email@example.com or join our Slack channel.

## 🔗 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **API Documentation**: https://your-backend.onrender.com/api

---

**Happy Reading! 📚✨**
