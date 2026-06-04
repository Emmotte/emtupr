/**
 * seed-projects.mjs
 *
 * One-shot script to port the 2 local Digital projects into Firestore.
 * 
 * Usage:
 *   node scripts/seed-projects.mjs
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to a Firebase
 * service account JSON, OR run via `firebase emulators` with FIRESTORE_EMULATOR_HOST.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../firebase-applet-config.json'), 'utf8'));

initializeApp({
  credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? undefined  // uses env var automatically
    : (() => { throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path'); })()
  ),
  projectId: config.projectId,
});

const db = getFirestore();
db.settings({ databaseId: config.firestoreDatabaseId });

const projects = [
  {
    id: 'wet-knee',
    data: {
      title: 'Wet Knee Photoshoot',
      category: 'Photography',
      description: 'Band promotional shoot capturing raw energy and the local atmosphere.',
      content: `### Overview
A candid photoshoot for my band, Wet Knee. We focused on raw urban textures to complement our sound.

### Gallery
- ![IMG_7755](/IMG_7755.jpg)
- ![IMG_7741](/IMG_7741.jpg)
- ![IMG_7777](/IMG_7777.jpg)
- ![IMG_7782](/IMG_7782.jpg)
- ![IMG_7850](/IMG_7850.jpg)
- ![IMG_7881](/IMG_7881.jpg)
- ![IMG_7889](/IMG_7889.jpg)
- ![IMG_7910](/IMG_7910.jpg)
- ![IMG_7912](/IMG_7912.jpg)
- ![IMG_7739](/IMG_7739.jpg)
- ![IMG_7844-3](/IMG_7844-3.jpg)
- ![IMG_7886](/IMG_7886.jpg)
- ![IMG_7902](/IMG_7902.jpg)
- ![IMG_7904](/IMG_7904.jpg)
- ![IMG_7908](/IMG_7908.jpg)
- ![IMG_7918](/IMG_7918.jpg)
- ![IMG_7922-2](/IMG_7922-2.jpg)
- ![IMG_7923](/IMG_7923.jpg)
- ![IMG_7835](/IMG_7835.jpg)
- ![IMG_7839-2](/IMG_7839-2.jpg)
- ![IMG_7840](/IMG_7840.jpg)
- ![IMG_7880](/IMG_7880.jpg)
- ![IMG_7780](/IMG_7780.jpg)
- ![IMG_7761](/IMG_7761.jpg)
- ![IMG_7751](/IMG_7751.jpg)`,
      skills: ['Canon T2i', 'Lightroom', 'Band Photography'],
      isPublic: true,
      link: '',
      period: '2026',
      role: 'Photographer',
      thumbnail: '/IMG_7902-2.jpg',
      createdAt: Timestamp.now(),
    }
  },
  {
    id: 'open-studio-stream',
    data: {
      title: 'Open Studio Live Stream Setup',
      category: 'Video',
      description: 'Technical documentation for setting up a live stream in the open studio.',
      content: `# Open Studio live stream docs

1. Turn on the a6000, make sure to press down on the focus button to extend the lens

![IMG_1582](/images/IMG_1582.jpg)
![IMG_1586](/images/IMG_1586.jpg)
![IMG_1585](/images/IMG_1585.jpg)

2. Turn on the ptz camera

![IMG_1588](/images/IMG_1588.jpg)
![IMG_1587](/images/IMG_1587.jpg)

3. Remove the lens cap, make sure the status is green, and note the last 3 digits of the ip

![IMG_1589](/images/IMG_1589.jpg)
![IMG_1590](/images/IMG_1590.jpg)
![IMG_1591](/images/IMG_1591.jpg)

4. Power on the mixer, and connect it via usb, make sure the led indicator is orange

![IMG_1580](/images/IMG_1580.jpg)
![IMG_1581](/images/IMG_1581.jpg)
![IMG_1624](/images/IMG_1624.jpg)

5. Get gimbal and camera

![IMG_1594](/images/IMG_1594.jpg)
![IMG_1597](/images/IMG_1597.jpg)
![IMG_1600](/images/IMG_1600.jpg)

6. Lock out pan axis and tilt axis

![IMG_1610](/images/IMG_1610.jpg)
![IMG_1615](/images/IMG_1615.jpg)

7. Balance gimbal

![IMG_1612](/images/IMG_1612.jpg)
![IMG_1613](/images/IMG_1613.jpg)
![IMG_1614](/images/IMG_1614.jpg)

8. Unlock tilt axis and balance other side

![IMG_1616](/images/IMG_1616.jpg)
![IMG_1617](/images/IMG_1617.jpg)
![IMG_1618](/images/IMG_1618.jpg)
![IMG_1619](/images/IMG_1619.jpg)

9. Unlock pan axis and power on

![IMG_1621](/images/IMG_1621.jpg)

10. Connect to hdmi

![IMG_1622](/images/IMG_1622.jpg)
![IMG_1623](/images/IMG_1623.jpg)

11. Power on computer, open vmix, reaper and sonosbus

![image](/images/image.png)
![image 1](/images/image%201.png)
![image 2](/images/image%202.png)

12. In vmix open the coffee house preset in the documents folder

![Screenshot 1](/images/Screenshot_2026-06-02_102832.png)
![Screenshot 2](/images/Screenshot_2026-06-02_102856.png)
![Screenshot 3](/images/Screenshot_2026-06-02_102906.png)
![Screenshot 4](/images/Screenshot_2026-06-02_102911.png)

13. Enable ndi for ptz camera, hit settings on input 3, then change

![Screenshot 5](/images/Screenshot_2026-06-02_103031.png)
![Screenshot 6](/images/Screenshot_2026-06-02_102956.png)
![Screenshot 7](/images/Screenshot_2026-06-02_103003.png)

14. Connect ptz on input 3, hit settings then ptz

![Screenshot 8](/images/Screenshot_2026-06-02_103031%201.png)
![Screenshot 9](/images/Screenshot_2026-06-02_103036.png)

15. In reaper, open most recent mixed preset

![Screenshot 10](/images/Screenshot_2026-06-02_104226.png)

16. Configure reaper's audio (control p to access preferences)

![Screenshot 11](/images/Screenshot_2026-06-02_110223.png)
![Screenshot 12](/images/Screenshot_2026-06-02_110341.png)

17. Configure all audio sources to in

![Screenshot 13](/images/Screenshot_2026-06-02_110401.png)

18. Add sonobus as a effect on main

![Screenshot 14](/images/Screenshot_2026-06-02_104244.png)
![Screenshot 15](/images/Screenshot_2026-06-02_111211.png)

19. Connect reaper sonobus to windows application sonobus — hit connect, 3 dots, connect to raw address, copy the address and paste it in the windows app.

![Screenshot 16](/images/Screenshot_2026-06-02_111215.png)
![Screenshot 17](/images/Screenshot_2026-06-02_111222.png)

20. Confirm audio is playing back on windows sonobus, by playing back in reaper

![Screenshot 18](/images/Screenshot_2026-06-02_111313.png)

21. Hit settings and configure audio device in windows app sonobus to output to vb audio cable A

![Screenshot 19](/images/Screenshot_2026-06-02_111320.png)
![Screenshot 20](/images/Screenshot_2026-06-02_111330.png)

22. Confirm audio input in vmix, and hit record

![Screenshot 21](/images/Screenshot_2026-06-02_111342.png)

Optional: configure live stream

![Screenshot 22](/images/Screenshot_2026-06-02_111410.png)

[Creating a new YouTube Live Stream | vMix](https://www.vmix.com/knowledgebase/article.aspx/222/creating-a-new-youtube-live-stream-using-the-new-youtube-studio-interface)
[How to stream to YouTube Live | vMix](https://www.vmix.com/knowledgebase/article.aspx/374/how-to-stream-to-youtube-live)`,
      skills: ['vMix', 'Reaper', 'Sonobus', 'Live Streaming'],
      isPublic: true,
      link: '',
      period: '2026',
      role: 'Technical Director',
      thumbnail: '/images/IMG_1582.jpg',
      createdAt: Timestamp.now(),
    }
  }
];

async function seed() {
  console.log(`Seeding ${projects.length} projects to Firestore database: ${config.firestoreDatabaseId}`);
  for (const { id, data } of projects) {
    await db.collection('projects').doc(id).set(data);
    console.log(`  ✅ Written: ${id} — "${data.title}"`);
  }
  console.log('\nDone! All projects seeded successfully.');
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
