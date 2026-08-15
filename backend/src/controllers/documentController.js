'use strict';

const documentService = require('../fabric/documentService');

async function getDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const document =
            await documentService.getDocument(documentId);

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {

        console.error('Get document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function createDocument(req, res) {
    try {
        const documentData = req.body;

        if (!documentData.documentId) {
            return res.status(400).json({
                success: false,
                message: 'documentId is required'
            });
        }

        const document =
            await documentService.createDocument(documentData);

        return res.status(201).json({
            success: true,
            data: document
        });

    } catch (error) {

        console.error('Create document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function updateDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const document =
            await documentService.updateDocument(
                documentId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('Update document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function transferDocument(req, res) {
    try {
        const { documentId } = req.params;
        const { newOwner } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!newOwner) {
            return res.status(400).json({
                success: false,
                message: 'newOwner is required'
            });
        }

        const document =
            await documentService.transferDocument(
                documentId,
                newOwner
            );

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('Transfer document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function archiveDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const document =
            await documentService.archiveDocument(documentId);

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('Archive document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function replaceDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!req.body.newHash) {
            return res.status(400).json({
                success: false,
                message: 'newHash is required'
            });
        }

        const document =
            await documentService.replaceDocument(
                documentId,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {
        console.error('Replace document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function verifyDocument(req, res) {
    try {
        const { documentId } = req.params;
        const { documentHash } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!documentHash) {
            return res.status(400).json({
                success: false,
                message: 'documentHash is required'
            });
        }

        const result =
            await documentService.verifyDocument(
                documentId,
                documentHash
            );

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Verify document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function getDocumentHistory(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const history =
            await documentService.getDocumentHistory(
                documentId
            );

        return res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error('Get history error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
async function getAllDocuments(req, res) {
    try {
        const documents =
            await documentService.getAllDocuments();

        return res.status(200).json({
            success: true,
            data: documents
        });

    } catch (error) {
        console.error('Get all documents error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    getDocument,
    createDocument,
    updateDocument,
    transferDocument,
    archiveDocument,
    replaceDocument,
    verifyDocument,
    getDocumentHistory,
    getAllDocuments

};