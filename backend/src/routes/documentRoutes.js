'use strict';

const express = require('express');

const {
    getDocument,
    createDocument,
    updateDocument,
    transferDocument,
    archiveDocument,
    replaceDocument,
    verifyDocument,
    getDocumentHistory,
    getAllDocuments
} = require('../controllers/documentController');

const router = express.Router();

router.get('/:documentId', getDocument);
router.post('/', createDocument);
router.put('/:documentId', updateDocument);
router.post('/:documentId/transfer', transferDocument);
router.post('/:documentId/archive', archiveDocument);
router.post('/:documentId/replace', replaceDocument);
router.post('/:documentId/verify', verifyDocument);
router.get('/:documentId/history', getDocumentHistory);
router.get('/', getAllDocuments);
module.exports = router;