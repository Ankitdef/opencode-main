export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  category: string;
  image: string;
  featured: boolean;
  href: string;
}

export const stories: Story[] = [
  {
    id: "1",
    title: "The Hidden Valley: A Trekker's Guide to Valley of Flowers",
    slug: "hidden-valley-guide",
    excerpt: "Discover the secret alpine meadows and rare Himalayan flora that make this UNESCO World Heritage Site one of India's most magical treks.",
    content: "Full article content here...",
    author: "Priya Sharma",
    authorRole: "Trek Leader",
    publishedAt: "2024-12-15",
    readTime: 8,
    category: "Trekking",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    featured: true,
    href: "/treks/valley-of-flowers",
  },
  {
    id: "2",
    title: "Winter Trekking in Uttarakhand: What You Need to Know",
    slug: "winter-trekking-guide",
    excerpt: "From snow-covered trails to frozen lakes, here's everything you need to prepare for a Himalayan winter adventure.",
    content: "Full article content here...",
    author: "Rahul Verma",
    authorRole: "Expedition Manager",
    publishedAt: "2024-11-20",
    readTime: 6,
    category: "Guide",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80",
    featured: false,
    href: "/treks",
  },
  {
    id: "3",
    title: "Skiing in Auli: India's Best-Kept Secret",
    slug: "skiing-in-auli",
    excerpt: "Why Auli's powder slopes and panoramic Nanda Devi views rival the world's top ski destinations.",
    content: "Full article content here...",
    author: "Meera Nair",
    authorRole: "Skiing Instructor",
    publishedAt: "2024-10-05",
    readTime: 5,
    category: "Skiing",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    featured: false,
    href: "/activities#skiing",
  },
];
