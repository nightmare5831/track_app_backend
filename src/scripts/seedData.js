import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import Material from '../models/Material.js';
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
        password: 'password123', // This should be hashed in real scenario
        name: 'Test User',
        role: 'operator'
      });
      console.log('Created test user');
    }

    // Clear existing data
    await Equipment.deleteMany({});
    await Material.deleteMany({});
    console.log('Cleared existing equipment and materials');

    // Create Excavators
    const excavators = [
      {
        name: 'Excavator CAT 320',
        type: 'excavator',
        registrationNumber: 'EXC-001',
        capacity: 1.2,
        status: 'active',
        owner: user._id
      },
      {
        name: 'Excavator Komatsu PC200',
        type: 'excavator',
        registrationNumber: 'EXC-002',
        capacity: 1.5,
        status: 'active',
        owner: user._id
      },
      {
        name: 'Excavator Volvo EC210',
        type: 'excavator',
        registrationNumber: 'EXC-003',
        capacity: 1.3,
        status: 'active',
        owner: user._id
      }
    ];

    // Create Trucks
    const trucks = [
      {
        name: 'Dump Truck CAT 770',
        type: 'truck',
        registrationNumber: 'TRK-001',
        capacity: 50,
        status: 'active',
        owner: user._id
      },
      {
        name: 'Dump Truck Volvo A40G',
        type: 'truck',
        registrationNumber: 'TRK-002',
        capacity: 45,
        status: 'active',
        owner: user._id
      },
      {
        name: 'Dump Truck Komatsu HD785',
        type: 'truck',
        registrationNumber: 'TRK-003',
        capacity: 60,
        status: 'active',
        owner: user._id
      },
      {
        name: 'Dump Truck CAT 775',
        type: 'truck',
        registrationNumber: 'TRK-004',
        capacity: 55,
        status: 'active',
        owner: user._id
      }
    ];

    // Create Materials
    const materials = [
      {
        name: 'Copper Ore',
        category: 'other',
        quantity: 1000,
        unit: 'ton',
        location: 'Mine Section A',
        owner: user._id
      },
      {
        name: 'Iron Ore',
        category: 'other',
        quantity: 1500,
        unit: 'ton',
        location: 'Mine Section B',
        owner: user._id
      },
      {
        name: 'Gold Ore',
        category: 'other',
        quantity: 500,
        unit: 'ton',
        location: 'Mine Section C',
        owner: user._id
      },
      {
        name: 'Waste Rock',
        category: 'other',
        quantity: 2000,
        unit: 'ton',
        location: 'Dump Site',
        owner: user._id
      },
      {
        name: 'Diesel Fuel',
        category: 'fuel',
        quantity: 5000,
        unit: 'liter',
        location: 'Fuel Station',
        owner: user._id
      }
    ];

    // Insert all data
    await Equipment.insertMany([...excavators, ...trucks]);
    console.log(`Created ${excavators.length} excavators and ${trucks.length} trucks`);

    await Material.insertMany(materials);
    console.log(`Created ${materials.length} materials`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('\nEquipment Summary:');
    console.log(`- ${excavators.length} Excavators`);
    console.log(`- ${trucks.length} Trucks`);
    console.log(`\nMaterials Summary:`);
    console.log(`- ${materials.length} materials added`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
