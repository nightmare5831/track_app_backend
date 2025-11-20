import Operation from '../models/Operation.js';
import { User } from '../models/User.js';

// Get all active operations across all users (admin only)
export const getAllActiveOperations = async (req, res) => {
  try {
    const operations = await Operation.find({ endTime: null })
      .populate('equipment operator activity material truckBeingLoaded')
      .sort({ startTime: -1 });

    res.json({ success: true, data: operations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all operations with filters (admin only)
export const getAllOperations = async (req, res) => {
  try {
    const { startDate, endDate, operator, equipment, activity, status } = req.query;

    const filter = {};

    // Date range filter
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    // Specific filters
    if (operator) filter.operator = operator;
    if (equipment) filter.equipment = equipment;
    if (activity) filter.activity = activity;

    // Status filter (active vs completed)
    if (status === 'active') {
      filter.endTime = null;
    } else if (status === 'completed') {
      filter.endTime = { $ne: null };
    }

    const operations = await Operation.find(filter)
      .populate('equipment operator activity material truckBeingLoaded')
      .sort({ startTime: -1 });

    res.json({ success: true, data: operations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get inactivity alerts (admin only)
// Detects operations that have been running for too long without updates
export const getInactivityAlerts = async (req, res) => {
  try {
    const { thresholdMinutes = 30 } = req.query;
    const thresholdMs = parseInt(thresholdMinutes) * 60 * 1000;
    const now = new Date();
    const alertThreshold = new Date(now - thresholdMs);

    // Find active operations that started before the threshold
    const inactiveOperations = await Operation.find({
      endTime: null,
      startTime: { $lte: alertThreshold }
    })
      .populate('equipment operator activity material truckBeingLoaded')
      .sort({ startTime: 1 }); // Oldest first

    // Calculate inactivity duration for each
    const alerts = inactiveOperations.map(op => {
      const durationMs = now - new Date(op.startTime);
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationHours = Math.floor(durationMinutes / 60);
      const remainingMinutes = durationMinutes % 60;

      return {
        operation: op,
        inactiveDuration: {
          milliseconds: durationMs,
          minutes: durationMinutes,
          formatted: `${durationHours}h ${remainingMinutes}m`
        },
        severity: durationMinutes > 120 ? 'high' : durationMinutes > 60 ? 'medium' : 'low'
      };
    });

    res.json({
      success: true,
      data: {
        threshold: `${thresholdMinutes} minutes`,
        totalAlerts: alerts.length,
        alerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total active operations
    const activeOperations = await Operation.countDocuments({ endTime: null });

    // Total operators
    const totalOperators = await User.countDocuments({ role: 'operator' });

    // Operations today
    const operationsToday = await Operation.countDocuments({
      startTime: { $gte: today }
    });

    // Completed operations today
    const completedToday = await Operation.countDocuments({
      startTime: { $gte: today },
      endTime: { $ne: null }
    });

    // Get operators with active operations
    const activeOps = await Operation.find({ endTime: null })
      .populate('operator')
      .select('operator');

    const activeOperatorIds = [...new Set(activeOps.map(op => op.operator?._id?.toString()))].filter(Boolean);

    // Inactivity count (> 30 min)
    const thresholdMs = 30 * 60 * 1000;
    const alertThreshold = new Date(now - thresholdMs);
    const inactivityAlerts = await Operation.countDocuments({
      endTime: null,
      startTime: { $lte: alertThreshold }
    });

    res.json({
      success: true,
      data: {
        activeOperations,
        totalOperators,
        activeOperators: activeOperatorIds.length,
        idleOperators: totalOperators - activeOperatorIds.length,
        operationsToday,
        completedToday,
        inactivityAlerts,
        timestamp: now
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all operators with their current status
export const getOperatorsStatus = async (req, res) => {
  try {
    const operators = await User.find({ role: 'operator' }).select('-password');

    const operatorsWithStatus = await Promise.all(
      operators.map(async (operator) => {
        // Get current active operation
        const activeOperation = await Operation.findOne({
          operator: operator._id,
          endTime: null
        })
          .populate('equipment activity material')
          .sort({ startTime: -1 });

        // Get today's operations count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOperations = await Operation.countDocuments({
          operator: operator._id,
          startTime: { $gte: today }
        });

        let status = 'idle';
        let inactiveDuration = null;

        if (activeOperation) {
          status = 'active';
          const now = new Date();
          const durationMs = now - new Date(activeOperation.startTime);
          const durationMinutes = Math.floor(durationMs / 60000);

          // Check if inactive (> 30 min on same activity)
          if (durationMinutes > 30) {
            status = 'inactive';
            inactiveDuration = {
              minutes: durationMinutes,
              formatted: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
            };
          }
        }

        return {
          operator: {
            _id: operator._id,
            name: operator.name,
            email: operator.email,
            role: operator.role
          },
          status,
          activeOperation: activeOperation || null,
          inactiveDuration,
          todayOperations
        };
      })
    );

    res.json({ success: true, data: operatorsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
