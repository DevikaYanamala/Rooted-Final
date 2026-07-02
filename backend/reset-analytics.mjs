import 'dotenv/config';
import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://devikayanamala611_db_user:T4A0uWGGP2g6MskN@cluster0.elroo7v.mongodb.net/RootedDB?appName=Cluster0';

const analyticsSchema = new mongoose.Schema({
  eventType: String,
  userId: String,
  location: String,
  targetId: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
const AnalyticsLog = mongoose.model('AnalyticsLog', analyticsSchema);

console.log('Connecting to MongoDB...');
await mongoose.connect(mongoURI);

const count = await AnalyticsLog.countDocuments();
console.log(`Found ${count} analytics records.`);

await AnalyticsLog.deleteMany({});
console.log('✅ All analytics data cleared! Starting fresh.');

await mongoose.disconnect();
