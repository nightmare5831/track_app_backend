import Operation from '../models/Operation.js';

// Start new operation
export const startOperation = async (req, res) => {
  try {
    const { equipment, activity, activityDetails, material, truckBeingLoaded, miningFront, destination } = req.body;

    // Check if user already has an active operation
    const existingOperation = await Operation.findOne({
      operator: req.user.id,
      endTime: null
    });

    if (existingOperation) {
      return res.status(400).json({ success: false, message: 'You already have an active operation. Please stop it first.' });
    }

    // Build operation object - always use authenticated user as operator
    const operation = new Operation({
      equipment,
      operator: req.user.id, // Always use authenticated user
      activity,
      activityDetails,
      material,
      truckBeingLoaded,
      miningFront,
      destination,
      startTime: new Date()
    });

    await operation.save();

    // Populate references before returning
    await operation.populate('equipment operator activity material truckBeingLoaded');

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

    // Security: Ensure user can only stop their own operations
    if (operation.operator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to stop this operation' });
    }

    operation.endTime = new Date();
    if (distance !== undefined) {
      operation.distance = distance;
    }

    await operation.save();
    await operation.populate('equipment operator activity material truckBeingLoaded');

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
      .populate('equipment operator activity material truckBeingLoaded')
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
      .populate('equipment operator activity material truckBeingLoaded')
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
      .populate('equipment operator activity material truckBeingLoaded');

    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found' });
    }

    // Security: Ensure user can only view their own operations
    if (operation.operator._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this operation' });
    }

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update operation
export const updateOperation = async (req, res) => {
  try {
    const { activity, activityDetails, material, truckBeingLoaded, miningFront, destination, distance } = req.body;
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      return res.status(404).json({ success: false, message: 'Operation not found' });
    }

    // Security: Ensure user can only update their own operations
    if (operation.operator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this operation' });
    }

    // Update fields if provided
    if (activity) operation.activity = activity;
    if (activityDetails !== undefined) operation.activityDetails = activityDetails;
    if (material !== undefined) operation.material = material;
    if (truckBeingLoaded !== undefined) operation.truckBeingLoaded = truckBeingLoaded;
    if (miningFront !== undefined) operation.miningFront = miningFront;
    if (destination !== undefined) operation.destination = destination;
    if (distance !== undefined) operation.distance = distance;

    await operation.save();
    await operation.populate('equipment operator activity material truckBeingLoaded');

    res.json({ success: true, data: operation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
