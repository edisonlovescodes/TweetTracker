import { NextRequest, NextResponse } from 'next/server';
import { getMonitorsCollection } from '@/lib/firebase';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const monitorsRef = getMonitorsCollection();
    const doc = await monitorsRef.doc(accountId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    await doc.ref.delete();

    console.log(`[Remove Account] ✅ Removed monitoring for account ${accountId}`);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[Remove Account] Error:', error);
    return NextResponse.json(
      { error: 'Failed to remove account' },
      { status: 500 }
    );
  }
}
