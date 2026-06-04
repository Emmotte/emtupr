/**
 * Paste this entire block into the browser DevTools console
 * while on the /admin page (you must be logged in).
 *
 * It uses the existing Firebase connection already active in the page,
 * so no service account or extra setup is needed.
 */

(async () => {
  // Pull Firebase internals from the running app
  const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
  const { getFirestore, doc, setDoc, Timestamp, collection } =
    await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js');

  // Re-use the already-initialized app
  const apps = getApps();
  if (!apps.length) { console.error('No Firebase app found. Make sure you are on the /admin page and logged in.'); return; }
  const app = apps[0];

  const db = getFirestore(app, 'ai-studio-5ea78394-d2c3-4bc9-b91a-c485a284419a');

  const projects = [
    {
      id: 'wet-knee',
      title: 'Wet Knee Photoshoot',
      category: 'Photography',
      description: 'Band promotional shoot capturing raw energy and the local atmosphere.',
      content: `### Overview\nA candid photoshoot for my band, Wet Knee. We focused on raw urban textures to complement our sound.\n\n### Gallery\n- ![IMG_7755](/IMG_7755.jpg)\n- ![IMG_7741](/IMG_7741.jpg)\n- ![IMG_7777](/IMG_7777.jpg)\n- ![IMG_7782](/IMG_7782.jpg)\n- ![IMG_7850](/IMG_7850.jpg)\n- ![IMG_7881](/IMG_7881.jpg)\n- ![IMG_7889](/IMG_7889.jpg)\n- ![IMG_7910](/IMG_7910.jpg)\n- ![IMG_7912](/IMG_7912.jpg)\n- ![IMG_7739](/IMG_7739.jpg)\n- ![IMG_7844-3](/IMG_7844-3.jpg)\n- ![IMG_7886](/IMG_7886.jpg)\n- ![IMG_7902](/IMG_7902.jpg)\n- ![IMG_7904](/IMG_7904.jpg)\n- ![IMG_7908](/IMG_7908.jpg)\n- ![IMG_7918](/IMG_7918.jpg)\n- ![IMG_7922-2](/IMG_7922-2.jpg)\n- ![IMG_7923](/IMG_7923.jpg)\n- ![IMG_7835](/IMG_7835.jpg)\n- ![IMG_7839-2](/IMG_7839-2.jpg)\n- ![IMG_7840](/IMG_7840.jpg)\n- ![IMG_7880](/IMG_7880.jpg)\n- ![IMG_7780](/IMG_7780.jpg)\n- ![IMG_7761](/IMG_7761.jpg)\n- ![IMG_7751](/IMG_7751.jpg)\n- ![IMG_7751-2](/IMG_7751-2.jpg)\n- ![IMG_7761-2](/IMG_7761-2.jpg)\n- ![IMG_7886-2](/IMG_7886-2.jpg)\n- ![IMG_7894](/IMG_7894.jpg)\n- ![IMG_7887](/IMG_7887.jpg)`,
      skills: ['Canon T2i', 'Lightroom', 'Band Photography'],
      isPublic: true,
      link: '',
      period: '2026',
      role: 'Photographer',
      thumbnail: '/IMG_7902-2.jpg',
      createdAt: Timestamp.fromDate(new Date('2026-01-15')),
    },
    {
      id: 'open-studio-stream',
      title: 'Open Studio Live Stream Setup',
      category: 'Video',
      description: 'Technical documentation for setting up a live stream in the open studio.',
      content: `# Open Studio live stream docs\n\n1. Turn on the a6000, make sure to press down on the focus button to extend the lens\n\n![IMG_1582](/images/IMG_1582.jpg)\n![IMG_1586](/images/IMG_1586.jpg)\n![IMG_1585](/images/IMG_1585.jpg)\n\n2. Turn on the ptz camera\n\n![IMG_1588](/images/IMG_1588.jpg)\n![IMG_1587](/images/IMG_1587.jpg)\n\n3. Remove the lens cap, make sure the status is green, and note the last 3 digits of the ip\n\n![IMG_1589](/images/IMG_1589.jpg)\n![IMG_1590](/images/IMG_1590.jpg)\n![IMG_1591](/images/IMG_1591.jpg)\n\n4. Power on the mixer, and connect it via usb, make sure the led indicator is orange\n\n![IMG_1580](/images/IMG_1580.jpg)\n![IMG_1581](/images/IMG_1581.jpg)\n![IMG_1624](/images/IMG_1624.jpg)\n\n5. Get gimbal and camera\n\n![IMG_1594](/images/IMG_1594.jpg)\n![IMG_1597](/images/IMG_1597.jpg)\n![IMG_1600](/images/IMG_1600.jpg)\n\n6. Lock out pan axis and tilt axis\n\n![IMG_1610](/images/IMG_1610.jpg)\n![IMG_1615](/images/IMG_1615.jpg)\n\n7. Balance gimbal\n\n![IMG_1612](/images/IMG_1612.jpg)\n![IMG_1613](/images/IMG_1613.jpg)\n![IMG_1614](/images/IMG_1614.jpg)\n\n8. Unlock tilt axis and balance other side\n\n![IMG_1616](/images/IMG_1616.jpg)\n![IMG_1617](/images/IMG_1617.jpg)\n![IMG_1618](/images/IMG_1618.jpg)\n![IMG_1619](/images/IMG_1619.jpg)\n\n9. Unlock pan axis and power on\n\n![IMG_1621](/images/IMG_1621.jpg)\n\n10. Connect to hdmi\n\n![IMG_1622](/images/IMG_1622.jpg)\n![IMG_1623](/images/IMG_1623.jpg)\n\n11. Power on computer, open vmix, reaper and sonosbus\n\n![image](/images/image.png)\n\n12. In vmix open the coffee house preset in the documents folder\n\n![Screenshot 1](/images/Screenshot_2026-06-02_102832.png)\n![Screenshot 2](/images/Screenshot_2026-06-02_102856.png)\n\n13. Enable ndi for ptz camera, hit settings on input 3, then change\n\n![Screenshot 5](/images/Screenshot_2026-06-02_103031.png)\n\n14. Connect ptz on input 3, hit settings then ptz\n\n![Screenshot 8](/images/Screenshot_2026-06-02_103031%201.png)\n\n15. In reaper, open most recent mixed preset\n\n16. Configure reaper's audio (control p to access preferences)\n\n17. Configure all audio sources to in\n\n18. Add sonobus as a effect on main\n\n19. Connect reaper sonobus to windows sonobus — hit connect, 3 dots, connect to raw address, copy and paste in windows app.\n\n20. Confirm audio playback in reaper, then confirm in windows sonobus\n\n21. Configure windows sonobus audio device to vb audio cable A\n\n22. Confirm audio input in vmix, and hit record\n\n[Creating a YouTube Live Stream | vMix](https://www.vmix.com/knowledgebase/article.aspx/222/creating-a-new-youtube-live-stream-using-the-new-youtube-studio-interface)`,
      skills: ['vMix', 'Reaper', 'Sonobus', 'Live Streaming'],
      isPublic: true,
      link: '',
      period: '2026',
      role: 'Technical Director',
      thumbnail: '/images/IMG_1582.jpg',
      createdAt: Timestamp.fromDate(new Date('2026-06-02')),
    }
  ];

  for (const { id, ...data } of projects) {
    try {
      await setDoc(doc(db, 'projects', id), data);
      console.log(`✅ Seeded: ${id} — "${data.title}"`);
    } catch (err) {
      console.error(`❌ Failed: ${id}`, err.message);
    }
  }

  console.log('\n🎉 Seed complete! Refresh the admin panel to see both projects.');
})();
