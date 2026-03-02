import { NextResponse } from 'next/server';
import { getMedications, createMedication, initializeDatabase } from '@/app/lib/db';
import { getUserId, withUserCookie } from '@/app/lib/userId';

export async function GET(request) {
    try {
        await initializeDatabase();
        const userId = await getUserId();
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';
        const medications = await getMedications(userId, !showAll);
        return withUserCookie(NextResponse.json(medications), userId);
    } catch (error) {
        console.error('Error fetching medications:', error);
        return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await initializeDatabase();
        const userId = await getUserId();
        const data = await request.json();

        if (!data.name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const medication = await createMedication(userId, data);
        return withUserCookie(NextResponse.json(medication, { status: 201 }), userId);
    } catch (error) {
        console.error('Error creating medication:', error);
        return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 });
    }
}
