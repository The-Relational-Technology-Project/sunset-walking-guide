export type TimeLayer = 'past' | 'present' | 'future';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timeLayers: TimeLayer[];
  description: string;
  thumbnail: string;
  photoCredit?: string;
  audio?: {
    url: string;
    duration: string;
    label: string;
  };
  links?: {
    label: string;
    url: string;
  }[];
}

export const PLACES: Place[] = [
  {
    id: 'playland',
    name: 'Playland at the Beach',
    lat: 37.7712,
    lng: -122.5094,
    timeLayers: ['past'],
    description:
      'From 1913 to 1972, this stretch of land beside the ocean was one of the loudest, most beloved amusement parks on the West Coast. Roller coasters, a funhouse, a carousel, and the slightly terrifying Laughing Sal greeted generations of San Franciscans here. It closed in 1972 and was replaced by condos. The laughter soaked into the sand.',
    thumbnail: '/thumbnails/playland.jpg',
    links: [
      {
        label: 'Learn more on Western Neighborhoods Project',
        url: 'https://www.outsidelands.org/playland.php',
      },
    ],
  },
  {
    id: 'great-highway-seawall',
    name: 'Great Highway seawall',
    lat: 37.7600,
    lng: -122.5100,
    timeLayers: ['past', 'present'],
    description:
      'The Great Highway required decades of engineering to exist at all. Sand dunes once reached far inland, and the ocean regularly reclaimed ground. The seawall and road were built in the early 1900s as part of a grand civic project to connect the city to its western edge. Today the road itself is in an ongoing conversation with the sea.',
    thumbnail: '/thumbnails/seawall.jpg',
    links: [
      {
        label: 'Great Highway history',
        url: 'https://www.sfpublicpress.org/great-highway-history',
      },
    ],
  },
  {
    id: 'l-taraval',
    name: 'N-Judah at 46th Avenue',
    lat: 37.7638,
    lng: -122.5038,
    timeLayers: ['past', 'present'],
    description:
      'The L-Taraval has connected the Outer Sunset to downtown since 1919. At its peak it carried tens of thousands of riders a day. The route runs along Taraval Street, past fog-dusted storefronts and neighbors who have ridden it their whole lives. It is slower than it used to be. People still read on it, sleep on it, think on it.',
    thumbnail: '/thumbnails/judah-46th-1948.jpg',
    photoCredit: 'outsidelands.org',
    audio: {
      url: 'https://www.outsidelands.org/podcast/WNP175_Ron_Jones',
      duration: '',
      label: 'Ron Jones: growing up on 46th Avenue',
    },
    links: [
      {
        label: 'Ron Jones and Life in the Sunset — WNP Podcast',
        url: 'https://www.outsidelands.org/podcast/WNP175_Ron_Jones',
      },
    ],
  },
  {
    id: 'sand-dunes',
    name: 'The great sand dunes',
    lat: 37.7590,
    lng: -122.4980,
    timeLayers: ['past'],
    description:
      'Before the grid, before the houses, before the streets, there were just dunes. The western half of San Francisco was blowing sand, shifting with every season. In the late 1800s and early 1900s, the city planted hundreds of thousands of trees and stabilized the dunes to make the Sunset District possible. The neighborhood you are standing in was built on sand memory.',
    thumbnail: '/thumbnails/sand-dunes-aerial.jpg',
    photoCredit: 'outsidelands.org',
  },
  {
    id: 'black-bird',
    name: 'Black Bird Bookstore & Cafe',
    lat: 37.7639,
    lng: -122.5010,
    timeLayers: ['present'],
    description:
      'A narrow room full of carefully chosen books, good coffee, and the low murmur of people who came in for one thing and stayed for an hour. Black Bird opened in 2020 and became a neighborhood anchor faster than most places manage in a decade. The staff know their regulars by name and by what they were looking for last time.',
    thumbnail: '/thumbnails/black-bird.jpg',
    links: [
      {
        label: 'Visit Black Bird',
        url: 'https://blackbirdsf.com',
      },
    ],
  },
  {
    id: 'andytown',
    name: 'Andytown Coffee',
    lat: 37.7637,
    lng: -122.5006,
    timeLayers: ['present'],
    description:
      'Andytown started on a corner in the Outer Sunset and grew from a neighborhood coffee shop into something quietly beloved citywide, without ever really leaving. The Snowy Plover was invented here. On foggy mornings, the line stretches outside. Everyone is patient.',
    thumbnail: '/thumbnails/andytown.jpg',
    links: [
      {
        label: 'Andytown Coffee Roasters',
        url: 'https://andytownsf.com',
      },
    ],
    audio: {
      url: '',
      duration: '1:12',
      label: 'The founders on opening day',
    },
  },
  {
    id: 'outerlands',
    name: 'Outerlands',
    lat: 37.7599,
    lng: -122.5089,
    timeLayers: ['present'],
    description:
      'A restaurant made of salvaged wood and good intentions on a windswept block near the beach. Outerlands opened in 2009 and helped define a certain kind of San Francisco cooking: seasonal, unpretentious, slightly wild. The bread is made in-house. The fog usually arrives before dinner.',
    thumbnail: '/thumbnails/outerlands.jpg',
    links: [
      {
        label: 'Outerlands restaurant',
        url: 'https://outerlandssf.com',
      },
    ],
  },
  {
    id: 'sunset-library',
    name: 'Sunset Branch Library',
    lat: 37.7498,
    lng: -122.4817,
    timeLayers: ['present'],
    description:
      'The Sunset Branch has been on Irving Street since 1918. It was rebuilt and expanded in 2014 and now feels like what a neighborhood library should feel like: light-filled, quiet, busy, free. Kids do homework here. Seniors read the paper. New arrivals use the computers. Everyone is welcome at the same table.',
    thumbnail: '/thumbnails/sunset-library.jpg',
    links: [
      {
        label: 'San Francisco Public Library',
        url: 'https://sfpl.org/locations/sunset',
      },
    ],
  },
  {
    id: 'ocean-beach',
    name: 'Ocean Beach',
    lat: 37.7600,
    lng: -122.5107,
    timeLayers: ['past', 'present'],
    description:
      'The western edge of the city, and the place everything in this guide orbits. People have gathered here forever, long before the city existed, long before the seawall or the highway. Today it is surfers and dog walkers and people staring at the horizon. The water is cold. The fog is frequent. It is one of the most honest places in San Francisco.',
    thumbnail: '/thumbnails/ocean-beach-rescue.jpg',
    photoCredit: 'outsidelands.org',
    audio: {
      url: '',
      duration: '2:04',
      label: 'A longtime surfer on the beach in winter',
    },
  },
  {
    id: 'irving-gathering',
    name: 'Irving & 47th: a community dream',
    lat: 37.7637,
    lng: -122.5087,
    timeLayers: ['future'],
    description:
      'For years, neighbors have talked about this corner as a place that could hold something more. A small plaza, a permanent farmers market, a place to sit and watch the fog roll in from the ocean. Nothing has been built here yet. The dream is specific: shade trees, a simple bench, a reason to stop. Some dreams take time. This one is patient.',
    thumbnail: '/thumbnails/irving-gathering.jpg',
  },
  // ── New historical places ──────────────────────────────────────────────────
  {
    id: 'carville',
    name: 'Carville & St. Andrew by the Sea',
    lat: 37.7638,
    lng: -122.5090,
    timeLayers: ['past'],
    description:
      'In the 1890s, retired streetcar bodies were dragged out here and converted into homes — a whole neighborhood of repurposed transit cars lined the beach edge along La Playa. They called it Carville. The St. Andrew by the Sea Church stood nearby at 1338 47th Avenue, built in 1908. Most of the car-homes are long gone, but the idea of it — neighbors hauling transit cars to the sand and making a life — stays with you.',
    thumbnail: '/thumbnails/carville-st-andrew.jpg',
    photoCredit: 'outsidelands.org',
    links: [
      {
        label: 'Carville history — Western Neighborhoods Project',
        url: 'https://www.outsidelands.org/carville.php',
      },
      {
        label: 'Great Highway Podcast Ep. 470',
        url: 'https://www.outsidelands.org/podcast/470',
      },
    ],
  },
  {
    id: 'surf-theatre',
    name: 'The Surf Theatre',
    lat: 37.7638,
    lng: -122.5038,
    timeLayers: ['past'],
    description:
      'The Surf Theatre opened in 1926 as the Parkview, became the Sunset Theatre in 1937, and finally the Surf in 1957. It was a neighborhood cinema that showed foreign and art films — "a little beacon of culture out there in the Outer Sunset." Part of the Levin family\'s west-side theatre chain. It closed July 7, 1985. The building still stands.',
    thumbnail: '/thumbnails/surf-theatre.jpg',
    photoCredit: 'outsidelands.org',
    links: [
      {
        label: 'Surf Theatre history — Western Neighborhoods Project',
        url: 'https://www.outsidelands.org/surf-theatre.php',
      },
      {
        label: 'WNP Podcast Ep. 8',
        url: 'https://www.outsidelands.org/podcast/8',
      },
    ],
  },
  {
    id: 'irving-1917',
    name: 'Irving Street, 1917',
    lat: 37.7638,
    lng: -122.5038,
    timeLayers: ['past'],
    description:
      'In 1917 this block of Irving was all dirt, pipe trenches, and possibility. The streetcar tracks were being laid, utilities were going in, and the neighborhood was deciding what it wanted to be. The houses on either side were already there, watching the work. This photo was taken looking east from the beach end of Irving.',
    thumbnail: '/thumbnails/irving-1917.jpg',
    photoCredit: 'outsidelands.org',
  },
  {
    id: 'lincoln-early',
    name: '48th & Lincoln: early settlement',
    lat: 37.7712,
    lng: -122.5090,
    timeLayers: ['past'],
    description:
      'Around 1905, this corner of the far Outer Sunset was mostly dunes and a few scattered shacks. Early settlers built right at the edge of what the city called livable — some structures on stilts, some half-buried in sand. The windmill in the distance pumped water to Golden Gate Park. This was the frontier end of San Francisco.',
    thumbnail: '/thumbnails/lincoln-early.jpg',
    photoCredit: 'outsidelands.org',
  },
  {
    id: 'carville-great-highway',
    name: 'Carville on the Great Highway',
    lat: 37.7638,
    lng: -122.5109,
    timeLayers: ['past'],
    description:
      'This postcard from January 1910 shows Carville in its full strange glory — retired streetcar bodies lined up along the Great Highway, a windmill pumping water in the background, a horse-drawn carriage in the foreground. The handwritten inscription reads "Carville, Ocean Beach, San Francisco." It looks like the edge of the world because it was.',
    thumbnail: '/thumbnails/carville-great-highway.jpg',
    photoCredit: 'outsidelands.org',
    links: [
      {
        label: 'Carville history — Western Neighborhoods Project',
        url: 'https://www.outsidelands.org/carville.php',
      },
      {
        label: 'Great Highway Podcast Ep. 468',
        url: 'https://www.outsidelands.org/podcast/468',
      },
    ],
  },
  // ── New future places ─────────────────────────────────────────────────────
  {
    id: 'gas-station-lincoln-laplaya',
    name: 'New convenience store & gas station',
    lat: 37.7712,
    lng: -122.5100,
    timeLayers: ['future'],
    description:
      'A new convenience store and gas station is planned for the corner of Lincoln Way and La Playa Street, replacing an earlier use at the edge of the neighborhood. Plans show a 2,027 sq ft convenience store, a fueling canopy with solar panel provisions, underground storage tanks, and new street trees along La Playa. The project is working its way through approvals.',
    thumbnail: '/thumbnails/gas-station-plans.png',
  },
  {
    id: 'irving-dunes-walkway',
    name: 'A path from Irving St to the dunes',
    lat: 37.7638,
    lng: -122.5075,
    timeLayers: ['future'],
    description:
      'Right now, the route from Irving Street up into Sunset Dunes is steep, uneven, and inaccessible to anyone who cannot scramble over rocks and mud. Neighbors have long imagined a proper accessible walkway here — a boardwalk or paved path through the native dune plants, with gentle grades and maybe a railing. Nothing has been approved or funded. But the desire is specific, and the current path makes the case for itself.',
    thumbnail: '/thumbnails/irving-dunes-path-sidebyside.jpg',
  },
  {
    id: 'great-highway-housing',
    name: '1234 Great Highway housing proposal',
    lat: 37.7665,
    lng: -122.5109,
    timeLayers: ['future'],
    description:
      'A large mixed-use housing development has been proposed for 1234 Great Highway, with residential buildings, adult daycare, and ground-floor community uses along La Playa Street. The project has been in the pipeline for years and is now delayed at least another year. When — and whether — it gets built will shape this stretch of the western edge of the city for generations.',
    thumbnail: '/thumbnails/great-highway-housing.png',
  },
];

// Default center: 48th & Irving
export const DEFAULT_CENTER = {
  lat: 37.7637,
  lng: -122.5087,
};

// Radius in km for "in range" check
export const FIELD_GUIDE_RADIUS_KM = 4;
