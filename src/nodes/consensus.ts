import { BASE_NODE_PORT } from "../config";
import http from "http";

export async function startConsensus(N: number) {
  // Launch a node
  for (let index = 0; index < N; index++) {
    const options = {
      hostname: "localhost",
      port: BASE_NODE_PORT + index,
      path: "/start",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to start consensus on node ${index}. Status code: ${res.statusCode}`);
      }
    });

    req.on("error", (error) => {
      console.error(`Failed to start consensus on node ${index}:`, error);
    });

    req.end();
  }
}

export async function stopConsensus(N: number) {
  // Stop consensus on each node
  for (let index = 0; index < N; index++) {
    const options = {
      hostname: "localhost",
      port: BASE_NODE_PORT + index,
      path: "/stop",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to stop consensus on node ${index}. Status code: ${res.statusCode}`);
      }
    });

    req.on("error", (error) => {
      console.error(`Failed to stop consensus on node ${index}:`, error);
    });

    req.end();
  }
}