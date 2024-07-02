require('dotenv').config();
const {
   SNSClient,
   PublishCommand
} = require("@aws-sdk/client-sns");
const {
   SQSClient,
   ReceiveMessageCommand,
   DeleteMessageCommand
} = require('@aws-sdk/client-sqs');

// Configura el cliente de SNS
const snsClient = new SNSClient({
   region: process.env.AWS_REGION,
   credentials: {
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
   }
});
const topicArn = process.env.SNS_TOPIC_ARN;

// Configura el cliente de SQS
const sqsClient = new SQSClient({
   region: process.env.AWS_REGION,
   credentials: {
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
   }
});
const queueUrl = process.env.SQS_URL;

const publishMessageToSNS = (async (req, res) => {
	const { message } = req.body;
   const params = {
      TopicArn: topicArn,
      Message: message
   };

   try {
      const command = new PublishCommand(params);
      const data = await snsClient.send(command);
		res.json({
			MessageId: data.MessageId,
		});
    } catch (err) {
      console.error("Error publishing message to SNS:", err);
		res.status(500).json({
			error: err
		});
   }
});

const receiveMessagesFromSQS = (async (req, res) => {
   const queues = await receiveQueues();
   if (typeof queues === 'object') {
      await deleteQueues(queues);
   }
   res.json(queues)
});

const receiveQueues = (async () => {
   const params = {
		QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10
	};

   try {
      const command = new ReceiveMessageCommand(params);
      const data = await sqsClient.send(command);

      if (data.Messages) {
         const queues = data.Messages.map(item => ({
            id: item.MessageId, message: item.Body
         }));
         queues.sort((a, b) => a - b);
         return queues;
      } else {
         return "No messages available in the queue";
      }
   } catch (error) {
      console.error("Error receiving queues from SQS:", error);
      return error;
   }
});

const deleteQueues = (async (queues) => {
   const params = {
      QueueUrl: queueUrl
   };

   try {
      for (let i = 0; i < queues.length; i++) {
         const queue = queues[i];
         if (queue.ReceiptHandle) {
            params.ReceiptHandle = queue.ReceiptHandle;
            const command = new DeleteMessageCommand(params);
            await sqsClient.send(command);
         }
      }
   } catch (error) {
      console.error("Error deleting queue from SQS:", error);
      return error;
   }
});

module.exports = {
   publishMessageToSNS,
   receiveMessagesFromSQS
};
