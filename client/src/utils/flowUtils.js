export const serializeFlow = (nodes, edges) => {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label || null
    }))
  };
};

export const deserializeFlow = (flowData) => {
  const { nodes = [], edges = [] } = flowData;
  return {
    nodes: nodes.map((node) => ({
      ...node,
      type: node.type || 'customNode',
      position: node.position || { x: 0, y: 0 },
      data: node.data || {}
    })),
    edges
  };
};

export const createNode = (label, existingNodes = []) => {
  // Calculate position to avoid overlapping
  const baseX = 200;
  const baseY = 100;
  const spacing = 150;

  const nodeCount = existingNodes.length;
  const row = Math.floor(nodeCount / 3);
  const col = nodeCount % 3;

  const x = baseX + (col * spacing) + (Math.random() * 50 - 25);
  const y = baseY + (row * spacing) + (Math.random() * 50 - 25);

  return {
    id: `${label}-${Date.now()}`,
    type: 'customNode',
    position: { x, y },
    data: { label },
    draggable: true
  };
};
