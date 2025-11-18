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
        'Equipment breakdown',
        'Fuel shortage',
        'Operator unavailable',
        'Safety issue',
        'End of shift',
        'Maintenance',
        'Road obstacle'
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
        'Loading delay',
        'Queue at loading point',
        'Queue at dump site'
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
