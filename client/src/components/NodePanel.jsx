import { createNode } from "../utils/flowUtils";

export default function NodePanel({ setNodes, nodes }) {
  const addNode = (label) => {
    setNodes((nds) => [...nds, createNode(label, nds)]);
  };

  return (
    <div className="w-52 bg-white border-r border-gray-200 p-4 space-y-4">
      <h2 className="font-bold text-lg">Blocks</h2>
      <button
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => addNode("Send Email")}
      >
        Send Email
      </button>
      <button
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={() => addNode("Wait")}
      >
        Wait
      </button>
      <button
        className="w-full p-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors"
        onClick={() => addNode("Condition")}
      >
        Condition
      </button>
    </div>
  );
}
