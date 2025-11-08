import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import StatsStrip from './sections/StatsStrip';
import QuickNav from './sections/QuickNav';
import ShowcaseCarousel from './sections/ShowcaseCarousel';
import NewsSection from './sections/NewsSection';
import GallerySection from './sections/GallerySection';
import VideoShowcase from './sections/VideoShowcase';
import MemberSpotlight from './sections/MemberSpotlight';
import ContactCTA from './sections/ContactCTA';
import {
  fetchGallery,
  fetchHomeConfig,
  fetchLatestNews,
  fetchMembers,
  fetchVideos,
  recordVisit,
  type Article,
  type Carousel,
  type HeroConfig,
  type MemberItem,
  type StatsConfig,
  type ImageItem,
  type VideoItem,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortalData = async () => {
      try {
        const [home, latestNews, gallery, videoList, memberList] = await Promise.all([
          fetchHomeConfig(),
          fetchLatestNews(4),
          fetchGallery(6),
          fetchVideos(4),
          fetchMembers(true),
        ]);
        setHero(home.hero);
        setStats(home.stats);
        setCarousels(home.carousels);
        setQuickNav(home.quick_nav);
        setNews(latestNews);
        setImages(gallery);
        setVideos(videoList);
        setMembers(memberList);
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
    <div className="min-h-screen bg-[#f5f5f7] font-body text-deep">
      <Navbar links={quickNav} />
      <main className="pt-20">
        <Hero hero={hero} carousels={carousels} />
        <StatsStrip stats={stats} />
        <QuickNav items={quickNav.slice(0, 4)} />
        <ShowcaseCarousel carousels={carousels} />
        <NewsSection articles={news} />
        <GallerySection images={images} />
        <VideoShowcase videos={videos} />
        <MemberSpotlight members={members} />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
