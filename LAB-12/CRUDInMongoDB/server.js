// npm init -y
// npm install express mongoose

// DELETE http://localhost:3000/users/<id>
// PUT http://localhost:3000/users/<id>
// GET http://localhost:3000/users
// POST http://localhost:3000/users
//install postman to test the api

// {
//   "name": "Naveen",
//   "age": 20
// }
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/users', require('./routes/userRoutes'));

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});