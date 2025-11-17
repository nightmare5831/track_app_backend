import Activity from '../models/Activity.js';

export const startActivity = async (req, res) => {
  try {
    const { equipment, activityType, material, truckId } = req.body;

    const activity = new Activity({
      equipment,
      type: activityType,
      material,
      truck: truckId,
      status: 'active',
      user: req.user.id
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
      user: req.user.id,
      status: 'active'
    }).populate('equipment material');

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .populate('equipment material')
      .sort({ startTime: -1 });

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
