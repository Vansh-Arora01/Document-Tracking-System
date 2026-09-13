// 'use strict';

// const documentService = require('../fabric/documentService');

// const {
//     processDocument
// } = require('../utils/documentProcessor');

// async function getDocument(req, res) {
//     try {
//         const { documentId } = req.params;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }

//         const organization =
//     req.headers['x-organization'] || 'Org1';

// const document =
//     await documentService.getDocument(
//         documentId,
//         organization
//     );

//         return res.status(200).json({
//             success: true,
//             data: document
//         });

//     } catch (error) {

//         console.error('Get document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// async function createDocument(req, res) {
//     try {
//         const documentData = req.body;

//         if (!documentData.documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'documentId is required'
//             });
//         }
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const document =
//             await documentService.createDocument(documentData, organization);

//         return res.status(201).json({
//             success: true,
//             data: document
//         });

//     } catch (error) {

//         console.error('Create document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function updateDocument(req, res) {
//     try {
//         const { documentId } = req.params;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }


//         const document =
//             await documentService.updateDocument(
//                 documentId,
//                 req.body,
//                 organization
//             );

//         return res.status(200).json({
//             success: true,
//             data: document,
//             organization
//         });

//     } catch (error) {
//         console.error('Update document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function transferDocument(req, res) {
//     try {
//         const { documentId } = req.params;
//         const { newOwner } = req.body;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }

//         if (!newOwner) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'newOwner is required'
//             });
//         }
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const document =
//             await documentService.transferDocument(
//                 documentId,
//                 newOwner,
//                 organization
//             );

//         return res.status(200).json({
//             success: true,
//             data: document
//         });

//     } catch (error) {
//         console.error('Transfer document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function archiveDocument(req, res) {
//     try {
//         const { documentId } = req.params;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const document =
//             await documentService.archiveDocument(documentId, organization);

//         return res.status(200).json({
//             success: true,
//             data: document
//         });

//     } catch (error) {
//         console.error('Archive document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function replaceDocument(req, res) {
//     try {
//         const { documentId } = req.params;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }

//         if (!req.body.newHash) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'newHash is required'
//             });
//         }
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const document =
//             await documentService.replaceDocument(
//                 documentId,
//                 req.body,
//                 organization
//             );

//         return res.status(200).json({
//             success: true,
//             data: document
//         });

//     } catch (error) {
//         console.error('Replace document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function verifyDocument(req, res) {
//     try {
//         const { documentId } = req.params;
//         const { documentHash } = req.body;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }

//         if (!documentHash) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'documentHash is required'
//             });
//         }

//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const result =
//             await documentService.verifyDocument(
//                 documentId,
//                 documentHash,
//                 organization
//             );

//         return res.status(200).json({
//             success: true,
//             data: result
//         });

//     } catch (error) {
//         console.error('Verify document error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function getDocumentHistory(req, res) {
//     try {
//         const { documentId } = req.params;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Document ID is required'
//             });
//         }

//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

//         const history =
//             await documentService.getDocumentHistory(
//                 documentId,
//                 organization
//             );

//         return res.status(200).json({
//             success: true,
//             data: history
//         });

//     } catch (error) {
//         console.error('Get history error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
// async function getAllDocuments(req, res) {
//     try {
//         const organization = req.headers['x-organization'];

// if (!organization) {
//     return res.status(400).json({
//         success: false,
//         message: 'Organization is required'
//     });
// }

// if (!['Org1', 'Org2'].includes(organization)) {
//     return res.status(400).json({
//         success: false,
//         message: 'Unsupported organization'
//     });
// }

// const documents =
//     await documentService.getAllDocuments(
//         organization
//     );
        

//         return res.status(200).json({
//             success: true,
//             data: documents
//         });

//     } catch (error) {
//         console.error('Get all documents error:', error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// async function uploadDocument(req, res) {

//     try {

//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'PDF file is required.'
//             });
//         }

//         /*
//          * Automatically process the uploaded PDF.
//          *
//          * This calculates:
//          * - SHA-256
//          * - file metadata
//          * - PDF metadata
//          */
//         const processed =
//             await processDocument(req.file);

//         /*
//          * Application-level metadata.
//          *
//          * These values are supplied by the client,
//          * because they are not necessarily present
//          * inside the PDF.
//          */
//         const {
//             documentId,
//             description,
//             owner,
//             department,
//             program,
//             batch
//         } = req.body;

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'documentId is required.'
//             });
//         }

//         /*
//          * Use the PDF title when available.
//          * Otherwise fall back to the original filename.
//          */
//         const title =
//             processed.pdfMetadata.title ||
//             processed.file.originalName;

