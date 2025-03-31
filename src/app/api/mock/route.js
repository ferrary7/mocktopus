import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createMockApi } from '@/models/MockApi';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for mock endpoints
// In a real app, you'd use a database
const mockEndpoints = new Map();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint") || "/users";

    // Check if we have a saved mock for this endpoint
    const savedMock = mockEndpoints.get(endpoint);
    if (savedMock) {
      // Apply any configured delay
      if (savedMock.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, savedMock.delay));
      }

      // Apply chaos mode if enabled
      if (savedMock.chaosMode && Math.random() * 100 < savedMock.chaosLevel) {
        // Choose a random chaos effect
        const chaosEffect = Math.floor(Math.random() * 3);
        
        if (chaosEffect === 0) {
          // Return an error status
          return new Response(JSON.stringify({ error: "Chaos mode error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        } else if (chaosEffect === 1) {
          // Return partial data (remove random fields)
          const data = processTemplate(savedMock.template);
          const keys = Object.keys(data);
          const keysToRemove = Math.floor(keys.length / 2);
          
          for (let i = 0; i < keysToRemove; i++) {
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            delete data[randomKey];
          }
          
          return new Response(JSON.stringify({ data }), {
            status: savedMock.statusCode,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // Add additional delay
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Return the configured response
      return new Response(JSON.stringify({ 
        data: processTemplate(savedMock.template) 
      }), {
        status: savedMock.statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default mock response if no saved mock exists
    const mockResponse = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
    };

    return new Response(JSON.stringify({ endpoint, data: mockResponse }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const mockId = uuidv4();
    
    const mockApiData = {
      mockId,
      userId: session.user.id,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      delay: data.delay,
      chaosMode: data.chaosMode,
      chaosLevel: data.chaosLevel,
      template: data.template
    };
    
    const createdMock = await createMockApi(mockApiData);

    // Process the template to generate the mock response
    const processedResponse = processTemplate(data.template);

    return NextResponse.json({ 
      mockId, 
      _id: createdMock._id,
      response: processedResponse // Include the processed response
    });
  } catch (error) {
    console.error('Error creating mock API:', error);
    return NextResponse.json(
      { error: 'Failed to create mock API' },
      { status: 500 }
    );
  }
}

// Function to process template placeholders
function processTemplate(templateStr) {
  try {
    const template = JSON.parse(templateStr);
    return processObject(template);
  } catch (error) {
    return { error: "Invalid template format" };
  }
}

function processObject(obj) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      result[key] = processObject(value);
    } else if (typeof value === 'string' && value.includes('{{') && value.includes('}}')) {
      result[key] = replacePlaceholder(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

function replacePlaceholder(value) {
  // Handle various placeholder types
  return value
    .replace(/{{uuid}}/g, faker.string.uuid())
    .replace(/{{name}}/g, faker.person.fullName())
    .replace(/{{firstName}}/g, faker.person.firstName())
    .replace(/{{lastName}}/g, faker.person.lastName())
    .replace(/{{email}}/g, faker.internet.email())
    .replace(/{{phone}}/g, faker.phone.number())
    .replace(/{{address}}/g, faker.location.streetAddress())
    .replace(/{{city}}/g, faker.location.city())
    .replace(/{{country}}/g, faker.location.country())
    .replace(/{{zipCode}}/g, faker.location.zipCode())
    .replace(/{{date}}/g, faker.date.recent().toISOString())
    .replace(/{{number}}/g, faker.number.int(1000).toString())
    .replace(/{{boolean}}/g, faker.datatype.boolean().toString());
}
