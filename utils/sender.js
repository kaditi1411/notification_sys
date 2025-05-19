async function sendEmail(notification) {
  console.log(`Sending EMAIL to user ${notification.userId}: ${notification.message}`);
  // Simulate success/failure randomly for retries
  if (Math.random() < 0.8) return true; // 80% success rate
  throw new Error('Email sending failed');
}

async function sendSMS(notification) {
  console.log(`Sending SMS to user ${notification.userId}: ${notification.message}`);
  if (Math.random() < 0.8) return true;
  throw new Error('SMS sending failed');
}

async function sendInApp(notification) {
  console.log(`Sending IN-APP notification to user ${notification.userId}: ${notification.message}`);
  // In-app always succeeds for demo
  return true;
}

module.exports = {
  sendEmail,
  sendSMS,
  sendInApp
};
