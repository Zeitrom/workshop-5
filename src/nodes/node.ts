import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value } from "../types";

export async function node(
  nodeId: number,
  N: number,
  F: number,
  initialValue: Value,
  isFaulty: boolean,
  nodesAreReady: () => boolean,
  setNodeIsReady: (index: number) => void
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  // Store the current status of the node
  let status = {
    nodeId,
    N,
    F,
    value: initialValue,
    isFaulty,
    isConsensusRunning: false,
  };

  node.get("/status", (req, res) => {
    res.json(status);
  });

  node.post("/message", (req, res) => {
    // Process the received message
    const message = req.body;
    // TODO: Implement the logic for handling the message

    res.sendStatus(200);
  });

  node.get("/start", async (req, res) => {
    if (status.isConsensusRunning) {
      res.status(400).json({ error: "Consensus is already running" });
    } else if (!nodesAreReady()) {
      res.status(400).json({ error: "Not all nodes are ready yet" });
    } else {
      // TODO: Implement the logic to start the consensus algorithm
      status.isConsensusRunning = true;
      res.sendStatus(200);
    }
  });

  node.get("/stop", async (req, res) => {
    if (!status.isConsensusRunning) {
      res.status(400).json({ error: "Consensus is not running" });
    } else {
      // TODO: Implement the logic to stop the consensus algorithm
      status.isConsensusRunning = false;
      res.sendStatus(200);
    }
  });

  node.get("/getState", (req, res) => {
    // TODO: Implement the logic to get the current state of a node
    res.json({ state: "Placeholder state" });
  });

  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(`Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`);
    setNodeIsReady(nodeId);
  });

  return server;
}