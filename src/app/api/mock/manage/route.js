import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getMockApisByUserId } from '@/models/MockApi';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const mockApis = await getMockApisByUserId(session.user.id);
    
    return NextResponse.json({ mockApis });
  } catch (error) {
    console.error('Error fetching mock APIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mock APIs' },
      { status: 500 }
    );
  }
}
