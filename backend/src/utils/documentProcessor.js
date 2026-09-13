'use strict';

const fs = require('fs');

const {
    PDFParse
} = require('pdf-parse');

const {
    calculateSHA256
} = require('./fileHash');


async function processDocument(file) {

    if (!file) {
        throw new Error('File is required.');
    }

    // 1. Calculate SHA-256
    const documentHash =
        calculateSHA256(file.path);

    // 2. Read PDF
    const buffer =
        fs.readFileSync(file.path);

    const parser =
        new PDFParse({
            data: buffer
        });

    // 3. Extract PDF information
    const pdfResult =
        await parser.getInfo();

    await parser.destroy();

    // 4. Build processed document information
    return {
        file: {
            originalName: file.originalname,
            storedName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path
        },

        documentHash,

        pdfMetadata: {
            pdfVersion:
                pdfResult.info?.PDFFormatVersion || null,

            title:
                pdfResult.info?.Title || null,

            producer:
                pdfResult.info?.Producer || null,

            creationDate:
                pdfResult.info?.CreationDate || null,

            modificationDate:
                pdfResult.info?.ModDate || null,

            language:
                pdfResult.info?.Language || null
        }
    };
}


module.exports = {
    processDocument
};