import { NextResponse } from 'next/server';
import { getCheckIns, createCheckIn, removeCheckIn, getCheckInHistory, getStreak } from '@/app/lib/db';
import { getUserId, withUserCookie } from '@/app/lib/userId';

export async function GET(request) {
    try {
        const userId = await getUserId();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const type = searchParams.get('type');

        if (type === 'streak') {
            const streak = await getStreak(userId);
            return withUserCookie(NextResponse.json({ streak }), userId);
        }

        if (type === 'history' && startDate && endDate) {
            const history = await getCheckInHistory(userId, startDate, endDate);
            return withUserCookie(NextResponse.json(history), userId);
        }

        const today = date || new Date().toISOString().split('T')[0];
        const checkIns = await getCheckIns(userId, today);
        return withUserCookie(NextResponse.json(checkIns), userId);
    } catch (error) {
        console.error('Error fetching check-ins:', error);
        return NextResponse.json({ error: 'Failed to fetch check-ins' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const userId = await getUserId();
        const { supplementId, medicationId, itemType } = await request.json();

        if (itemType === 'medication') {
            if (!medicationId) {
                return NextResponse.json({ error: 'medicationId is required' }, { status: 400 });
            }
            const checkIn = await createCheckIn(userId, null, 'medication', medicationId);
            return withUserCookie(NextResponse.json(checkIn, { status: 201 }), userId);
        }

        if (!supplementId) {
            return NextResponse.json({ error: 'supplementId is required' }, { status: 400 });
        }

        const checkIn = await createCheckIn(userId, supplementId);
        return withUserCookie(NextResponse.json(checkIn, { status: 201 }), userId);
    } catch (error) {
        console.error('Error creating check-in:', error);
        return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const userId = await getUserId();
        const { supplementId, medicationId, date, itemType } = await request.json();
        if (itemType === 'medication') {
            await removeCheckIn(userId, null, date, 'medication', medicationId);
        } else {
            await removeCheckIn(userId, supplementId, date);
        }
        return withUserCookie(NextResponse.json({ success: true }), userId);
    } catch (error) {
        console.error('Error removing check-in:', error);
        return NextResponse.json({ error: 'Failed to remove check-in' }, { status: 500 });
    }
}
