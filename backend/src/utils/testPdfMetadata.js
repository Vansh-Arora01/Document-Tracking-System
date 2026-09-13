'use strict';

const fs = require('fs');
const path = require('path');

const {
    PDFParse
} = require('pdf-parse');

async function main() {

    const filePath = path.join(
        __dirname,
        '../../test.pdf'
    );

    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
        data: buffer
    });

    const result = await parser.getInfo();

    console.log('PDF Information:');
    console.dir(result, {
        depth: null
    });

    await parser.destroy();
}

main().catch(error => {

    console.error(
        'PDF metadata extraction failed:'
    );

    console.error(error);
});