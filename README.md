# AMAZON SNS & AMAZON SQS

## GETTING STARTED
These instructions will help you to set up and run a project for local development.

## INITIAL SETUP
What things you need to install:

1. The project uses NodeJs version v20.11.1
2. Execute
   `$ npm install`

3. Setup Environment Variables

   `- On Windows Powershell`
   ```cmd
   copy example.env .env
   ```
   `- On Git Bash terminal`
   ```bash
   cp example.env .env
   ```

4. Replace environment varibles values in file `.env` with your AWS Cognito credentials

## LET'S START WITH PRACTICE

1. Update the files in `src\controllers\-controller.js`

2. Configure the clients for SNS and SQS with the credentials and region from the environment variables file:

    Insert the following code in line 11 of the file `sns-sqs-v2-controller.js`
    ```
    const sns = new AWS.SNS();
    const sqs = new AWS.SQS();

    const topicArn = process.env.SNS_TOPIC_ARN;
    const queueUrl = process.env.SQS_URL;
    ```

    Insert the following code in line 13 of the file `sns-sqs-v3-controller.js`
    ```
    const snsClient = new SNSClient({
       region: process.env.AWS_REGION,
       credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
       }
    });
    
    // Configure AWS SDK V3 for SQS client
    const sqsClient = new SQSClient({
       region: process.env.AWS_REGION,
       credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
       }
    });
    
    const topicArn = process.env.SNS_TOPIC_ARN;
    const queueUrl = process.env.SQS_URL;
    ```
    
3. Now let's start programming in the `publishMessageToSNS` and `receiveMessagesFromSQS` functions for each of the driver files.

4. Have fun!

## RUN LOCAL SERVER
```
npm run dev # in development mode - server starts on http://localhost:3000
```

## TIPS
Use the collection attached to the project to create some examples of the requests created.

NOTE: Do not forget that the project has an example of Amazon SNS & SQS implementation, with the SDK v3.
