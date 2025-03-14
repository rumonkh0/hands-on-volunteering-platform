const eventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Event title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Event description cannot exceed 1000 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required']
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      maxlength: [200, 'Event location cannot exceed 200 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', 
      required: [true, 'Event category is required']
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator is required']
    }
  },
  { timestamp: true });
  
  const Event = mongoose.model('Event', eventSchema);