// ─── Filter chip labels ───────────────────────────────────────────────────────
export const FILTER_CHIPS = ['All', 'Matches', 'Tournaments'] as const;

// ─── Carousel card width ──────────────────────────────────────────────────────
// Intentionally fixed so the carousel snaps cleanly on most phones.
export const MATCH_CARD_W = 320;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MatchPlayer {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface FeaturedMatch {
  id: string;
  type: string;
  title: string;
  /** Short display time, e.g. "Today, 18:00" */
  time: string;
  /** Full date + time range, e.g. "Sat, 14 Jun · 17:00 – 19:00" */
  dateRange: string;
  venue: string;
  /** City / country, e.g. "Islamabad, Pakistan" */
  venueCity: string;
  courtName: string;
  courtType: string;
  level: string;
  levelDisplay: string;
  image: string;
  spotsLeft: number;
  totalSpots: number;
  players: MatchPlayer[];
  host: {
    name: string;
    avatar: string;
    level: number;
    matches: number;
    verified: boolean;
  };
  description: string;
  stats: {
    winRate: number;
    matches: number;
    levelAvg: number;
  };
}

export interface NearbyPlayer {
  id: string;
  name: string;
  level: string;
  dist: string;
  avatar: string;
  online: boolean;
}

export type CourtSurface = 'Outdoor' | 'Indoor' | 'Covered';
export type CourtAmenity = 'Parking' | 'Café' | 'Changing Rooms' | 'Floodlights' | 'Pro Shop' | 'Coaching' | 'Showers';

export interface FeaturedCourt {
  id: string;
  name: string;
  city: string;
  address: string;
  dist: string;
  distKm: number;          // numeric, for sorting
  rating: number;
  reviews: number;
  image: string;
  surface: CourtSurface;
  courts: number;          // total number of courts
  pricePerHour: number;    // PKR
  openNow: boolean;
  openHours: string;       // e.g. "06:00 – 23:00"
  amenities: CourtAmenity[];
  featured: boolean;
}

// ─── Mock data (replace with real API calls later) ────────────────────────────
export const FEATURED_MATCHES: FeaturedMatch[] = [
  {
    id: '1',
    type: 'Open Match',
    title: 'Weekend Padel Mix',
    time: 'Today, 18:00',
    dateRange: 'Sat, 14 Jun · 17:00 – 19:00',
    venue: 'Islamabad Padel Club',
    venueCity: 'Islamabad, Pakistan',
    courtName: 'Outdoor Court 3',
    courtType: 'Outdoor',
    level: 'Level 3–4',
    levelDisplay: 'Level 3-4',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    spotsLeft: 1,
    totalSpots: 4,
    players: [
      { id: 'p1', name: 'Lucas', avatar: 'https://i.pravatar.cc/80?img=11', online: true },
      { id: 'p2', name: 'Marta', avatar: 'https://i.pravatar.cc/80?img=47', online: true },
      { id: 'p3', name: 'Javier', avatar: 'https://i.pravatar.cc/80?img=52', online: false },
    ],
    host: {
      name: 'Carlos M.',
      avatar: 'https://i.pravatar.cc/80?img=69',
      level: 4,
      matches: 52,
      verified: true,
    },
    description: 'Friendly match, good vibes and intermediate level.\nAll are welcome! Let\'s play padel!',
    stats: {
      winRate: 78,
      matches: 52,
      levelAvg: 3.8,
    },
  },
  {
    id: '2',
    type: 'Tournament',
    title: 'DHA League Match',
    time: 'Sat, 10:00',
    dateRange: 'Sat, 21 Jun · 10:00 – 12:00',
    venue: 'Lahore Sports Arena',
    venueCity: 'Lahore, Pakistan',
    courtName: 'Indoor Court 1',
    courtType: 'Indoor',
    level: 'Level 4–5',
    levelDisplay: 'Level 4-5',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
    spotsLeft: 2,
    totalSpots: 4,
    players: [
      { id: 'p1', name: 'Ali R.', avatar: 'https://i.pravatar.cc/80?img=33', online: true },
      { id: 'p2', name: 'Sara M.', avatar: 'https://i.pravatar.cc/80?img=44', online: false },
    ],
    host: {
      name: 'Hassan F.',
      avatar: 'https://i.pravatar.cc/80?img=15',
      level: 5,
      matches: 88,
      verified: true,
    },
    description: 'Competitive match for advanced players. Bring your A-game and enjoy a great session at the top court in Lahore.',
    stats: {
      winRate: 82,
      matches: 88,
      levelAvg: 4.5,
    },
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
    city: 'Islamabad',
    address: 'F-7 Markaz, Islamabad',
    dist: '1.2 km away',
    distKm: 1.2,
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&q=80',
    surface: 'Outdoor',
    courts: 4,
    pricePerHour: 2500,
    openNow: true,
    openHours: '06:00 – 23:00',
    amenities: ['Parking', 'Café', 'Changing Rooms', 'Floodlights'],
    featured: true,
  },
  {
    id: '2',
    name: 'Lahore Sports Arena',
    city: 'Lahore',
    address: 'DHA Phase 6, Lahore',
    dist: '2.4 km away',
    distKm: 2.4,
    rating: 4.6,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80',
    surface: 'Indoor',
    courts: 6,
    pricePerHour: 3000,
    openNow: true,
    openHours: '07:00 – 22:00',
    amenities: ['Parking', 'Changing Rooms', 'Pro Shop', 'Coaching', 'Showers'],
    featured: true,
  },
  {
    id: '3',
    name: 'Karachi Padel Hub',
    city: 'Karachi',
    address: 'Clifton Block 5, Karachi',
    dist: '3.1 km away',
    distKm: 3.1,
    rating: 4.5,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
    surface: 'Covered',
    courts: 3,
    pricePerHour: 2800,
    openNow: false,
    openHours: '08:00 – 22:00',
    amenities: ['Parking', 'Café', 'Floodlights', 'Showers'],
    featured: false,
  },
  {
    id: '4',
    name: 'Rawalpindi Racquet Club',
    city: 'Rawalpindi',
    address: 'Saddar Road, Rawalpindi',
    dist: '4.0 km away',
    distKm: 4.0,
    rating: 4.3,
    reviews: 41,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
    surface: 'Outdoor',
    courts: 2,
    pricePerHour: 2000,
    openNow: true,
    openHours: '06:00 – 21:00',
    amenities: ['Parking', 'Floodlights'],
    featured: false,
  },
  {
    id: '5',
    name: 'Gulberg Padel Center',
    city: 'Lahore',
    address: 'Gulberg III, Lahore',
    dist: '5.2 km away',
    distKm: 5.2,
    rating: 4.7,
    reviews: 93,
    image: 'https://images.unsplash.com/photo-1543357480-c60d40b92296?w=600&q=80',
    surface: 'Indoor',
    courts: 5,
    pricePerHour: 3500,
    openNow: true,
    openHours: '07:00 – 23:00',
    amenities: ['Parking', 'Café', 'Pro Shop', 'Coaching', 'Changing Rooms', 'Showers'],
    featured: true,
  },
  {
    id: '6',
    name: 'Faisal Town Sports Complex',
    city: 'Islamabad',
    address: 'Faisal Town, Islamabad',
    dist: '6.8 km away',
    distKm: 6.8,
    rating: 4.2,
    reviews: 30,
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&q=80',
    surface: 'Outdoor',
    courts: 2,
    pricePerHour: 1800,
    openNow: false,
    openHours: '08:00 – 20:00',
    amenities: ['Parking', 'Changing Rooms'],
    featured: false,
  },
  {
    id: '7',
    name: 'Bahria Town Padel',
    city: 'Rawalpindi',
    address: 'Bahria Town Phase 7',
    dist: '7.5 km away',
    distKm: 7.5,
    rating: 4.9,
    reviews: 150,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80',
    surface: 'Covered',
    courts: 8,
    pricePerHour: 4000,
    openNow: true,
    openHours: '06:00 – 24:00',
    amenities: ['Parking', 'Café', 'Pro Shop', 'Coaching', 'Floodlights', 'Showers', 'Changing Rooms'],
    featured: true,
  },
  {
    id: '8',
    name: 'Johar Town Court',
    city: 'Lahore',
    address: 'Johar Town, Lahore',
    dist: '9.0 km away',
    distKm: 9.0,
    rating: 4.1,
    reviews: 22,
    image: 'https://images.unsplash.com/photo-1543357480-c60d40b92296?w=600&q=80',
    surface: 'Outdoor',
    courts: 2,
    pricePerHour: 1500,
    openNow: true,
    openHours: '07:00 – 21:00',
    amenities: ['Parking', 'Floodlights'],
    featured: false,
  },
];
