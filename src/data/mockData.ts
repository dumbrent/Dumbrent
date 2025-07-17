import { Borough, Neighborhood, NeighborhoodFeature, Listing, User } from '../types';
import { supabase } from '../lib/supabase';

export const featureTypes = [
  'restaurants-bars',
  'gyms-fitness',
  'happy-hours-brunches',
  'shopping-grocery',
  'museums-art-entertainment',
  'schools-universities',
  'culture',
  'parks-landmark',
  'luxury',
  'transportation'
];

export const featureTypeLabels: Record<string, string> = {
  'restaurants-bars': 'Restaurants & Bars',
  'gyms-fitness': 'Gyms & Fitness',
  'happy-hours-brunches': 'Happy Hours & Brunches',
  'shopping-grocery': 'Shopping & Grocery',
  'museums-art-entertainment': 'Museums, Art & Entertainment',
  'schools-universities': 'Schools & Universities',
  'culture': 'Culture',
  'parks-landmark': 'Parks & Landmark',
  'luxury': 'Luxury',
  'transportation': 'Transportation'
};

export const amenities = [
  'Air Conditioning',
  'Balcony',
  'Dishwasher',
  'Elevator',
  'Fitness Center',
  'Furnished',
  'Hardwood Floors',
  'In-Unit Laundry',
  'Package Room',
  'Parking Available',
  'Patio',
  'Pets Allowed',
  'Private Outdoor Space',
  'Storage Available',
  'Stainless Steel Appliances',
  'Walk-in Closet',
  'Doorman',
  'Roof Deck'
];

export const boroughs: Borough[] = [
  {
    id: '1',
    name: 'Manhattan',
    description: 'The most densely populated borough of New York City, known for its cultural, entertainment, and financial centers.',
    imageUrl: '/images/manhattan.jpg'
  },
  {
    id: '2',
    name: 'Brooklyn',
    description: 'Known for its cultural diversity, independent art scene, and distinct neighborhoods.',
    imageUrl: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg'
  },
  {
    id: '3',
    name: 'Queens',
    description: 'The largest borough by area and the most ethnically diverse urban area in the world.',
    imageUrl: 'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg'
  },
  {
    id: '4',
    name: 'The Bronx',
    description: 'The northernmost borough, home to the Bronx Zoo, Yankee Stadium, and the birthplace of hip hop.',
    imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg'
  },
  {
    id: '5',
    name: 'Staten Island',
    description: 'The most suburban of the five boroughs, connected to Manhattan by the Staten Island Ferry.',
    imageUrl: 'https://images.pexels.com/photos/2190377/pexels-photo-2190377.jpeg'
  }
];

