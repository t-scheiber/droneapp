import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { resolveRealDocument } from '@/lib/documents';
import { SESSION_COOKIE, roleFromToken } from '@/lib/session';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'private, no-store' };

// Serves a real document. Only an owner session gets through; a demo session
// gets 403 for every file name, whether it exists or not.
export async function GET(request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const role = roleFromToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!role) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401, headers: noStore });
  }
  if (role !== 'owner') {
    return NextResponse.json({ error: 'Demo sessions can only open sample documents' }, { status: 403, headers: noStore });
  }

  const { file } = await params;
  const filePath = await resolveRealDocument(file);
  if (!filePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: noStore });
  }

  const data = await fs.readFile(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      ...noStore,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(file)}`,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
