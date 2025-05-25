//i want to make a cron job that hit a get endpoint every 10 minutes
const cron = require('node-cron');
const axios = require('axios');
const endpoint = 'http://localhost:3000/api/v1/user/test'; // Replace with your actual endpoint




const autoPrompt = () => {
    // Schedule a task to run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        try {
        const response = await axios.get(endpoint);
        console.log('Cron job executed successfully:', response.data);
        } catch (error) {
        console.error('Error executing cron job:', error.message);
        }
    });
}


// Export the autoPrompt function to be used in server.js
module.exports = autoPrompt;