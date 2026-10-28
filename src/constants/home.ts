// ─── Filter chip labels ───────────────────────────────────────────────────────
export const FILTER_CHIPS = ['All', 'Matches', 'Tournaments'] as const;

// ─── Carousel card width ──────────────────────────────────────────────────────
// Intentionally fixed so the carousel snaps cleanly on most phones.
export const MATCH_CARD_W = 320;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FeaturedMatch {
  id: string;
  type: string;
  title: string;
  time: string;
  venue: string;
  level: string;
  image: string;
}

export interface NearbyPlayer {
  id: string;
  name: string;
  level: string;
  dist: string;
  avatar: string;
  online: boolean;
}

export interface FeaturedCourt {
  id: string;
  name: string;
  dist: string;
  rating: number;
  reviews: number;
  image: string;
}

// ─── Mock data (replace with real API calls later) ────────────────────────────
export const FEATURED_MATCHES: FeaturedMatch[] = [
  {
    id: '1',
    type: 'Open Match',
    title: 'Friendly Padel Game',
    time: 'Today, 18:00',
    venue: 'Islamabad Padel Club',
    level: 'Level 3–4',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  },
  {
    id: '2',
    type: 'Tournament',
    title: 'DHA League Match',
    time: 'Sat, 10:00',
    venue: 'Lahore Sports Arena',
    level: 'Level 4–5',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
  },
];

export const NEARBY_PLAYERS: NearbyPlayer[] = [
  { id: '1', name: 'Ali R.', level: 'Level 4', dist: '0.8 km', avatar: 'https://i.pravatar.cc/80?img=11', online: true },
  { id: '2', name: 'Sara M.', level: 'Level 3', dist: '1.1 km', avatar: 'https://i.pravatar.cc/80?img=47', online: true },
  { id: '3', name: 'Usman K.', level: 'Level 4', dist: '1.4 km', avatar: 'https://i.pravatar.cc/80?img=52', online: false },
  { id: '4', name: 'Nadia L.', level: 'Level 3', dist: '2.1 km', avatar: 'https://i.pravatar.cc/80?img=32', online: true },
  { id: '5', name: 'Hassan F.', level: 'Level 5', dist: '2.8 km', avatar: 'https://i.pravatar.cc/80?img=69', online: false },
];

export const FEATURED_COURTS: FeaturedCourt[] = [
  {
    id: '1',
    name: 'Islamabad Padel Club',
    dist: '1.2 km away',
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80',
  },
  {
    id: '2',
    name: 'Lahore Sports Arena',
    dist: '2.4 km away',
    rating: 4.6,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&q=80',
  },
];
