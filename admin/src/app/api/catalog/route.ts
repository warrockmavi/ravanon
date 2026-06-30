import { NextRequest, NextResponse } from "next/server";
import {
  deleteBrand,
  deleteCollection,
  getCatalogSummary,
  saveBrand,
  saveCategory,
  saveCollection,
} from "@/lib/store/catalog-repo";
import { addAuditLog } from "@/lib/store/audit-repo";
import { requirePermission } from "@/lib/auth/api-guard";
import type { Brand, Category, Collection } from "@/types/admin";

export async function GET() {
  const catalog = await getCatalogSummary();
  return NextResponse.json(catalog);
}

export async function POST(req: NextRequest) {
  const guard = requirePermission(req, "products.edit");
  if (guard.error) return guard.error;
  const session = guard.session!;

  const body = await req.json();
  const { type, data } = body as { type: "brand" | "category" | "collection"; data: Brand | Category | Collection };

  let saved;
  if (type === "brand") saved = await saveBrand(data as Brand);
  else if (type === "category") saved = await saveCategory(data as Category);
  else if (type === "collection") saved = await saveCollection(data as Collection);
  else return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });

  await addAuditLog({
    userId: session.sub,
    actorId: session.sub,
    actorName: session.name,
    action: `catalog.${type}.create`,
    details: `${type} oluşturuldu/güncellendi: ${(data as { name: string }).name}`,
  });

  return NextResponse.json({ item: saved }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const guard = requirePermission(req, "products.edit");
  if (guard.error) return guard.error;
  const session = guard.session!;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  if (!type || !id) return NextResponse.json({ error: "type ve id gerekli" }, { status: 400 });

  let ok = false;
  if (type === "brand") ok = await deleteBrand(id);
  else if (type === "collection") ok = await deleteCollection(id);
  else return NextResponse.json({ error: "Geçersiz tip" }, { status: 400 });

  if (!ok) return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });

  await addAuditLog({
    userId: session.sub,
    actorId: session.sub,
    actorName: session.name,
    action: `catalog.${type}.delete`,
    details: `${type} silindi: ${id}`,
  });

  return NextResponse.json({ success: true });
}