import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import Material from '../models/Material.js';
import Activity from '../models/Activity.js';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackapp');
    console.log('Connected to MongoDB');

    // Find or create a test user
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
      console.log('Created test user');
    }

    // Clear existing data
    await Equipment.deleteMany({});
    await Material.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing equipment, materials, and activities');

    // Create Materials
    const materials = [
      {
        name: 'Activated Bentonite',
        type: 'processed',
        properties: {
          density: 1200,
          customFields: []
        }
      },
      {
        name: 'Raw Bentonite',
        type: 'mineral',
        properties: {
          density: 1100,
          customFields: []
        }
      },
      {
        name: 'Copper Ore',
        type: 'ore',
        properties: {
          density: 1800,
          gradePercentage: 2.5,
          customFields: []
        }
      },
      {
        name: 'Iron Ore',
        type: 'ore',
        properties: {
          density: 2500,
          gradePercentage: 65,
          customFields: []
        }
      },
      {
        name: 'Waste Rock',
        type: 'waste',
        properties: {
          density: 1600,
          customFields: []
        }
      }
    ];

    const createdMaterials = await Material.insertMany(materials);
    console.log(`Created ${createdMaterials.length} materials`);

    // Create Excavators (Loading Equipment)
    const excavators = [
      {
        name: 'Excavator CAT 320',
        category: 'loading',
        capacity: 1.2,
        status: 'active'
      },
      {
        name: 'Excavator Komatsu PC200',
        category: 'loading',
        capacity: 1.5,
        status: 'active'
      },
      {
        name: 'Excavator Volvo EC210',
        category: 'loading',
        capacity: 1.3,
        status: 'active'
      }
    ];

    // Create Trucks (Transport Equipment)
    const trucks = [
      {
        name: 'Dump Truck CAT 770',
        category: 'transport',
        capacity: 50,
        status: 'active'
      },
      {
        name: 'Dump Truck Volvo A40G',
        category: 'transport',
        capacity: 45,
        status: 'active'
      },
      {
        name: 'Dump Truck Komatsu HD785',
        category: 'transport',
        capacity: 60,
        status: 'active'
      },
      {
        name: 'Dump Truck CAT 775',
        category: 'transport',
        capacity: 55,
        status: 'active'
      },
      {
        name: 'Dump Truck Mercedes-Benz Actros',
        category: 'transport',
        capacity: 40,
        status: 'active'
      }
    ];

    // Insert equipment
    await Equipment.insertMany([...excavators, ...trucks]);
    console.log(`Created ${excavators.length} excavators and ${trucks.length} trucks`);

    // Create Activities (reference/lookup table)
    const activities = [
      // Common activities
      {
        name: 'Lunch',
        activityType: 'lunch',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Dinner',
        activityType: 'dinner',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Refueling',
        activityType: 'refueling',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Checklist',
        activityType: 'checklist',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Transfer',
        activityType: 'transfer',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Maintenance',
        activityType: 'maintenance',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Service',
        activityType: 'service',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Training/DDS',
        activityType: 'training_dds',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Operating Other Machine',
        activityType: 'operating_other_machine',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Machine Change',
        activityType: 'machine_change',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Bench Relocation',
        activityType: 'bench_relocation',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Stopped',
        activityType: 'stopped',
        activityDetails: {
          stopped_reason: ['Rain', 'No truck available', 'No loader', 'Lost key', 'Equipment breakdown', 'Fuel shortage', 'Operator unavailable', 'Safety issue', 'Weather conditions', 'End of shift'],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Waiting',
        activityType: 'waiting',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: ['Access issues', 'Lack of trucks', 'Waiting for instructions', 'Waiting for equipment', 'Road maintenance', 'Traffic congestion', 'Loading delay', 'Authorization pending'],
          custom_reason: []
        }
      },

      // Loading equipment activities
      {
        name: 'Loading',
        activityType: 'loading',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Loading Truck',
        activityType: 'loading_truck',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },

      // Transport equipment activities
      {
        name: 'Load',
        activityType: 'load',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Trip to Destination',
        activityType: 'trip_to_destination',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Unload',
        activityType: 'unload',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Return',
        activityType: 'return',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      }
    ];

    const createdActivities = await Activity.insertMany(activities);
    console.log(`Created ${createdActivities.length} activities`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n=== Test User Credentials ===');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('\n=== Equipment Summary ===');
    console.log(`- ${excavators.length} Excavators (Loading Equipment)`);
    console.log(`- ${trucks.length} Trucks (Transport Equipment)`);
    console.log(`\n=== Materials Summary ===`);
    console.log(`- ${createdMaterials.length} materials added`);
    console.log('  • Activated Bentonite');
    console.log('  • Raw Bentonite');
    console.log('  • Copper Ore');
    console.log('  • Iron Ore');
    console.log('  • Waste Rock');
    console.log(`\n=== Activities Summary (Reference Data) ===`);
    console.log(`- ${createdActivities.length} activity types added`);
    console.log('  • 13 Common activities (lunch, dinner, stopped, waiting, etc.)');
    console.log('  • 2 Loading equipment activities (loading, loading_truck)');
    console.log('  • 4 Transport equipment activities (load, trip, unload, return)');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
