// src/agents/nodes/researcher.ts

import { TavilySearch } from "@langchain/tavily";
import { model } from "../model.js";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { io } from "../../server.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This tells dotenv to go up and out of 'dist' to find the .env in the root
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 
export const researcherNode = async (state: any) => {
  io.emit('node_start', { node: 'researching' }); // Signal the frontend!
 


  console.log("--- NODE: Researching Best Practices ---");

  try {
    const searchTool = new TavilySearch({ maxResults: 2 });
    
    const primaryService = state.blueprint.services[1]?.serviceName || "AWS ECS Fargate";
    const searchQuery = `Latest AWS best practices for ${primaryService} in 2026`;

    // 1. Perform the search
    const searchResult = await searchTool.invoke({ query: searchQuery });
    
    // Log for debugging
    console.log("Search Result received:", typeof searchResult === 'string' ? "Text Data" : "Object Data");

    // 2. Ensure searchResult is a string before passing to Gemini
    // If Tavily fails or returns an object, we stringify it.
    const searchContent = typeof searchResult === 'string' 
      ? searchResult 
      : JSON.stringify(searchResult);

    // 3. Summarize with Gemini
    const summary = await model.invoke([
      ["system", "Summarize these technical search results into a concise recommendation. If no data is found, say 'No specific 2026 updates found'."],
      ["user", searchContent]
    ]);

    return { 
      blueprint: {
        ...state.blueprint,
        researchNote: summary.content
      }
    };

  } catch (error) {
    console.error("Researcher Node Error:", error);
    // If the tool fails, don't break the graph! Just return a fallback note.
    return {
      blueprint: {
        ...state.blueprint,
        researchNote: "Research unavailable at this moment. Proceeding with architectural defaults."
      }
    };
  }
};