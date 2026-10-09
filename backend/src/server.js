'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const { authorizeRoles } = require('./middleware/roleMiddleware');
const { authenticateToken } = require('./middleware/authMiddleware');
const blockchainRoutes = require('./routes/blockchainRoutes');

const { connectDatabase } = require('./config/database');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors());

app.use(express.json());

app.use('/api/blockchain', blockchainRoutes);

// Health check

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Document Tracking System backend is running'
    });
});

// Root route

app.get('/', (req, res) => {
    res.json({
        message: 'Document Tracking System API'
    });
});

// auth routes
app.use('/api/auth', authRoutes);
// Document routes
app.use('/api/documents', documentRoutes);

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// Start server

async function startServer() {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(
            `Backend server running on port ${PORT}`
        );
    });
}

startServer();