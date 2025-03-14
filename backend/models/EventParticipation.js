const eventParticipationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  hours_logged: { type: Number, required: true },
  verified: { type: Boolean, default: false },
  verified_by: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  created_at: { type: Date, default: Date.now },
});

const EventParticipation = mongoose.model(
  "EventParticipation",
  eventParticipationSchema
);
