const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Event = require("../models/Event");
const EventParticipation = require("../models/EventParticipation");
// const User = require("../models/User");

// @desc      Create a new event
// @route     POST /api/v1/events
// @access    Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, date, time, location, category, team_id } =
    req.body;

  let is_public = true;

  // If the event is associated with a team, inherit the team's visibility setting
  if (team_id) {
    const team = await Team.findById(team_id);
    if (!team) {
      return next(new ErrorResponse(`Team not found with id ${team_id}`, 404));
    }
    is_public = team.is_public;
  }

  // Create the event
  const event = await Event.create({
    title,
    description,
    date,
    time,
    location,
    category,
    created_by: req.user.id,
    team_id,
    is_public,
  });

  res.status(201).json({ success: true, data: event });
});

// @desc      Get all events
// @route     GET /api/v1/events
// @access    Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, location, date } = req.query;

  // Build the filter object
  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (date) filter.date = { $gte: new Date(date) }; // Events on or after the specified date

  // Fetch events with filters
  const events = await Event.find(filter).populate("created_by", "name email");

  res.status(200).json({ success: true, count: events.length, data: events });
});

// @desc      Get a single event by ID
// @route     GET /api/v1/events/:id
// @access    Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate(
    "created_by",
    "name email"
  );

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: event });
});

// @desc      Join an event and log volunteer hours
// @route     POST /api/v1/events/:id/join
// @access    Private
exports.joinEvent = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Check if the user is already attending the event
  const existingParticipation = await EventParticipation.findOne({
    user_id: userId,
    event_id: eventId,
  });

  if (existingParticipation) {
    return next(new ErrorResponse("User is already attending this event", 400));
  }

  // Create a new EventParticipation record
  const participation = await EventParticipation.create({
    user_id: userId,
    event_id: eventId,
    hours_logged: 0,
    verified: false,
  });

  res.status(200).json({ success: true, data: participation });
});

// @desc      Log volunteer hours for an event
// @route     PUT /api/v1/events/:id/log-hours
// @access    Private
exports.logVolunteerHours = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const { hours_logged } = req.body;

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Find the user's participation record
  const participation = await VolunteerHours.findOne({
    user_id: userId,
    event_id: eventId,
  });

  if (!participation) {
    return next(new ErrorResponse("User is not attending this event", 400));
  }

  // Update the hours_logged field
  participation.hours_logged = hours_logged;
  await participation.save();

  res.status(200).json({ success: true, data: participation });
});

// @desc      Get all events created by a specific user
// @route     GET /api/v1/events/user/:userId
// @access    Public
exports.getEventsByUser = asyncHandler(async (req, res, next) => {
  const events = await Event.find({ created_by: req.params.userId });

  res.status(200).json({ success: true, count: events.length, data: events });
});

// @desc      Get all users who participated in a specific event
// @route     GET /api/v1/events/:id/users
// @access    Public
exports.getUsersByEvents = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Fetch all VolunteerHours records for the event and populate user details
  const volunteerHours = await VolunteerHours.find({
    event_id: eventId,
  }).populate("user_id", "name email");

  // Extract user details and hours logged
  const users = volunteerHours.map((record) => ({
    user: record.user_id,
    hours_logged: record.hours_logged,
    verified: record.verified,
    verified_by: record.verified_by,
    created_at: record.created_at,
  }));

  res.status(200).json({ success: true, count: users.length, data: users });
});
