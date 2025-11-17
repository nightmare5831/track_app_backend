import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['loading', 'unloading', 'digging', 'idle', 'maintenance']
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'
  },
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: Date,
  duration: Number,
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

activitySchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

export default mongoose.model('Activity', activitySchema);
