const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get all tasks for authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new task
router.post('/', [auth, [
    check('title', 'Title is required').notEmpty()
]], async (req, res) => {
    try {
        // Log incoming request details
        console.log('Create Task Request:', {
            body: req.body,
            user: req.user
        });

        // Validate that user exists
        if (!req.user || !req.user._id) {
            console.error('No authenticated user found');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Task Creation Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, deadline, priority, status } = req.body;
        
        // Validate required fields
        if (!title) {
            console.error('Task Creation Error: Title is required');
            return res.status(400).json({ message: 'Title is required' });
        }

        const task = new Task({
            title,
            description: description || '',
            deadline: deadline || null,
            priority: priority || 'medium',
            status: status || 'pending',
            owner: req.user._id  // Explicitly set owner using _id from authenticated user
        });

        try {
            await task.save();
            console.log('Task Created Successfully:', task);
            res.status(201).json(task);
        } catch (saveError) {
            console.error('Task Save Error:', saveError);
            
            // More detailed error response
            res.status(500).json({ 
                message: 'Error saving task', 
                error: saveError.message,
                details: saveError.errors ? Object.keys(saveError.errors).map(key => ({
                    field: key,
                    message: saveError.errors[key].message
                })) : null
            });
        }
    } catch (error) {
        console.error('Task Creation Server Error:', error);
        res.status(500).json({ 
            message: 'Server error creating task', 
            error: error.message 
        });
    }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updates = Object.keys(req.body);
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
