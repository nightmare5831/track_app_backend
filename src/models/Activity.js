import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  activityType: {
    type: String,
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  truckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  details: {
    type: String
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
