import { useState, useEffect } from "react";
import axios from "axios";

export default function CampaignDashboard({ campaignId }) {
  const [userStates, setUserStates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignData();
      // Set up auto-refresh every 5 seconds
      const interval = setInterval(fetchCampaignData, 5000);
      return () => clearInterval(interval);
    }
  }, [campaignId]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userStatesRes, eventsRes] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/campaigns/${campaignId}/users`
        ),
        axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/campaigns/${campaignId}/events`
        ),
      ]);

      setUserStates(userStatesRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error("Error fetching campaign data:", error);

      // Provide more specific error messages
      if (error.code === "ECONNREFUSED") {
        setError(
          "Cannot connect to server. Make sure the backend server is running on port 5000."
        );
      } else if (error.response?.status === 503) {
        setError("Database not available. Please check MongoDB connection.");
      } else if (error.response?.status === 404) {
        setError(
          "Campaign not found. The campaign may not have been saved yet."
        );
      } else {
        setError("Failed to fetch campaign data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerEvent = async (eventType, userId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/campaigns/events/${eventType}`,
        {
          userId,
          campaignId,
          additionalData: { manual: true },
        }
      );

      // Refresh data after a short delay
      setTimeout(fetchCampaignData, 1000);
    } catch (error) {
      console.error("Error triggering event:", error);
    }
  };

  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "email_sent":
        return "bg-blue-100 text-blue-800";
      case "opened":
        return "bg-green-100 text-green-800";
      case "clicked":
        return "bg-purple-100 text-purple-800";
      case "page_visited":
        return "bg-indigo-100 text-indigo-800";
      case "form_submitted":
        return "bg-orange-100 text-orange-800";
      case "wait_started":
        return "bg-yellow-100 text-yellow-800";
      case "wait_completed":
        return "bg-orange-100 text-orange-800";
      case "condition_evaluating":
        return "bg-indigo-100 text-indigo-800";
      case "condition_result":
        return "bg-pink-100 text-pink-800";
      case "campaign_completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading campaign data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-2 mt-0.5"
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
            <div>
              <span className="text-red-800 font-medium">{error}</span>
              <div className="text-sm text-red-600 mt-2">
                <p>Troubleshooting steps:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Make sure the backend server is running on port 5000</li>
                  <li>Check if MongoDB is installed and running</li>
                  <li>Try refreshing the page</li>
                  <li>Check the browser console for more details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Campaign Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchCampaignData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold text-blue-600">
            {userStates.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold text-green-600">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Campaign ID</h3>
          <p className="text-sm font-mono text-gray-600">{campaignId}</p>
        </div>
      </div>

      {/* User States */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          User States ({userStates.length})
        </h3>
        {userStates.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No users found. Campaign may not have started yet.</p>
            <p className="text-sm mt-2">Try refreshing in a few seconds.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userStates.map((userState, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <strong className="text-blue-600">
                        {userState.userId}
                      </strong>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {userState.history?.length || 0} steps
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>Current Node:</strong> {userState.currentNode}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Campaign ID:</strong> {userState.campaignId}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => triggerEvent("opened", userState.userId)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Trigger Open
                    </button>
                    <button
                      onClick={() => triggerEvent("clicked", userState.userId)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      Trigger Click
                    </button>
                    <button
                      onClick={() =>
                        triggerEvent("page_visited", userState.userId)
                      }
                      className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                    >
                      Trigger Page Visit
                    </button>
                    <button
                      onClick={() =>
                        triggerEvent("form_submitted", userState.userId)
                      }
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                    >
                      Trigger Form Submit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Recent Events ({events.length})
        </h3>
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No events recorded yet.</p>
            <p className="text-sm mt-2">
              Events will appear as the campaign progresses.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.map((event, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(
                          event.eventType
                        )}`}
                      >
                        {event.eventType}
                      </span>
                      <span className="text-sm font-medium">
                        {event.recipient}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {event.additionalData &&
                      Object.keys(event.additionalData).length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          <strong>Data:</strong>{" "}
                          {JSON.stringify(event.additionalData)}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
