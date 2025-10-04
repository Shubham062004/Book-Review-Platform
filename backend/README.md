# Book Review Platform - Backend

A RESTful API for a book review platform built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- CRUD operations for books
- Review system with ratings
- Pagination and search
- Input validation
- Error handling

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key for JWT tokens
- `PORT`: Server port (default: 5000)

4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Reviews
- `GET /api/reviews/:bookId` - Get book reviews
- `POST /api/reviews` - Add review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## Query Parameters

### Books endpoint
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 5)
- `search`: Search by title or author
- `genre`: Filter by genre

Example: `/api/books?page=2&limit=10&search=harry&genre=fantasy`

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Database Schema

### User
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)

### Book
- title (String, required)
- author (String, required)
- description (String)
- genre (String, required)
- year (Number)
- addedBy (ObjectId, ref: User)

### Review
- bookId (ObjectId, ref: Book)
- userId (ObjectId, ref: User)
- rating (Number, 1-5)
- reviewText (String, required)

## Error Handling

The API returns consistent error responses:

```
{
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error


