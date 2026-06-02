import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import DecryptedText from '../components/DecryptedText';

export const DIGITAL_PROJECTS = [
  {
    id: 'wet-knee',
    category: 'Photography',
    title: 'Wet Knee Photoshoot',
    role: 'Photographer',
    period: '2026',
    description: 'Band promotional shoot capturing raw energy and the local atmosphere.',
    content: '### Overview\nA candid photoshoot for my band, Wet Knee. We focused on raw urban textures to complement our sound.\n\n### Gallery\n- ![IMG_7755](/IMG_7755.jpg)\n- ![IMG_7741](/IMG_7741.jpg)\n- ![IMG_7777](/IMG_7777.jpg)\n- ![IMG_7782](/IMG_7782.jpg)\n- ![IMG_7850](/IMG_7850.jpg)\n- ![IMG_7881](/IMG_7881.jpg)\n- ![IMG_7889](/IMG_7889.jpg)\n- ![IMG_7910](/IMG_7910.jpg)\n- ![IMG_7912](/IMG_7912.jpg)\n- ![IMG_7739](/IMG_7739.jpg)\n- ![IMG_7844-3](/IMG_7844-3.jpg)\n- ![IMG_7886](/IMG_7886.jpg)\n- ![IMG_7902](/IMG_7902.jpg)\n- ![IMG_7904](/IMG_7904.jpg)\n- ![IMG_7908](/IMG_7908.jpg)\n- ![IMG_7918](/IMG_7918.jpg)\n- ![IMG_7922-2](/IMG_7922-2.jpg)\n- ![IMG_7923](/IMG_7923.jpg)\n- ![IMG_7835](/IMG_7835.jpg)\n- ![IMG_7839-2](/IMG_7839-2.jpg)\n- ![IMG_7840](/IMG_7840.jpg)\n- ![IMG_7880](/IMG_7880.jpg)\n- ![IMG_7780](/IMG_7780.jpg)\n- ![IMG_7761](/IMG_7761.jpg)\n- ![IMG_7751](/IMG_7751.jpg)\n- ![IMG_7751-2](/IMG_7751-2.jpg)\n- ![IMG_7761-2](/IMG_7761-2.jpg)\n- ![IMG_7886-2](/IMG_7886-2.jpg)\n- ![IMG_7894](/IMG_7894.jpg)\n- ![IMG_7887](/IMG_7887.jpg)',
    tags: ['Canon T2i', 'Lightroom', 'Band Photography'],
    thumbnail: '/IMG_7902-2.jpg'
  },
  {
    id: 'open-studio-stream',
    category: 'Video',
    title: 'Open Studio Live Stream Setup',
    role: 'Technical Director',
    period: '2026',
    description: 'Technical documentation for setting up a live stream in the open studio.',
    content: '# Open Studio live stream docs\n\n1. Turn on the a6000, make sure to press down on the focus button to extend the lens\n\n![IMG_1582](/images/IMG_1582.jpg)\n![IMG_1586](/images/IMG_1586.jpg)\n![IMG_1585](/images/IMG_1585.jpg)\n\n2. Turn on the ptz camera\n\n![IMG_1588](/images/IMG_1588.jpg)\n![IMG_1587](/images/IMG_1587.jpg)\n\n3. remove the lens cap, make sure the status is green, and note the last 3 digits of the ip\n\n![IMG_1589](/images/IMG_1589.jpg)\n![IMG_1590](/images/IMG_1590.jpg)\n![IMG_1591](/images/IMG_1591.jpg)\n\n4. Power on the mixer, and connect it via usb, make sure the led indicator is orange\n\n![IMG_1580](/images/IMG_1580.jpg)\n![IMG_1581](/images/IMG_1581.jpg)\n![IMG_1624](/images/IMG_1624.jpg)\n\n5. Get gimbal and camera\n\n![IMG_1594](/images/IMG_1594.jpg)\n![IMG_1597](/images/IMG_1597.jpg)\n![IMG_1600](/images/IMG_1600.jpg)\n\n6. lock out pan axis and tilt axis\n\n![IMG_1610](/images/IMG_1610.jpg)\n![IMG_1615](/images/IMG_1615.jpg)\n\n7. balance gimbal\n\n![IMG_1612](/images/IMG_1612.jpg)\n![IMG_1613](/images/IMG_1613.jpg)\n![IMG_1614](/images/IMG_1614.jpg)\n\n8. unlock tilt axis and balance other side\n\n![IMG_1616](/images/IMG_1616.jpg)\n![IMG_1617](/images/IMG_1617.jpg)\n![IMG_1618](/images/IMG_1618.jpg)\n![IMG_1619](/images/IMG_1619.jpg)\n\n9. unlock pan axis and power on\n\n![IMG_1621](/images/IMG_1621.jpg)\n\n10. connect to hdmi\n\n![IMG_1622](/images/IMG_1622.jpg)\n![IMG_1623](/images/IMG_1623.jpg)\n\n11. power on computer, open vmix, reaper and sonosbus\n\n![image](/images/image.png)\n![image 1](/images/image%201.png)\n![image 2](/images/image%202.png)\n\n12. in vmix open the coffee house preset in the documents folder\n\n![Screenshot 1](/images/Screenshot_2026-06-02_102832.png)\n![Screenshot 2](/images/Screenshot_2026-06-02_102856.png)\n![Screenshot 3](/images/Screenshot_2026-06-02_102906.png)\n![Screenshot 4](/images/Screenshot_2026-06-02_102911.png)\n\n13. enable ndi for ptz camera, hit settings on input 3, then change\n\n![Screenshot 5](/images/Screenshot_2026-06-02_103031.png)\n![Screenshot 6](/images/Screenshot_2026-06-02_102956.png)\n![Screenshot 7](/images/Screenshot_2026-06-02_103003.png)\n\n14. connect ptz on input 3, hit settings then ptz\n\n![Screenshot 8](/images/Screenshot_2026-06-02_103031%201.png)\n![Screenshot 9](/images/Screenshot_2026-06-02_103036.png)\n\n15. in reaper, open most recent mixed preset\n\n![Screenshot 10](/images/Screenshot_2026-06-02_104226.png)\n\n16. configure reaper’s audio (control p to access preferences)\n\n![Screenshot 11](/images/Screenshot_2026-06-02_110223.png)\n![Screenshot 12](/images/Screenshot_2026-06-02_110341.png)\n\n17. configure all audio sources to in\n\n![Screenshot 13](/images/Screenshot_2026-06-02_110401.png)\n\n18. add sonobus as a effect on main\n\n![Screenshot 14](/images/Screenshot_2026-06-02_104244.png)\n![Screenshot 15](/images/Screenshot_2026-06-02_111211.png)\n\n19. connect reaper sonobus to windows application sonos bus\nhit connect, 3 dots, connect to raw address coppy the address and paste it in the windows app.\n\n![Screenshot 16](/images/Screenshot_2026-06-02_111215.png)\n![Screenshot 17](/images/Screenshot_2026-06-02_111222.png)\n\n20. confirm audio is playing back on window sonobus, by playing back in reaper\n\n![Screenshot 18](/images/Screenshot_2026-06-02_111313.png)\n\n21. Hit setting ands configure audio divice in windows app sonobus to output to vb audio cable A\n\n![Screenshot 19](/images/Screenshot_2026-06-02_111320.png)\n![Screenshot 20](/images/Screenshot_2026-06-02_111330.png)\n\n22. confirm audio input in vmix, and hit record\n\n![Screenshot 21](/images/Screenshot_2026-06-02_111342.png)\n\nOptional, configure live stream\n\n![Screenshot 22](/images/Screenshot_2026-06-02_111410.png)\n\n[Creating a new YouTube Live Stream using the new YouTube Studio interface | vMix](https://www.vmix.com/knowledgebase/article.aspx/222/creating-a-new-youtube-live-stream-using-the-new-youtube-studio-interface)\n\n[How to stream to YouTube Live | vMix](https://www.vmix.com/knowledgebase/article.aspx/374/how-to-stream-to-youtube-live)',
    tags: ['vMix', 'Reaper', 'Sonobus', 'Live Streaming'],
    thumbnail: '/images/IMG_1582.jpg'
  }
];

