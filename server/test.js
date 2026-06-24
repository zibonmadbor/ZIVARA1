require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesAggregation = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: '$total' }
        } 
      },
      { $sort: { _id: 1 } }
    ]);
    console.log('Aggregation success:', salesAggregation);

  } catch (err) {
    console.error('Aggregation Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
test();
