import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Try to use application default credentials
  const storage = new Storage({
    projectId: 'gen-lang-client-0282457788',
  });

  // Try to find the bucket
  const bucketNames = [
    'gen-lang-client-0282457788.firebasestorage.app',
    'gen-lang-client-0282457788.appspot.com',
  ];

  for (const bucketName of bucketNames) {
    try {
      const [exists] = await storage.bucket(bucketName).exists();
      console.log(`Bucket "${bucketName}" exists: ${exists}`);
      if (exists) {
        console.log(`Setting CORS on bucket: ${bucketName}`);
        await storage.bucket(bucketName).setCorsConfiguration([
          {
            maxAgeSeconds: 3600,
            method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            origin: ['http://localhost:3000', 'http://localhost:5173', 'https://emtupr.dev', 'https://*.emtupr.dev'],
            responseHeader: ['Content-Type', 'Content-Disposition', 'Cache-Control', 'x-goog-*', 'X-Firebase-Storage-Version'],
          },
        ]);
        console.log('CORS configuration set successfully!');
        return;
      }
    } catch (err) {
      console.log(`Error checking bucket "${bucketName}":`, err.message);
    }
  }

  // List all buckets
  try {
    const [buckets] = await storage.getBuckets();
    console.log('\nAll accessible buckets:');
    for (const b of buckets) {
      console.log(` - ${b.name}`);
    }
  } catch (err) {
    console.log('Could not list buckets:', err.message);
  }
}

main().catch(console.error);
