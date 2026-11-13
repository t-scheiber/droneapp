import { NextRequest, NextResponse } from 'next/server';
import { listDocuments } from '@/lib/documents';
import { SESSION_COOKIE, roleFromToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const role = roleFromToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!role) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  const documents = await listDocuments(role);
  return NextResponse.json({ role, documents }, { headers: { 'Cache-Control': 'private, no-store' } });
}
