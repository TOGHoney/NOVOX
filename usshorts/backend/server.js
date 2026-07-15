require('dotenv').config({ path: './.env'});
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        // Only start the server after DB connection is established
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit process with failure
    });