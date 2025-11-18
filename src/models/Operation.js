import mongoose from 'mongoose';

const operationSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  truckBeingLoaded: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  miningFront: {
    type: String
  },
  destination: {
    type: String
  },
  distance: {
    type: Number,
    default: 0
  },
  activityDetails: {
    type: String
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Operation', operationSchema);
