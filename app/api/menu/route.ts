import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { MenuItemSchema } from '@/lib/validations';

// High-performance Auth Check
async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token?.value === process.env.ADMIN_SESSION_SECRET;
}

// GET: Fetch menu items with availability filtering
export async function GET() {
  try {
    await dbConnect();
    
    // Check if the requester is an admin
    const isAdmin = await isAuthenticated();
    
    /**
     * LOGIC: 
     * If Admin: Fetch all items (so they can toggle them back on).
     * If Customer: Fetch only items where isAvailable is NOT false.
     * We use $ne: false to include items where the field is missing/undefined.
     */
    const query = isAdmin ? {} : { isAvailable: { $ne: false } };

    const items = await Item.find(query).sort({ category: 1 }).lean();
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    console.error("🚨 GET ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// POST: Add new item
export async function POST(request: Request) {
  /* NOTE: Uncomment auth check for production */
  // if (!(await isAuthenticated())) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    await dbConnect();
    const body = await request.json();

    // 1. Validate with Zod (Ensure isAvailable is in your Zod schema!)
    const validation = MenuItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    // 2. Save to MongoDB
    const newItem = await Item.create(validation.data);
    
    // 3. Purge cache
    revalidatePath('/menu');
    
    return NextResponse.json(newItem, { status: 201 });

  } catch (err: any) {
    console.log("🚨 MONGODB POST ERROR:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to add item" }, 
      { status: 500 }
    );
  }
}

// PUT: Update existing item (Handle partial updates like Availability toggles)
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing Asset ID" }, { status: 400 });
    }

    // Validate updates (partial allowed for toggles)
    const validation = MenuItemSchema.partial().safeParse(updates);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $set: validation.data },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    revalidatePath('/menu');
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (err: any) {
    console.log("🚨 UPDATE ERROR:", err.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await dbConnect();
    if (!id) throw new Error("ID required");
    
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Asset already purged or not found" }, { status: 404 });
    }

    revalidatePath('/menu');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}