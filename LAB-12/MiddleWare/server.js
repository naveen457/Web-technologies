// npm install express
// http://localhost:3000/
// http://localhost:3000/special

// npm init -y
// npm install express


const express = require('express');
const app = express();

const PORT = 3000;

// -------------------------------
// 1️⃣ Global Middleware (Logger)
// -------------------------------
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[GLOBAL] ${req.method} ${req.url} - ${timestamp}`);
    next(); // pass control to next middleware
});

// -------------------------------
// 2️⃣ Middleware Layer 1
// -------------------------------
app.use((req, res, next) => {
    console.log("[MIDDLEWARE 1] Processing request...");
    next();
});

// -------------------------------
// 3️⃣ Middleware Layer 2
// -------------------------------
app.use((req, res, next) => {
    console.log("[MIDDLEWARE 2] Additional processing...");
    next();
});

// -------------------------------
// 4️⃣ Route-Level Middleware
// -------------------------------
const routeMiddleware = (req, res, next) => {
    console.log("[ROUTE MIDDLEWARE] Only for /special route");
    next();
};

// -------------------------------
// 5️⃣ Routes
// -------------------------------

// Normal route
app.get('/', (req, res) => {
    console.log("[HANDLER] Sending response for /");
    res.send("Home Page");
});

// Route with route-level middleware
app.get('/special', routeMiddleware, (req, res) => {
    console.log("[HANDLER] Sending response for /special");
    res.send("Special Page with Route Middleware");
});

// -------------------------------
// 6️⃣ Start Server
// -------------------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});