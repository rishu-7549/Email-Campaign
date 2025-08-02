import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeElement from "./NodeElement";
import NodeConfigModal from "./NodeConfigModal";
import { useState } from "react";

const nodeTypes = {
  customNode: NodeElement,
};

// Custom edge styles
const edgeStyles = {
  stroke: "#2563eb",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};

export default function Canvas({ nodes, setNodes, edges, setEdges, onNodeSelect }) {
  const [configModal, setConfigModal] = useState({ isOpen: false, node: null });

  const onNodesChange = (changes) => {
    console.log("Node changes:", changes);
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange = (changes) => {
    console.log("Edge changes:", changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect = (params) => {
    console.log("Connecting nodes:", params);
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          style: edgeStyles,
          type: "smoothstep",
        },
        eds
      )
    );
  };

  const onNodeClick = (event, node) => {
    console.log("Node clicked:", node);
    // Pass the selected node to parent component
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  const onNodeDoubleClick = (event, node) => {
    console.log("Node double clicked:", node);
    setConfigModal({ isOpen: true, node });
  };

  const onNodeDragStart = (event, node) => {
    console.log("Node drag start:", node);
  };

  const onNodeDrag = (event, node) => {
    console.log("Node dragging:", node);
  };

  const onNodeDragStop = (event, node) => {
    console.log("Node drag stop:", node);
  };

  const handleConfigSave = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, config } } : node
      )
    );
  };

  return (
    <div className="flex-1 h-full bg-gray-100 relative">
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2">
              Welcome to Campaign Builder
            </h3>
            <p className="text-gray-600 mb-4">
              Add nodes from the left panel and connect them to build your email
              campaign
            </p>
            <div className="text-sm text-gray-500">
              <p>• Click and drag nodes to move them</p>
              <p>• Drag from the bottom handle to connect to another node</p>
              <p>• Click on nodes to configure them in the right sidebar</p>
              <p>• Double-click nodes to open quick config modal</p>
            </div>
          </div>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode="loose"
        deleteKeyCode="Delete"
        defaultEdgeOptions={{
          type: "smoothstep",
          style: edgeStyles,
        }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      <NodeConfigModal
        node={configModal.node}
        isOpen={configModal.isOpen}
        onClose={() => setConfigModal({ isOpen: false, node: null })}
        onSave={handleConfigSave}
      />
    </div>
  );
}
