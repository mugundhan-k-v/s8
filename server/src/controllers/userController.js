const User = require('../models/User');

const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (To be implemented)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('schoolId', 'name code');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Public (for initial setup) / Private
exports.createUser = async (req, res) => {
    const { name, email, password, role, schoolId, assignedClass } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            passwordHash: hashedPassword,
            role,
            schoolId,
            assignedClass,
        });

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
