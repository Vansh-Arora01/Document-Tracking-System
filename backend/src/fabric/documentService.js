'use strict';

const { connectToFabric } = require('./gateway');

async function getDocument(documentId) {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.evaluateTransaction(
            'ReadDocument',
            documentId
        );

        const response = Buffer
            .from(result)
            .toString('utf8');

        return JSON.parse(response);

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}
async function createDocument(documentData) {
    let connection;

    try {
        connection = await connectToFabric();

        const documentJSON = JSON.stringify(documentData);

        const result = await connection.contract.submitTransaction(
            'CreateDocument',
            documentJSON
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

async function updateDocument(documentId, updates) {
    let connection;

    try {
        connection = await connectToFabric();

        const updateData = {
            documentId,
            ...updates
        };

        const result = await connection.contract.submitTransaction(
            'UpdateDocument',
            JSON.stringify(updateData)
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}
async function transferDocument(documentId, newOwner) {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.submitTransaction(
            'TransferDocument',
            documentId,
            newOwner
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

async function archiveDocument(documentId) {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.submitTransaction(
            'ArchiveDocument',
            documentId
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

async function replaceDocument(documentId, replacementData) {
    let connection;

    try {
        connection = await connectToFabric();

        const data = {
            documentId,
            ...replacementData
        };

        const result = await connection.contract.submitTransaction(
            'ReplaceDocument',
            JSON.stringify(data)
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

async function verifyDocument(documentId, documentHash) {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.evaluateTransaction(
            'VerifyDocument',
            documentId,
            documentHash
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}
async function getDocumentHistory(documentId) {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.evaluateTransaction(
            'GetDocumentHistory',
            documentId
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}
async function getAllDocuments() {
    let connection;

    try {
        connection = await connectToFabric();

        const result = await connection.contract.evaluateTransaction(
            'GetAllDocuments'
        );

        return JSON.parse(
            Buffer.from(result).toString('utf8')
        );

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
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