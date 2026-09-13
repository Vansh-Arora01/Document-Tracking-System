'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const User = require('../models/User');

const { createUser } = require('../services/userService');

async function createInitialUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                'MONGODB_URI is not defined in .env'
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to MongoDB');

        const users = [
            {
                name: 'Org1 Administrator',
                email: 'admin@org1.local',
                password: 'Org1Admin@123',
                organization: 'Org1',
                role: 'ADMIN'
            },
            {
                name: 'Org1 User',
                email: 'user@org1.local',
                password: 'Org1User@123',
                organization: 'Org1',
                role: 'USER'
            },
            {
                name: 'Org2 Administrator',
                email: 'admin@org2.local',
                password: 'Org2Admin@123',
                organization: 'Org2',
                role: 'ADMIN'
            },
            {
                name: 'Org2 User',
                email: 'user@org2.local',
                password: 'Org2User@123',
                organization: 'Org2',
                role: 'USER'
            }
        ];

        for (const userData of users) {
            try {
                const user = await createUser(userData);

                console.log(
                    `Created user: ${user.email} | ${user.organization} | ${user.role}`
                );

                console.log(
                    `MongoDB ID: ${user._id}`
                );
            } catch (error) {
                console.log(
                    `Skipped ${userData.email}: ${error.message}`
                );
            }
        }

        console.log('Initial user setup completed');
    } catch (error) {
        console.error(
            'Initial user setup failed:',
            error.message
        );

        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();

        console.log('MongoDB connection closed');
    }
}

createInitialUsers();