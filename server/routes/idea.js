import express from 'express';
import axios from 'axios'; // Import axios to make HTTP requests
import Idea from '../models/idea.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// --- API Routes for Ideas ---

/**
 * @route   POST /api/ideas
 * @desc    Create a new idea and trigger the analysis
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
    try {
        const newIdeaData = {
            ...req.body,
            userId: req.user.id
        };
        
        const newIdea = new Idea(newIdeaData);
        const savedIdea = await newIdea.save();

        // --- UPDATED LOGIC ---
        // Trigger the Flask analysis service asynchronously
        console.log(`Triggering Flask analysis for ID: ${savedIdea._id}`);
        
        // We use a .catch() here so that even if the Python server is down,
        // the user's idea is still saved and they get a successful response.
        axios.post('http://localhost:5002/analyze', {
            ideaId: savedIdea._id.toString()
        }).catch(err => {
            console.error("Error triggering Flask analysis service:", err.message);
            // Optionally, you could update the idea status to 'error' here
        });
        // --- END OF UPDATED LOGIC ---
        
        res.status(201).json({ message: 'Idea submitted successfully and is being processed.', ideaId: savedIdea._id });

    } catch (error) {
        console.error('Error submitting idea:', error);
        res.status(500).json({ message: 'Server error while submitting idea.' });
    }
});

/**
 * @route   GET /api/ideas/my-ideas
 * @desc    Get all ideas for the logged-in user
 * @access  Private
 */
router.get('/my-ideas', auth, async (req, res) => {
    try {
        const ideas = await Idea.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        console.error('Error fetching user ideas:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * @route   GET /api/ideas/:id
 * @desc    Get a specific idea by its ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        
        if (idea.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to view this idea.' });
        }
        
        res.json(idea);
    } catch (error) {
        console.error('Error fetching idea:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
