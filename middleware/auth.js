const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Log the entire headers for debugging
        console.log('Request Headers:', {
            authorization: req.headers.authorization,
            contentType: req.headers['content-type']
        });

        // Check if Authorization header exists
        const authHeader = req.header('Authorization') || req.header('authorization');
        if (!authHeader) {
            console.error('No Authorization header');
            return res.status(401).json({ error: 'No authorization header. Please log in.' });
        }

        // Extract token (handle both 'Bearer ' and potential variations)
        const tokenParts = authHeader.split(' ');
        const token = tokenParts.length > 1 ? tokenParts[1] : tokenParts[0];
        
        // Log token for debugging
        console.log('Received Token:', token ? 'Token Present' : 'No Token');

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (verifyError) {
            console.error('Token Verification Error:', verifyError.message);
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                details: verifyError.message 
            });
        }

        console.log('Decoded Token User ID:', decoded.userId);

        // Find user by ID with more robust error handling
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            console.error('User not found for ID:', decoded.userId);
            return res.status(401).json({ 
                error: 'User not found. Please log in again.',
                userId: decoded.userId 
            });
        }

        // Attach user and token to request
        req.token = token;
        req.user = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('Authentication Middleware Unexpected Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: 'Internal server authentication error',
            details: error.message 
        });
    }
};

module.exports = auth;
