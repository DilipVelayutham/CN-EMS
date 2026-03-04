const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const dynamoDB = require("../config/dynamo");
const authOrganizer = require("../middleware/authOrganizer");


// ============================
// TEST ROUTE
// ============================
router.get("/test", authOrganizer, (req, res) => {
  res.json({
    message: "Organizer authenticated",
    organizer: req.organizer
  });
});


// ============================
// CREATE EVENT
// ============================
router.post("/events", authOrganizer, async (req, res) => {
  try {
    const { title, description, category, date, location, status } = req.body;

    const newEvent = {
      eventId: uuidv4(),
      organizerId: req.organizer.organizerId,
      title,
      description,
      category,
      date,
      location,
      status: req.body.status ||"DRAFT",
      createdAt: new Date().toISOString()
    };

    await dynamoDB.put({
      TableName: "Events",
      Item: newEvent
    }).promise();

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({
      message: "Error creating event"
    });
  }
});


// ============================
// GET ALL EVENTS FOR ORGANIZER
// ============================
router.get("/events", authOrganizer,async (req, res) => {
  try {
    const result = await dynamoDB.query({
      TableName: "Events",
      IndexName: "organizerId-index",
      KeyConditionExpression: "organizerId = :orgId",
      ExpressionAttributeValues: {
        ":orgId": req.organizer.organizerId
      }
    }).promise();

    res.json({
      events: result.Items
    });

  } catch (error) {
    console.error("Fetch Events Error:", error);
    res.status(500).json({
      message: "Error fetching events"
    });
  }
});


module.exports = router;

// ============================
// UPDATE EVENT
// ============================
router.put("/events/:eventId", authOrganizer, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, category, date, location } = req.body;

    await dynamoDB.update({
      TableName: "Events",
      Key: { eventId },
      UpdateExpression: `
        SET title = :title,
            description = :description,
            category = :category,
            #date = :date,
            location = :location
      `,
      ExpressionAttributeNames: {
        "#date": "date"
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":category": category,
        ":date": date,
        ":location": location
      }
    }).promise();

    res.json({ message: "Event updated successfully" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Error updating event" });
  }
});

// ============================
// DELETE EVENT
// ============================
router.delete("/events/:eventId", authOrganizer, async (req, res) => {
  try {
    const { eventId } = req.params;

    await dynamoDB.delete({
      TableName: "Events",
      Key: { eventId }
    }).promise();

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// ============================
// PUBLISH / UNPUBLISH EVENT
// ============================
router.patch("/events/:eventId/publish", authOrganizer, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body; // "PUBLISHED" or "DRAFT"

    await dynamoDB.update({
      TableName: "Events",
      Key: { eventId },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": status
      }
    }).promise();

    res.json({ message: `Event status updated to ${status}` });

  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ message: "Error updating status" });
  }
});
