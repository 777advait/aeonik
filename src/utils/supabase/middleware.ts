import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";
import { db } from "~/server/db";

export async function updateSession(request: NextRequest) {
  const supabase = await createClient();
  const pathname = request.nextUrl.pathname;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- CASE 1: Not authenticated ---
  if (!user) {
    if (pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- CASE 2: Authenticated but not onboarded ---
  const userRecord = await db.query.userSchema.findFirst({
    where: ({ id }, { eq }) => eq(id, user.id),
    columns: { onboarded: true },
  });
  const isOnboarded = userRecord?.onboarded || false;

  if (!isOnboarded) {
    if (pathname !== "/onboard") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- CASE 3: Authenticated and onboarded ---
  if (pathname !== "/chat") {
    const url = request.nextUrl.clone();
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
