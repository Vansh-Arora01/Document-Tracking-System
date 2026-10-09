'use strict';

const {
    getFabricContext
} = require('../fabric/fabricContext');

const {
    CHANNEL_NAME,
    CHAINCODE_NAME
} = require('../fabric/config/fabricConfig');

const organizations = require('../fabric/config/organizations');

const FABRIC_CHAINCODE_VERSION = '1.1';

/*
 * Convert Fabric transaction results into JavaScript values.
 */
function parseResult(result) {
    if (!result || result.length === 0) {
        return null;
    }

    return JSON.parse(Buffer.from(result).toString('utf8'));
}

/*
 * Close Fabric resources safely.
 */
function closeContext(context) {
    if (!context) return;

    try {
        context.gateway?.close();
    } catch (error) {
        // Ignore gateway close errors.
    }

    try {
        context.client?.close();
    } catch (error) {
        // Ignore client close errors.
    }
}

/*
 * Check whether an organization can query its peer.
 */
async function checkOrganization(orgName) {
    const organization = organizations[orgName];

    if (!organization) {
        return {
            organization: orgName,
            mspId: null,
            status: 'UNKNOWN',
            error: 'Organization configuration not found.'
        };
    }

    let context;

    try {
        context = await getFabricContext(orgName);

        // A successful ledger query verifies peer connectivity
        // and chaincode availability.
        await context.contract.evaluateTransaction('GetAllDocuments');

        return {
            organization: orgName,
            mspId: organization.mspId,
            peer: organization.peer.hostAlias,
            endpoint: organization.peer.endpoint,
            status: 'CONNECTED'
        };
    } catch (error) {
        return {
            organization: orgName,
            mspId: organization.mspId,
            peer: organization.peer.hostAlias,
            endpoint: organization.peer.endpoint,
            status: 'OFFLINE',
            error: error.message
        };
    } finally {
        closeContext(context);
    }
}

/*
 * Build network status information.
 */
async function buildNetworkStatus() {
    const orgNames = Object.keys(organizations);

    const organizationResults = await Promise.all(
        orgNames.map(checkOrganization)
    );

    const connectedCount = organizationResults.filter(
        org => org.status === 'CONNECTED'
    ).length;

    const networkOnline = connectedCount > 0;

    return {
        network: {
            name: 'Hyperledger Fabric',
            status: networkOnline ? 'ONLINE' : 'OFFLINE'
        },

        channel: {
            name: CHANNEL_NAME,
            status: networkOnline ? 'ACTIVE' : 'UNKNOWN'
        },

        chaincode: {
            name: CHAINCODE_NAME,
            version: FABRIC_CHAINCODE_VERSION,
            status: networkOnline ? 'ACTIVE' : 'UNKNOWN'
        },

        organizations: organizationResults,

        orderingService: {
            type: 'Raft',
            nodes: [
                {
                    name: 'orderer1.org1.example.com',
                    endpoint: 'localhost:7050',
                    status: 'CONFIGURED'
                },
                {
                    name: 'orderer2.org2.example.com',
                    endpoint: 'localhost:8050',
                    status: 'CONFIGURED'
                },
                {
                    name: 'orderer3.org3.example.com',
                    endpoint: 'localhost:9050',
                    status: 'CONFIGURED'
                }
            ]
        },

        summary: {
            organizations: organizationResults.length,
            connectedOrganizations: connectedCount,
            totalOrderers: 3,
            consensus: 'Raft'
        },

        checkedAt: new Date().toISOString()
    };
}

/*
 * Read actual document history from the Fabric ledger.
 */
async function buildBlockchainActivity() {
    const activity = [];
    let context;

    try {
        let selectedOrg = null;

        // Select the first organization with a working peer.
        for (const orgName of Object.keys(organizations)) {
            let candidate;

            try {
                candidate = await getFabricContext(orgName);

                const result = await candidate.contract.evaluateTransaction(
                    'GetAllDocuments'
                );

                context = candidate;
                selectedOrg = orgName;

                // Keep the successful query result for reuse.
                var documents = parseResult(result) || [];
                break;
            } catch (error) {
                console.error(
                    `${orgName} activity connection failed:`,
                    error.message
                );

                closeContext(candidate);
            }
        }

        if (!context || !selectedOrg) {
            throw new Error(
                'No Fabric peer is currently available for blockchain activity.'
            );
        }

        for (const document of documents) {
            try {
                const historyResult =
                    await context.contract.evaluateTransaction(
                        'GetDocumentHistory',
                        document.documentId
                    );

                const history = parseResult(historyResult) || [];

                for (const entry of history) {
                    activity.push({
                        documentId: document.documentId,
                        title: document.title || null,
                        organization: selectedOrg,
                        mspId: organizations[selectedOrg].mspId,
                        transactionId: entry.txId || null,
                        timestamp: entry.timestamp || null,
                        operation:
                            entry.operation ||
                            entry.event ||
                            'BLOCKCHAIN UPDATE',
                        status: 'RECORDED',
                        channel: CHANNEL_NAME,
                        chaincode: CHAINCODE_NAME,
                        value: entry.value || null
                    });
                }
            } catch (historyError) {
                console.error(
                    `History error for ${document.documentId}:`,
                    historyError.message
                );
            }
        }
    } finally {
        closeContext(context);
    }

    // Remove duplicate transactions.
    const unique = new Map();

    for (const item of activity) {
        const key = item.transactionId ||
            `${item.documentId}-${item.timestamp}`;

        if (!unique.has(key)) {
            unique.set(key, item);
        }
    }

    // Return newest activity first.
    return Array.from(unique.values()).sort((a, b) => {
        const aTime = a.timestamp
            ? new Date(a.timestamp).getTime()
            : 0;

        const bTime = b.timestamp
            ? new Date(b.timestamp).getTime()
            : 0;

        return bTime - aTime;
    });
}

/*
 * Find a transaction in the available document history.
 */
async function buildTransaction(txId) {
    if (!txId) {
        throw new Error('Transaction ID is required.');
    }

    const activity = await buildBlockchainActivity();

    const transaction = activity.find(
        item => item.transactionId === txId
    );

    if (!transaction) {
        throw new Error(
            'Transaction was not found in the available blockchain history.'
        );
    }

    return transaction;
}

/*
 * Express route handlers.
 */
async function getNetworkStatus(req, res) {
    try {
        const data = await buildNetworkStatus();

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Network status error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getBlockchainActivity(req, res) {
    try {
        const data = await buildBlockchainActivity();

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Blockchain activity error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getTransaction(req, res) {
    try {
        const data = await buildTransaction(req.params.txId);

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getNetworkStatus,
    getBlockchainActivity,
    getTransaction
};
