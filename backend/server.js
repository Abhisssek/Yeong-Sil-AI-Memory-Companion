const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const path = require('path');


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());





// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


const job10 = require('./cron job/cron'); // Import the auto-prompt script

// Start the auto-prompt script
job10(); // Start the cron job


// Routes
const aiRoute = require('./routers/aiRoute');
const authRoute = require('./routers/authRoutes');
const familyRoute = require('./routers/familyRoutes');
const healthRoute = require('./routers/healthRoutes');
app.use('/api/v1/companion', aiRoute);
app.use('/api/v1/user', authRoute);
app.use('/api/v1/family', familyRoute);
app.use('/api/v1/health', healthRoute);

app.use('/public', express.static(path.join(__dirname, 'public')));



const autoPrompt = require('./node-cron/autoPrompt'); // Import the auto-prompt script

// Start the auto-prompt script
autoPrompt(); // Start the cron job



//server running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});