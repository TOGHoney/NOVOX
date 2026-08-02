const express = require('express');
const cors = require('cors');
const app = express(); // 1. CREATE THE APP FIRST


// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 3. ROUTES
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const debateRoutes = require('./routes/debateRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/debates', debateRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('LinguaBrief API is running...');
});

// 5. EXPORT THE APP
module.exports = app;