//         /*
//          * Build the blockchain document object.
//          */
//         const documentData = {

//             documentId,

//             title,

//             description:
//                 description || '',

//             /*
//              * IMPORTANT:
//              * This is automatically generated
//              * from the uploaded PDF.
//              */
//             documentHash:
//                 processed.documentHash,

//             owner:
//                 owner || '',

//             department:
//                 department || '',

//             fileName:
//                 processed.file.originalName,

//             mimeType:
//                 processed.file.mimeType,

//             status:
//                 'ACTIVE',

//             metadata: {

//                 program:
//                     program || null,

//                 batch:
//                     batch || null,

//                 pdfVersion:
//                     processed.pdfMetadata.pdfVersion,

//                 pdfTitle:
//                     processed.pdfMetadata.title,

//                 producer:
//                     processed.pdfMetadata.producer,

//                 creationDate:
//                     processed.pdfMetadata.creationDate,

//                 modificationDate:
//                     processed.pdfMetadata.modificationDate,

//                 language:
//                     processed.pdfMetadata.language
//             }
//         };

//         /*
//          * Send the automatically generated
//          * document record to Hyperledger Fabric.
//          */
//         const document =
//             await documentService.createDocument(
//                 documentData
//             );

//         return res.status(201).json({

//             success: true,

//             message:
//                 'Document uploaded and recorded on blockchain.',

//             data: {

//                 blockchainDocument:
//                     document,

//                 file: processed.file,

//                 documentHash:
//                     processed.documentHash,

//                 pdfMetadata:
//                     processed.pdfMetadata
//             }
//         });

//     } catch (error) {

//         console.error(
//             'Upload and blockchain creation error:',
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }


// module.exports = {
//     getDocument,
//     createDocument,
//     updateDocument,
//     transferDocument,
//     archiveDocument,
//     replaceDocument,
//     verifyDocument,
//     getDocumentHistory,
//     getAllDocuments,
//     uploadDocument

// };

'use strict';
const crypto = require('crypto');

const documentService = require('../fabric/documentService');

const {
    processDocument
} = require('../utils/documentProcessor');


function getUserOrganization(req) {
    if (!req.user || !req.user.organization) {
        throw new Error('Authenticated organization is required');
    }

    return req.user.organization;
}


