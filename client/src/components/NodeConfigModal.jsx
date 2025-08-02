import { useState, useEffect } from "react";

export default function NodeConfigModal({ node, isOpen, onClose, onSave }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (node) {
      setConfig(node.data.config || {});
    }
  }, [node]);

  if (!isOpen || !node) return null;

  const renderConfigForm = () => {
    switch (node.data.label) {
      case "Send Email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={config.subject || ""}
                onChange={(e) =>
                  setConfig({ ...config, subject: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Content
              </label>
              <textarea
                value={config.content || ""}
                onChange={(e) =>
                  setConfig({ ...config, content: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter email content"
              />
            </div>
          </div>
        );

      case "Wait":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wait Duration (days)
              </label>
              <input
                type="number"
                value={config.duration || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter wait duration in days"
                min="0"
              />
            </div>
          </div>
        );

      case "Condition":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Type
              </label>
              <select
                value={config.conditionType || ""}
                onChange={(e) =>
                  setConfig({ ...config, conditionType: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select condition type</option>
                <option value="email_opened">Email Opened</option>
                <option value="link_clicked">Link Clicked</option>
                <option value="purchase_made">Purchase Made</option>
                <option value="idle_time">Idle Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Value
              </label>
              <input
                type="text"
                value={config.conditionValue || ""}
                onChange={(e) =>
                  setConfig({ ...config, conditionValue: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter condition value"
              />
            </div>
          </div>
        );

      default:
        return <div>No configuration needed for this node type.</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Configure {node.data.label}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {renderConfigForm()}

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(node.id, config);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
