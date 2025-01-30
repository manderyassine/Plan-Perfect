const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../client/public/uploads/profiles');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
        }
    }
});

// Register User
router.post('/register', [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('name', 'Name is required').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, name } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            name,
            lastLogin: new Date() // Set initial login time on registration
        });

        await user.save();

        // Create JWT token with name included
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username,
                name: user.name  // Include name in token payload
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Login attempt for non-existent user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Invalid password attempt for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token with explicit expiration
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                username: user.username,
                name: user.name  // Include name in token payload
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }  // Token expires in 7 days
        );

        // Prepare user response (include all non-sensitive fields)
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name || '',  // Explicitly include name
            email: user.email,
            profileImage: user.profileImage || '',
            location: user.location || {},
            bio: user.bio || ''
        };

        console.log('Successful login for user:', {
            userId: user._id,
            email: user.email,
            name: user.name,
            tokenGenerated: token ? 'Yes' : 'No'
        });

        res.json({
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login Error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Server error during login', 
            error: process.env.NODE_ENV !== 'production' ? error.message : {} 
        });
    }
});

// Update user profile
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Profile Update Request:', {
            userId: req.user._id,
            body: req.body,
            file: req.file ? req.file.filename : 'No file'
        });

        // Find user by ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic profile information
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.bio) user.bio = req.body.bio;

        // Location handling with robust parsing
        if (req.body.location) {
            try {
                let locationData;
                
                // Handle different input formats
                if (typeof req.body.location === 'string') {
                    try {
                        locationData = JSON.parse(req.body.location);
                    } catch {
                        // If JSON parsing fails, try direct string parsing
                        locationData = { city: req.body.location };
                    }
                } else if (typeof req.body.location === 'object') {
                    locationData = req.body.location;
                } else {
                    throw new Error('Invalid location format');
                }

                // Ensure location has city and country
                user.location = {
                    city: locationData.city || locationData.name || '',
                    country: locationData.country || locationData.region || ''
                };

                console.log('Parsed Location:', user.location);
            } catch (parseError) {
                console.error('Location parsing error:', parseError);
                return res.status(400).json({ 
                    message: 'Invalid location format',
                    error: parseError.message 
                });
            }
        }

        // Handle profile image upload
        if (req.file) {
            user.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        // Save updated user
        await user.save();

        // Return full user object, excluding sensitive fields
        const userResponse = {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            location: user.location || {}
        };

        res.json(userResponse);
    } catch (error) {
        console.error('Profile update server error:', error);
        res.status(500).json({ 
            message: 'Server error updating profile',
            error: process.env.NODE_ENV !== 'production' ? error.message : {} 
        });
    }
});

// Get user details
router.get('/user/:id', auth, async (req, res) => {
    try {
        // Find user by ID and exclude sensitive information
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        // req.user is already populated by the auth middleware
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            location: user.location
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// Token verification route
router.get('/verify', auth, async (req, res) => {
    try {
        // If we reach here, the token is valid (middleware already checked)
        // Find the user and return minimal user info
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({
            user: {
                _id: user._id,
                username: user.username,
                name: user.name || '',  // Explicitly include name
                email: user.email,
                profileImage: user.profileImage || '',
                location: user.location || {},
                bio: user.bio || ''
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            message: 'Server error during token verification',
            error: process.env.NODE_ENV !== 'production' ? error.message : {} 
        });
    }
});

module.exports = router;
