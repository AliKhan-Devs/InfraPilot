import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

/**
 * This is the "Single Source of Truth" for our Agent.
 * Every node in the graph will receive this state, 
 * modify it, and pass it to the next node.
 */
export const AgentState = Annotation.Root({
  // Stores the conversation history (Human and AI messages)
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y), // This logic says: "Always append new messages to the list"
    default: () => [],
  }),
  
  // Tracks the current architectural blueprint being designed
  blueprint: Annotation<any>({
    reducer: (x, y) => ({ ...x, ...y }), // Merge old blueprint data with new updates
    default: () => ({}),
  }),

  // Stores the final generated Terraform/CDK code
  generatedCode: Annotation<string>({
    reducer: (x, y) => y, // Simply overwrite with the latest version
    default: () => "",
  }),

  // Any safety or validation errors found by the Reviewer node
  errors: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
});