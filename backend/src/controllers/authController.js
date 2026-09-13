'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        // Do not reveal whether email exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // JWT secret must exist
        if (!process.env.JWT_SECRET) {
            throw new Error(
                'JWT_SECRET is not configured'
            );
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                organization: user.organization,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || '1h'
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                organization: user.organization,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            'Login error:',
            error.message
        );

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    login
};