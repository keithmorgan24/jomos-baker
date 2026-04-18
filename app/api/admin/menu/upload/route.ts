import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No asset detected" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Added explicit types (any) to the promise to resolve the 'implicit any' error
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'jomos_baker_menu' },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload Protocol Failed" }, { status: 500 });
  }
}