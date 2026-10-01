export const photo = (id: string) => `/images/${id}.jpg`;
export interface Stay {
  id: string;
  name: string;
  city: string;
  country: string;
  area: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  amenities: string[];
  description: string;
}
export const images = {
  coast: photo("photo-1516483638261-f4dbaf036963"),
  lisbon: photo("photo-1746485415555-4188d435c8ff"),
  santorini: photo("photo-1613395877344-13d4a8e0d49e"),
  bali: photo("photo-1537996194471-e657df975ab4"),
  paris: photo("photo-1502602898657-3e91760cbb34"),
  marrakech: photo("photo-1597212618440-806262de4f6b"),
  room: photo("photo-1611892440504-42a792e24d32"),
  villa: photo("photo-1613977257363-707ba9348227"),
  pool: photo("photo-1576013551627-0cc20b96c2a7"),
  interior: photo("photo-1600210492486-724fe5c67fb0"),
  food: photo("photo-1414235077428-338989a2e8c0"),
  boat: photo("photo-1540946485063-a40da27545f8"),
  hiking: photo("photo-1551632811-561732d1e306"),
};
export const destinations = [
  {
    name: "Lisbon",
    country: "Portugal",
    caption: "Sunlit streets & slow mornings",
    image: images.lisbon,
  },
  {
    name: "Santorini",
    country: "Greece",
    caption: "A little closer to the sea",
    image: images.santorini,
  },
  {
    name: "Bali",
    country: "Indonesia",
    caption: "Find your own kind of calm",
    image: images.bali,
  },
  {
    name: "Paris",
    country: "France",
    caption: "Always a good idea",
    image: images.paris,
  },
  {
    name: "Marrakech",
    country: "Morocco",
    caption: "Lose yourself in the color",
    image: images.marrakech,
  },
];
export const stays: Stay[] = [
  {
    id: "casa-aurora",
    name: "Casa Aurora",
    city: "Lisbon",
    country: "Portugal",
    area: "Alfama",
    type: "Boutique hotel",
    price: 148,
    rating: 4.96,
    reviews: 128,
    image: images.interior,
    tag: "Guest favorite",
    amenities: ["Wi-Fi", "Breakfast", "Air conditioning"],
    description:
      "A quiet, sun-filled hideaway above the winding lanes of Alfama. Original stone, warm oak, and thoughtful little details make this beautifully restored townhouse feel like a home you wish was yours.",
  },
  {
    id: "aegean-house",
    name: "The Aegean House",
    city: "Santorini",
    country: "Greece",
    area: "Oia",
    type: "Villa",
    price: 245,
    rating: 4.98,
    reviews: 94,
    image: images.santorini,
    tag: "Room with a view",
    amenities: ["Wi-Fi", "Pool", "Breakfast", "Sea view", "Air conditioning"],
    description:
      "Wake up to the Aegean from your private terrace. This intimate, whitewashed retreat pairs island simplicity with thoughtful comforts, just a short stroll from Oia’s little galleries and cafés.",
  },
  {
    id: "bambu-retreat",
    name: "Bambu Retreat",
    city: "Bali",
    country: "Indonesia",
    area: "Ubud",
    type: "Villa",
    price: 126,
    rating: 4.91,
    reviews: 216,
    image: images.pool,
    tag: "Slow living",
    amenities: ["Wi-Fi", "Pool", "Breakfast", "Air conditioning"],
    description:
      "Set between emerald gardens and quiet rice fields, Bambu is a small sanctuary for unhurried days. Swim before breakfast, wander into Ubud, and come home to an open-air living room.",
  },
  {
    id: "maison-flore",
    name: "Maison Flore",
    city: "Paris",
    country: "France",
    area: "Le Marais",
    type: "Apartment",
    price: 189,
    rating: 4.94,
    reviews: 83,
    image: images.room,
    tag: "Perfect city base",
    amenities: ["Wi-Fi", "Kitchen", "Air conditioning"],
    description:
      "Your own little address in Le Marais. With high ceilings, soft linen and the city’s best bakeries on your doorstep, this graceful apartment is made for living like a local.",
  },
  {
    id: "riad-sable",
    name: "Riad Sable",
    city: "Marrakech",
    country: "Morocco",
    area: "Medina",
    type: "Boutique hotel",
    price: 112,
    rating: 4.88,
    reviews: 175,
    image: images.interior,
    tag: "Hidden gem",
    amenities: ["Wi-Fi", "Pool", "Breakfast"],
    description:
      "Step from the energy of the medina into a serene courtyard scented with orange blossom. Rooftop breakfasts and warm local hospitality turn a short stay into a lasting memory.",
  },
  {
    id: "terra-lisboa",
    name: "Terra Lisboa",
    city: "Lisbon",
    country: "Portugal",
    area: "Príncipe Real",
    type: "Apartment",
    price: 98,
    rating: 4.82,
    reviews: 67,
    image: images.villa,
    tag: "Thoughtfully designed",
    amenities: ["Wi-Fi", "Kitchen", "Air conditioning"],
    description:
      "A light-filled apartment in leafy Príncipe Real, with room to stretch out and a kitchen for market finds. Independent shops, gardens, and lovely neighborhood restaurants are all around you.",
  },
  {
    id: "caldera-suites",
    name: "Caldera Suites",
    city: "Santorini",
    country: "Greece",
    area: "Imerovigli",
    type: "Boutique hotel",
    price: 215,
    rating: 4.95,
    reviews: 112,
    image: images.villa,
    tag: "Golden-hour favorite",
    amenities: ["Wi-Fi", "Pool", "Sea view", "Breakfast"],
    description:
      "Terraced above the caldera, these intimate suites invite long breakfasts and sunset evenings. Natural textures and an easy island rhythm give every day a little more breathing room.",
  },
  {
    id: "ubud-garden",
    name: "Ubud Garden House",
    city: "Bali",
    country: "Indonesia",
    area: "Penestanan",
    type: "Apartment",
    price: 78,
    rating: 4.79,
    reviews: 53,
    image: images.interior,
    tag: "A greener escape",
    amenities: ["Wi-Fi", "Kitchen", "Pool"],
    description:
      "A garden home tucked into the creative village of Penestanan. Bring a book, take the scenic footpaths, and settle into the easy pace of a neighborhood full of small discoveries.",
  },
];
export interface Experience {
  id: string;
  name: string;
  city: string;
  category: string;
  duration: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}
