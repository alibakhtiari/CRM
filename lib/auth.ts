import { jwtVerify } from "jose";

const secret = new TextEncoder().encode("your-secret-key");

export async function verifyAuth(request: Request): Promise<number | null> {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    return payload.userId as number;
  } catch {
    return null;
  }
}