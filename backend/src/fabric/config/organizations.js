'use strict';

const organizations = {
    Org1: {
        name: 'Org1',
        mspId: 'Org1MSP',
        domain: 'org1.example.com',
        peer: {
            endpoint: 'localhost:7051',
            hostAlias: 'peer0.org1.example.com'
        }
    },

    Org2: {
        name: 'Org2',
        mspId: 'Org2MSP',
        domain: 'org2.example.com',
        peer: {
            endpoint: 'localhost:8051',
            hostAlias: 'peer0.org2.example.com'
        }
    },

    Org3: {
        name: 'Org3',
        mspId: 'Org3MSP',
        domain: 'org3.example.com',
        peer: {
            endpoint: 'localhost:9051',
            hostAlias: 'peer0.org3.example.com'
        }
    }
};

module.exports = organizations;