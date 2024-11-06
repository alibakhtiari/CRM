import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { records } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = userId === 0 
      ? db.select().from(records)
      : db.select().from(records).where(eq(records.user_id, userId));

    const data = query.all();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await request.json();
    
    if (userId !== 0) {
      const record = db.select().from(records)
        .where(eq(records.id, id))
        .get();
      
      if (!record || record.user_id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    db.update(records)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(records.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}