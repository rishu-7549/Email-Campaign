import { useState, useEffect } from "react";
import Canvas from "../components/Canvas";
import NodePanel from "../components/NodePanel";
import TopBar from "../components/TopBar";
import NodeConfigSidebar from "../components/NodeConfigSidebar";

export default function CampaignBuilder({ user, onLogout }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Clear campaign state when component mounts or user changes
  useEffect(() => {
    console.log(`🔄 Clearing campaign state for user: ${user?.email}`);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [user?.email]); // Reset when user email changes

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleNodeConfigSave = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, config } } : node
      )
    );
  };

  const handleNodeConfigClose = () => {
    setSelectedNode(null);
  };

  const handleLoadCampaign = (loadedNodes, loadedEdges) => {
    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        nodes={nodes}
        edges={edges}
        user={user}
        onLogout={onLogout}
        onLoadCampaign={handleLoadCampaign}
      />
      <div className="flex flex-1 overflow-hidden">
        <NodePanel setNodes={setNodes} nodes={nodes} />
        <Canvas
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          onNodeSelect={handleNodeSelect}
        />
        {selectedNode && (
          <NodeConfigSidebar
            selectedNode={selectedNode}
            onClose={handleNodeConfigClose}
            onSave={handleNodeConfigSave}
          />
        )}
      </div>
    </div>
  );
}
