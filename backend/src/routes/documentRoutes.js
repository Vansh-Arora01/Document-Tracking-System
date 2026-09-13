'use strict';

const express = require('express');

const upload = require('../middleware/upload');

const { authenticateToken } =
    require('../middleware/authMiddleware');

const {
    getDocument,
    createDocument,
    updateDocument,
    transferDocument,
    archiveDocument,
    replaceDocument,
    verifyDocument,
    getDocumentHistory,
    getAllDocuments,
    uploadDocument
} = require('../controllers/documentController');

const router = express.Router();

/*
 * All document APIs require authentication.
 */
router.use(authenticateToken);

/*
 * Upload PDF
 */
router.post(
    '/upload',
    upload.single('file'),
    uploadDocument
);

/*
 * Read single document
 */
router.get(
    '/:documentId',
    getDocument
);

/*
 * Create document
 */
router.post(
    '/',
    createDocument
);

/*
 * Update document
 */
router.put(
    '/:documentId',
    updateDocument
);

/*
 * Transfer document
 */
router.post(
    '/:documentId/transfer',
    transferDocument
);

/*
 * Archive document
 */
router.post(
    '/:documentId/archive',
    archiveDocument
);

/*
 * Replace document
 */
router.post(
    '/:documentId/replace',
    upload.single('file'),
    replaceDocument
)

/*
 * Verify document
 */
router.post(
    '/:documentId/verify',
    verifyDocument
);

/*
 * Document history
 */
router.get(
    '/:documentId/history',
    getDocumentHistory
);

/*
 * Get all documents
 */
router.get(
    '/',
    getAllDocuments
);

module.exports = router;