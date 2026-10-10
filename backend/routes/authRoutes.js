import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campusfind_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user & return JWT
router.post('/register', async (req, res) => {
  try {
    const { name, studentId, email, department, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide Name, Email, and Password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { studentId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or Student ID already exists' });
    }

    const user = await User.create({
      name,
      studentId: studentId || `STU-${Date.now().toString().slice(-6)}`,
      email: email.toLowerCase(),
      department: department || 'CSE',
      password,
      role: role || 'Student'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        department: user.department,
        role: user.role,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
router.post('/login', async (req, res) => {
  try {
    const { emailOrId, password } = req.body;

    if (!emailOrId || !password) {
      return res.status(400).json({ message: 'Please provide Email / Student ID and password' });
    }

    // Search by email or student ID
    const user = await User.findOne({
      $or: [{ email: emailOrId.toLowerCase() }, { studentId: emailOrId }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        department: user.department,
        role: user.role,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Check Email/Student ID and Password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { emailOrId } = req.body;
    if (!emailOrId) {
      return res.status(400).json({ message: 'Please provide Email or Student ID' });
    }

    const cleanInput = emailOrId.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanInput }, { studentId: emailOrId }]
    });

    if (!user) {
      return res.status(404).json({ message: 'No account found with that Email or Student ID' });
    }

    // Generate a 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      message: 'Password reset code generated successfully.',
      resetToken: resetToken,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using reset code
router.post('/reset-password', async (req, res) => {
  try {
    const { emailOrId, resetToken, newPassword } = req.body;

    if (!emailOrId || !resetToken || !newPassword) {
      return res.status(400).json({ message: 'Please provide Email/Student ID, Reset Code, and New Password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const cleanInput = emailOrId.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanInput }, { studentId: emailOrId }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    if (user.resetPasswordToken && user.resetPasswordToken !== resetToken) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Reset code expired. Please request a new code.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      message: 'Password reset successfully!',
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.studentId = req.body.studentId || user.studentId;
      user.department = req.body.department || user.department;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        studentId: updatedUser.studentId,
        email: updatedUser.email,
        department: updatedUser.department,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
