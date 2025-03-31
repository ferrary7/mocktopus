import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getMockApiById, updateMockApi, deleteMockApi } from '@/models/MockApi';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const mockApi = await getMockApiById(id);
    
    if (!mockApi) {
      return NextResponse.json({ error: 'Mock API not found' }, { status: 404 });
    }
    
    if (mockApi.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json({ mockApi });
  } catch (error) {
    console.error('Error fetching mock API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mock API' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const data = await request.json();
    
    const mockApi = await getMockApiById(id);
    
    if (!mockApi) {
      return NextResponse.json({ error: 'Mock API not found' }, { status: 404 });
    }
    
    if (mockApi.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const updatedMockApi = await updateMockApi(id, data);
    
    return NextResponse.json({ mockApi: updatedMockApi });
  } catch (error) {
    console.error('Error updating mock API:', error);
    return NextResponse.json(
      { error: 'Failed to update mock API' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const mockApi = await getMockApiById(id);
    
    if (!mockApi) {
      return NextResponse.json({ error: 'Mock API not found' }, { status: 404 });
    }
    
    if (mockApi.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await deleteMockApi(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mock API:', error);
    return NextResponse.json(
      { error: 'Failed to delete mock API' },
      { status: 500 }
    );
  }
}
