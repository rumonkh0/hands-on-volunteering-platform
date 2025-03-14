const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const HelpRequest = require("../models/HelpRequest");

// @desc      Create a new help request
// @route     POST /api/v1/help-requests
// @access    Private
exports.createHelpRequest = asyncHandler(async (req, res, next) => {
  const { title, description, urgency_level } = req.body;

  // Create the help request
  const helpRequest = await HelpRequest.create({
    title,
    description,
    urgency_level,
    created_by: req.user.id,
  });

  res.status(201).json({ success: true, data: helpRequest });
});

// @desc      Get all help requests
// @route     GET /api/v1/help-requests
// @access    Public
exports.getHelpRequests = asyncHandler(async (req, res, next) => {
  const { urgency_level } = req.query;

  // Build the filter object
  const filter = {};
  if (urgency_level) filter.urgency_level = urgency_level;

  // Fetch help requests with filters
  const helpRequests = await HelpRequest.find(filter).populate(
    "created_by",
    "name email"
  );

  res
    .status(200)
    .json({ success: true, count: helpRequests.length, data: helpRequests });
});

// @desc      Get a single help request by ID
// @route     GET /api/v1/help-requests/:id
// @access    Public
exports.getSingleHelpRequest = asyncHandler(async (req, res, next) => {
  const helpRequestId = req.params.id;

  // Fetch the help request and populate relevant fields
  const helpRequest = await HelpRequest.findById(helpRequestId)
    .populate("created_by", "name email") // Populate creator details
    .populate("comments.posted_by", "name email "); // Populate commenter details

  if (!helpRequest) {
    return next(
      new ErrorResponse(`Help request not found with id ${helpRequestId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: helpRequest });
});

// @desc      Add a comment to a help request
// @route     POST /api/v1/help-requests/:id/comments
// @access    Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const helpRequestId = req.params.id;
  const { text } = req.body;

  // Check if the help request exists
  const helpRequest = await HelpRequest.findById(helpRequestId);
  if (!helpRequest) {
    return next(
      new ErrorResponse(`Help request not found with id ${helpRequestId}`, 404)
    );
  }

  // Add the comment to the help request
  helpRequest.comments.push({
    text,
    posted_by: req.user.id, // Attach the user ID from the request (authenticated user)
  });

  await helpRequest.save();

  res.status(200).json({ success: true, data: helpRequest });
});

// @desc      Update the status of a help request
// @route     PUT /api/v1/help-requests/:id/status
// @access    Private
exports.updateHelpRequestStatus = asyncHandler(async (req, res, next) => {
  const helpRequestId = req.params.id;
  const { status } = req.body;

  // Check if the help request exists
  const helpRequest = await HelpRequest.findById(helpRequestId);
  if (!helpRequest) {
    return next(
      new ErrorResponse(`Help request not found with id ${helpRequestId}`, 404)
    );
  }

  // Update the status
  helpRequest.status = status;
  await helpRequest.save();

  res.status(200).json({ success: true, data: helpRequest });
});
