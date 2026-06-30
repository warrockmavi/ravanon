import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/api-guard";
import { signImpersonateToken } from "@/lib/auth/session";
import { getUserById } from "@/lib/store/users-repo";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = requirePermission(req, "users.impersonate");
  if (guard.error) return guard.error;

  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const token = signImpersonateToken(user.id, user.email);
  const url = `http://localhost:8765/account.html?impersonate=${user.id}&email=${encodeURIComponent(user.email)}&token=${token}`;
  return NextResponse.json({ url, token });
}