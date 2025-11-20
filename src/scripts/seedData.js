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

    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'administrator'
      });
      console.log('Created admin user');
    }

    // Find or create test operator users
    let operator1 = await User.findOne({ email: 'operator1@example.com' });
    if (!operator1) {
      operator1 = await User.create({
        email: 'operator1@example.com',
        password: 'password123',
        name: 'John Operator',
        role: 'operator'
      });
      console.log('Created operator user 1');
    }

    let operator2 = await User.findOne({ email: 'operator2@example.com' });
    if (!operator2) {
      operator2 = await User.create({
        email: 'operator2@example.com',
        password: 'password123',
        name: 'Jane Operator',
        role: 'operator'
      });
      console.log('Created operator user 2');
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
      // General activities (available for all equipment)
      {
        name: 'Lunch',
        activityType: 'general',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Maintenance',
        activityType: 'general',
        activityDetails: {
          stopped_reason: ['Maintenance'],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Stopped',
        activityType: 'general',
        activityDetails: {
          stopped_reason: [
            'Rain',
            'No truck available',
            'No loader',
            'Equipment breakdown',
            'Fuel shortage',
            'Operator unavailable',
            'Safety issue',
            'End of shift',
            'Road obstacle'
          ],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Waiting',
        activityType: 'general',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [
            'Access issues',
            'Lack of trucks',
            'Waiting for instructions',
            'Waiting for equipment',
            'Road maintenance',
            'Loading delay',
            'Queue at loading point',
            'Queue at dump site'
          ],
          custom_reason: []
        }
      },

      // Loading equipment specific activities
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
        activityType: 'loading',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [],
          custom_reason: []
        }
      },

      // Transport equipment specific activities
      {
        name: 'Load',
        activityType: 'transport',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [
            'Waiting for equipment',
            'Queue at loading point',
            'Loading delay'
          ],
          custom_reason: []
        }
      },
      {
        name: 'Trip to Destination',
        activityType: 'transport',
        activityDetails: {
          stopped_reason: [
            'Road obstacle',
            'Rain',
            'Equipment breakdown'
          ],
          waiting_reason: [],
          custom_reason: []
        }
      },
      {
        name: 'Unload',
        activityType: 'transport',
        activityDetails: {
          stopped_reason: [],
          waiting_reason: [
            'Queue at dump site',
            'Waiting for instructions',
            'Waiting for equipment'
          ],
          custom_reason: []
        }
      },
      {
        name: 'Return',
        activityType: 'transport',
        activityDetails: {
          stopped_reason: [
            'Road obstacle',
            'Rain'
          ],
          waiting_reason: [],
          custom_reason: []
        }
      }
    ];

    const createdActivities = await Activity.insertMany(activities);
    
    console.log('\n✅ Seed data created successfully!');
    console.log('Users:');
    console.log('  • Admin: admin@example.com / admin123');
    console.log('  • Operator 1: operator1@example.com / password123');
    console.log('  • Operator 2: operator2@example.com / password123');
    console.log('\nActivities:');
    console.log('  • 4 General activities (Lunch, Maintenance, Stopped, Waiting)');
    console.log('  • 2 Loading activities (Loading, Loading Truck)');
    console.log('  • 4 Transport activities (Load, Trip to Destination, Unload, Return)');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
