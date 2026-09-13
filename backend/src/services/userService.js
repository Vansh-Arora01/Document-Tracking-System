'use strict';

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const SALT_ROUNDS = 12;

/**
 * Create a new application user.
 *
 * The organization and role are supplied by trusted
 * server-side code, not by an unauthenticated client.
 */
async function createUser({
    name,
    email,
    password,
    organization,
    role = 'USER'
}) {
    if (!name || !email || !password || !organization) {
        throw new Error(
            'Name, email, password and organization are required'
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        throw new Error(
            `User already exists with email: ${normalizedEmail}`
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        organization,
        role
    });

    return user;
}

module.exports = {
    createUser
};