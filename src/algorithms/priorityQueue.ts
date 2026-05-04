export type EmergencyTask = {
  id: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  distance: number;
};

const severityWeight = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export class PriorityQueue {
  private queue: EmergencyTask[] = [];

  enqueue(task: EmergencyTask) {
    this.queue.push(task);
    this.queue.sort((a, b) => {
      return (
        severityWeight[b.severity] - severityWeight[a.severity] ||
        a.distance - b.distance
      );
    });
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}