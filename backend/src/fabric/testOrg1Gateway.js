'use strict';

const {
    connectToFabric
} = require('./gateway');

const {
    getOrg1Identity,
    getOrg1PrivateKey
} = require('./identities/org1Identity');

async function main() {
    let connection;

    try {
        console.log('Connecting as Org1...');

        const identity = getOrg1Identity();
        const privateKeyPem = getOrg1PrivateKey();

        connection = await connectToFabric({
            orgName: 'Org1',
            identity,
            privateKeyPem
        });

        console.log('Successfully connected as Org1.');

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
        console.error('\nOrg1 Gateway test failed:');
        console.error(error);

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

main();