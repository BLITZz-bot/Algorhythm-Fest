require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const registrationSchema = new mongoose.Schema({
    id: String
}, { strict: false });

const Registration = mongoose.model('Registration', registrationSchema);

async function clearRegistrations() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');
        
        const result = await Registration.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} registrations.`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

clearRegistrations();
