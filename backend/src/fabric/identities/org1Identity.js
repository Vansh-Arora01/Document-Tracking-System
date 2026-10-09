'use strict';

const fs = require('fs');
const path = require('path');

const CUSTOM_NETWORK =
    '/workspaces/fabric-samples/test-network/custom-network';

const MSP_ID = 'Org1MSP';

const USER_NAME = 'User1@org1.example.com';

const USER_MSP_PATH = path.join(
    CUSTOM_NETWORK,
    'organizations',
    'peerOrganizations',
    'org1.example.com',
    'users',
    USER_NAME,
    'msp'
);

const CERT_PATH = path.join(
    USER_MSP_PATH,
    'signcerts',
    'User1@org1.example.com-cert.pem'
);

const KEY_PATH = path.join(
    USER_MSP_PATH,
    'keystore',
    'priv_sk'
);

function getOrg1Identity() {
    return {
        mspId: MSP_ID,
        credentials: fs.readFileSync(CERT_PATH)
    };
}

function getOrg1PrivateKey() {
    return fs.readFileSync(KEY_PATH);
}

module.exports = {
    getOrg1Identity,
    getOrg1PrivateKey
};