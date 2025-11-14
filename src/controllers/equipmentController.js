import Equipment from '../models/Equipment.js';

export const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({ status: 'active' });
    res.json({ success: true, data: equipment });
  } catch (error) {
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
