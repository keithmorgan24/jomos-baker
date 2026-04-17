import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Using your verified path
import Order from '@/models/Order';
import Driver from '@/models/Driver';

export async function GET() {
  try {
    await dbConnect();

    // 1. Calculate Today's Revenue
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const revenueResult = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfToday },
          status: 'delivered' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalAmount" } 
        } 
      }
    ]);

    // 2. Count Active Orders
    const activeOrders = await Order.countDocuments({ 
      status: { $in: ['pending', 'baking', 'dispatched'] } 
    });

    // 3. Count Fleet Online
    const fleetOnline = await Driver.countDocuments({ isOnline: true });

    return NextResponse.json({
      revenue: revenueResult[0]?.total || 0,
      activeOrders,
      fleetOnline
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" }, 
      { status: 500 }
    );
  }
}