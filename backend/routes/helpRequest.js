const express = require("express");
const {
  createHelpRequest,
  getHelpRequests,
  getSingleHelpRequest,
  addComment,
  updateHelpRequestStatus,
} = require("../controllers/helpRequest");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", createHelpRequest);
router.get("/", getHelpRequests);
router.get("/:id", getSingleHelpRequest);
router.get("/:id/comments", addComment);
router.put("/:id/status", updateHelpRequestStatus);

module.exports = router;