export const experiences: Experience[] = [
  {
    id: "lisbon-tastes",
    name: "A taste of old Lisbon",
    city: "Lisbon",
    category: "Food & culture",
    duration: "3 hours",
    price: 65,
    rating: 4.98,
    image: images.food,
    description:
      "Follow local host Inês through family-run cafés, a neighborhood market, and her favorite petiscos spots. Six tastings, one very good afternoon.",
  },
  {
    id: "aegean-sail",
    name: "Sail into the Santorini sunset",
    city: "Santorini",
    category: "On the water",
    duration: "4 hours",
    price: 95,
    rating: 4.97,
    image: images.boat,
    description:
      "Slip away from the crowds on a small-group sailing trip. Swim in clear coves, enjoy a freshly prepared dinner, and watch the caldera turn gold.",
  },
  {
    id: "bali-trails",
    name: "The quiet side of Bali",
    city: "Bali",
    category: "Outdoors",
    duration: "5 hours",
    price: 48,
    rating: 4.94,
    image: images.bali,
    description:
      "Walk the rice terraces with a local guide, share tea in a village home, and discover the island at the pace it deserves.",
  },
  {
    id: "paris-table",
    name: "Around a Parisian table",
    city: "Paris",
    category: "Food & culture",
    duration: "3 hours",
    price: 82,
    rating: 4.95,
    image: images.food,
    description:
      "Shop a neighborhood market, then cook a seasonal French lunch in a welcoming home kitchen. Good food and better conversation included.",
  },
  {
    id: "atlas-walk",
    name: "A morning in the Atlas foothills",
    city: "Marrakech",
    category: "Outdoors",
    duration: "6 hours",
    price: 72,
    rating: 4.92,
    image: images.hiking,
    description:
      "Trade the city for mountain paths, valley views, and a shared lunch with your guide’s family. Round-trip local transport included.",
  },
  {
    id: "lisbon-light",
    name: "Lisbon through a local lens",
    city: "Lisbon",
    category: "Art & discovery",
    duration: "2 hours",
    price: 38,
    rating: 4.89,
    image: images.lisbon,
    description:
      "Explore tiled façades, secret viewpoints, and quiet backstreets on a relaxed photo walk. Bring your phone or camera; curiosity is all you need.",
  },
];
export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
export function dateAfter(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export const nightsBetween = (start: string, end: string) =>
  Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
