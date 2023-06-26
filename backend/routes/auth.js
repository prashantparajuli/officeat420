require('dotenv/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      // If user does not exist, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If passwords don't match, return an error
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.KEY);
  
      // Return the token and user data
      res.status(200).json({ token, user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the user with the same email already exists
      const existingUser = await User.findOne({ email });
  
      // If user already exists, return an error
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Create a JWT token
      const token = jwt.sign({ userId: newUser._id }, 'your-secret-key');
  
      // Return the token and user data
      res.status(201).json({ token, user: newUser });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  module.exports = router;