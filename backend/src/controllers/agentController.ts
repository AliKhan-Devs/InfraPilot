import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../agents/graph.js";

export const handleArchitectRequest = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // Trigger the LangGraph!
    // We pass the initial state: an array with the user's message.
    const finalState = await graph.invoke({
      messages: [new HumanMessage(prompt)]
    });

    // Return the generated blueprint to your React dashboard
    res.json({
      success: true,
      blueprint: finalState.blueprint,
      terraformCode: finalState.generatedCode,
      securityReview: finalState.errors, // Add this!
      history: finalState.messages
    });

  } catch (error) {
    console.error("Agent Error:", error);
    res.status(500).json({ error: "Agent failed to architect." });
  }
};