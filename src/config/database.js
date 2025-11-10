import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Connect with Mongoose using MongoDB Atlas recommended settings
    await mongoose.connect(process.env.MONGODB_URI);

    // Send a ping to confirm a successful connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
