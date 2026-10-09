'use strict';

const {
    getFabricContext
} = require('./fabricContext');

const {
    CHANNEL_NAME,
    CHAINCODE_NAME
} = require('./config/fabricConfig');

const organizations = require('./config/organizations');

const FABRIC_CHAINCODE_VERSION = '1.1';

/*
 * ============================================================
 * Helper
 * ============================================================
 */

async function checkOrganization(orgName) {
    let gateway;
    let client;

    const organization = organizations[orgName];

    if (!organization) {
        return {
            organization: orgName,
            mspId: null,
            status: 'UNKNOWN',
            error: 'Organization configuration not found.'
        };
    }

    try {
        const context = await getFabricContext(orgName);

        gateway = context.gateway;
        client = context.client;

        /*
         * GetAllDocuments is a read-only transaction.
         *
         * Successful evaluation proves that:
         * - identity is valid
         * - TLS connection works
         * - peer is reachable
         * - channel is available
         * - chaincode is installed/committed
         * - chaincode can execute
         */
        await context.contract.evaluateTransaction(
            'GetAllDocuments'
        );

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

        try {
            if (gateway) {
                gateway.close();
            }
        } catch (error) {
            // ignore close errors
        }

        try {
            if (client) {
                client.close();
            }
        } catch (error) {
            // ignore close errors
        }
    }
}


/*
 * ============================================================
 * NETWORK STATUS
 * ============================================================
 */

async function getNetworkStatus() {

    const orgNames = Object.keys(organizations);

    const organizationResults =
        await Promise.all(
            orgNames.map(checkOrganization)
        );

    const connectedCount =
        organizationResults.filter(
            org => org.status === 'CONNECTED'
        ).length;

    const networkOnline =
        connectedCount > 0;

    return {
        network: {
            name: 'Hyperledger Fabric',
            status: networkOnline
                ? 'ONLINE'
                : 'OFFLINE'
        },

        channel: {
            name: CHANNEL_NAME,
            status: networkOnline
                ? 'ACTIVE'
                : 'UNKNOWN'
        },

        chaincode: {
            name: CHAINCODE_NAME,
            version: FABRIC_CHAINCODE_VERSION,
            status: networkOnline
                ? 'ACTIVE'
                : 'UNKNOWN'
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
 * ============================================================
 * DOCUMENT ACTIVITY
 *
 * Reads actual blockchain history through Fabric.
 * ============================================================
 */

async function getBlockchainActivity() {

    const activity = [];

    /*
     * Query each organization.
     *
     * Because all peers maintain the ledger, the history
     * returned from a healthy peer can be used as blockchain
     * activity evidence.
     */

    for (const orgName of Object.keys(organizations)) {

        let gateway;
        let client;

        try {

            const context =
                await getFabricContext(orgName);

            gateway = context.gateway;
            client = context.client;

            const result =
                await context.contract.evaluateTransaction(
                    'GetAllDocuments'
                );

            const documents =
                JSON.parse(
                    Buffer
                        .from(result)
                        .toString('utf8')
                );

            /*
             * We intentionally do not fabricate transaction IDs
             * here.
             *
             * Transaction history is obtained separately through
             * GetDocumentHistory when a document is known.
             */

            for (const document of documents) {

                try {

                    const historyResult =
                        await context.contract.evaluateTransaction(
                            'GetDocumentHistory',
                            document.documentId
                        );

                    const history =
                        JSON.parse(
                            Buffer
                                .from(historyResult)
                                .toString('utf8')
                        );

                    for (const entry of history) {

                        activity.push({
                            documentId:
                                document.documentId,

                            title:
                                document.title || null,

                            organization:
                                orgName,

                            mspId:
                                organizations[orgName].mspId,

                            transactionId:
                                entry.txId || null,

                            timestamp:
                                entry.timestamp || null,

                            operation:
                                entry.operation ||
                                entry.event ||
                                'BLOCKCHAIN UPDATE',

                            status:
                                'RECORDED',

                            channel:
                                CHANNEL_NAME,

                            chaincode:
                                CHAINCODE_NAME,

                            value:
                                entry.value || null
                        });

                    }

                } catch (historyError) {

                    /*
                     * A history failure for one document should
                     * not prevent the rest of the dashboard from
                     * loading.
                     */

                    console.error(
                        `History error for ${document.documentId}:`,
                        historyError.message
                    );
                }
            }

        } catch (error) {

            console.error(
                `${orgName} activity error:`,
                error.message
            );

        } finally {

            try {
                if (gateway) {
                    gateway.close();
                }
            } catch (error) {}

            try {
                if (client) {
                    client.close();
                }
            } catch (error) {}
        }
    }

    /*
     * Remove duplicate transactions because the same ledger
     * exists on multiple peers.
     */

    const unique =
        new Map();

    for (const item of activity) {

        const key =
            item.transactionId
                ? item.transactionId
                : `${item.documentId}-${item.timestamp}`;

        if (!unique.has(key)) {
            unique.set(key, item);
        }
    }

    return Array
        .from(unique.values())
        .sort((a, b) => {

            const aTime =
                a.timestamp
                    ? new Date(a.timestamp).getTime()
                    : 0;

            const bTime =
                b.timestamp
                    ? new Date(b.timestamp).getTime()
                    : 0;

            return bTime - aTime;
        });
}


/*
 * ============================================================
 * SINGLE TRANSACTION
 * ============================================================
 */

async function getTransaction(txId) {

    if (!txId) {
        throw new Error(
            'Transaction ID is required.'
        );
    }

    const activity =
        await getBlockchainActivity();

    const transaction =
        activity.find(
            item =>
                item.transactionId === txId
        );

    if (!transaction) {

        throw new Error(
            'Transaction was not found in the available blockchain history.'
        );
    }

    return transaction;
}


/*
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {
    getNetworkStatus,
    getBlockchainActivity,
    getTransaction
};