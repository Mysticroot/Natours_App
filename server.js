const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Handle synchronous (coding) errors
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

// Replace placeholder with actual DB password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB
mongoose.connect(DB).then(() => {
  console.log('✅ Database connection successful');
});

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 App is running on port ${port}`);
});

// Handle unhandled promise rejections (e.g., DB down)
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
