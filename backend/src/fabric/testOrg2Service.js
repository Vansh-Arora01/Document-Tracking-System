'use strict';

const { getFabricContext } = require('./fabricContext');

async function main() {
    let connection;

    try {
        console.log('Connecting through backend Fabric context as Org2...');

        connection = await getFabricContext('Org2');

        const result =
            await connection.contract.evaluateTransaction(
                'ReadDocument',
                'DOC003'
            );

        console.log('\nDocument retrieved through Org2:');
        console.log(
            Buffer.from(result).toString('utf8')
        );

    } catch (error) {

        console.error(
            'Org2 service test failed:',
            error
        );

    } finally {

        if (connection) {
            connection.gateway.close();
            connection.client.close();
        }
    }
}

main();