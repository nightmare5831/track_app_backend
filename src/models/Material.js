import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['ore', 'mineral', 'waste', 'processed', 'other'],
    default: 'ore'
  },
  properties: {
    density: {
      type: Number, 
    },
    volume: {
      type: Number, 
    },
    gradePercentage: {
      type: Number, 
    },
    moistureContent: {
      type: Number, 
    },
    customFields: [{
      name: String,
      value: mongoose.Schema.Types.Mixed
    }]
  },
}, { timestamps: true });

export default mongoose.model('Material', materialSchema);
