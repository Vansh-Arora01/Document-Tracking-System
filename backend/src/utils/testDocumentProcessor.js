'use strict';

const path = require('path');

const {
    processDocument
} = require('./documentProcessor');


async function main() {

    const file = {
        originalname: 'test.pdf',
        filename: '1787330863785-test.pdf',
        mimetype: 'application/pdf',
        size: 143112,
        path: path.join(
            __dirname,
            '../../uploads/1787330863785-test.pdf'
        )
    };

    const result =
        await processDocument(file);

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );
}


main().catch(error => {

    console.error(
        'Document processing failed:'
    );

    console.error(error);
});