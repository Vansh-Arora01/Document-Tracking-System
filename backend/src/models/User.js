'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must contain at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters']
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                'Please provide a valid email address'
            ]
        },

        passwordHash: {
            type: String,
            required: [true, 'Password hash is required']
        },

        organization: {
            type: String,
            required: [true, 'Organization is required'],
             enum: ['Org1', 'Org2', 'Org3'],
            message: 'Organization must be either Org1, Org2, or Org3'
        },

        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['ADMIN', 'USER'],
                message: 'Role must be either ADMIN or USER'
            },
            default: 'USER'
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;