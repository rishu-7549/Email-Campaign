import { sendEmail } from "./emailService.js";
import { scheduleTask } from "./scheduler.js";
import EmailEvent from "../models/EmailEvent.js";
import Campaign from "../models/Campaign.js";

// User state management - store in memory for now, but could be moved to database
const userStates = new Map();

export const runCampaign = async (campaign) => {
  console.log("Starting campaign:", campaign._id);

  // Initialize campaign for all users
  const startNode = campaign.nodes.find(node =>
    !campaign.edges.some(edge => edge.target === node.id)
  );

  if (!startNode) {
    console.error("No start node found in campaign");
    return;
  }

  // Create multiple test users to simulate a real campaign
  const testUsers = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
    "user4@example.com",
    "user5@example.com"
  ];

  // Start the campaign for all test users
  for (const userId of testUsers) {
    console.log(`Starting campaign for user: ${userId}`);
    await executeNodeForUser(campaign, startNode, userId);
  }

  console.log(`Campaign started for ${testUsers.length} users`);
};

export const executeNodeForUser = async (campaign, node, userId) => {
  if (!node) return;

  console.log(`Executing node ${node.id} (${node.data.label}) for user ${userId}`);

  // Update user state
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      campaignId: campaign._id,
      currentNode: node.id,
      history: [],
      variables: {}
    });
  }

  const userState = userStates.get(userId);
  userState.currentNode = node.id;
  userState.history.push({
    nodeId: node.id,
    nodeType: node.data.label,
    timestamp: new Date(),
    config: node.data.config
  });

  try {
    switch (node.data.label) {
      case "Send Email":
        await handleSendEmail(campaign, node, userId);
        break;

      case "Wait":
        await handleWait(campaign, node, userId);
        break;

      case "Condition":
        await handleCondition(campaign, node, userId);
        break;

      default:
        console.warn(`Unknown node type: ${node.data.label}`);
        await proceedToNextNode(campaign, node, userId);
    }
  } catch (error) {
    console.error(`Error executing node ${node.id}:`, error);
  }
};

const handleSendEmail = async (campaign, node, userId) => {
  const config = node.data.config || {};
  const subject = config.subject || "Campaign Email";
  const content = config.content || "This is a campaign email.";

  console.log(`Sending email to ${userId}: ${subject}`);

  try {
    await sendEmail(userId, subject, content, campaign._id);
    console.log(`Email sent successfully to ${userId}`);

    // Record the email sent event
    await EmailEvent.create({
      eventType: "email_sent",
      recipient: userId,
      campaignId: campaign._id,
      additionalData: {
        subject,
        content: content.substring(0, 100) + "...",
        nodeId: node.id
      },
      timestamp: new Date()
    });

    // Proceed to next node immediately after sending
    await proceedToNextNode(campaign, node, userId);
  } catch (error) {
    console.error(`Failed to send email to ${userId}:`, error);
  }
};

const handleWait = async (campaign, node, userId) => {
  const config = node.data.config || {};
  const duration = config.duration || 1; // Default to 1 day
  const timeUnit = config.timeUnit || "days";

  console.log(`Scheduling wait for ${duration} ${timeUnit} for user ${userId}`);

  // Record the wait event
  await EmailEvent.create({
    eventType: "wait_started",
    recipient: userId,
    campaignId: campaign._id,
    additionalData: {
      duration,
      timeUnit,
      reason: config.reason || "No reason specified",
      nodeId: node.id
    },
    timestamp: new Date()
  });

  // For demo purposes, we'll wait a shorter time
  const waitMinutes = timeUnit === "minutes" ? duration :
    timeUnit === "hours" ? duration * 60 :
      timeUnit === "days" ? duration * 60 * 24 :
        duration * 60 * 24 * 7; // weeks

  // Use a shorter wait time for demo (1 minute instead of actual duration)
  const demoWaitMinutes = Math.min(waitMinutes, 1);

  setTimeout(async () => {
    console.log(`Wait completed for user ${userId}, proceeding to next node`);

    // Record wait completion
    await EmailEvent.create({
      eventType: "wait_completed",
      recipient: userId,
      campaignId: campaign._id,
      additionalData: {
        originalDuration: duration,
        timeUnit,
        nodeId: node.id
      },
      timestamp: new Date()
    });

    await proceedToNextNode(campaign, node, userId);
  }, demoWaitMinutes * 60 * 1000); // Convert to milliseconds
};

