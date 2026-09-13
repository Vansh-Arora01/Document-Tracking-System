'use strict';

const { getFabricContext } = require('./fabricContext');


async function getDocument(documentId, organization = 'Org1') {
    let connection;

    try {
        connection = await getFabricContext(organization);

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


async function createDocument(documentData, organization) {
    let connection;
    if (!organization) {
    throw new Error('Organization is required');
}

    try {
        connection = await getFabricContext(organization);

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


async function updateDocument(documentId, updates, organization) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

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


async function transferDocument(documentId, newOwner, organization) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

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


async function archiveDocument(documentId, organization) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

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


async function replaceDocument(
    documentId,
    replacementData,
    organization
) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

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


async function verifyDocument(
    documentId,
    documentHash,
    organization
) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

        const result =
            await connection.contract.evaluateTransaction(
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


async function getDocumentHistory(
    documentId,
    organization
) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

        const result =
            await connection.contract.evaluateTransaction(
                'GetDocumentHistory',
                documentId
            );

        const response =
            Buffer.from(result).toString('utf8');

        return JSON.parse(response);

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}


async function getAllDocuments(organization) {
    let connection;

    if (!organization) {
        throw new Error('Organization is required');
    }

    try {
        connection = await getFabricContext(organization);

        const result =
            await connection.contract.evaluateTransaction(
                'GetAllDocuments'
            );

        const response =
            Buffer.from(result).toString('utf8');

        return JSON.parse(response);

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