import { useState, useEffect } from "react";

export default function NodeConfigSidebar({ selectedNode, onClose, onSave }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const renderConfigSummary = () => {
    const hasConfig = config && Object.keys(config).length > 0;

    if (!hasConfig) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium text-yellow-800">
              No configuration set
            </span>
          </div>
        </div>
      );
    }

    const summaryItems = [];

    switch (selectedNode.data.label) {
      case "Send Email":
        if (config.subject) summaryItems.push(`Subject: ${config.subject}`);
        if (config.content)
          summaryItems.push(`Content: ${config.content.substring(0, 50)}...`);
        if (config.template) summaryItems.push(`Template: ${config.template}`);
        break;
      case "Wait":
        if (config.duration)
          summaryItems.push(
            `Duration: ${config.duration} ${config.timeUnit || "days"}`
          );
        if (config.reason) summaryItems.push(`Reason: ${config.reason}`);
        break;
      case "Condition":
        if (config.conditionType)
          summaryItems.push(`Type: ${config.conditionType}`);
        if (config.conditionValue)
          summaryItems.push(`Value: ${config.conditionValue}`);
        if (config.description)
          summaryItems.push(`Description: ${config.description}`);
        break;
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-green-800">
            Configuration Summary
          </span>
        </div>
        <div className="space-y-1">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-xs text-green-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConfigForm = () => {
    switch (selectedNode.data.label) {
      case "Send Email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={config.subject || ""}
                onChange={(e) =>
                  setConfig({ ...config, subject: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={config.content || ""}
                onChange={(e) =>
                  setConfig({ ...config, content: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                placeholder="Enter email content"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Template
              </label>
              <select
                value={config.template || ""}
                onChange={(e) =>
                  setConfig({ ...config, template: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select template</option>
                <option value="welcome">Welcome Email</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotion">Promotion</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
          </div>
        );

      case "Wait":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wait Duration
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={config.duration || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Duration"
                  min="0"
                />
                <select
                  value={config.timeUnit || "days"}
                  onChange={(e) =>
                    setConfig({ ...config, timeUnit: e.target.value })
                  }
                  className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wait Reason
              </label>
              <textarea
                value={config.reason || ""}
                onChange={(e) =>
                  setConfig({ ...config, reason: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Why are we waiting? (optional)"
              />
            </div>
          </div>
        );

      case "Condition":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Type
              </label>
              <select
                value={config.conditionType || ""}
                onChange={(e) =>
                  setConfig({ ...config, conditionType: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select condition type</option>
                <option value="email_opened">Email Opened</option>
                <option value="link_clicked">Link Clicked</option>
                <option value="purchase_made">Purchase Made</option>
                <option value="idle_time">Idle Time</option>
                <option value="form_submitted">Form Submitted</option>
                <option value="page_visited">Page Visited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Value
              </label>
              <input
                type="text"
                value={config.conditionValue || ""}
                onChange={(e) =>
                  setConfig({ ...config, conditionValue: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter condition value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Description
              </label>
              <textarea
                value={config.description || ""}
                onChange={(e) =>
                  setConfig({ ...config, description: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe what this condition checks"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No configuration needed for this node type.</p>
          </div>
        );
    }
  };

  const handleSave = () => {
    onSave(selectedNode.id, config);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Configure {selectedNode.data.label}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Configuration Summary */}
        {renderConfigSummary()}

        {/* Node Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Node Information
          </h3>
          <div className="text-sm text-gray-600">
            <p>
              <strong>Type:</strong> {selectedNode.data.label}
            </p>
            <p>
              <strong>ID:</strong> {selectedNode.id}
            </p>
            <p>
              <strong>Position:</strong> ({Math.round(selectedNode.position.x)},{" "}
              {Math.round(selectedNode.position.y)})
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Configuration
          </h3>
          {renderConfigForm()}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
