const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'supersecretkey_change_in_production',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Quick helper to seed an admin if none exists
exports.seedAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: 'sakthivelk8340@gmail.com' });
    if (adminExists) {
      return res.json({ message: 'Admin already exists' });
    }
    const admin = new User({
      email: 'sakthivelk8340@gmail.com',
      password: '#Manikandan',
      name: 'Admin'
    });
    await admin.save();
    res.json({ message: 'Admin created. Email: sakthivelk8340@gmail.com' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding admin' });
  }
};
