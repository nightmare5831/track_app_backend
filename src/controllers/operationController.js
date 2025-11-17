import Operation from '../models/Operation.js';

// Start new operation
export const startOperation = async (req, res) => {
  try {
    const { equipment, activity, material, miningFront, destination, activityDetails } = req.body;

    const operation = new Operation({
      equipment,
      operator: req.user.id,
      activity,
      material,
      miningFront,
      destination,
      activityDetails,
      startTime: new Date()
    });

    await operation.save();

    // Populate references before returning
    await operation.populate('equipment operator activity material');

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Stop operation
export const stopOperation = async (req, res) => {
  try {
    const { distance } = req.body;
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found' });
    }

    // Check if operation belongs to the user
    if (operation.operator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    operation.endTime = new Date();
    if (distance) {
      operation.distance = distance;
    }

    await operation.save();
    await operation.populate('equipment operator activity material');

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current active operation for user
export const getCurrentOperation = async (req, res) => {
  try {
    const operation = await Operation.findOne({
      operator: req.user.id,
      endTime: null
    })
      .populate('equipment operator activity material')
      .sort({ startTime: -1 });

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all operations for user
export const getOperations = async (req, res) => {
  try {
    const { startDate, endDate, equipment, activity } = req.query;

    const filter = { operator: req.user.id };

    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    if (equipment) filter.equipment = equipment;
    if (activity) filter.activity = activity;

    const operations = await Operation.find(filter)
      .populate('equipment operator activity material')
      .sort({ startTime: -1 });

    res.json({ success: true, data: operations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get operation by ID
export const getOperationById = async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id)
      .populate('equipment operator activity material');

    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found' });
    }

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
