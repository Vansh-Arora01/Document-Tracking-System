'use strict';
const documentRoutes = require('./routes/documentRoutes');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
app.use('/api/documents', documentRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});