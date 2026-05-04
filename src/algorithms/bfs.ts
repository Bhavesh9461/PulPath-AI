type Node = {
  id: string;
  neighbors: string[];
};

export function bfs(start: string, graph: Record<string, Node>) {
  const queue: string[] = [start];
  const visited = new Set<string>();

  const result: string[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;

    visited.add(node);
    result.push(node);

    for (const neighbor of graph[node].neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}