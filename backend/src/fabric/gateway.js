




'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const grpc = require('@grpc/grpc-js');

const {
    connect,
    signers
} = require('@hyperledger/fabric-gateway');

const organizations = require('./config/organizations');
const {
    CHANNEL_NAME,
    CHAINCODE_NAME,
    CUSTOM_NETWORK
} = require('./config/fabricConfig');


function getTLSCertPath(orgName) {

    const org = organizations[orgName];

    if (!org) {
        throw new Error(
            `Unknown organization: ${orgName}`
        );
    }

    return path.join(
        CUSTOM_NETWORK,
        'organizations',
        'peerOrganizations',
        org.domain,
        'peers',
        `peer0.${org.domain}`,
        'tls',
        'ca.crt'
    );
}


function createGrpcConnection(orgName) {

    const org = organizations[orgName];

    if (!org) {
        throw new Error(
            `Unknown organization: ${orgName}`
        );
    }

    const tlsCertPath =
        getTLSCertPath(orgName);

    const tlsRootCert =
        fs.readFileSync(tlsCertPath);

    const credentials =
        grpc.credentials.createSsl(
            tlsRootCert
        );

    return new grpc.Client(
        org.peer.endpoint,
        credentials,
        {
            'grpc.ssl_target_name_override':
                org.peer.hostAlias,

            'grpc.default_authority':
                org.peer.hostAlias
        }
    );
}


function createGatewayIdentity(identity) {

    if (!identity || !identity.mspId) {
        throw new Error(
            'Valid Fabric identity is required'
        );
    }

    return {
        mspId: identity.mspId,
        credentials: identity.credentials
    };
}


function createSigner(privateKeyPem) {

    const privateKey =
        crypto.createPrivateKey(
            privateKeyPem
        );

    return signers.newPrivateKeySigner(
        privateKey
    );
}


async function connectToFabric({
    orgName,
    identity,
    privateKeyPem
}) {

    if (!orgName) {
        throw new Error(
            'orgName is required'
        );
    }

    if (!identity) {
        throw new Error(
            'identity is required'
        );
    }

    if (!privateKeyPem) {
        throw new Error(
            'privateKeyPem is required'
        );
    }

    const client =
        createGrpcConnection(orgName);

    const gateway =
        connect({
            client,

            identity:
                createGatewayIdentity(identity),

            signer:
                createSigner(privateKeyPem),

            evaluateOptions: () => ({
                deadline:
                    Date.now() + 5000
            }),

            endorseOptions: () => ({
                deadline:
                    Date.now() + 15000
            }),

            submitOptions: () => ({
                deadline:
                    Date.now() + 15000
            }),

            commitStatusOptions: () => ({
                deadline:
                    Date.now() + 15000
            })
        });

    const network =
        gateway.getNetwork(
            CHANNEL_NAME
        );

    const contract =
        network.getContract(
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