import { io } from "../../server.js";
import { model } from "../model.js";

/**
 * REVIEWER NODE
 * Scans the generated Terraform for security issues or missing best practices.
 */
export const reviewerNode = async (state: any) => {
  console.log("--- NODE: Reviewing Security & Best Practices ---");
  io.emit('node_start', { node: 'reviewing' }); // Signal the frontend!
  

  const reviewPrompt = `
    You are a Cloud Security Expert. Review the following Terraform code and architectural blueprint.
    Identify any security risks (e.g., public buckets, missing encryption, open ports).
    
    Architecture: ${JSON.stringify(state.blueprint)}
    Code: ${state.generatedCode}

    Output a JSON list of issues found. If no issues, return an empty array [].
    Example format: ["S3 bucket is public", "RDS missing storage encryption"]
  `;

  // We use the model to get a simple response
  const response = await model.invoke(reviewPrompt);
  
  // Clean the response in case the AI added markdown backticks
  const content = response.content.toString().replace(/```json|```/g, "").trim();
  let issues = [];
  try {
    issues = JSON.parse(content);
  } catch (e) {
    console.log("Reviewer output was not JSON, treating as text.");
    issues = [content];
  }

  return {
    errors: issues
  };
};