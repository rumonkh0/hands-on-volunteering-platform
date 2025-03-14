const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  joinEvent,
  getEventsByUser,
  logVolunteerHours,
  getUsersByEvents,
} = require("../controllers/event");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/user/:id", getEventsByUser);
router.get("/:id/user", getUsersByEvents);
router.get("/:id", getEvent);
router.get("/", getEvents);
router.post("/:id/log-hours", logVolunteerHours);
router.post("/:id/join", joinEvent);
router.post("/", createEvent);

module.exports = router;
