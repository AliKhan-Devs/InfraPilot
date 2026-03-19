import { z } from "zod";
import { model } from "../model.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { io } from "../../server.js";

// 1. Define the Blueprint Schema using Zod
// This is the "Interface" the AI must follow.
const BlueprintSchema = z.object({
  projectName: z.string().describe("A slug-style name for the cloud project"),
  services: z.array(z.object({
    serviceName: z.string().describe("e.g., ECS, RDS, SQS"),
    reasoning: z.string().describe("Why this service was chosen"),
    configHint: z.string().describe("Key settings like 't3.micro' or 'public-subnet'")
  })),
  infrastructureType: z.enum(["serverless", "containerized", "hybrid"]),
  needsVPC: z.boolean().describe("Whether a custom VPC is required")
});

/**
 * ARCHITECT NODE
 * Takes user requirements -> Returns a structured Blueprint
 */
export const architectNode = async (state: any) => {
  console.log("--- NODE: Architecting Infrastructure ---");
  // 1. Alert the frontend
  io.emit('node_start', { node: 'architecting' });


  const architectPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are a Senior AWS Solutions Architect.
      Design a robust infrastructure based on user needs.
      IMPORTANT: You must return ONLY valid JSON. 
      Do not include any explanations before or after the JSON block.`],
    ["placeholder", "{messages}"],
  ]);

  // 3. Bind the Schema to the Model (Force Structured Output)
  const structuredModel = model.withStructuredOutput(BlueprintSchema);

  // 4. Create the Chain and Invoke
  const chain = architectPrompt.pipe(structuredModel);

  // We pass the conversation history from the state
  const result = await chain.invoke({
    messages: state.messages,
  });

  // 5. Return the update to the State
  // LangGraph will merge this 'blueprint' into our AgentState automatically
  return {
    blueprint: result,
    // Add a status message to history so the user knows what happened
    messages: [new HumanMessage(`I have designed a ${result.infrastructureType} blueprint for ${result.projectName}.`)]
  };
};