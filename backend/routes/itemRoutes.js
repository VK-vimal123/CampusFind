import express from 'express';
import Item from '../models/Item.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/items/upload
// @desc    Upload an item image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }
  const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
  res.json({ imageUrl, filename: req.file.filename });
});

// @route   GET /api/items
// @desc    Get all lost and found items with search & filter parameters
router.get('/', async (req, res) => {
  try {
    const { type, search, category, location, date, status } = req.query;
    let query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { category: searchRegex }
      ];
    }

    const items = await Item.find(query)
      .populate('reportedBy', 'name email role department regNo avatar')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/items/my-reports
// @desc    Get items reported by current logged in user
router.get('/my-reports', protect, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name email role department regNo avatar')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item details
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'reportedBy',
      'name email role department regNo avatar'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/items/lost
// @desc    Report a lost item
router.post('/lost', protect, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      date,
      time,
      image,
      contactName,
      contactEmail,
      contactPhone
    } = req.body;

    const item = new Item({
      title,
      type: 'lost',
      category,
      description,
      location,
      date,
      time,
      image: image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
      status: 'Searching',
      reportedBy: req.user._id,
      contactName: contactName || req.user.name,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || '+91 98765 43210'
    });

    const createdItem = await item.save();
    const populated = await createdItem.populate('reportedBy', 'name email role department regNo avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/items/found
// @desc    Report a found item
router.post('/found', protect, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      date,
      time,
      image,
      contactName,
      contactEmail,
      contactPhone
    } = req.body;

    const item = new Item({
      title,
      type: 'found',
      category,
      description,
      location,
      date,
      time,
      image: image || 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      status: 'Reported',
      reportedBy: req.user._id,
      contactName: contactName || req.user.name,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || '+91 98123 45678'
    });

    const createdItem = await item.save();
    const populated = await createdItem.populate('reportedBy', 'name email role department regNo avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/items/:id/status
// @desc    Update item status (e.g., Returned, Searching, Verified)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status || item.status;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/items/:id/claim
// @desc    Submit a claim message on an item
router.post('/:id/claim', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const newClaim = {
      claimant: req.user._id,
      claimantName: req.user.name,
      claimantEmail: req.user.email,
      message: message || 'I believe this item belongs to me.',
      createdAt: new Date()
    };

    item.claims.push(newClaim);
    item.status = 'Contacted';
    await item.save();

    res.status(201).json({ message: 'Claim request submitted successfully', claims: item.claims });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
