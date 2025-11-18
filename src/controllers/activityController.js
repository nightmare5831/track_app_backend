import Activity from '../models/Activity.js';

// Get all activities (reference data)
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get activities by type
export const getActivitiesByType = async (req, res) => {
  try {
    const { activityType } = req.params;
    const activities = await Activity.find({ activityType });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new activity (admin only)
export const createActivity = async (req, res) => {
  try {
    const { name, activityType, activityDetails } = req.body;

    const activity = new Activity({
      name,
      activityType,
      activityDetails
    });

    await activity.save();
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update activity (admin only)
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, activityType, activityDetails } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      id,
      { name, activityType, activityDetails },
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add custom reason to activity (user can add custom reasons)
export const addCustomReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { customReason } = req.body;

    if (!customReason || customReason.trim() === '') {
      return res.status(400).json({ success: false, message: 'Custom reason is required' });
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Check if custom reason already exists
    if (activity.activityDetails.custom_reason.includes(customReason)) {
      return res.status(400).json({ success: false, message: 'Custom reason already exists' });
    }

    // Add custom reason
    activity.activityDetails.custom_reason.push(customReason);
    await activity.save();

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get activity details options for a specific activity
export const getActivityDetailsOptions = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({
      success: true,
      data: {
        activityType: activity.activityType,
        activityDetails: activity.activityDetails
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
