const { validateEnv, PORT } = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');

// Validate environment variables
validateEnv();

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 TrackMyFinance API running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
