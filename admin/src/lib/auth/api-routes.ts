const STORE_ORIGINS = ["http://localhost:8765", "http://127.0.0.1:8765"];

const PUBLIC_GET = ["/api/store", "/api/auth/login", "/api/auth/me"];
const STORE_POST = ["/api/users", "/api/orders", "/api/ai/chat"];

export function isStoreOrigin(origin: string) {
  return STORE_ORIGINS.includes(origin);
}

export function isPublicApiRoute(pathname: string, method: string): boolean {
  if (method === "OPTIONS") return true;
  if (PUBLIC_GET.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  if (method === "POST" && STORE_POST.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return true;
  }
  return false;
}