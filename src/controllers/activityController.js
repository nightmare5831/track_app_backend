import Activity from '../models/Activity.js';

export const startActivity = async (req, res) => {
  try {
    const { equipment, activityType, material, truckId, details } = req.body;

    const activity = new Activity({
      equipment,
      activityType,
      material,
      truckId,
      details,
      startTime: new Date(),
      status: 'in-progress',
      createdBy: req.user.id
    });

    await activity.save();
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const stopActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activity.endTime = new Date();
    activity.status = 'completed';
    await activity.save();

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      createdBy: req.user.id,
      status: 'in-progress'
    }).populate('equipment material');

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ createdBy: req.user.id })
      .populate('equipment material')
      .sort({ startTime: -1 });

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
