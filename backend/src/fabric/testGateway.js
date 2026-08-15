'use strict';

const { connectToFabric } = require('./gateway');

async function main() {
    let connection;

    try {
        console.log('Connecting to Hyperledger Fabric...');

        connection = await connectToFabric();

        console.log('Successfully connected to Fabric.');

        const result = await connection.contract.evaluateTransaction(
            'ReadDocument',
            'DOC003'
        );

        console.log('\nDocument retrieved from blockchain:\n');
       console.log(
    Buffer.from(result).toString('utf8')
);

    } catch (error) {
        console.error('\nFailed to connect/query Fabric:');
        console.error(error);

        process.exitCode = 1;

    } finally {
        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

main();