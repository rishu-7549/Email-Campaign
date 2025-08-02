import axios from "axios";
import { serializeFlow } from "../utils/flowUtils";
import {
  generateCampaignSchema,
  validateCampaignSchema,
  exportCampaignSchema,
} from "../utils/campaignSchema";
import { useState, useEffect } from "react";
import CampaignDashboard from "./CampaignDashboard";

export default function TopBar({
  nodes,
  edges,
  user,
  onLogout,
  onLoadCampaign,
}) {
  const [showDashboard, setShowDashboard] = useState(false);
  const [savedCampaignId, setSavedCampaignId] = useState(null);

  // Clear dashboard state when user changes
  useEffect(() => {
    console.log(`🔄 Clearing dashboard state for user: ${user?.email}`);
    setShowDashboard(false);
    setSavedCampaignId(null);
  }, [user?.email]);

  const loadCampaign = async (campaignId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaignId}`
      );
      const campaign = response.data;
      if (campaign.nodes && campaign.edges) {
        if (onLoadCampaign) {
          onLoadCampaign(campaign.nodes, campaign.edges);
        }
        setSavedCampaignId(campaignId);
        alert("Campaign loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading campaign:", error);
      alert("Failed to load campaign");
    }
  };

  const loadLastCampaign = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/campaigns?userId=${
          user?._id
        }&limit=1`
      );
      if (response.data.length > 0) {
        const lastCampaign = response.data[0]; // Most recent campaign
        await loadCampaign(lastCampaign._id);
      } else {
        alert("No campaigns found. Create your first campaign!");
      }
    } catch (error) {
      console.error("Error loading last campaign:", error);
      alert("Failed to load last campaign");
    }
  };

  const clearCanvas = () => {
    if (onLoadCampaign) {
      onLoadCampaign([], []); // Clear nodes and edges
    }
    setSavedCampaignId(null);
    alert("Canvas cleared!");
  };

  const saveFlow = async () => {
    try {
      const flowData = serializeFlow(nodes, edges);

      // Add user information to the campaign data
      const campaignData = {
        ...flowData,
        userId: user?._id,
        userEmail: user?.email,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
        campaignData
      );
      setSavedCampaignId(response.data.campaign._id);
      alert("Campaign saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save campaign");
    }
  };

  const exportCampaign = () => {
    try {
      const schema = generateCampaignSchema(nodes, edges);
      const validation = validateCampaignSchema(schema);

      if (!validation.isValid) {
        alert(`Campaign validation failed:\n${validation.errors.join("\n")}`);
        return;
      }

      const schemaJson = exportCampaignSchema(schema);
      const blob = new Blob([schemaJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campaign-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("Campaign schema exported successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to export campaign schema");
    }
  };

  const validateCampaign = () => {
    const schema = generateCampaignSchema(nodes, edges);
    const validation = validateCampaignSchema(schema);

    if (validation.isValid) {
      alert("Campaign is valid!");
    } else {
      alert(`Campaign validation failed:\n${validation.errors.join("\n")}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
        <div>
          <h1 className="font-bold text-xl">Email Campaign Builder</h1>
          <p className="text-sm text-gray-500">Logged in as: {user?.email}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={validateCampaign}
          >
            Validate
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            onClick={exportCampaign}
          >
            Export Schema
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={saveFlow}
          >
            Save Campaign
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            onClick={loadLastCampaign}
          >
            Load Last Campaign
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>
          {savedCampaignId && (
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              onClick={() => setShowDashboard(!showDashboard)}
            >
              {showDashboard ? "Hide" : "Show"} Dashboard
            </button>
          )}
        </div>
      </div>

      {showDashboard && savedCampaignId && (
        <div className="bg-gray-50 border-b border-gray-200">
          <CampaignDashboard campaignId={savedCampaignId} />
        </div>
      )}
    </>
  );
}
