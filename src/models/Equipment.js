import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['excavator', 'truck', 'drill', 'loader', 'other']
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Equipment', equipmentSchema);
