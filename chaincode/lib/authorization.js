'use strict';

function getCallerMSP(ctx) {
    return ctx.clientIdentity.getMSPID();
}

function requireOrg1(ctx) {
    const msp = getCallerMSP(ctx);

    if (msp !== 'Org1MSP') {
        throw new Error(
            `Unauthorized. This operation requires Org1MSP. Caller: ${msp}`
        );
    }
}

function requireOrg1OrOrg2(ctx) {
    const msp = getCallerMSP(ctx);

    if (msp !== 'Org1MSP' && msp !== 'Org2MSP') {
        throw new Error(
            `Unauthorized organization: ${msp}`
        );
    }
}

module.exports = {
    getCallerMSP,
    requireOrg1,
    requireOrg1OrOrg2
};