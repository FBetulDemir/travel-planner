import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/api/gemini", async (req, res) => {
    try {
        const { prompt } = req.body; // hämta från sidan
        if (!prompt) {
            return res.status(400).json({ error: "Ingen prompt skickades" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction:
                "Svara ENDAST med ett javascript-objekt eller -lista.",
        });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        console.log(result.response);

        res.json({ response: responseText }); // Skicka svaret till sidan..
    } catch (error) {
        console.error("Fel vid API-anrop:", error);
        res.status(500).json({ error: "Något gick fel" });
    }
});

// Starta servern
app.listen(PORT, () => {
    console.log(`Servern körs nu på http://localhost:${PORT}`);
});
