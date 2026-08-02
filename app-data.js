// Shared data & state for Beach House App

window.APP_DATA = {
  houseName: "The Pierce/Thomas Beach House",
  location: "Shelter Cove, Hilton Head Island, SC",

  // Family rotation: 2 months on, 2 months off, alternating
  familyRotation: [
    { months: [0, 1],  family: "Pierce", label: "Pierce Family" },
    { months: [2, 3],  family: "Thomas", label: "Thomas Family" },
    { months: [4, 5],  family: "Pierce", label: "Pierce Family" },
    { months: [6, 7],  family: "Thomas", label: "Thomas Family" },
    { months: [8, 9],  family: "Pierce", label: "Pierce Family" },
    { months: [10, 11], family: "Thomas", label: "Thomas Family" },
  ],

  familyMembers: [
    { id: 1, name: "Sarah Pierce", email: "sarah@family.com", password: "pierce123", role: "admin", avatar: "SP", family: "Pierce" },
    { id: 2, name: "Mike Pierce", email: "mike@family.com", password: "pierce123", role: "member", avatar: "MP", family: "Pierce" },
    { id: 3, name: "Linda Thomas", email: "linda@family.com", password: "thomas123", role: "admin", avatar: "LT", family: "Thomas" },
    { id: 4, name: "James Thomas", email: "james@family.com", password: "thomas123", role: "member", avatar: "JT", family: "Thomas" },
    { id: 5, name: "Emma Pierce", email: "emma@family.com", password: "pierce123", role: "member", avatar: "EP", family: "Pierce" },
  ],

  reservations: [
    { id: 1, userId: 2, userName: "Mike Pierce", checkIn: "2026-05-13", checkOut: "2026-05-20", guests: ["Mike Pierce", "Karen Pierce", "Tommy Pierce"], guestCount: 3, status: "approved", notes: "Kids' summer break!", votes: { 1: "approve", 3: "approve" }, createdAt: "2026-04-10" },
    { id: 2, userId: 4, userName: "James Thomas", checkIn: "2026-07-04", checkOut: "2026-07-11", guests: ["James Thomas", "Linda Thomas", "Cody Thomas", "Mia Thomas"], guestCount: 4, status: "pending", notes: "4th of July week — fireworks on the beach!", votes: { 3: "approve" }, createdAt: "2026-04-22" },
    { id: 3, userId: 5, userName: "Emma Pierce", checkIn: "2026-05-25", checkOut: "2026-05-30", guests: ["Emma Pierce", "Ryan Cole"], guestCount: 2, status: "pending", notes: "Anniversary weekend ❤️", votes: {}, createdAt: "2026-05-01" },
    { id: 4, userId: 1, userName: "Sarah Pierce", checkIn: "2026-09-12", checkOut: "2026-09-19", guests: ["Sarah Pierce", "Dan Pierce"], guestCount: 2, status: "approved", notes: "Fall getaway", votes: { 1: "approve", 4: "approve" }, createdAt: "2026-03-15" }
  ],

  houseRules: [
    "No smoking inside the house",
    "Max 6 guests at a time (2 BR / 2 BA)",
    "Quiet hours after 10pm — be neighborly",
    "Clean before you leave",
    "Notify the other family of any damage right away",
    "Pets allowed with prior heads-up",
    "Lock all doors when leaving",
    "Trash is taken out"
  ],

  houseInfo: {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 6,
    unit: "7557",
    gateCode: "1776#",
    wifiName: "paradise7557",
    wifiPassword: "happy123",
    parking: "Unassigned lot parking at the building",
    address: "Unit 7557 · Shelter Cove, Hilton Head Island, SC",
    amenities: ["Marina & pool view", "Community pool & hot tub", "Chef's kitchen", "Gas fireplace", "Wet bar + wine storage", "Screened balcony", "Walk to dining & marina", "Smart TVs", "Washer/dryer", "LED-lit baths"]
  },

  // Photo gallery — real photos of unit 7557
  gallery: [
    { cat: "Views",            file: "photos/IMG_3259.jpg", caption: "Pool & marina from the balcony" },
    { cat: "Views",            file: "photos/IMG_3260.jpg", caption: "Shelter Cove marina & boats" },
    { cat: "Views",            file: "photos/IMG_3238.jpg", caption: "Marina & pool through the windows" },
    { cat: "Views",            file: "photos/IMG_3243.jpg", caption: "Screened balcony over the water" },
    { cat: "Living",           file: "photos/IMG_3250.jpg", caption: "Open living room with gas fireplace" },
    { cat: "Living",           file: "photos/IMG_3239.jpg", caption: "Living & dining, open to the kitchen" },
    { cat: "Living",           file: "photos/IMG_3242.jpg", caption: "Sitting area & wet bar, marina view" },
    { cat: "Living",           file: "photos/IMG_3241.jpg", caption: "Lounge with wine wall & wet bar" },
    { cat: "Living",           file: "photos/IMG_3240.jpg", caption: "Wet bar with wine fridge" },
    { cat: "Kitchen",          file: "photos/IMG_3245.jpg", caption: "Chef's kitchen, waterfall marble island" },
    { cat: "Kitchen",          file: "photos/IMG_3244.jpg", caption: "Full kitchen, stainless appliances" },
    { cat: "Bedrooms",         file: "photos/IMG_3252.jpg", caption: "Guest bedroom with balcony" },
    { cat: "Bedrooms",         file: "photos/IMG_3251.jpg", caption: "Guest bedroom, queen + smart TV" },
    { cat: "Bedrooms",         file: "photos/IMG_3247.jpg", caption: "Bedroom with private porch access" },
    { cat: "Bedrooms",         file: "photos/IMG_3246.jpg", caption: "Queen bedroom" },
    { cat: "Bathrooms",        file: "photos/IMG_3249.jpg", caption: "Marble walk-in shower" },
    { cat: "Bathrooms",        file: "photos/IMG_3248.jpg", caption: "Double vanity & dressing area" },
    { cat: "Bathrooms",        file: "photos/IMG_3257.jpg", caption: "Dual LED-lit vanities" },
    { cat: "Bathrooms",        file: "photos/IMG_3258.jpg", caption: "Walk-in shower, sea-glass tile" },
    { cat: "Bathrooms",        file: "photos/IMG_3253.jpg", caption: "Guest bath with glass shower" },
    { cat: "Parking & Access", file: "photos/IMG_3261.jpg", caption: "Unit 7557 — front door (keypad entry)" },
    { cat: "Parking & Access", file: "photos/IMG_3263.jpg", caption: "Parking lot at the building" },
    { cat: "Parking & Access", file: "photos/IMG_3262.jpg", caption: "Parking from above" }
  ],

  // House supplies inventory — checked by departing guests
  supplies: [
    { id: 1,  name: "Toilet paper",        category: "Bathroom", status: "good", count: "8 rolls", updatedBy: "Mike Pierce", updatedAt: "2026-05-18", essential: true },
    { id: 2,  name: "Paper towels",        category: "Kitchen",  status: "good", count: "4 rolls", updatedBy: "Mike Pierce", updatedAt: "2026-05-18", essential: true },
    { id: 3,  name: "Dish soap",           category: "Kitchen",  status: "low",  count: "Half bottle", updatedBy: "Mike Pierce", updatedAt: "2026-05-18", essential: true },
    { id: 4,  name: "Dishwasher pods",     category: "Kitchen",  status: "good", count: "20+ pods", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 5,  name: "Laundry detergent",   category: "Laundry",  status: "good", count: "Full bottle", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 6,  name: "Trash bags (kitchen)",category: "Cleaning", status: "out",  count: "0", updatedBy: "Mike Pierce", updatedAt: "2026-05-18", essential: true },
    { id: 7,  name: "Trash bags (outdoor)",category: "Cleaning", status: "good", count: "Most of box", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
    { id: 8,  name: "Hand soap",           category: "Bathroom", status: "good", count: "2 dispensers full", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 9,  name: "Shampoo & conditioner", category: "Bathroom", status: "low", count: "Running low", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
    { id: 10, name: "Body wash",           category: "Bathroom", status: "good", count: "Full", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 11, name: "Coffee + filters",    category: "Kitchen",  status: "low",  count: "1/2 bag", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
    { id: 12, name: "Salt, pepper, oil",   category: "Kitchen",  status: "good", count: "Pantry stocked", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 13, name: "Sponges + dish cloths", category: "Cleaning", status: "good", count: "Fresh", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
    { id: 14, name: "All-purpose cleaner", category: "Cleaning", status: "good", count: "Almost full", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 15, name: "Sunscreen (shared)",  category: "Beach",    status: "low",  count: "Half bottle", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
    { id: 16, name: "Beach towels",        category: "Beach",    status: "good", count: "8 towels", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 17, name: "Sand toys + chairs",  category: "Beach",    status: "good", count: "In garage", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 18, name: "First aid kit",       category: "Safety",   status: "good", count: "Fully stocked", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 19, name: "Batteries (AA/AAA)",  category: "Safety",   status: "good", count: "Drawer full", updatedBy: "Sarah Pierce", updatedAt: "2026-04-22" },
    { id: 20, name: "Light bulbs (spare)", category: "Safety",   status: "low",  count: "Just 2 left", updatedBy: "Mike Pierce", updatedAt: "2026-05-18" },
  ],

  // Checkout checklist — departing guests confirm these are done
  checkoutChecklist: [
    "Trash out to curb (if Monday night)",
    "Dishwasher run + emptied",
    "Beds stripped, linens in laundry",
    "Towels in laundry basket",
    "Thermostat set to 78° (summer) / 62° (winter)",
    "All windows + doors locked",
    "Lockbox keys returned",
    "Supplies inventory updated",
  ],

  // Real Shelter Cove area places
  localRecs: [
    // Dining — actually around Shelter Cove
    { category: "Dining", name: "ELA's Blu Water Grille", note: "Waterfront dining at Shelter Cove Marina. Sunset reservations are everything.", tag: "Marina", walk: "5 min walk" },
    { category: "Dining", name: "San Miguel's", note: "Casual Mexican right on the marina — frozen margaritas + tacos.", tag: "Marina", walk: "5 min walk" },
    { category: "Dining", name: "Hudson's Seafood House", note: "Local institution. Get the shrimp. Cash-friendly, no reservations.", tag: "Seafood", walk: "10 min drive" },
    { category: "Dining", name: "Skull Creek Boathouse", note: "Sunset views, dock-and-dine. Good for groups.", tag: "Waterfront", walk: "15 min drive" },
    { category: "Dining", name: "Poseidon", note: "Rooftop bar at Shelter Cove Towne Centre. Great for cocktails.", tag: "Rooftop", walk: "8 min walk" },

    // Beach
    { category: "Beach", name: "Burkes Beach", note: "Closest public beach access. Wide sand, less crowded than Coligny.", tag: "Beach", walk: "10 min drive" },
    { category: "Beach", name: "Islanders Beach Park", note: "Resident-friendly, restrooms, picnic tables. Bring the parking pass.", tag: "Family", walk: "12 min drive" },
    { category: "Beach", name: "Coligny Beach Park", note: "Big public beach with shops + restaurants nearby.", tag: "Lively", walk: "15 min drive" },
    { category: "Beach", name: "Driessen Beach Park", note: "Boardwalk through the dunes. Great for sunrise walks.", tag: "Quiet", walk: "10 min drive" },

    // Bike & Trails — Hilton Head has 60+ miles of paths
    { category: "Bike & Trails", name: "Cross Island Path", note: "Paved bike path running across the island. Pick it up right at Shelter Cove.", tag: "Path", walk: "At door" },
    { category: "Bike & Trails", name: "Pinckney Island Refuge", note: "Flat, scenic dirt trails through the marsh. Amazing wildlife.", tag: "Nature", walk: "8 min drive" },
    { category: "Bike & Trails", name: "Beach Riding (Low Tide)", note: "Ride the hard sand at low tide — check tide chart first.", tag: "Beach", walk: "10 min drive" },
    { category: "Bike & Trails", name: "Hilton Head Bicycle Co.", note: "Rentals, repairs, and recommended routes if you brought your own.", tag: "Rentals", walk: "5 min drive" },
    { category: "Bike & Trails", name: "Shelter Cove Loop", note: "Easy 4-mile loop around the marina + community. Good for kids.", tag: "Easy", walk: "At door" },

    // Things to do
    { category: "Activities", name: "Shelter Cove Marina", note: "Boats, dolphin tours, sunset cruises — all leave from here.", tag: "Marina", walk: "5 min walk" },
    { category: "Activities", name: "Harbour Town Lighthouse", note: "Walk up for the view. Sea Pines fee at the gate.", tag: "Landmark", walk: "20 min drive" },
    { category: "Activities", name: "Outside Hilton Head", note: "Kayak + paddleboard rentals, marsh tours. Book ahead in summer.", tag: "Water", walk: "5 min walk" },
    { category: "Activities", name: "Coastal Discovery Museum", note: "Free, easy walking trails + butterfly garden. Great rainy-day backup.", tag: "Indoor", walk: "8 min drive" },

    // Groceries
    { category: "Groceries", name: "Publix at Shelter Cove", note: "Closest grocery, in the Towne Centre. Open until 10pm.", tag: "Shopping", walk: "8 min walk" },
    { category: "Groceries", name: "Fresh Market", note: "Nicer produce + prepared foods. Worth the short drive.", tag: "Specialty", walk: "5 min drive" },
    { category: "Groceries", name: "Harris Teeter (Coligny)", note: "Full-size grocery near Coligny Plaza, wide selection. Good for a big stock-up.", tag: "Shopping", walk: "15 min drive" },
    { category: "Groceries", name: "Kroger (Pineland Station)", note: "Large, well-stocked, usually less crowded than the Publix by the marina.", tag: "Shopping", walk: "12 min drive" },
    { category: "Groceries", name: "Whole Foods Market", note: "Organic + specialty groceries, good prepared foods bar for a quick dinner.", tag: "Specialty", walk: "15 min drive" },
    { category: "Groceries", name: "Piggly Wiggly (Sea Pines Center)", note: "Small, convenient, in-season for quick top-ups near Sea Pines.", tag: "Convenient", walk: "20 min drive" },
    { category: "Groceries", name: "The Store (Bluffton)", note: "Local butcher + market with excellent seafood and meats, worth the trip.", tag: "Specialty", walk: "20 min drive" },
  ]
};
