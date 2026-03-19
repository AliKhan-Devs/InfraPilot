import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { architectNode } from "./nodes/architect.js";
import { researcherNode } from "./nodes/researcher.js";
import { coderNode } from "./nodes/coder.js";
import { reviewerNode } from "./nodes/reviewer.js";

const workflow = new StateGraph(AgentState)
  .addNode("architect", architectNode)
  .addNode("researcher", researcherNode)
  .addNode("coder", coderNode)
  .addNode("reviewer", reviewerNode)
  
  .addEdge(START, "architect")
  .addEdge("architect", "researcher")
  .addEdge("researcher", "coder")
  .addEdge("coder", "reviewer") // Code goes to Reviewer
  .addEdge("reviewer", END);

export const graph = workflow.compile();