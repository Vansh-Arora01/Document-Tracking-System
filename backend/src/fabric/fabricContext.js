'use strict';

const {
    connectToFabric
} = require('./gateway');

const {
    getOrg1Identity,
    getOrg1PrivateKey
} = require('./identities/org1Identity');

const {
    getOrg2Identity,
    getOrg2PrivateKey
} = require('./identities/org2Identity');
const {
    getOrg3Identity,
    getOrg3PrivateKey
} = require('./identities/org3Identity');


function getIdentityForOrganization(orgName) {

    switch (orgName) {

        case 'Org1':
            return {
                identity: getOrg1Identity(),
                privateKeyPem: getOrg1PrivateKey()
            };

        case 'Org2':
            return {
                identity: getOrg2Identity(),
                privateKeyPem: getOrg2PrivateKey()
            };
        case 'Org3':
            return {
                identity: getOrg3Identity(),
                privateKeyPem: getOrg3PrivateKey()
            };

        default:
            throw new Error(
                `Unsupported organization: ${orgName}`
            );
    }
}


async function getFabricContext(orgName) {

    if (!orgName) {
        throw new Error(
            'Organization is required'
        );
    }

    const {
        identity,
        privateKeyPem
    } = getIdentityForOrganization(orgName);

    const connection =
        await connectToFabric({
            orgName,
            identity,
            privateKeyPem
        });

    return connection;
}


module.exports = {
    getFabricContext
};