const express = require('express');
const router = express.Router();
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

// Update user profile
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        console.log('Profile Update Request:', {
            userId: req.user.userId,
            body: req.body,
            file: req.file ? req.file.filename : 'No file'
        });

        const userId = req.user.userId;
        const { name, username, bio, location } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found for ID:', userId);
            return res.status(404).json({ message: 'User not found', userId });
        }

        // Update basic profile information
        if (name) user.name = name;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (location) user.location = location;

        // Handle profile image upload
        if (req.file) {
            // Delete old profile image if it exists and is not the default
            if (user.profileImage && !user.profileImage.includes('ui-avatars.com')) {
                const oldImagePath = path.join(__dirname, '../client/public', user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Set new profile image path
            user.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        // Save updated user
        await user.save();

        // Return full user object
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            location: user.location
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            message: 'Server error updating profile',
            error: error.message
        });
    }
});

module.exports = router;
