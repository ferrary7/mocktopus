import { NextResponse } from 'next/server';
import { getMockApiByMockId } from '@/models/MockApi';
import { faker } from '@faker-js/faker';

// Function to process template with faker data
function processTemplate(template) {
  let jsonTemplate;
  try {
    jsonTemplate = typeof template === 'string' ? JSON.parse(template) : template;
  } catch (error) {
    return { error: 'Invalid JSON template' };
  }

  function replacePlaceholders(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(replacePlaceholders);
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Replace placeholders with faker data
        result[key] = value
          .replace(/{{uuid}}/g, faker.string.uuid())
          .replace(/{{name}}/g, faker.person.fullName())
          .replace(/{{firstName}}/g, faker.person.firstName())
          .replace(/{{lastName}}/g, faker.person.lastName())
          .replace(/{{email}}/g, faker.internet.email())
          .replace(/{{phone}}/g, faker.phone.number())
          .replace(/{{address}}/g, faker.location.streetAddress())
          .replace(/{{date}}/g, faker.date.recent().toISOString())
          .replace(/{{number}}/g, faker.number.int(1000).toString())
          .replace(/{{boolean}}/g, faker.datatype.boolean().toString());
      } else if (typeof value === 'object' && value !== null) {
        result[key] = replacePlaceholders(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return replacePlaceholders(jsonTemplate);
}

export async function GET(request, { params }) {
  try {
    const { mockId } = params;
    
    const mockApi = await getMockApiByMockId(mockId);
    
    if (!mockApi) {
      return NextResponse.json(
        { error: 'Mock API not found' },
        { status: 404 }
      );
    }
    
    // Apply delay if specified
    if (mockApi.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockApi.delay));
    }
    
    // Process the template to generate data
    const responseData = processTemplate(mockApi.template);
    
    // Apply chaos if enabled
    if (mockApi.chaosMode && Math.random() * 100 < mockApi.chaosLevel) {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];
      const randomStatus = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      return NextResponse.json(
        { error: `Chaos mode activated: ${randomStatus}` },
        { status: randomStatus }
      );
    }
    
    return NextResponse.json(responseData, { status: mockApi.statusCode });
  } catch (error) {
    console.error('Error serving mock API:', error);
    return NextResponse.json(
      { error: 'Failed to serve mock API' },
      { status: 500 }
    );
  }
}
