import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/api-guard";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ admin: null }, { status: 401 });
  return NextResponse.json({
    admin: {
      id: session.sub,
      email: session.email,
      name: session.name,
      roles: session.roles,
      permissions: session.permissions,
    },
  });
}