'use strict';

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function (req, file, cb) {
        const uniqueName =
            `${Date.now()}-${file.originalname}`;

        cb(null, uniqueName);
    }
});

const fileFilter = function (req, file, cb) {

    const extension =
        path.extname(file.originalname).toLowerCase();

    if (
        extension === '.pdf' &&
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        cb(
            new Error('Only PDF files are allowed.')
        );
    }
};

const upload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;