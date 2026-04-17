import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// 1. Server-side (Used in API routes / Server Actions)
// This only runs on the Node.js server
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// 2. Client-side (Used in Admin Dashboard / Components)
// We use a singleton pattern to prevent creating 100 connections 
// and check if we are in the browser (window)
export const pusherClient = 
  typeof window !== 'undefined' 
    ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        forceTLS: true,
      })
    : null;