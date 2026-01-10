import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://subnexit.com';

  // আপনার ওয়েবসাইটের সব পেজের লিস্ট এখানে দিন
  const pages = [
    '',
    '/about',
    '/contact',
    // ভবিষ্যতে আরও পেজ যোগ করলে এখানে লিখে দিলেই হবে
  ];

  return pages.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: url === '' ? 1 : 0.8,
  }));
}
