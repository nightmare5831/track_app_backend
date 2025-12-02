import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import Material from '../models/Material.js';
import Activity from '../models/Activity.js';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackapp');
    console.log('Connected to MongoDB');

    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'administrator',
        authorizedEquipment: [] 
      });
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }

    // Create or update test operator users
    let operator1 = await User.findOne({ email: 'operator1@example.com' });
    if (!operator1) {
      operator1 = await User.create({
        email: 'operator1@example.com',
        password: 'password123',
        name: 'John Operator',
        role: 'operator',
        authorizedEquipment: []
      });
      console.log('Created operator user 1');
    } else {
      console.log('Operator 1 already exists');
    }

    let operator2 = await User.findOne({ email: 'operator2@example.com' });
    if (!operator2) {
      operator2 = await User.create({
        email: 'operator2@example.com',
        password: 'password123',
        name: 'Jane Operator',
        role: 'operator',
        authorizedEquipment: []
      });
      console.log('Created operator user 2');
    } else {
      console.log('Operator 2 already exists');
    }

    await Equipment.deleteMany({});
    await Material.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing equipment, materials, and activities');

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

    const createdEquipment = await Equipment.insertMany([...excavators, ...trucks]);
    console.log(`Created ${excavators.length} excavators and ${trucks.length} trucks`);

    const operator1Equipment = [
      createdEquipment[0]._id, 
      createdEquipment[1]._id, 
      createdEquipment[3]._id, 
      createdEquipment[4]._id  
    ];

    await User.updateOne(
      { _id: operator1._id },
      { $set: { authorizedEquipment: operator1Equipment } }
    );
    console.log(`Assigned ${operator1Equipment.length} equipment to operator1`);

    const operator2Equipment = [
      createdEquipment[0]._id, 
      createdEquipment[2]._id, 
      createdEquipment[5]._id, 
      createdEquipment[6]._id, 
      createdEquipment[7]._id 
    ];

    await User.updateOne(
      { _id: operator2._id },
      { $set: { authorizedEquipment: operator2Equipment } }
    );
    console.log(`Assigned ${operator2Equipment.length} equipment to operator2`);


    const activities = [
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
    console.log('\nUsers:');
    console.log('  • Admin: admin@example.com / admin123 (all equipment access)');
    console.log('  • Operator 1: operator1@example.com / password123 (4 equipment assigned)');
    console.log('  • Operator 2: operator2@example.com / password123 (5 equipment assigned)');
    console.log('\nEquipment:');
    console.log('  • 3 Excavators (loading equipment)');
    console.log('  • 5 Dump Trucks (transport equipment)');
    console.log('\nActivities:');
    console.log('  • 4 General activities (Lunch, Maintenance, Stopped, Waiting)');
    console.log('  • 2 Loading activities (Loading, Loading Truck)');
    console.log('  • 4 Transport activities (Load, Trip to Destination, Unload, Return)');
    console.log('\nMaterials:');
    console.log(`  • ${createdMaterials.length} materials created`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
