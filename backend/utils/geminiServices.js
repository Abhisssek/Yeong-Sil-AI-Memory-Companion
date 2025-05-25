const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getGeminiReminder = async (userName, medicine, dosage) => {
  const prompt = `Remind ${userName} to take ${dosage || "a dose"} of ${medicine} now.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response =  result.response;
    const text =  response.text();

    return text;
  } catch (error) {
    console.error("Gemini reminder error:", error);
    return `Reminder: ${userName}, take ${dosage || "a dose"} of ${medicine}.`; // fallback
  }
};

module.exports = { getGeminiReminder };

