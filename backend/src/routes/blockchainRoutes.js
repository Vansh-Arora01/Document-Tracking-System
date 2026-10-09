'use strict';

const express = require('express');
const router = express.Router();

const blockchainController = require('../controllers/blockchainController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/status', blockchainController.getNetworkStatus);
router.get('/activity', blockchainController.getBlockchainActivity);
router.get('/transaction/:txId', blockchainController.getTransaction);

module.exports = router;
