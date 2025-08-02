import express from "express";
import Campaign from "../models/campaign.js";
import { runCampaign, handleUserEvent, getUserState, getCampaignUserStates } from "../services/campaignRunner.js";
import EmailEvent from "../models/emailEvent.js";

const router = express.Router();

// Save campaign & start it
router.post("/", async (req, res) => {
  try {
    console.log("Saving campaign:", req.body);

    // Check if we can connect to the database
    if (!Campaign.db.readyState) {
      return res.status(503).json({
        message: "Database not available. Please check MongoDB connection.",
        error: "Database connection failed"
      });
    }

    const campaign = await Campaign.create(req.body);

    console.log("Campaign saved with ID:", campaign._id);

    // Start the campaign asynchronously
    runCampaign(campaign).catch(error => {
      console.error("Error starting campaign:", error);
    });

    res.status(201).json({
      message: "Campaign saved & started",
      campaign,
      note: "Campaign is starting with 5 test users"
    });
  } catch (err) {
    console.error("Error saving campaign:", err);
    res.status(500).json({
      message: "Error saving campaign",
      error: err.message
    });
  }
});

// Tracking pixel for open event
router.get("/events/open/:campaignId/:userId", async (req, res) => {
  try {
    const { campaignId, userId } = req.params;

    await handleUserEvent("opened", userId, campaignId);

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length
    });
    res.end(pixel);
  } catch (err) {
    console.error("Error handling open event:", err);
    res.status(500).send();
  }
});

// Link click tracking
router.get("/events/click/:campaignId/:userId", async (req, res) => {
  try {
    const { campaignId, userId } = req.params;
    const { url } = req.query;

    await handleUserEvent("clicked", userId, campaignId, { url });

    // Redirect to the actual URL
    res.redirect(url || "/");
  } catch (err) {
    console.error("Error handling click event:", err);
    res.status(500).send();
  }
});

// Manual event trigger (for testing)
router.post("/events/:eventType", async (req, res) => {
  try {
    const { eventType } = req.params;
    const { userId, campaignId, additionalData } = req.body;

    await handleUserEvent(eventType, userId, campaignId, additionalData);

    res.json({ message: "Event recorded successfully" });
  } catch (err) {
    console.error("Error recording event:", err);
    res.status(500).json({ message: "Error recording event" });
  }
});

// Get user state
router.get("/users/:userId/state", async (req, res) => {
  try {
    const { userId } = req.params;
    const userState = getUserState(userId);

    if (userState) {
      res.json(userState);
    } else {
      res.status(404).json({ message: "User state not found" });
    }
  } catch (err) {
    console.error("Error getting user state:", err);
    res.status(500).json({ message: "Error getting user state" });
  }
});

// Get all user states for a campaign
router.get("/:campaignId/users", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const userStates = getCampaignUserStates(campaignId);

    res.json(userStates);
  } catch (err) {
    console.error("Error getting campaign user states:", err);
    res.status(500).json({ message: "Error getting user states" });
  }
});

// Get campaign events
router.get("/:campaignId/events", async (req, res) => {
  try {
    const { campaignId } = req.params;

    // Check if we can connect to the database
    if (!EmailEvent.db.readyState) {
      return res.json([]); // Return empty array if database not available
    }

    const events = await EmailEvent.find({ campaignId }).sort({ timestamp: -1 });

    res.json(events);
  } catch (err) {
    console.error("Error getting campaign events:", err);
    res.status(500).json({ message: "Error getting events" });
  }
});

// Get all campaigns (filtered by user if userId provided)
router.get("/", async (req, res) => {
  try {
    // Check if we can connect to the database
    if (!Campaign.db.readyState) {
      return res.json([]); // Return empty array if database not available
    }

    const { userId, limit } = req.query;
    let query = {};

    // If userId is provided, filter campaigns by user
    if (userId) {
      query.userId = userId;
    }

    let campaignsQuery = Campaign.find(query).sort({ createdAt: -1 });

    // If limit is provided, limit the results
    if (limit) {
      campaignsQuery = campaignsQuery.limit(parseInt(limit));
    }

    const campaigns = await campaignsQuery;
    res.json(campaigns);
  } catch (err) {
    console.error("Error getting campaigns:", err);
    res.status(500).json({ message: "Error getting campaigns" });
  }
});

// Get specific campaign (this must come after more specific routes)
router.get("/:id([a-fA-F0-9]{24})", async (req, res) => {
  try {
    // Check if we can connect to the database
    if (!Campaign.db.readyState) {
      return res.status(503).json({ message: "Database not available" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ message: "Campaign not found" });
    }
  } catch (err) {
    console.error("Error getting campaign:", err);
    res.status(500).json({ message: "Error getting campaign" });
  }
});

export default router;
