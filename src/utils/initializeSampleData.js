// Initialize Sample Hotel Data for Development
export const sampleHotels = [
  {
    id: 1,
    name: "The Grand Kashmir Resort",
    location: "Dal Lake, Srinagar",
    rating: 4.8,
    reviews: 245,
    stars: 5,
    price: 8500,
    taxes: 1530,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    description: "Luxury resort on the banks of Dal Lake offering stunning mountain views and world-class amenities.",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking", "Lake view", "Butler service"],
    status: 'approved',
    rooms: [
      {
        id: 101,
        type: "Deluxe Room",
        price: 6500,
        size: "350 sq ft",
        beds: "1 King Bed",
        amenities: ["WiFi", "TV", "Air conditioning", "Minibar"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 20,
        images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"]
      },
      {
        id: 102,
        type: "Suite",
        price: 12000,
        size: "600 sq ft",
        beds: "1 King Bed + Sofa",
        amenities: ["WiFi", "TV", "Air conditioning", "Minibar", "Lake view", "Balcony"],
        maxOccupancy: 3,
        availability: true,
        totalRooms: 10,
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"]
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 48 hours before arrival",
      pets: "Not allowed",
      payment: "Credit card or cash accepted",
      children: "Children under 12 stay free with parents"
    },
    contact: {
      phone: "+91 9876543210",
      email: "info@grandkashmir.com"
    }
  },
  {
    id: 2,
    name: "Himalayan Heights Hotel",
    location: "Gulmarg, Kashmir",
    rating: 4.6,
    reviews: 189,
    stars: 4,
    price: 5500,
    taxes: 990,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    description: "Mountain retreat perfect for skiing and adventure activities with panoramic Himalayan views.",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Fitness Center", "Bar", "Ski storage"],
    status: 'approved',
    rooms: [
      {
        id: 201,
        type: "Standard Room",
        price: 4500,
        size: "280 sq ft",
        beds: "2 Twin Beds",
        amenities: ["WiFi", "TV", "Air conditioning"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 30,
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800"]
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 72 hours before arrival",
      pets: "Small pets allowed with extra charge",
      payment: "All major cards accepted",
      children: "Children welcome"
    },
    contact: {
      phone: "+91 9876543211",
      email: "info@himalayanheights.com"
    }
  },
  {
    id: 3,
    name: "Royal Srinagar Palace",
    location: "Boulevard Road, Srinagar",
    rating: 4.9,
    reviews: 312,
    stars: 5,
    price: 12000,
    taxes: 2160,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    description: "Historic palace hotel offering royal treatment with traditional Kashmiri hospitality and modern luxury.",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Parking", "Butler service", "Concierge", "Lake view"],
    status: 'approved',
    rooms: [
      {
        id: 301,
        type: "Royal Suite",
        price: 18000,
        size: "800 sq ft",
        beds: "1 King Bed",
        amenities: ["WiFi", "TV", "Air conditioning", "Minibar", "Lake view", "Balcony", "Jacuzzi", "Butler service"],
        maxOccupancy: 3,
        availability: true,
        totalRooms: 5,
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"]
      },
      {
        id: 302,
        type: "Premium Room",
        price: 10000,
        size: "450 sq ft",
        beds: "1 King Bed",
        amenities: ["WiFi", "TV", "Air conditioning", "Minibar", "Lake view"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 15,
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"]
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 24 hours before arrival",
      pets: "Not allowed",
      payment: "All payment methods accepted",
      children: "Children under 10 stay free"
    },
    contact: {
      phone: "+91 9876543212",
      email: "reservations@royalsrinagar.com"
    }
  },
  {
    id: 4,
    name: "Pahalgam Valley Resort",
    location: "Pahalgam, Kashmir",
    rating: 4.7,
    reviews: 198,
    stars: 4,
    price: 6500,
    taxes: 1170,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    description: "Scenic resort nestled in the Lidder Valley, perfect for nature lovers and trekking enthusiasts.",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Fitness Center", "Yoga Classes", "Boat Ride"],
    status: 'approved',
    rooms: [
      {
        id: 401,
        type: "Valley View Room",
        price: 5500,
        size: "320 sq ft",
        beds: "1 Queen Bed",
        amenities: ["WiFi", "TV", "Air conditioning", "Valley view", "Balcony"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 25,
        images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800"]
      }
    ],
    policies: {
      checkIn: "1:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before arrival",
      pets: "Pets allowed",
      payment: "Cash and cards accepted",
      children: "Family friendly"
    },
    contact: {
      phone: "+91 9876543213",
      email: "info@pahalgamvalley.com"
    }
  },
  {
    id: 5,
    name: "Sonmarg Mountain Lodge",
    location: "Sonmarg, Kashmir",
    rating: 4.5,
    reviews: 156,
    stars: 4,
    price: 4800,
    taxes: 864,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    description: "Cozy mountain lodge offering stunning views of snow-capped peaks and glacier access.",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Bonfire", "Trekking guides"],
    status: 'approved',
    rooms: [
      {
        id: 501,
        type: "Mountain View Room",
        price: 4000,
        size: "280 sq ft",
        beds: "2 Single Beds",
        amenities: ["WiFi", "Heater", "Mountain view"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 20,
        images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"]
      }
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 72 hours before arrival",
      pets: "Not allowed",
      payment: "Cash preferred",
      children: "Children welcome"
    },
    contact: {
      phone: "+91 9876543214",
      email: "info@sonmarglodge.com"
    }
  },
  {
    id: 6,
    name: "Yusmarg Retreat",
    location: "Yusmarg, Kashmir",
    rating: 4.4,
    reviews: 134,
    stars: 3,
    price: 3500,
    taxes: 630,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    description: "Budget-friendly retreat in the meadows of Yusmarg, ideal for peaceful getaways.",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Garden"],
    status: 'approved',
    rooms: [
      {
        id: 601,
        type: "Standard Room",
        price: 3000,
        size: "250 sq ft",
        beds: "1 Double Bed",
        amenities: ["WiFi", "TV"],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 15,
        images: ["https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800"]
      }
    ],
    policies: {
      checkIn: "1:00 PM",
      checkOut: "10:00 AM",
      cancellation: "Free cancellation up to 48 hours before arrival",
      pets: "Allowed",
      payment: "Cash only",
      children: "Children welcome"
    },
    contact: {
      phone: "+91 9876543215",
      email: "info@yusmargretreat.com"
    }
  }
];

// Initialize data in localStorage
export const initializeSampleData = () => {
  const existingHotels = localStorage.getItem('kashmirStays_hotels');
  const existingPending = localStorage.getItem('kashmirStays_pendingHotels');
  
  // Only initialize if no data exists
  if (!existingHotels) {
    console.log('📦 Initializing sample hotel data...');
    localStorage.setItem('kashmirStays_hotels', JSON.stringify(sampleHotels));
    console.log(`✅ Initialized ${sampleHotels.length} sample hotels`);
  } else {
    const hotels = JSON.parse(existingHotels);
    console.log(`✅ Found ${hotels.length} existing hotels in localStorage`);
  }
  
  if (!existingPending) {
    localStorage.setItem('kashmirStays_pendingHotels', JSON.stringify([]));
    console.log('✅ Initialized empty pending hotels list');
  }
};

export default initializeSampleData;
