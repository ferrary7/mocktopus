import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function createMockApi(mockData) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('mockApis').insertOne({
    ...mockData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return {
    ...mockData,
    _id: result.insertedId.toString()
  };
}

export async function getMockApiById(id) {
  const client = await clientPromise;
  const db = client.db();
  
  const mockApi = await db.collection('mockApis').findOne({ 
    _id: new ObjectId(id) 
  });
  
  return mockApi;
}

export async function getMockApiByMockId(mockId) {
  const client = await clientPromise;
  const db = client.db();
  
  return await db.collection('mockApis').findOne({ mockId });
}

export async function getMockApisByUserId(userId) {
  const client = await clientPromise;
  const db = client.db();
  
  const mockApis = await db
    .collection('mockApis')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
  
  return mockApis;
}

export async function updateMockApi(id, updates) {
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('mockApis').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...updates,
        updatedAt: new Date()
      } 
    }
  );
  
  return await getMockApiById(id);
}

export async function deleteMockApi(id) {
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('mockApis').deleteOne({ _id: new ObjectId(id) });
  
  return { success: true };
}
