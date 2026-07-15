const express = require('express');
const cors = require('cors');
const app = express(); // 1. CREATE THE APP FIRST


// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 3. ROUTES
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // 4. NOW YOU CAN USE IT

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('LinguaBrief API is running...');
});

// 5. EXPORT THE APP
module.exports = app;