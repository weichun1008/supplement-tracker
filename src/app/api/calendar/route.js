import { NextResponse } from 'next/server';
import { getCalendarData, getCheckIns, initializeDatabase } from '@/app/lib/db';
import { getUserId, withUserCookie } from '@/app/lib/userId';

export async function GET(request) {
    try {
        await initializeDatabase();
        const userId = await getUserId();
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
        const month = parseInt(searchParams.get('month')) || (new Date().getMonth() + 1);
        const date = searchParams.get('date');

        // If a specific date is requested, return detailed check-ins for that day
        if (date) {
            const checkIns = await getCheckIns(userId, date);
            return withUserCookie(NextResponse.json(checkIns), userId);
        }

        // Otherwise return calendar overview for the month
        const data = await getCalendarData(userId, year, month);
        return withUserCookie(NextResponse.json(data), userId);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
    }
}
