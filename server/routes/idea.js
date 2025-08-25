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
        axios.post(`${process.env.FLASK_API_URL}/analyze`, {
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

router.delete('/:id', auth, async (req, res) => {
    try {
        // Find the idea by its ID
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }

        // Ensure the user owns the idea
        if (idea.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this idea.' });
        }

        // Delete the idea
        await idea.deleteOne();

        res.json({ message: 'Idea removed successfully.' });

    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ message: 'Server error while deleting idea.' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        // Find the idea by its ID
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found.' });
        }

        // Ensure the user owns the idea
        if (idea.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to edit this idea.' });
        }

        // Update the idea with the new data from the request body
        const updatedIdea = await Idea.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // This option returns the document after it has been updated
        );
        
        // Optional: If you want to re-trigger analysis after an edit,
        // you can call your Flask service again here.
        // For now, we'll just save the changes.

        res.json({ message: 'Idea updated successfully.', idea: updatedIdea });

    } catch (error) {
        console.error('Error updating idea:', error);
        res.status(500).json({ message: 'Server error while updating idea.' });
    }
});

export default router;
