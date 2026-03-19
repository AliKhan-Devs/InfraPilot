import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as dotenv from "dotenv";

dotenv.config();

// We initialize Gemini 2.0 Flash. 
// It's the best balance of speed and "agentic" reasoning.
export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
  // Temperature 0 makes the AI more predictable and "robotic"
  // which is exactly what we want for coding and architecture.
  temperature: 0, 
});