export default function Digital() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, style } = useTheme();

  const filteredProjects = DIGITAL_PROJECTS.filter(project => 
    searchQuery === '' ? true : 
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-6xl mx-auto w-full relative ${theme === 'dark' ? 'px-6 py-24' : 'px-8 py-28'}`}
    >
      <header className={`mb-16 relative z-10 text-center ${theme === 'dark' ? '' : 'scrapbook-cutout'}`}>
        <h1 className={`text-6xl md:text-9xl font-black tracking-tighter mb-8 ${theme === 'dark' ? 'text-neutral-100' : 'text-black'}`}>
           {style === '95' ? <DecryptedText text="Visual & Audio Media" /> : "Visual & Audio Media"}
        </h1>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion.
        </p>
      </header>

      <div className="mb-16 relative max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`} />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-lg rounded-full pl-12 pr-6 py-4 focus:outline-none transition-all ${
                theme === 'dark' 
                ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-neutral-600' 
                : 'bg-white border-2 border-neutral-200 text-black focus:border-black'
              }`}
            />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pl-4">
        {filteredProjects.length > 0 ? filteredProjects.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            className="group flex flex-col gap-6"
          >
            <Link to={`/project/${item.id}`} className="relative block overflow-hidden rounded-sm aspect-[16/10]">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </Link>
            
            <div className="flex flex-col">
              <h3 className={`text-3xl font-bold mb-2 tracking-tight ${theme === 'dark' ? 'text-neutral-200' : 'text-black'}`}>{item.title}</h3>
              <p className={`text-sm mb-4 uppercase tracking-widest ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>{item.category} • {item.period}</p>
            </div>
          </motion.div>
        )) : (
          <div className={`md:col-span-2 font-mono text-center py-20 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>No media matching "{searchQuery}"</div>
        )}
      </div>
    </motion.div>
  );
}
