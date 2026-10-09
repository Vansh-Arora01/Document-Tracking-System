'use strict';

const { Contract } = require('fabric-contract-api');
// const {
//     requireOrg1,
//     requireOrg1OrOrg2
// } = require('./authorization');

class DocumentContract extends Contract {

    async CreateDocument(ctx, documentJSON) {

        // requireOrg1(ctx);

    // -----------------------------
    // Step 1 : Parse incoming JSON
    // -----------------------------
    let document;

    try {
        document = JSON.parse(documentJSON);
    } catch (error) {
        throw new Error("Invalid JSON format.");
    }

    // -----------------------------
    // Step 2 : Validate required fields
    // -----------------------------
    const requiredFields = [
        "documentId",
        "title",
        "documentHash",
        "owner",
        "department",
        "fileName",
        "mimeType"
    ];

    for (const field of requiredFields) {
        if (!document[field]) {
            throw new Error(`${field} is required.`);
        }
    }

    // -----------------------------
    // Step 3 : Check if document already exists
    // -----------------------------
    const existingDocument = await ctx.stub.getState(document.documentId);

    if (existingDocument.length > 0) {
        throw new Error(
            `Document ${document.documentId} already exists.`
        );
    }

    // -----------------------------
    // Step 4 : Get transaction timestamp
    // -----------------------------
    const txTimestamp = ctx.stub.getTxTimestamp();

    const createdAt = new Date(
        txTimestamp.seconds.low * 1000
    ).toISOString();

    // -----------------------------
    // Step 5 : Get creator identity
    // -----------------------------
    const createdBy = ctx.clientIdentity.getMSPID();

    // (Later we'll improve this to use Fabric CA attributes.)

    // -----------------------------
    // Step 6 : Create final blockchain asset
    // -----------------------------
    const documentAsset = {

        documentId: document.documentId,

        title: document.title,

        description: document.description || "",

        documentHash: document.documentHash,

        owner: document.owner,

        department: document.department,

        fileName: document.fileName,

        mimeType: document.mimeType,

        status: "ACTIVE",

        metadata: document.metadata || {},

        createdBy: createdBy,

        createdAt: createdAt,

        updatedAt: createdAt
    };

    // -----------------------------
    // Step 7 : Store on blockchain
    // -----------------------------
    await ctx.stub.putState(
        documentAsset.documentId,
        Buffer.from(JSON.stringify(documentAsset))
    );

    // -----------------------------
    // Step 8 : Return created asset
    // -----------------------------
    return JSON.stringify(documentAsset);
}

async DocumentExists(ctx, documentId) {     
    // requireOrg1OrOrg2(ctx);
    const documentBytes = await ctx.stub.getState(documentId);

    return documentBytes.length > 0;
}
async ReadDocument(ctx, documentId) {
    // requireOrg1OrOrg2(ctx);

    const documentBytes = await ctx.stub.getState(documentId);

    if (documentBytes.length === 0) {
        throw new Error(`Document ${documentId} does not exist.`);
    }

    return documentBytes.toString();
}
async UpdateDocument(ctx, documentJSON) {
    // requireOrg1(ctx);

    let updates;

    try {
        updates = JSON.parse(documentJSON);
    } catch (error) {
        throw new Error("Invalid JSON format.");
    }

    if (!updates.documentId) {
        throw new Error("documentId is required.");
    }

    const documentBytes = await ctx.stub.getState(
        updates.documentId
    );

    if (documentBytes.length === 0) {
        throw new Error(
            `Document ${updates.documentId} does not exist.`
        );
    }

    const document = JSON.parse(
        documentBytes.toString()
    );

    if (updates.title !== undefined) {
        document.title = updates.title;
    }

    if (updates.description !== undefined) {
        document.description = updates.description;
    }

    if (updates.department !== undefined) {
        document.department = updates.department;
    }

    if (updates.metadata !== undefined) {
        document.metadata = updates.metadata;
    }

    const txTimestamp = ctx.stub.getTxTimestamp();

    const updatedAt = new Date(
        Number(txTimestamp.seconds) * 1000
    ).toISOString();

    document.updatedAt = updatedAt;

    await ctx.stub.putState(
        document.documentId,
        Buffer.from(JSON.stringify(document))
    );

    return JSON.stringify(document);
}

async TransferDocument(ctx, documentId, newOwner) {
    // requireOrg1(ctx);

    if (!documentId) {
        throw new Error("documentId is required.");
    }

    if (!newOwner) {
        throw new Error("newOwner is required.");
    }

    const documentBytes = await ctx.stub.getState(documentId);

    if (documentBytes.length === 0) {
        throw new Error(
            `Document ${documentId} does not exist.`
        );
    }

    const document = JSON.parse(
        documentBytes.toString()
    );

    if (document.status === "ARCHIVED") {
        throw new Error(
            `Document ${documentId} is archived and cannot be transferred.`
        );
    }

    document.owner = newOwner;

    const txTimestamp = ctx.stub.getTxTimestamp();

    const updatedAt = new Date(
        Number(txTimestamp.seconds) * 1000
    ).toISOString();

    document.updatedAt = updatedAt;

    await ctx.stub.putState(
        document.documentId,
        Buffer.from(JSON.stringify(document))
    );

    return JSON.stringify(document);
}
async VerifyDocument(ctx, documentId, providedHash) {
    // requireOrg1OrOrg2(ctx);

    if (!documentId) {
        throw new Error("documentId is required.");
    }

    if (!providedHash) {
        throw new Error("providedHash is required.");
    }

    const documentBytes = await ctx.stub.getState(documentId);

    if (documentBytes.length === 0) {
        throw new Error(
            `Document ${documentId} does not exist.`
        );
    }

    const document = JSON.parse(
        documentBytes.toString()
    );

    const isValid =
        document.documentHash === providedHash;

    return JSON.stringify({
        documentId: document.documentId,
        valid: isValid,
        storedHash: document.documentHash,
        providedHash: providedHash
    });
}

async ArchiveDocument(ctx, documentId) {
    // requireOrg1(ctx);
    if (!documentId) {
        throw new Error("documentId is required.");
    }

    const documentBytes = await ctx.stub.getState(documentId);

    if (documentBytes.length === 0) {
        throw new Error(
            `Document ${documentId} does not exist.`
        );
    }

    const document = JSON.parse(
        documentBytes.toString()
    );

    if (document.status === "ARCHIVED") {
        throw new Error(
            `Document ${documentId} is already archived.`
        );
    }

    document.status = "ARCHIVED";

    const txTimestamp = ctx.stub.getTxTimestamp();

    const updatedAt = new Date(
        Number(txTimestamp.seconds) * 1000
    ).toISOString();

    document.updatedAt = updatedAt;

    await ctx.stub.putState(
        document.documentId,
        Buffer.from(JSON.stringify(document))
    );

    return JSON.stringify(document);
}

async GetDocumentHistory(ctx, documentId) {
    // requireOrg1OrOrg2(ctx);
    if (!documentId) {
        throw new Error("documentId is required.");
    }

    const historyIterator =
        await ctx.stub.getHistoryForKey(documentId);

    const history = [];

    while (true) {

        const response = await historyIterator.next();

        if (response.value) {

            const record = {
                txId: response.value.txId,
                timestamp: null,
                isDelete: response.value.isDelete
            };

            if (response.value.timestamp) {

                const timestamp =
                    response.value.timestamp;

                record.timestamp =
                    new Date(
                        Number(timestamp.seconds) * 1000
                    ).toISOString();
            }

            if (!response.value.isDelete) {

                record.value =
                    JSON.parse(
                        response.value.value.toString()
                    );
            }

            history.push(record);
        }

        if (response.done) {
            await historyIterator.close();
            break;
        }
    }

    return JSON.stringify(history);
}
async GetAllDocuments(ctx) {
    // requireOrg1OrOrg2(ctx);
    const iterator =
        await ctx.stub.getStateByRange('', '');

    const documents = [];

    while (true) {

        const response = await iterator.next();

        if (response.value) {

            const document =
                JSON.parse(
                    response.value.value.toString()
                );

            documents.push(document);
        }

        if (response.done) {
            await iterator.close();
            break;
        }
    }

    return JSON.stringify(documents);
}
async ReplaceDocument(ctx, documentJSON) {
    // requireOrg1(ctx);
    let replacement;

    try {
        replacement = JSON.parse(documentJSON);
    } catch (error) {
        throw new Error("Invalid JSON format.");
    }

    if (!replacement.documentId) {
        throw new Error("documentId is required.");
    }

    if (!replacement.newHash) {
        throw new Error("newHash is required.");
    }

    const documentBytes = await ctx.stub.getState(
        replacement.documentId
    );

    if (documentBytes.length === 0) {
        throw new Error(
            `Document ${replacement.documentId} does not exist.`
        );
    }

    const document = JSON.parse(
        documentBytes.toString()
    );

    if (document.status === "ARCHIVED") {
        throw new Error(
            `Document ${replacement.documentId} is archived and cannot be replaced.`
        );
    }

    if (document.documentHash === replacement.newHash) {
        throw new Error(
            "New document hash must be different from the current hash."
        );
    }

    const txTimestamp = ctx.stub.getTxTimestamp();

    const timestamp = new Date(
        Number(txTimestamp.seconds) * 1000
    ).toISOString();

    /*
     * Initialize version history for older documents.
     */
    if (!document.currentVersion) {

        document.currentVersion = 1;

        document.versions = [
            {
                version: 1,
                hash: document.documentHash,
                createdBy: document.createdBy,
                createdAt: document.createdAt
            }
        ];
    }

    const newVersion =
        document.currentVersion + 1;

    document.versions.push({
        version: newVersion,
        hash: replacement.newHash,
        createdBy: ctx.clientIdentity.getMSPID(),
        createdAt: timestamp
    });

    document.currentVersion = newVersion;

    document.documentHash =
        replacement.newHash;

    document.updatedAt = timestamp;

    if (replacement.fileName !== undefined) {
        document.fileName = replacement.fileName;
    }

    if (replacement.mimeType !== undefined) {
        document.mimeType = replacement.mimeType;
    }

    await ctx.stub.putState(
        document.documentId,
        Buffer.from(JSON.stringify(document))
    );

    return JSON.stringify(document);
}


}

module.exports = DocumentContract;