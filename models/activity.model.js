const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  userId:{
    type: String,
    required: true,
  },
  
});

const Task = mongoose.model('Task', activitySchema);
const Meeting = mongoose.model('Meeting', activitySchema);
const Call = mongoose.model('Call', activitySchema);
const CloseTask = mongoose.model('CloseTask', activitySchema);
const CloseMeeting = mongoose.model('CloseMeeting', activitySchema);
const CloseCall = mongoose.model('CloseCall', activitySchema);
module.exports = { Task, Meeting, Call ,CloseTask , CloseMeeting, CloseCall};