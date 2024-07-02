require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SDK V2
AWS.config.update({
	accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
	region: `${process.env.AWS_REGION}`
});

const topicArn = process.env.SNS_TOPIC_ARN;
const queueUrl = process.env.SQS_URL;

const sns = new AWS.SNS();
const sqs = new AWS.SQS();

const publish = (async (req, res) => {
	const { message } = req.body;
	const params = { TopicArn: topicArn };

   try {
		for (let i = 1; i <= 10; i++) {
			params.Message = `Number ${i} - Message: ${message}`;
			await sns.publish(params).promise();
		}
		res.json(`Messages published on SNS`);
	} catch (err) {
		console.error('Error publishing message:', err);
		// Handle specific errors
		if (err.code === 'InvalidParameter') {
			console.error('Invalid parameters provided');
		} else if (err.code === 'NotFound') {
			console.error('Topic not found');
		} else {
			console.error('Unknown error:', err.message);
		}
		res.status(500).json({
			error: 'Failed to publish message'
		});
   }
});

const receive = (async (req, res) => {
	const params = {
		QueueUrl: queueUrl,
		MaxNumberOfMessages: 10,
		WaitTimeSeconds: 10
	};

   try {
      const data = await sqs.receiveMessage(params).promise();
      if (data.Messages) {
         const queues = data.Messages.map(item => ({ id: item.MessageId, message: item.Body }));
         queues.sort((a, b) => a - b);
         res.json(queues);
		} else {
         res.json({
            message: 'No messages available'
         });
      }
   } catch (err) {
      res.status(500).json({
         error: err
      });
   }
});

module.exports = {
   publish,
   receive
};
