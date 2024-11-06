import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const secret = new TextEncoder().encode("your-secret-key");

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = db.select().from(users)
      .where(eq(users.username, username))
      .get();

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}