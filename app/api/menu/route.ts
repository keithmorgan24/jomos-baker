import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Helper to verify admin session (Fix #5/6)
async function isAuthenticated() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token');
  return adminToken?.value === process.env.ADMIN_SESSION_SECRET;
}

// 1. GET: Fetch items (with Cache-Control fix #10)
export async function GET() {
  try {
    await dbConnect();
    
    const isAdmin = await isAuthenticated();
    // Customers only see available items; Admins see everything
    const query = isAdmin ? {} : { isAvailable: { $ne: false } };

    const items = await Item.find(query).sort({ category: 1 }).lean();
    
    const response = NextResponse.json(items, { status: 200 });
    
    // KILL STALE DATA: Prevent Next.js from caching deleted items
    response.headers.set(
      'Cache-Control', 
      'no-store, max-age=0, must-revalidate'
    );
    
    return response;
  } catch (err) {
    console.error("🚨 GET ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// 2. POST: Add new item (Security fix #3)
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    // Save to MongoDB
    const newItem = await Item.create({
      ...body,
      isAvailable: body.isAvailable ?? true,
    });
    
    // Purge the public cache immediately
    revalidatePath('/menu');
    revalidatePath('/');
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add item" }, { status: 500 });
  }
}

// 3. PUT: Update item (Mongoose deprecation fix #4)
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, ...updates } = await request.json();

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // FIX: Use 'returnDocument' instead of deprecated 'new: true'
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: 'after' } 
    );

    if (!updatedItem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    revalidatePath('/menu');
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 4. DELETE: Remove item (Sync fix)
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await dbConnect();
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Force Next.js to dump the old menu from its memory
    revalidatePath('/menu');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}