import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import StatsStrip from './sections/StatsStrip';
import NewsSection from './sections/NewsSection';
import GallerySection from './sections/GallerySection';
import VideoShowcase from './sections/VideoShowcase';
import MemberSpotlight from './sections/MemberSpotlight';
import ContactCTA from './sections/ContactCTA';
import MilestoneTimeline from './sections/MilestoneTimeline';
import {
  fetchGallery,
  fetchHomeConfig,
  fetchLatestNews,
  fetchMembers,
  fetchVideos,
  fetchContactInfo,
  fetchMilestones,
  recordVisit,
  type Article,
  type Carousel,
  type HeroConfig,
  type MemberItem,
  type StatsConfig,
  type ImageItem,
  type VideoItem,
  type ContactInfo,
  type MilestoneEvent,
} from './api/portal';

const App = () => {
  const [hero, setHero] = useState<HeroConfig | null>(null);
  const [stats, setStats] = useState<StatsConfig | null>(null);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [quickNav, setQuickNav] = useState<{ id: number; name: string; link_url: string }[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [milestones, setMilestones] = useState<MilestoneEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const [home, latestNews, gallery, videoList, memberList, contact, milestoneList] = await Promise.all([
          fetchHomeConfig(),
          fetchLatestNews(4),
          fetchGallery(6),
          fetchVideos(4),
          fetchMembers(true),
          fetchContactInfo().catch(() => null),
          fetchMilestones(8).catch(() => []),
        ]);
        setHero(home.hero);
        setStats(home.stats);
        setCarousels(home.carousels);
        setQuickNav(home.quick_nav);
        setNews(latestNews);
        setImages(gallery);
        setVideos(videoList);
        setMembers(memberList);
        setContactInfo(contact);
        setMilestones(milestoneList);
      } catch (error) {
        console.error('Failed to load portal data', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortalData();
  }, []);

  useEffect(() => {
    recordVisit({
      page_url: window.location.pathname,
      referer: document.referrer,
      user_agent: navigator.userAgent,
      device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browser: navigator.userAgent,
      os: navigator.platform,
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="cosmic-shell font-body text-[var(--color-text)]">
      <div className="mesh-canvas" aria-hidden />
      <div className="grid-overlay" aria-hidden />
      <Navbar links={quickNav} />
      <main className="relative z-10 space-y-0 pt-28">
        <Hero hero={hero} carousels={carousels} quickNav={quickNav} stats={stats} />
        {[
          { key: 'stats', node: <StatsStrip stats={stats} /> },
          { key: 'timeline', node: <MilestoneTimeline events={milestones} /> },
          { key: 'news', node: <NewsSection articles={news} /> },
          { key: 'gallery', node: <GallerySection images={images} /> },
          { key: 'videos', node: <VideoShowcase videos={videos} /> },
          { key: 'members', node: <MemberSpotlight members={members} /> },
          { key: 'contact', node: <ContactCTA info={contactInfo} /> },
        ].map((section, index, arr) => (
          <div key={section.key} className="section-wrapper">
            <div className="section-glow" aria-hidden />
            {section.node}
            {index < arr.length - 1 && <div className="section-connector" aria-hidden />}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default App;
