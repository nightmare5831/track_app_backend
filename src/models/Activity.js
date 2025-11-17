import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
