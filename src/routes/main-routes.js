const express = require('express');
const router = express.Router();
const controllerv2 = require('../controllers/sns-sqs-v2-controller.js');
const controllerv3 = require('../controllers/sns-sqs-v3-controller.js');

// Requests for the simple example using the AWS SDK v2
router.post('/v2/publish', controllerv2.publishMessageToSNS);
router.get('/v2/receive', controllerv2.receiveMessagesFromSQS);

// Requests for the simple example using the AWS SDK v3
router.post('/v3/publish', controllerv3.publishMessageToSNS);
router.get('/v3/receive', controllerv3.receiveMessagesFromSQS);

module.exports = router;
