const amqp = require('amqplib');
const { QUEUE, RABBIT_URL, saveNotification } = require('./queue');
const { sendEmail, sendSMS, sendInApp } = require('./utils/sender');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function startConsumer() {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);

  console.log('Waiting for messages in queue...');

  channel.consume(QUEUE, async (msg) => {
    if (msg) {
      let notification = JSON.parse(msg.content.toString());
      try {
        switch (notification.type.toLowerCase()) {
          case 'email':
            await sendEmail(notification);
            break;
          case 'sms':
            await sendSMS(notification);
            break;
          case 'in-app':
            await sendInApp(notification);
            break;
          default:
            throw new Error('Unknown notification type');
        }

        // Save notification after success
        saveNotification(notification.userId, notification);
        channel.ack(msg);
      } catch (err) {
        console.log(`Error sending notification: ${err.message}`);

        if (notification.retries < MAX_RETRIES) {
          notification.retries++;
          // Delay retry by requeueing after some time
          setTimeout(() => {
            channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(notification)));
          }, RETRY_DELAY_MS);
          channel.ack(msg); // ack current message so retry happens separately
        } else {
          console.log('Max retries reached. Dropping notification:', notification);
          channel.ack(msg);
        }
      }
    }
  });
}

startConsumer().catch(console.error);
