const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const Memory = require("../models/memorySchema");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

// 🆕 Transcribe audio using AssemblyAI
async function transcribeAudio(filePath) {
  try {
    const audioData = fs.readFileSync(filePath);

    // Step 1: Upload the file
    const uploadRes = await axios.post("https://api.assemblyai.com/v2/upload", audioData, {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/octet-stream",
      },
    });

    const uploadUrl = uploadRes.data.upload_url;

    // Step 2: Request transcription
    const transcriptRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: uploadUrl },
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcriptRes.data.id;

    // Step 3: Poll until transcription is complete
    let transcriptionResult = null;
    while (true) {
      const pollingRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
      });

      if (pollingRes.data.status === "completed") {
        transcriptionResult = pollingRes.data.text;
        break;
      } else if (pollingRes.data.status === "error") {
        throw new Error(`Transcription failed: ${pollingRes.data.error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s
    }


    await Memory.create({ content: transcriptionResult });

    return transcriptionResult;
  } catch (err) {
    console.error("AssemblyAI STT Error:", err?.response?.data || err.message);
    return null;
  }
}

// 🔊 2. Convert AI reply to audio (TTS)
async function generateSpeech(text, filename = "output.mp3") {

  console.log("api key", ELEVEN_API_KEY);
  console.log("voice id", VOICE_ID);
  
  
  try {
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      responseType: "arraybuffer",
    });

    console.log("Audio response status:", response.status);
    console.log("Audio response headers:", response.headers);
    console.log("Audio data length:", response.data.byteLength);

    const outputPath = path.join(__dirname, "..", "public", filename);
    fs.writeFileSync(outputPath, response.data);
    console.log(`Audio file saved to: ${outputPath}`);

    return `/public/${filename}`;
  } catch (err) {
    console.error("ElevenLabs TTS Error:", err?.response?.data || err.message);
    return null;
  }
}



// 📥 3. Main AI handler when audio is uploaded
const chatWithAI = async (req, res) => {
  const filePath = req.file?.path; // From multer
  if (!filePath) return res.status(400).json({ error: "Audio file is required" });

  try {
    const userText = await transcribeAudio(filePath);
    if (!userText) return res.status(500).json({ error: "Failed to transcribe audio." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const isRememberCommand = userText.toLowerCase().includes("remember");
    if (isRememberCommand) await Memory.create({ content: userText });

    const memories = await Memory.find().sort({ createdAt: 1 });

    const systemPrompt = `
You are Yeong Sil, a compassionate AI memory companion created to support elderly users.
You are designed to:
- Speak gently and clearly
- Remember what users tell you
- Help them recall important details
- and as it is going to be a voice message do not use /n * or /n any other special characters until you are asked for

Here are some things the user previously asked you to remember:
${memories.map((m, i) => `${i + 1}. ${m.content}`).join("\n")}
`;

    const fullPrompt = `${systemPrompt}\nUser: ${userText}\nYeong Sil:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    

    const audioUrl = await generateSpeech(reply);

    res.json({ transcription: userText, reply, audioUrl });
  } catch (err) {
    console.error("AI Flow Error:", err.message);
    res.status(500).json({ error: "Something went wrong in AI processing." });
  }
};

module.exports = { chatWithAI };
