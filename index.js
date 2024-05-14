const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require('./helper/database');
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

// Routes with versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
