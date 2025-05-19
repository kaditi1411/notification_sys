const express = require('express');
const bodyParser = require('body-parser');
const { sendToQueue, getUserNotifications } = require('./queue');

const app = express();
app.use(bodyParser.json());

// POST /notifications
app.post('/notifications', async (req, res) => {
  const { userId, type, message } = req.body;
  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'userId, type, and message are required' });
  }

  try {
    await sendToQueue({ userId, type, message, retries: 0 });
    res.json({ status: 'Notification queued' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue notification' });
  }
});

// GET /users/:id/notifications
app.get('/users/:id/notifications', (req, res) => {
  const userId = req.params.id;
  const notifications = getUserNotifications(userId);
  res.json({ notifications });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
});
