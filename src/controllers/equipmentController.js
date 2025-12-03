import Equipment from '../models/Equipment.js';
import { User } from '../models/User.js';

export const getEquipment = async (req, res) => {
  try {
    // Admin sees all equipment, operator sees only authorized equipment
    if (req.user.role === 'administrator') {
      const equipment = await Equipment.find({ status: 'active' });
      return res.json({ success: true, data: equipment });
    }

    // For operators, fetch their authorized equipment
    const user = await User.findById(req.user.id).populate('authorizedEquipment');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const authorizedEquipment = user.authorizedEquipment.filter(e => e.status === 'active');
    res.json({ success: true, data: authorizedEquipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEquipment = async (req, res) => {
  try {
    const { name, category, capacity, status } = req.body;
    const equipment = new Equipment({ name, category, capacity, status });
    await equipment.save();
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { name, category, capacity, status } = req.body;
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, category, capacity, status },
      { new: true, runValidators: true }
    );
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({ success: true, message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
