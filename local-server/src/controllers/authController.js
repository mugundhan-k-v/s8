const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt for:', email);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found in Local DB');
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.passwordHash);

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret', // Use same secret as central or env
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token, user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        schoolId: user.schoolId
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['passwordHash'] }
        });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
