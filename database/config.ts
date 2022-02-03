import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN as string);

    console.log('Database Online');
  } catch (error) {
    console.log(error);
    
    throw new Error('Error Triying To Connect With Database');
  }
}

export default dbConnection;