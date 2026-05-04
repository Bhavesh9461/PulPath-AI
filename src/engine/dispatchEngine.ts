import { PriorityQueue } from "@/algorithms/priorityQueue";

export function dispatchEmergency(request: {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  distance: number;
}) {
  const queue = new PriorityQueue();

  queue.enqueue(request);

  const next = queue.peek();

  return {
    assignedRequest: next,
    status: "DISPATCHED",
  };
}