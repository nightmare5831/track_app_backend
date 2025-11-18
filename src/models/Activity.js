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
  },
  activityDetails: {
    stopped_reason: {
      type: [String],
      enum: [
        'Rain',
        'No truck available',
        'No loader',
        'Lost key',
        'Equipment breakdown',
        'Fuel shortage',
        'Operator unavailable',
        'Safety issue',
        'Weather conditions',
        'End of shift'
      ],
      default: []
    },
    waiting_reason: {
      type: [String],
      enum: [
        'Access issues',
        'Lack of trucks',
        'Waiting for instructions',
        'Waiting for equipment',
        'Road maintenance',
        'Traffic congestion',
        'Loading delay',
        'Authorization pending'
      ],
      default: []
    },
    custom_reason: {
      type: [String],
      default: []
    }
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
