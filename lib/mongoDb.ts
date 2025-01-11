import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGO_URL;
		if (!mongoUri) {
			throw new Error('MONGODB_URI is not defined');
		}
		await mongoose.connect(mongoUri, {});
		console.log('MongoDB connected');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
};

export default connectDB;