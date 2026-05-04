type Edge = {
  to: string;
  weight: number;
};

type Graph = Record<string, Edge[]>;

export function dijkstra(graph: Graph, start: string) {
  const distances: Record<string, number> = {};
  const visited = new Set<string>();

  for (const node in graph) {
    distances[node] = Infinity;
  }

  distances[start] = 0;

  while (true) {
    let closestNode: string | null = null;

    for (const node in distances) {
      if (!visited.has(node)) {
        if (
          closestNode === null ||
          distances[node] < distances[closestNode]
        ) {
          closestNode = node;
        }
      }
    }

    if (!closestNode) break;

    visited.add(closestNode);

    for (const edge of graph[closestNode]) {
      const newDist =
        distances[closestNode] + edge.weight;

      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
      }
    }
  }

  return distances;
}