// Complete NYC neighborhoods data - 160+ neighborhoods - NOW USING LOCAL IMAGE
export const neighborhoods = [
  // Manhattan - 40+ neighborhoods - NOW USING LOCAL IMAGE
  { id: 'battery-park-city', name: 'Battery Park City', boroughId: '1', description: 'Planned community with waterfront views and modern amenities.', imageUrl: '/images/manhattan.jpg' },
  { id: 'financial-district', name: 'Financial District', boroughId: '1', description: 'Historic area home to Wall Street and the World Trade Center.', imageUrl: '/images/manhattan.jpg' },
  { id: 'tribeca', name: 'Tribeca', boroughId: '1', description: 'Upscale neighborhood known for its converted warehouses and celebrity residents.', imageUrl: '/images/manhattan.jpg' },
  { id: 'soho', name: 'SoHo', boroughId: '1', description: 'Famous for its cast-iron architecture, art galleries, and high-end shopping.', imageUrl: '/images/manhattan.jpg' },
  { id: 'nolita', name: 'Nolita', boroughId: '1', description: 'Trendy area north of Little Italy with boutique shopping and cafes.', imageUrl: '/images/manhattan.jpg' },
  { id: 'little-italy', name: 'Little Italy', boroughId: '1', description: 'Historic Italian-American neighborhood with authentic restaurants.', imageUrl: '/images/manhattan.jpg' },
  { id: 'chinatown', name: 'Chinatown', boroughId: '1', description: 'Vibrant cultural enclave with authentic Chinese cuisine and markets.', imageUrl: '/images/manhattan.jpg' },
  { id: 'les', name: 'Lower East Side', boroughId: '1', description: 'Historic neighborhood known for its vibrant nightlife, diverse dining scene, and cultural heritage.', imageUrl: '/images/manhattan.jpg' },
  { id: 'east-village', name: 'East Village', boroughId: '1', description: 'Bohemian neighborhood with a rich counterculture history.', imageUrl: '/images/manhattan.jpg' },
  { id: 'west-village', name: 'West Village', boroughId: '1', description: 'Picturesque area with tree-lined streets and historic brownstones.', imageUrl: '/images/manhattan.jpg' },
  { id: 'greenwich-village', name: 'Greenwich Village', boroughId: '1', description: 'Historic bohemian neighborhood with NYU campus and Washington Square Park.', imageUrl: '/images/manhattan.jpg' },
  { id: 'noho', name: 'NoHo', boroughId: '1', description: 'Small upscale neighborhood north of Houston Street.', imageUrl: '/images/manhattan.jpg' },
  { id: 'chelsea', name: 'Chelsea', boroughId: '1', description: 'Art district with galleries, the High Line, and modern condos.', imageUrl: '/images/manhattan.jpg' },
  { id: 'flatiron', name: 'Flatiron District', boroughId: '1', description: 'Commercial area centered around the iconic Flatiron Building.', imageUrl: '/images/manhattan.jpg' },
  { id: 'gramercy', name: 'Gramercy', boroughId: '1', description: 'Quiet residential area with historic Gramercy Park.', imageUrl: '/images/manhattan.jpg' },
  { id: 'union-square', name: 'Union Square', boroughId: '1', description: 'Bustling area with shopping, dining, and the famous farmers market.', imageUrl: '/images/manhattan.jpg' },
  { id: 'midtown-south', name: 'Midtown South', boroughId: '1', description: 'Commercial district with office buildings and Penn Station.', imageUrl: '/images/manhattan.jpg' },
  { id: 'midtown-west', name: 'Midtown West', boroughId: '1', description: 'Theater District and Times Square area.', imageUrl: '/images/manhattan.jpg' },
  { id: 'midtown-east', name: 'Midtown East', boroughId: '1', description: 'Business district with skyscrapers and corporate headquarters.', imageUrl: '/images/manhattan.jpg' },
  { id: 'hells-kitchen', name: 'Hell\'s Kitchen', boroughId: '1', description: 'Diverse neighborhood with international cuisine and proximity to theaters.', imageUrl: '/images/manhattan.jpg' },
  { id: 'upper-west-side', name: 'Upper West Side', boroughId: '1', description: 'A residential and cultural neighborhood between Central Park and Riverside Park.', imageUrl: '/images/manhattan.jpg' },
  { id: 'upper-east-side', name: 'Upper East Side', boroughId: '1', description: 'Upscale area with museums, boutiques, and Central Park access.', imageUrl: '/images/manhattan.jpg' },
  { id: 'yorkville', name: 'Yorkville', boroughId: '1', description: 'Upper East Side neighborhood with German and Czech heritage.', imageUrl: '/images/manhattan.jpg' },
  { id: 'carnegie-hill', name: 'Carnegie Hill', boroughId: '1', description: 'Affluent area near Central Park with luxury buildings.', imageUrl: '/images/manhattan.jpg' },
  { id: 'lenox-hill', name: 'Lenox Hill', boroughId: '1', description: 'Upscale neighborhood with high-end shopping and dining.', imageUrl: '/images/manhattan.jpg' },
  { id: 'sutton-place', name: 'Sutton Place', boroughId: '1', description: 'Exclusive residential area with river views.', imageUrl: '/images/manhattan.jpg' },
  { id: 'turtle-bay', name: 'Turtle Bay', boroughId: '1', description: 'Midtown East neighborhood home to the United Nations.', imageUrl: '/images/manhattan.jpg' },
  { id: 'murray-hill', name: 'Murray Hill', boroughId: '1', description: 'Residential area popular with young professionals.', imageUrl: '/images/manhattan.jpg' },
  { id: 'kips-bay', name: 'Kips Bay', boroughId: '1', description: 'Residential neighborhood with modern high-rises.', imageUrl: '/images/manhattan.jpg' },
  { id: 'stuyvesant-town', name: 'Stuyvesant Town', boroughId: '1', description: 'Large residential complex on the East Side.', imageUrl: '/images/manhattan.jpg' },
  { id: 'alphabet-city', name: 'Alphabet City', boroughId: '1', description: 'Eastern part of East Village with avenues A, B, C, and D.', imageUrl: '/images/manhattan.jpg' },
  { id: 'two-bridges', name: 'Two Bridges', boroughId: '1', description: 'Diverse neighborhood between Manhattan and Brooklyn bridges.', imageUrl: '/images/manhattan.jpg' },
  { id: 'morningside-heights', name: 'Morningside Heights', boroughId: '1', description: 'Academic neighborhood home to Columbia University.', imageUrl: '/images/manhattan.jpg' },
  { id: 'hamilton-heights', name: 'Hamilton Heights', boroughId: '1', description: 'Historic Harlem neighborhood with beautiful architecture.', imageUrl: '/images/manhattan.jpg' },
  { id: 'harlem', name: 'Harlem', boroughId: '1', description: 'Historic African-American cultural center with rich musical heritage.', imageUrl: '/images/manhattan.jpg' },
  { id: 'east-harlem', name: 'East Harlem', boroughId: '1', description: 'Diverse neighborhood also known as El Barrio.', imageUrl: '/images/manhattan.jpg' },
  { id: 'washington-heights', name: 'Washington Heights', boroughId: '1', description: 'Northern Manhattan neighborhood with Fort Tryon Park.', imageUrl: '/images/manhattan.jpg' },
  { id: 'inwood', name: 'Inwood', boroughId: '1', description: 'Northernmost Manhattan neighborhood with parks and affordable housing.', imageUrl: '/images/manhattan.jpg' },
  { id: 'marble-hill', name: 'Marble Hill', boroughId: '1', description: 'Small neighborhood technically in the Bronx but part of Manhattan.', imageUrl: '/images/manhattan.jpg' },

  // Brooklyn - 32+ neighborhoods (adding East New York and Red Hook)
  { id: 'brooklyn-heights', name: 'Brooklyn Heights', boroughId: '2', description: 'Historic neighborhood with the famous Promenade and brownstones.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'dumbo', name: 'DUMBO', boroughId: '2', description: 'Historic waterfront neighborhood with cobblestone streets and stunning Manhattan views.', imageUrl: 'https://images.pexels.com/photos/2190284/pexels-photo-2190284.jpeg' },
  { id: 'downtown-brooklyn', name: 'Downtown Brooklyn', boroughId: '2', description: 'Commercial and cultural center with shopping and entertainment.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'fort-greene', name: 'Fort Greene', boroughId: '2', description: 'Historic neighborhood with Fort Greene Park and cultural institutions.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'boerum-hill', name: 'Boerum Hill', boroughId: '2', description: 'Trendy area with Victorian houses and artisanal shops.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'cobble-hill', name: 'Cobble Hill', boroughId: '2', description: 'Charming neighborhood with historic brownstones and boutiques.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'carroll-gardens', name: 'Carroll Gardens', boroughId: '2', description: 'Italian-American neighborhood with tree-lined streets.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'red-hook', name: 'Red Hook', boroughId: '2', description: 'Waterfront neighborhood with art studios, unique shops, and stunning harbor views.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'gowanus', name: 'Gowanus', boroughId: '2', description: 'Industrial area undergoing rapid development and gentrification.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'pslope', name: 'Park Slope', boroughId: '2', description: 'Family-friendly area with beautiful brownstones and proximity to Prospect Park.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'prospect-heights', name: 'Prospect Heights', boroughId: '2', description: 'Diverse neighborhood near Prospect Park and Brooklyn Museum.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'crown-heights', name: 'Crown Heights', boroughId: '2', description: 'Diverse area with Caribbean culture and historic architecture.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'bedstuy', name: 'Bedford-Stuyvesant', boroughId: '2', description: 'Historic African-American neighborhood with beautiful brownstones.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'clinton-hill', name: 'Clinton Hill', boroughId: '2', description: 'Historic district with Victorian mansions and Pratt Institute.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'wburg', name: 'Williamsburg', boroughId: '2', description: 'A vibrant neighborhood known for its hipster culture, art scene, and waterfront views.', imageUrl: 'https://images.pexels.com/photos/2406759/pexels-photo-2406759.jpeg' },
  { id: 'greenpoint', name: 'Greenpoint', boroughId: '2', description: 'Polish-American neighborhood with waterfront parks and trendy spots.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'bushwick', name: 'Bushwick', boroughId: '2', description: 'Industrial area turned artist haven with galleries and nightlife.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'east-williamsburg', name: 'East Williamsburg', boroughId: '2', description: 'Industrial area with artist studios and creative spaces.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'ridgewood', name: 'Ridgewood', boroughId: '2', description: 'Diverse neighborhood on the Brooklyn-Queens border.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'sunset-park', name: 'Sunset Park', boroughId: '2', description: 'Diverse area with great views of Manhattan and the harbor.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'bay-ridge', name: 'Bay Ridge', boroughId: '2', description: 'Family-friendly neighborhood with Norwegian heritage.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'dyker-heights', name: 'Dyker Heights', boroughId: '2', description: 'Residential area famous for elaborate Christmas decorations.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'bensonhurst', name: 'Bensonhurst', boroughId: '2', description: 'Italian-American and Chinese neighborhood with great food.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'coney-island', name: 'Coney Island', boroughId: '2', description: 'Famous beachfront area with amusement parks and boardwalk.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'brighton-beach', name: 'Brighton Beach', boroughId: '2', description: 'Russian-American community known as "Little Odessa."', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'sheepshead-bay', name: 'Sheepshead Bay', boroughId: '2', description: 'Waterfront neighborhood with fishing boats and seafood restaurants.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'flatbush', name: 'Flatbush', boroughId: '2', description: 'Large diverse area with Caribbean and Orthodox Jewish communities.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'midwood', name: 'Midwood', boroughId: '2', description: 'Residential area with Orthodox Jewish and Pakistani communities.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'marine-park', name: 'Marine Park', boroughId: '2', description: 'Suburban-style neighborhood with the largest park in Brooklyn.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'canarsie', name: 'Canarsie', boroughId: '2', description: 'Residential area at the southeastern tip of Brooklyn.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },
  { id: 'east-new-york', name: 'East New York', boroughId: '2', description: 'Diverse neighborhood with affordable housing and growing arts scene.', imageUrl: 'https://images.pexels.com/photos/2884867/pexels-photo-2884867.jpeg' },

  // Queens - 25+ neighborhoods
  { id: 'lic', name: 'Long Island City', boroughId: '3', description: 'Modern waterfront district with high-rise apartments and cultural institutions.', imageUrl: 'https://images.pexels.com/photos/2190285/pexels-photo-2190285.jpeg' },
  { id: 'astoria', name: 'Astoria', boroughId: '3', description: 'A diverse neighborhood known for its Greek heritage and growing arts community.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'sunnyside', name: 'Sunnyside', boroughId: '3', description: 'Diverse neighborhood with garden-style apartments and Irish heritage.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'woodside', name: 'Woodside', boroughId: '3', description: 'Multicultural area with Filipino, Irish, and Latin American communities.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'jackson-heights', name: 'Jackson Heights', boroughId: '3', description: 'Historic district known for its cultural diversity and food scene.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'elmhurst', name: 'Elmhurst', boroughId: '3', description: 'One of the most diverse neighborhoods in the world.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'corona', name: 'Corona', boroughId: '3', description: 'Diverse area home to Citi Field and the US Open tennis venue.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'flushing', name: 'Flushing', boroughId: '3', description: 'Vibrant Asian community known for authentic cuisine and shopping.', imageUrl: 'https://images.pexels.com/photos/2190286/pexels-photo-2190286.jpeg' },
  { id: 'forest-hills', name: 'Forest Hills', boroughId: '3', description: 'Upscale residential area with Tudor-style homes.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'rego-park', name: 'Rego Park', boroughId: '3', description: 'Diverse middle-class neighborhood with shopping centers.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'kew-gardens', name: 'Kew Gardens', boroughId: '3', description: 'Quiet residential area with historic architecture.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'richmond-hill', name: 'Richmond Hill', boroughId: '3', description: 'Diverse area with Indo-Caribbean and Latin American communities.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'ozone-park', name: 'Ozone Park', boroughId: '3', description: 'Diverse neighborhood near JFK Airport.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'howard-beach', name: 'Howard Beach', boroughId: '3', description: 'Waterfront community with Italian-American heritage.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'rockaway', name: 'Rockaway', boroughId: '3', description: 'Beach community with surfing and boardwalk attractions.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'bayside', name: 'Bayside', boroughId: '3', description: 'Suburban-style neighborhood with good schools and parks.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'whitestone', name: 'Whitestone', boroughId: '3', description: 'Quiet residential area near the Whitestone Bridge.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'college-point', name: 'College Point', boroughId: '3', description: 'Waterfront neighborhood with diverse communities.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'fresh-meadows', name: 'Fresh Meadows', boroughId: '3', description: 'Middle-class residential area with garden apartments.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'jamaica', name: 'Jamaica', boroughId: '3', description: 'Major transportation hub with diverse communities.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'st-albans', name: 'St. Albans', boroughId: '3', description: 'Historic African-American community with notable residents.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'hollis', name: 'Hollis', boroughId: '3', description: 'Residential area known for its hip-hop history.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'queens-village', name: 'Queens Village', boroughId: '3', description: 'Diverse suburban-style neighborhood.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'bellerose', name: 'Bellerose', boroughId: '3', description: 'Quiet residential area on the Nassau County border.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },
  { id: 'maspeth', name: 'Maspeth', boroughId: '3', description: 'Small residential neighborhood with Polish heritage.', imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg' },

  // The Bronx - 15+ neighborhoods
  { id: 'south-bronx', name: 'South Bronx', boroughId: '4', description: 'Historic area undergoing revitalization with cultural attractions.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'mott-haven', name: 'Mott Haven', boroughId: '4', description: 'Waterfront neighborhood with art galleries and new development.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'melrose', name: 'Melrose', boroughId: '4', description: 'Diverse area near Yankee Stadium with affordable housing.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'concourse', name: 'Grand Concourse', boroughId: '4', description: 'Historic boulevard lined with Art Deco architecture.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'highbridge', name: 'Highbridge', boroughId: '4', description: 'Historic area with the High Bridge and Yankee Stadium.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'morrisania', name: 'Morrisania', boroughId: '4', description: 'Central Bronx neighborhood with rich cultural history.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'tremont', name: 'Tremont', boroughId: '4', description: 'Diverse area with Italian and Latino communities.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'fordham', name: 'Fordham', boroughId: '4', description: 'Commercial hub with Fordham University and shopping district.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'belmont', name: 'Belmont', boroughId: '4', description: 'Italian-American neighborhood known as the "Little Italy of the Bronx."', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'morris-park', name: 'Morris Park', boroughId: '4', description: 'Residential area with Italian-American heritage.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'pelham-bay', name: 'Pelham Bay', boroughId: '4', description: 'Northeastern Bronx area with the largest park in NYC.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'riverdale', name: 'Riverdale', boroughId: '4', description: 'Scenic residential area with parks and historic mansions.', imageUrl: 'https://images.pexels.com/photos/2287523/pexels-photo-2287523.jpeg' },
  { id: 'kingsbridge', name: 'Kingsbridge', boroughId: '4', description: 'Diverse neighborhood near the Harlem River.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'norwood', name: 'Norwood', boroughId: '4', description: 'Residential area with Irish and Dominican communities.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },
  { id: 'wakefield', name: 'Wakefield', boroughId: '4', description: 'Northernmost Bronx neighborhood with suburban feel.', imageUrl: 'https://images.pexels.com/photos/2190376/pexels-photo-2190376.jpeg' },

  // Staten Island - 25+ neighborhoods
  { id: 'stjohn', name: 'St. George', boroughId: '5', description: 'Staten Island\'s civic center with Victorian houses and cultural venues.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'stapleton', name: 'Stapleton', boroughId: '5', description: 'Historic waterfront neighborhood with diverse communities.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'new-brighton', name: 'New Brighton', boroughId: '5', description: 'Hillside neighborhood with harbor views.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'west-brighton', name: 'West Brighton', boroughId: '5', description: 'Diverse area with affordable housing options.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'port-richmond', name: 'Port Richmond', boroughId: '5', description: 'Working-class neighborhood with Mexican and Latino communities.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'mariners-harbor', name: 'Mariners Harbor', boroughId: '5', description: 'Waterfront community with industrial heritage.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'new-springville', name: 'New Springville', boroughId: '5', description: 'Suburban area with shopping centers and family homes.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'bulls-head', name: 'Bulls Head', boroughId: '5', description: 'Central Staten Island residential area.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'great-kills', name: 'Great Kills', boroughId: '5', description: 'Waterfront neighborhood with marina and parks.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'tottenville', name: 'Tottenville', boroughId: '5', description: 'Southernmost neighborhood in NYC with historic charm.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'annadale', name: 'Annadale', boroughId: '5', description: 'Residential area with suburban character.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'eltingville', name: 'Eltingville', boroughId: '5', description: 'Southern Staten Island neighborhood with shopping and dining.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'clifton', name: 'Clifton', boroughId: '5', description: 'Diverse neighborhood with Sri Lankan and Mexican communities.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'concord', name: 'Concord', boroughId: '5', description: 'Family-friendly area with parks and suburban feel.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'grasmere', name: 'Grasmere', boroughId: '5', description: 'Quiet residential neighborhood with suburban character.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'old-town', name: 'Old Town', boroughId: '5', description: 'Historic waterfront area with colonial heritage and harbor views.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'richmondtown', name: 'Richmondtown', boroughId: '5', description: 'Historic village with colonial buildings and living history museum.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'midland-beach', name: 'Midland Beach', boroughId: '5', description: 'Beachfront community with boardwalk and ocean access.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'new-dorp-beach', name: 'New Dorp Beach', boroughId: '5', description: 'Waterfront extension of New Dorp with beach access.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'pleasant-plains', name: 'Pleasant Plains', boroughId: '5', description: 'Suburban neighborhood with family homes and parks.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'charleston', name: 'Charleston', boroughId: '5', description: 'Developing area with new housing developments and green spaces.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'rossville', name: 'Rossville', boroughId: '5', description: 'Southwestern Staten Island area with industrial and residential mix.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'woodrow', name: 'Woodrow', boroughId: '5', description: 'Southern Staten Island neighborhood with suburban character.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'grant-city', name: 'Grant City', boroughId: '5', description: 'Central Staten Island area with shopping and transportation.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' },
  { id: 'new-dorp', name: 'New Dorp', boroughId: '5', description: 'Central Staten Island neighborhood with shopping and dining.', imageUrl: 'https://images.pexels.com/photos/2389339/pexels-photo-2389339.jpeg' }
];

// Helper function to check if a listing ID corresponds to mock data
export const isMockListingId = (id: string): boolean => {
  return listings.some(listing => listing.id === id);
};

// Optimized listings - keeping core examples but reducing total count
export const listings = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Stunning Central Park View Luxury Condo',
    description: 'Welcome to your Upper West Side sanctuary! This meticulously renovated 2-bedroom haven offers breathtaking Central Park views and luxurious finishes throughout. The chef\'s kitchen features top-of-the-line appliances, custom cabinetry, and a breakfast bar perfect for entertaining.',
    price: 6500,
    deposit: 13000,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    address: '235 West 75th Street',
    zip_code: '10023',
    neighborhood_id: 'upper-west-side',
    borough_id: '1',
    key_feature: 'Panoramic Central Park Views',
    landlord_id: 'landlord-1',
    available_date: new Date('2025-03-15'),
    status: 'published',
    featured: true,
    created_at: new Date('2025-02-15'),
    updated_at: new Date('2025-02-15'),
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg'
    ],
    amenities: ['Air Conditioning', 'Dishwasher', 'Elevator', 'Doorman', 'Fitness Center', 'Hardwood Floors', 'In-Unit Laundry', 'Package Room', 'Roof Deck', 'Walk-in Closet', 'Stainless Steel Appliances']
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Designer Williamsburg Loft with Private Roof Deck',
    description: 'Discover urban luxury in this stunning Williamsburg loft! This thoughtfully designed space seamlessly blends industrial charm with modern comfort. The open-concept living area features soaring 12-foot ceilings, exposed brick walls, and oversized windows.',
    price: 4800,
    deposit: 9600,
    bedrooms: 1,
    bathrooms: 1.5,
    square_feet: 950,
    address: '180 North 7th Street',
    zip_code: '11211',
    neighborhood_id: 'wburg',
    borough_id: '2',
    key_feature: 'Private 800 sq ft Roof Deck',
    landlord_id: 'landlord-2',
    available_date: new Date('2025-04-01'),
    status: 'published',
    featured: true,
    created_at: new Date('2025-03-01'),
    updated_at: new Date('2025-03-01'),
    images: [
      'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg',
      'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg',
      'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1457848/pexels-photo-1457848.jpeg'
    ],
    amenities: ['Air Conditioning', 'Dishwasher', 'Hardwood Floors', 'In-Unit Laundry', 'Private Outdoor Space', 'Roof Deck', 'Stainless Steel Appliances', 'Storage Available', 'Walk-in Closet']
  },
  {
    id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    title: 'Charming Astoria Garden Oasis',
    description: 'Welcome to your peaceful Astoria retreat! This beautifully renovated garden apartment offers the perfect blend of indoor and outdoor living. The spacious layout features two sun-filled bedrooms and a modern open kitchen with breakfast bar.',
    price: 3200,
    deposit: 6400,
    bedrooms: 2,
    bathrooms: 1,
    square_feet: 800,
    address: '28-15 34th Street',
    zip_code: '11103',
    neighborhood_id: 'astoria',
    borough_id: '3',
    key_feature: 'Private Garden with Patio',
    landlord_id: 'landlord-3',
    available_date: new Date('2025-05-01'),
    status: 'published',
    featured: false,
    created_at: new Date('2025-04-01'),
    updated_at: new Date('2025-04-01'),
    images: [
      'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg',
      'https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg',
      'https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg',
      'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg',
      'https://images.pexels.com/photos/1457849/pexels-photo-1457849.jpeg'
    ],
    amenities: ['Air Conditioning', 'Dishwasher', 'Hardwood Floors', 'In-Unit Laundry', 'Pets Allowed', 'Private Outdoor Space', 'Stainless Steel Appliances', 'Storage Available']
  },
  {
    id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    title: 'Luxury High-Rise Studio in Lower East Side',
    description: 'Experience the epitome of Manhattan luxury living in this thoughtfully designed studio apartment. Floor-to-ceiling windows showcase stunning city views and flood the space with natural light.',
    price: 3500,
    deposit: 7000,
    bedrooms: 0,
    bathrooms: 1,
    square_feet: 500,
    address: '175 Ludlow Street',
    zip_code: '10002',
    neighborhood_id: 'les',
    borough_id: '1',
    key_feature: 'Floor-to-Ceiling Windows',
    landlord_id: 'landlord-1',
    available_date: new Date('2025-03-30'),
    status: 'published',
    featured: true,
    created_at: new Date('2025-02-28'),
    updated_at: new Date('2025-02-28'),
    images: [
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg',
      'https://images.pexels.com/photos/1643386/pexels-photo-1643386.jpeg',
      'https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg',
      'https://images.pexels.com/photos/1643388/pexels-photo-1643388.jpeg'
    ],
    amenities: ['Air Conditioning', 'Dishwasher', 'Doorman', 'Elevator', 'Fitness Center', 'Hardwood Floors', 'Package Room', 'Roof Deck', 'Stainless Steel Appliances']
  },
  {
    id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    title: 'DUMBO Waterfront Loft with Manhattan Bridge Views',
    description: 'Live in one of Brooklyn\'s most coveted neighborhoods in this spectacular converted loft. Original industrial details meet modern luxury in this unique 2-bedroom home.',
    price: 5800,
    deposit: 11600,
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1400,
    address: '65 Washington Street',
    zip_code: '11201',
    neighborhood_id: 'dumbo',
    borough_id: '2',
    key_feature: 'Direct Manhattan Bridge Views',
    landlord_id: 'landlord-3',
    available_date: new Date('2025-04-15'),
    status: 'published',
    featured: true,
    created_at: new Date('2025-03-15'),
    updated_at: new Date('2025-03-15'),
    images: [
      'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg',
      'https://images.pexels.com/photos/1643390/pexels-photo-1643390.jpeg',
      'https://images.pexels.com/photos/1643391/pexels-photo-1643391.jpeg',
      'https://images.pexels.com/photos/1643392/pexels-photo-1643392.jpeg',
      'https://images.pexels.com/photos/1643393/pexels-photo-1643393.jpeg'
    ],
    amenities: ['Air Conditioning', 'Dishwasher', 'Elevator', 'Hardwood Floors', 'In-Unit Laundry', 'Package Room', 'Pets Allowed', 'Storage Available', 'Stainless Steel Appliances']
  }
];

