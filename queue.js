const amqp = require('amqplib');
const fs = require('fs');

const QUEUE = 'notifications';
const RABBIT_URL = 'amqp://guest:guest@localhost';
const persistenceFile = './notifications.json';

let channel, connection;

// Load notifications "DB"
let notificationsDB = {};
if (fs.existsSync(persistenceFile)) {
  notificationsDB = JSON.parse(fs.readFileSync(persistenceFile, 'utf-8'));
}

async function connectRabbitMQ() {
  connection = await amqp.connect(RABBIT_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);
  console.log('Connected to RabbitMQ');
}
connectRabbitMQ().catch(console.error);

// Producer function
async function sendToQueue(notification) {
  if (!channel) throw new Error('RabbitMQ channel not ready');
  const sent = channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(notification)));
  if (!sent) throw new Error('Failed to send message');
}

// Store notification after processing
function saveNotification(userId, notification) {
  if (!notificationsDB[userId]) {
    notificationsDB[userId] = [];
  }
  notificationsDB[userId].push(notification);
  fs.writeFileSync(persistenceFile, JSON.stringify(notificationsDB, null, 2));
}

// Get user notifications
function getUserNotifications(userId) {
  return notificationsDB[userId] || [];
}

module.exports = {
  sendToQueue,
  saveNotification,
  getUserNotifications,
  QUEUE,
  RABBIT_URL
};
