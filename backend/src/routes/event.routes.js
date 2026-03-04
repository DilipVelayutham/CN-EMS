const express = require("express");
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    registerEvent
} = require("../controllers/event.controller");

const authOrganizer = require("../middleware/authOrganizer");
const authUser = require("../middleware/authUser");

router.post("/events", authOrganizer, createEvent);

router.get("/events", authUser, getAllEvents);

router.post("/events/register", authUser, registerEvent);
module.exports = router;