// Optimized neighborhood features - reduced to essential examples
export const neighborhoodFeatures = [
  {
    id: '1',
    neighborhoodId: 'upper-west-side',
    name: 'Central Park',
    description: 'An iconic urban park offering extensive walking trails, outdoor activities, and cultural attractions.',
    type: 'parks-landmark',
    imageUrl: 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '2',
    neighborhoodId: 'upper-west-side',
    name: 'American Museum of Natural History',
    description: 'World-renowned museum featuring dinosaur fossils, space exhibits, and cultural artifacts.',
    type: 'museums-art-entertainment',
    imageUrl: 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '3',
    neighborhoodId: 'les',
    name: 'Katz\'s Delicatessen',
    description: 'Historic deli famous for its pastrami sandwiches and traditional Jewish fare.',
    type: 'restaurants-bars',
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '4',
    neighborhoodId: 'soho',
    name: 'Cast Iron Architecture',
    description: 'The world\'s largest collection of cast-iron architecture, dating back to the 1800s.',
    type: 'culture',
    imageUrl: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '5',
    neighborhoodId: 'wburg',
    name: 'Smorgasburg',
    description: 'The largest weekly open-air food market in America, featuring diverse local vendors.',
    type: 'restaurants-bars',
    imageUrl: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '6',
    neighborhoodId: 'pslope',
    name: 'Prospect Park',
    description: '585-acre urban oasis designed by the creators of Central Park.',
    type: 'parks-landmark',
    imageUrl: 'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '7',
    neighborhoodId: 'dumbo',
    name: 'Brooklyn Bridge Park',
    description: '85-acre post-industrial waterfront park offering stunning Manhattan views.',
    type: 'parks-landmark',
    imageUrl: 'https://images.pexels.com/photos/2190284/pexels-photo-2190284.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '8',
    neighborhoodId: 'astoria',
    name: 'Museum of the Moving Image',
    description: 'The only museum in the US dedicated to the art, history, and technology of movies and television.',
    type: 'museums-art-entertainment',
    imageUrl: 'https://images.pexels.com/photos/2389349/pexels-photo-2389349.jpeg',
    addedBy: 'system',
    createdAt: new Date('2025-06-01')
  }
];

