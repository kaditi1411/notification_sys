# 📬 Notification Service

A backend service built with **Express.js** and **RabbitMQ** to send Email, SMS, and In-App notifications asynchronously with retry support for failed deliveries.

---

## 🚀 Features

* 📩 Send notifications via **Email**, **SMS**, and **In-App**
* 🐇 Uses **RabbitMQ** as a message queue
* 🔁 Automatic **retry mechanism** for failed notifications
* 🧾 Simple **JSON file persistence** for tracking undelivered notifications
* 📡 RESTful API for triggering and retrieving notifications

---

## 📁 Project Structure

notification-service/
├── app.js # Main Express app & API endpoints
├── queue.js # RabbitMQ setup, producer, and consumer logic
├── consumer.js # Listens to RabbitMQ and processes notifications
├── notifications.json # Simulated DB for storing notifications
├── utils/
│ └── senders.js # Simulated sending logic (Email, SMS, In-App)
└── package.json # Project metadata and dependencies

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

git clone [https://github.com/your-username/notification-service.git](https://github.com/your-username/notification-service.git)
cd notification-service
2\. Install Dependencies
npm install
3\. Ensure RabbitMQ is Running
RabbitMQ should be running locally on port 5672.

Install RabbitMQ: [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

To check if it's running:
rabbitmq-server
4\. Start the Server
node app.js
📡 API Endpoints
✅ Send a Notification
POST /notifications
{
"userId": "user123",
"type": "email",   // Options: "email", "sms", "in-app"
"message": "Hello from Notification Service!"
}
📬 Get User Notifications
GET /users/\:userId/notifications

Returns all in-app messages for the specified user from notifications.json.

🔄 Retry Mechanism
Failed notifications are retried every 30 seconds.

If a notification fails, it's pushed to a retry queue and reprocessed until successful.

📌 Notes
Email, SMS, and In-App delivery are mocked using console.log() in utils/senders.js.

Notifications are stored in a local notifications.json file to simulate a database.



👨‍💻 Author
Built by Aditi Kumari
