const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({ 
            _id: user._id, 
            username: user.username,
            email: user.email,
            nativeLanguage: user.nativeLanguage,
            targetLanguage: user.targetLanguage,
            cefrLevel: user.cefrLevel,
            profileCompleted: user.profileCompleted,
            streak: user.streak,
            token: generateToken(user._id) 
        });
    } catch (error) {
        console.error("Signup Error Details:", error);
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            nativeLanguage: user.nativeLanguage,
            targetLanguage: user.targetLanguage,
            cefrLevel: user.cefrLevel,
            profileCompleted: user.profileCompleted,
            streak: user.streak,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};