// Add a real database listing for testing
export const createTestListing = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('User not authenticated');
    return null;
  }

  try {
    // Check if test listing already exists
    const { data: existingListing } = await supabase
      .from('listings')
      .select('id')
      .eq('title', 'Test Listing for Application')
      .maybeSingle();

    if (existingListing) {
      console.log('Test listing already exists:', existingListing.id);
      return existingListing.id;
    }

    // Create a new test listing
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        title: 'Test Listing for Application',
        description: 'This is a test listing created for testing the application system. Feel free to apply to this listing to test the functionality.',
        price: 2500,
        deposit: 5000,
        bedrooms: 1,
        bathrooms: 1,
        square_feet: 700,
        address: '123 Test Street',
        zip_code: '10001',
        neighborhood_id: 'chelsea',
        borough_id: '1',
        key_feature: 'Test Feature',
        landlord_id: session.user.id,
        available_date: new Date().toISOString().split('T')[0],
        status: 'published'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test listing:', error);
      return null;
    }

    // Add test images
    await supabase
      .from('listing_images')
      .insert([
        {
          listing_id: listing.id,
          url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
          position: 0
        },
        {
          listing_id: listing.id,
          url: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
          position: 1
        }
      ]);

    // Add test amenities
    await supabase
      .from('listing_amenities')
      .insert([
        { listing_id: listing.id, amenity: 'Air Conditioning' },
        { listing_id: listing.id, amenity: 'Hardwood Floors' },
        { listing_id: listing.id, amenity: 'Dishwasher' }
      ]);

    console.log('Created test listing:', listing.id);
    return listing.id;
  } catch (error) {
    console.error('Error in createTestListing:', error);
    return null;
  }
};