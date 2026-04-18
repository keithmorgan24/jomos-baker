import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Validate Identity
    const isCorrectEmail = email === process.env.ADMIN_EMAIL;
    const storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!isCorrectEmail || !storedHash) {
      return NextResponse.json({ error: 'Access Denied: Invalid Credentials' }, { status: 401 });
    }

    // 2. Secure Password Comparison
    const isPasswordValid = await bcrypt.compare(password, storedHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Access Denied: Security Mismatch' }, { status: 401 });
    }

    // 3. Generate Sovereign JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      role: 'admin',
      email: email 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Session expires in 1 day
      .sign(secret);

    // 4. Secure Cookie Injection
    const response = NextResponse.json({ 
      success: true,
      message: "Vault Access Granted" 
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Auth Protocol Failure:", error);
    return NextResponse.json({ error: 'Internal Security Error' }, { status: 500 });
  }
}