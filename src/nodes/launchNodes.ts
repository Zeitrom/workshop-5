import { Value } from "../types";
import { node } from "./node";

export async function launchNodes(
  N: number,
  F: number,
  initialValues: Value[],
  faultyList: boolean[]
) {
  if (initialValues.length !== faultyList.length || N !== initialValues.length)
    throw new Error("Arrays don't match");
  if (faultyList.filter((el) => el === true).length !== F)
    throw new Error("faultyList doesn't have F faulties");

  const promises: Promise<any>[] = [];
  const nodesStates: boolean[] = new Array(N).fill(false);

  function nodesAreReady() {
    return nodesStates.every((el) => el === true);
  }

  function setNodeIsReady(index: number) {
    nodesStates[index] = true;
  }

  // Launch nodes
  for (let index = 0; index < N; index++) {
    const newPromise = node(
      index,
      N,
      F,
      initialValues[index],
      faultyList[index],
      nodesAreReady,
      setNodeIsReady
    );
    promises.push(newPromise);
  }

  const servers = await Promise.all(promises);

  return servers;
}