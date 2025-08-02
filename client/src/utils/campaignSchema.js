export const generateCampaignSchema = (nodes, edges) => {
  // Create a map of node connections
  const nodeConnections = {};
  edges.forEach(edge => {
    if (!nodeConnections[edge.source]) {
      nodeConnections[edge.source] = [];
    }
    nodeConnections[edge.source].push({
      target: edge.target,
      condition: edge.label || null
    });
  });

  // Generate steps from nodes
  const steps = nodes.map(node => {
    const step = {
      id: node.id,
      type: getStepType(node.data.label),
      label: node.data.label,
      config: node.data.config || {},
      position: node.position,
      nextSteps: nodeConnections[node.id] || []
    };

    return step;
  });

  return {
    id: `campaign-${Date.now()}`,
    name: "Email Campaign",
    description: "Generated from visual builder",
    steps,
    edges,
    createdAt: new Date().toISOString(),
    version: "1.0"
  };
};

const getStepType = (label) => {
  switch (label) {
    case "Send Email":
      return "send_email";
    case "Wait":
      return "wait";
    case "Condition":
      return "condition";
    default:
      return "unknown";
  }
};

export const validateCampaignSchema = (schema) => {
  const errors = [];

  // Check if there are any steps
  if (!schema.steps || schema.steps.length === 0) {
    errors.push("Campaign must have at least one step");
  }

  // Check for disconnected nodes
  const connectedNodes = new Set();
  schema.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  schema.steps.forEach(step => {
    if (!connectedNodes.has(step.id) && schema.steps.length > 1) {
      errors.push(`Node "${step.label}" is not connected to the flow`);
    }
  });

  // Check for required configurations
  schema.steps.forEach(step => {
    if (step.type === "send_email" && (!step.config.subject || !step.config.content)) {
      errors.push(`Send Email node "${step.label}" is missing subject or content`);
    }
    if (step.type === "wait" && !step.config.duration) {
      errors.push(`Wait node "${step.label}" is missing duration`);
    }
    if (step.type === "condition" && (!step.config.conditionType || !step.config.conditionValue)) {
      errors.push(`Condition node "${step.label}" is missing condition configuration`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const exportCampaignSchema = (schema) => {
  return JSON.stringify(schema, null, 2);
}; 