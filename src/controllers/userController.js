import { User } from '../models/User.js';

// Get all users (for operator selection)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name email role authorizedEquipment').populate('authorizedEquipment', 'name category');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('_id name email role authorizedEquipment').populate('authorizedEquipment', 'name category');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign equipment to user (admin only)
export const assignEquipment = async (req, res) => {
  try {
    const { userId, equipmentIds } = req.body;

    if (!userId || !Array.isArray(equipmentIds)) {
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { authorizedEquipment: equipmentIds },
      { new: true }
    ).populate('authorizedEquipment', 'name category');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
