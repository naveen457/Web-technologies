// npm init -y
// npm install express

// /users
//     / users / 1
//     / users
//     / users / 1
// /users/1
// install post man to test the API for the post,put and deleted commands

const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/users', userRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});