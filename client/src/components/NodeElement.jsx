import { Handle, Position } from "reactflow";

export default function NodeElement({ data, selected, dragging }) {
  let bgColor = "bg-gray-200";
  let textColor = "text-black";
  let borderColor = "border-gray-300";

  if (data.label === "Send Email") {
    bgColor = "bg-blue-500";
    textColor = "text-white";
    borderColor = "border-blue-600";
  } else if (data.label === "Wait") {
    bgColor = "bg-green-500";
    textColor = "text-white";
    borderColor = "border-green-600";
  } else if (data.label === "Condition") {
    bgColor = "bg-yellow-500";
    textColor = "text-black";
    borderColor = "border-yellow-600";
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-md text-sm font-bold border-2 ${bgColor} ${textColor} ${
        selected ? `ring-4 ring-blue-400 ${borderColor}` : "border-transparent"
      } ${
        dragging ? "opacity-50" : ""
      } cursor-pointer hover:opacity-80 transition-all min-w-[120px] relative`}
    >
      {/* Configuration indicator */}
      {data.config && Object.keys(data.config).length > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600 transition-colors"
        style={{ top: -6 }}
      />
      <div className="text-center">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white hover:bg-green-600 transition-colors"
        style={{ bottom: -6 }}
      />
    </div>
  );
}
