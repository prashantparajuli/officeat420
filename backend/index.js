const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/dbconfig');
const authMiddleware = require('./middlewares/auth');
const recordsRouter = require('./routes/records');
const authRouter = require('./routes/auth');

require('dotenv/config');
// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/auth', authRouter);
app.use('/records', authMiddleware, recordsRouter);


// Start the server

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${port}`);
});