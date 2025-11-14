import Material from '../models/Material.js';

export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
