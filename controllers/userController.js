import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user (Owner)
export const registerUser = async (req, res) => {
    const { name, email, phone, password, pgName, pgAddress, pgCapacity } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            phone,
            password,
            pgName,
            pgAddress,
            pgCapacity,
        });

        // Save user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login a user (Owner)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role, pgName: user.pgName }, // Adding pgName here if needed in future for the front-end
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with a success message and the token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, pgName: user.pgName }, // Include owner details
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get user details (Owner)
export const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Assuming the userId is passed via JWT token
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