const handleCondition = async (campaign, node, userId) => {
  const config = node.data.config || {};
  const conditionType = config.conditionType;
  const conditionValue = config.conditionValue;

  console.log(`Evaluating condition for user ${userId}: ${conditionType} = ${conditionValue}`);

  // Record condition evaluation start
  await EmailEvent.create({
    eventType: "condition_evaluating",
    recipient: userId,
    campaignId: campaign._id,
    additionalData: {
      conditionType,
      conditionValue,
      nodeId: node.id
    },
    timestamp: new Date()
  });

  // Wait a bit to allow for events to be processed
  setTimeout(async () => {
    try {
      let conditionMet = false;

      switch (conditionType) {
        case "email_opened":
          const openEvent = await EmailEvent.findOne({
            campaignId: campaign._id,
            recipient: userId,
            eventType: "opened"
          });
          conditionMet = !!openEvent;
          break;

        case "link_clicked":
          const clickEvent = await EmailEvent.findOne({
            campaignId: campaign._id,
            recipient: userId,
            eventType: "clicked"
          });
          conditionMet = !!clickEvent;
          break;

        case "purchase_made":
          // This would integrate with e-commerce platform
          conditionMet = false; // Placeholder
          break;

        case "idle_time":
          const lastEvent = await EmailEvent.findOne({
            campaignId: campaign._id,
            recipient: userId
          }).sort({ timestamp: -1 });

          if (lastEvent) {
            const daysSinceLastEvent = (new Date() - lastEvent.timestamp) / (1000 * 60 * 60 * 24);
            conditionMet = daysSinceLastEvent >= parseInt(conditionValue);
          }
          break;

        case "page_visited":
          // For demo purposes, we'll simulate page visits
          // In a real app, this would check against actual page visit data
          const pageVisits = await EmailEvent.find({
            campaignId: campaign._id,
            recipient: userId,
            eventType: "page_visited",
            "additionalData.page": conditionValue
          });
          conditionMet = pageVisits.length > 0;

          // For demo: simulate some page visits for testing
          if (!conditionMet && Math.random() < 0.3) { // 30% chance of "visiting" the page
            await EmailEvent.create({
              eventType: "page_visited",
              recipient: userId,
              campaignId: campaign._id,
              additionalData: {
                page: conditionValue,
                simulated: true
              },
              timestamp: new Date()
            });
            conditionMet = true;
          }
          break;

        case "form_submitted":
          // For demo purposes, we'll simulate form submissions
          // In a real app, this would check against actual form submission data
          const formSubmissions = await EmailEvent.find({
            campaignId: campaign._id,
            recipient: userId,
            eventType: "form_submitted",
            "additionalData.form": conditionValue
          });
          conditionMet = formSubmissions.length > 0;

          // For demo: simulate some form submissions for testing
          if (!conditionMet && Math.random() < 0.2) { // 20% chance of "submitting" the form
            await EmailEvent.create({
              eventType: "form_submitted",
              recipient: userId,
              campaignId: campaign._id,
              additionalData: {
                form: conditionValue,
                simulated: true
              },
              timestamp: new Date()
            });
            conditionMet = true;
          }
          break;

        default:
          console.warn(`Unknown condition type: ${conditionType}`);
          conditionMet = false;
      }

      console.log(`Condition result for user ${userId}: ${conditionMet}`);

      // Record condition result
      await EmailEvent.create({
        eventType: "condition_result",
        recipient: userId,
        campaignId: campaign._id,
        additionalData: {
          conditionType,
          conditionValue,
          result: conditionMet,
          nodeId: node.id
        },
        timestamp: new Date()
      });

      // Find the appropriate next node based on condition result
      // First try to find edge with specific label
      let nextEdge = campaign.edges.find(edge =>
        edge.source === node.id &&
        edge.label === (conditionMet ? "yes" : "no")
      );

      // If no labeled edge found, take the first available edge
      if (!nextEdge) {
        nextEdge = campaign.edges.find(edge => edge.source === node.id);
      }

      if (nextEdge) {
        const nextNode = campaign.nodes.find(n => n.id === nextEdge.target);
        if (nextNode) {
          console.log(`Proceeding to next node: ${nextNode.id} (${nextNode.data.label}) for user ${userId}`);
          await executeNodeForUser(campaign, nextNode, userId);
        } else {
          console.log(`Next node not found for edge: ${nextEdge.id}`);
        }
      } else {
        console.log(`No next node found for condition result: ${conditionMet} - campaign completed for user ${userId}`);

        // Record campaign completion when no next node is found
        await EmailEvent.create({
          eventType: "campaign_completed",
          recipient: userId,
          campaignId: campaign._id,
          additionalData: {
            finalNode: node.id,
            reason: "No next node found after condition",
            conditionResult: conditionMet,
            totalSteps: userStates.get(userId)?.history?.length || 0
          },
          timestamp: new Date()
        });
      }

    } catch (error) {
      console.error(`Error evaluating condition for user ${userId}:`, error);
    }
  }, 2000); // Wait 2 seconds for events to be processed
};

const proceedToNextNode = async (campaign, node, userId) => {
  const nextEdge = campaign.edges.find(edge => edge.source === node.id);

  if (nextEdge) {
    const nextNode = campaign.nodes.find(n => n.id === nextEdge.target);
    if (nextNode) {
      await executeNodeForUser(campaign, nextNode, userId);
    } else {
      console.log(`Next node not found for edge: ${nextEdge.id}`);
    }
  } else {
    console.log(`No next edge found for node: ${node.id} - campaign completed for user ${userId}`);

    // Record campaign completion
    await EmailEvent.create({
      eventType: "campaign_completed",
      recipient: userId,
      campaignId: campaign._id,
      additionalData: {
        finalNode: node.id,
        totalSteps: userStates.get(userId)?.history?.length || 0
      },
      timestamp: new Date()
    });
  }
};

// Event handlers for user actions
export const handleUserEvent = async (eventType, userId, campaignId, additionalData = {}) => {
  console.log(`Handling user event: ${eventType} for user ${userId} in campaign ${campaignId}`);

  try {
    // Record the event
    await EmailEvent.create({
      eventType,
      recipient: userId,
      campaignId,
      additionalData,
      timestamp: new Date()
    });

    // Check if user is in a condition node that's waiting for this event
    const userState = userStates.get(userId);
    if (userState && userState.campaignId === campaignId) {
      const campaign = await Campaign.findById(campaignId);
      const currentNode = campaign.nodes.find(n => n.id === userState.currentNode);

      if (currentNode && currentNode.data.label === "Condition") {
        // Re-evaluate the condition
        await handleCondition(campaign, currentNode, userId);
      }
    }
  } catch (error) {
    console.error(`Error handling user event:`, error);
  }
};

// Get user state
export const getUserState = (userId) => {
  return userStates.get(userId);
};

// Get all user states for a campaign
export const getCampaignUserStates = (campaignId) => {
  const states = [];
  for (const [userId, state] of userStates.entries()) {
    if (state.campaignId === campaignId) {
      states.push({ userId, ...state });
    }
  }
  return states;
};
