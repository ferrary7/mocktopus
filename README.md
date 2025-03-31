# Mocktopus

Mocktopus is a powerful API mocking and testing platform built with Next.js. It allows developers to create, manage, and monitor mock API endpoints for seamless frontend development and testing.

## Overview

Mocktopus solves the common challenge of frontend development being blocked by incomplete or unavailable backend APIs. With Mocktopus, you can:

- Create realistic mock API endpoints with customizable responses
- Track usage with detailed analytics
- Configure various response scenarios and status codes
- Collaborate with team members on API mocking
- Streamline development workflows by decoupling frontend and backend timelines

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Key Features

1. **API Mocking & Management**: Create and configure mock API endpoints with custom responses
2. **Analytics Dashboard**: Track request counts, success rates, and usage patterns
3. **Authentication**: Secure user accounts with NextAuth and Google OAuth
4. **Response Configuration**: Set up different status codes, delays, and payload formats
5. **User-friendly Interface**: Modern UI with intuitive navigation

## Environment Setup

Create a `.env` file based on the sample.env template:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
