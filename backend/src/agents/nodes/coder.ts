import { io } from "../../server.js";
import { model } from "../model.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * CODER NODE
 * Takes Blueprint + Research -> Generates Terraform Code
 */
export const coderNode = async (state: any) => {
  console.log("--- NODE: Generating Terraform Code ---");
  io.emit('node_start', { node: 'coding' }); // Signal the frontend!


  const coderPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert DevOps Engineer. 
    Your task is to write high-quality, production-ready Terraform code based on a provided architecture blueprint and research notes.
    
    Rules:
    1. Use AWS Provider version 5.0+.
    2. Include necessary VPC, Subnet, and Security Group definitions.
    3. Use variables for sensitive data.
    4. Output ONLY the Terraform code block. No talk, no markdown backticks.`],
    ["user", "Project: {projectName}\nInfrastructure: {infrastructureType}\nServices: {services}\nResearch Updates: {researchNote}"]
  ]);

  const chain = coderPrompt.pipe(model);

  const response = await chain.invoke({
    projectName: state.blueprint.projectName,
    infrastructureType: state.blueprint.infrastructureType,
    services: JSON.stringify(state.blueprint.services),
    researchNote: state.blueprint.researchNote || "No specific research updates."
  });

  return {
    generatedCode: response.content
  };
};