async function getDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const organization = getUserOrganization(req);

        const document =
            await documentService.getDocument(
                documentId,
                organization
            );

        return res.status(200).json({
            success: true,
            data: document
        });

    } catch (error) {

        console.error('Get document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function createDocument(req, res) {
    try {
        const documentData = req.body;

        if (!documentData.documentId) {
            return res.status(400).json({
                success: false,
                message: 'documentId is required'
            });
        }

        const organization = getUserOrganization(req);

        const document =
            await documentService.createDocument(
                documentData,
                organization
            );

        return res.status(201).json({
            success: true,
            data: document,
            organization
        });

    } catch (error) {

        console.error('Create document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function updateDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const organization = getUserOrganization(req);

        const document =
            await documentService.updateDocument(
                documentId,
                req.body,
                organization
            );

        return res.status(200).json({
            success: true,
            data: document,
            organization
        });

    } catch (error) {

        console.error('Update document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function transferDocument(req, res) {
    try {
        const { documentId } = req.params;
        const { newOwner } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!newOwner) {
            return res.status(400).json({
                success: false,
                message: 'newOwner is required'
            });
        }

        const organization = getUserOrganization(req);

        const document =
            await documentService.transferDocument(
                documentId,
                newOwner,
                organization
            );

        return res.status(200).json({
            success: true,
            data: document,
            organization
        });

    } catch (error) {

        console.error('Transfer document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function archiveDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const organization = getUserOrganization(req);

        const document =
            await documentService.archiveDocument(
                documentId,
                organization
            );

        return res.status(200).json({
            success: true,
            data: document,
            organization
        });

    } catch (error) {

        console.error('Archive document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function replaceDocument(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Replacement PDF file is required.'
            });
        }

        /*
         * Organization comes from the
         * authenticated user's JWT.
         */
        const organization =
            getUserOrganization(req);

        /*
         * Process the replacement PDF.
         *
         * This automatically calculates:
         * - SHA-256 hash
         * - file metadata
         * - PDF metadata
         */
        const processed =
            await processDocument(req.file);

        /*
         * The hash is generated by the backend.
         * The frontend never supplies the hash.
         */
        const replacementData = {
            documentId,

            newHash:
                processed.documentHash,

            fileName:
                processed.file.originalName,

            mimeType:
                processed.file.mimeType
        };

        /*
         * Send the generated hash to
         * Hyperledger Fabric.
         */
        const document =
            await documentService.replaceDocument(
                documentId,
                replacementData,
                organization
            );

        return res.status(200).json({
            success: true,

            message:
                'Document replaced and new version recorded on blockchain.',

            organization,

            data: {
                blockchainDocument: document,

                file: processed.file,

                documentHash:
                    processed.documentHash,

                pdfMetadata:
                    processed.pdfMetadata
            }
        });

    } catch (error) {

        console.error(
            'Replace document error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function verifyDocument(req, res) {
    try {
        const { documentId } = req.params;
        const { documentHash } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        if (!documentHash) {
            return res.status(400).json({
                success: false,
                message: 'documentHash is required'
            });
        }

        const organization = getUserOrganization(req);

        const result =
            await documentService.verifyDocument(
                documentId,
                documentHash,
                organization
            );

        return res.status(200).json({
            success: true,
            data: result,
            organization
        });

    } catch (error) {

        console.error('Verify document error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function getDocumentHistory(req, res) {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Document ID is required'
            });
        }

        const organization = getUserOrganization(req);

        const history =
            await documentService.getDocumentHistory(
                documentId,
                organization
            );

        return res.status(200).json({
            success: true,
            data: history,
            organization
        });

    } catch (error) {

        console.error('Get history error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function getAllDocuments(req, res) {
    try {
        const organization = getUserOrganization(req);

        const documents =
            await documentService.getAllDocuments(
                organization
            );

        return res.status(200).json({
            success: true,
            data: documents,
            organization
        });

    } catch (error) {

        console.error('Get all documents error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function uploadDocument(req, res) {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'PDF file is required.'
            });
        }

        /*
         * Organization comes from authenticated JWT.
         */
        const organization =
            getUserOrganization(req);

        /*
         * Owner comes from authenticated JWT.
         * The client cannot choose another owner.
         */
        if (!req.user || !req.user.email) {
            return res.status(401).json({
                success: false,
                message: 'Authenticated user information is required.'
            });
        }

        /*
         * Process uploaded PDF.
         *
         * Automatically:
         * - calculates SHA-256 hash
         * - extracts file information
         * - extracts PDF metadata
         */
        const processed =
            await processDocument(req.file);

        /*
         * Only genuine document information
         * comes from the request body.
         */
        const {
            description,
            department,
            program,
            batch
        } = req.body;

        /*
         * Department is required by the
         * current blockchain smart contract.
         */
        if (!department || !department.trim()) {
            return res.status(400).json({
                success: false,
                message: 'department is required.'
            });
        }

        /*
         * System-generated unique document ID.
         */
        const documentId =
            `DOC-${crypto.randomUUID()}`;

        /*
         * Use PDF title if available.
         * Otherwise use original filename.
         */
        const title =
            processed.pdfMetadata.title ||
            processed.file.originalName;

        /*
         * Build blockchain document.
         *
         * User-controlled:
         * - description
         * - department
         * - program
         * - batch
         *
         * System-controlled:
         * - documentId
         * - owner
         * - organization
         * - hash
         * - file information
         * - PDF metadata
         */
        const documentData = {

            documentId,

            title,

            description:
                description || '',

            documentHash:
                processed.documentHash,

            owner:
                req.user.email,

            department:
                department.trim(),

            fileName:
                processed.file.originalName,

            mimeType:
                processed.file.mimeType,

            status:
                'ACTIVE',

            metadata: {

                program:
                    program || null,

                batch:
                    batch || null,

                pdfVersion:
                    processed.pdfMetadata.pdfVersion,

                pdfTitle:
                    processed.pdfMetadata.title,

                producer:
                    processed.pdfMetadata.producer,

                creationDate:
                    processed.pdfMetadata.creationDate,

                modificationDate:
                    processed.pdfMetadata.modificationDate,

                language:
                    processed.pdfMetadata.language
            }
        };

        /*
         * Submit document to Hyperledger Fabric.
         */
        const document =
            await documentService.createDocument(
                documentData,
                organization
            );

        return res.status(201).json({

            success: true,

            message:
                'Document uploaded and recorded on blockchain.',

            organization,

            data: {

                blockchainDocument:
                    document,

                file:
                    processed.file,

                documentHash:
                    processed.documentHash,

                pdfMetadata:
                    processed.pdfMetadata
            }
        });

    } catch (error) {

        console.error(
            'Upload and blockchain creation error:',
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    getDocument,
    createDocument,
    updateDocument,
    transferDocument,
    archiveDocument,
    replaceDocument,
    verifyDocument,
    getDocumentHistory,
    getAllDocuments,
    uploadDocument
};