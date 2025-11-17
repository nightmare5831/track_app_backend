import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
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
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  activityType: {
    type: String,
    required: true,
    enum: [
      'lunch', 'dinner', 'refueling', 'checklist', 'transfer', 'maintenance',
      'service', 'training_dds', 'operating_other_machine', 'machine_change',
      'bench_relocation', 'stopped', 'waiting',
      'loading', 'loading_truck',
      'load', 'trip_to_destination', 'unload', 'return'
    ]
  },
  activityDetails: {
    stoppedReason: {
      type: String,
      enum: ['rain', 'no_truck_available', 'no_loader', 'lost_key', 'other']
    },
    waitingReason: {
      type: String,
      enum: ['access_issues', 'lack_of_trucks', 'other']
    },
    customDetails: {
      type: String
    }
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
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
