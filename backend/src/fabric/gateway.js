'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const grpc = require('@grpc/grpc-js');

const {
    connect,
    signers
} = require('@hyperledger/fabric-gateway');

const TEST_NETWORK = '/workspaces/fabric-samples/test-network';

const MSP_ID = 'Org1MSP';
const CHANNEL_NAME = 'mychannel';
const CHAINCODE_NAME = 'documentcc';

const PEER_ENDPOINT = 'localhost:7051';
const PEER_HOST_ALIAS = 'peer0.org1.example.com';

const CERT_PATH = path.join(
    TEST_NETWORK,
    'organizations',
    'peerOrganizations',
    'org1.example.com',
    'users',
    'Admin@org1.example.com',
    'msp',
    'signcerts',
    'Admin@org1.example.com-cert.pem'
);

const KEY_PATH = path.join(
    TEST_NETWORK,
    'organizations',
    'peerOrganizations',
    'org1.example.com',
    'users',
    'Admin@org1.example.com',
    'msp',
    'keystore',
    'priv_sk'
);

const TLS_CERT_PATH = path.join(
    TEST_NETWORK,
    'organizations',
    'peerOrganizations',
    'org1.example.com',
    'peers',
    'peer0.org1.example.com',
    'tls',
    'ca.crt'
);

function newGrpcConnection() {
    const tlsRootCert = fs.readFileSync(TLS_CERT_PATH);

    const credentials = grpc.credentials.createSsl(
        tlsRootCert
    );

    return new grpc.Client(
        PEER_ENDPOINT,
        credentials,
        {
            'grpc.ssl_target_name_override': PEER_HOST_ALIAS,
            'grpc.default_authority': PEER_HOST_ALIAS
        }
    );
}

function newIdentity() {
    const credentials = fs.readFileSync(
        CERT_PATH
    );

    return {
        mspId: MSP_ID,
        credentials
    };
}

function newSigner() {
    const privateKeyPem = fs.readFileSync(
        KEY_PATH
    );

    const privateKey = crypto.createPrivateKey(
        privateKeyPem
    );

    return signers.newPrivateKeySigner(
        privateKey
    );
}

async function connectToFabric() {

    const client = newGrpcConnection();

    const gateway = connect({
        client,
        identity: newIdentity(),
        signer: newSigner(),
        evaluateOptions: () => {
            return {
                deadline: Date.now() + 5000
            };
        },
        endorseOptions: () => {
            return {
                deadline: Date.now() + 15000
            };
        },
        submitOptions: () => {
            return {
                deadline: Date.now() + 15000
            };
        },
        commitStatusOptions: () => {
            return {
                deadline: Date.now() + 15000
            };
        }
    });

    const network = gateway.getNetwork(
        CHANNEL_NAME
    );

    const contract = network.getContract(
        CHAINCODE_NAME
    );

    return {
        client,
        gateway,
        network,
        contract
    };
}

module.exports = {
    connectToFabric
};