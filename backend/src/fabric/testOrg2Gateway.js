'use strict';

const {
    connectToFabric
} = require('./gateway');

const {
    getOrg2Identity,
    getOrg2PrivateKey
} = require('./identities/org2Identity');

async function main() {
    let connection;

    try {
        console.log('Connecting as Org2...');

        const identity = getOrg2Identity();
        const privateKeyPem = getOrg2PrivateKey();

        connection = await connectToFabric({
            orgName: 'Org2',
            identity,
            privateKeyPem
        });

        console.log('Successfully connected as Org2.');

        const result =
            await connection.contract.evaluateTransaction(
                'ReadDocument',
                'DOC003'
            );

        console.log('\nDocument retrieved:');
        console.log(
            Buffer.from(result).toString('utf8')
        );

    } catch (error) {
        console.error('\nOrg2 Gateway test failed:');
        console.error(error);

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

main();