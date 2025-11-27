import Operation from '../models/Operation.js';
import ExcelJS from 'exceljs';

// Get daily report - trips, time per activity, material moved
export const getDailyReport = async (req, res) => {
  try {
    const { date, operator, equipment } = req.query;

    // Parse date or use today
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Build filter
    const filter = {
      startTime: { $gte: startOfDay, $lt: endOfDay },
      endTime: { $ne: null }
    };
    if (operator) filter.operator = operator;
    if (equipment) filter.equipment = equipment;

    // Get operations
    const operations = await Operation.find(filter)
      .populate('equipment operator activity material')
      .sort({ startTime: 1 });

    // Calculate metrics
    const trips = operations.filter(op =>
      op.activity?.name && ['Ida', 'Volta', 'Trip to destination', 'Return'].includes(op.activity.name)
    );

    // Time per activity
    const activityTime = {};
    operations.forEach(op => {
      const activityName = op.activity?.name || 'Unknown';
      const duration = op.endTime ? Math.max(0, (new Date(op.endTime) - new Date(op.startTime)) / 1000 / 60) : 0;
      activityTime[activityName] = (activityTime[activityName] || 0) + duration;
    });

    // Material moved with destination details (only transport activity type with destination)
    const materialMovedMap = {};
    operations
      .filter(op => op.material && op.destination && op.activity?.activityType === 'transport')
      .forEach(op => {
        const materialName = op.material?.name || 'Unknown';
        const destination = op.destination;
        const key = `${materialName}|${destination}`;

        if (!materialMovedMap[key]) {
          materialMovedMap[key] = {
            name: materialName,
            destination: destination,
            count: 0
          };
        }
        materialMovedMap[key].count += 1;
      });

    const materialMoved = Object.values(materialMovedMap);

    // Calculate total distance
    const totalDistance = operations.reduce((sum, op) => sum + (op.distance || 0), 0);

    res.json({
      success: true,
      data: {
        date: startOfDay,
        summary: {
          totalOperations: operations.length,
          totalTrips: trips.length,
          totalDistance,
          totalTimeMinutes: Object.values(activityTime).reduce((a, b) => a + b, 0)
        },
        timePerActivity: activityTime,
        materialMoved,
        operations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export report to Excel
export const exportToExcel = async (req, res) => {
  try {
    const { startDate, endDate, operator, equipment } = req.query;

    // Build filter
    const filter = { endTime: { $ne: null } };
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }
    if (operator) filter.operator = operator;
    if (equipment) filter.equipment = equipment;

    const operations = await Operation.find(filter)
      .populate('equipment operator activity material truckBeingLoaded')
      .sort({ startTime: -1 });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Operations Report');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Operator', key: 'operator', width: 20 },
      { header: 'Equipment', key: 'equipment', width: 20 },
      { header: 'Activity', key: 'activity', width: 20 },
      { header: 'Material', key: 'material', width: 20 },
      { header: 'Start Time', key: 'startTime', width: 20 },
      { header: 'End Time', key: 'endTime', width: 20 },
      { header: 'Duration (min)', key: 'duration', width: 15 },
      { header: 'Distance', key: 'distance', width: 12 },
      { header: 'Mining Front', key: 'miningFront', width: 15 },
      { header: 'Destination', key: 'destination', width: 15 }
    ];

    // Add data
    operations.forEach(op => {
      const duration = op.endTime
        ? ((new Date(op.endTime) - new Date(op.startTime)) / 1000 / 60).toFixed(2)
        : 0;

      worksheet.addRow({
        date: new Date(op.startTime).toLocaleDateString(),
        operator: op.operator?.name || 'N/A',
        equipment: op.equipment?.name || 'N/A',
        activity: op.activity?.name || 'N/A',
        material: op.material?.name || 'N/A',
        startTime: new Date(op.startTime).toLocaleString(),
        endTime: op.endTime ? new Date(op.endTime).toLocaleString() : 'Active',
        duration,
        distance: op.distance || 0,
        miningFront: op.miningFront || 'N/A',
        destination: op.destination || 'N/A'
      });
    });

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=operations-report-${Date.now()}.xlsx`);
    res.send(buffer);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get performance dashboard data
export const getPerformanceDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { endTime: { $ne: null } };
    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) {
        const start = new Date(startDate);
        filter.startTime.$gte = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      }
      if (endDate) {
        const end = new Date(endDate);
        // Set to end of day
        filter.startTime.$lt = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);
      }
    }

    const operations = await Operation.find(filter)
      .populate('equipment operator activity');

    // Trip count by equipment
    const tripsByEquipment = {};
    const timeByEquipment = {};

    operations.forEach(op => {
      const equipName = op.equipment?.name || 'Unknown';
      const duration = Math.max(0, (new Date(op.endTime) - new Date(op.startTime)) / 1000 / 60 / 60); // hours, never negative

      tripsByEquipment[equipName] = (tripsByEquipment[equipName] || 0) + 1;
      timeByEquipment[equipName] = (timeByEquipment[equipName] || 0) + duration;
    });

    // Efficiency by operator
    const operatorStats = {};
    operations.forEach(op => {
      const operatorName = op.operator?.name || 'Unknown';
      if (!operatorStats[operatorName]) {
        operatorStats[operatorName] = { trips: 0, totalTime: 0 };
      }
      operatorStats[operatorName].trips += 1;
      operatorStats[operatorName].totalTime += Math.max(0, (new Date(op.endTime) - new Date(op.startTime)) / 1000 / 60);
    });

    // Calculate availability (total time / 24 hours per equipment)
    const availability = {};
    Object.entries(timeByEquipment).forEach(([equip, hours]) => {
      // Simple availability: hours worked today as percentage of 24h
      const availPercent = Math.min(100, (hours / 24) * 100);
      availability[equip] = availPercent.toFixed(1);
    });

    res.json({
      success: true,
      data: {
        tripsByEquipment,
        timeByEquipment,
        availability,
        operatorStats,
        totalOperations: operations.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
