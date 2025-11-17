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
    const { activityType, activityDetails } = req.body;

    const activity = new Activity({
      activityType,
      activityDetails
    });

    await activity.save();
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
