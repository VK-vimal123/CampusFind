export const INITIAL_MOCK_ITEMS = [
  {
    id: "item-1",
    title: "Student ID Card - Vimal Kumar",
    type: "lost",
    category: "ID Card",
    description: "Lost my college Smart ID card near Central Library ground floor. Green lanyard with CSE dept batch 2023-2027 printed on it.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    location: "Central Library",
    date: "2026-09-26",
    time: "11:30 AM",
    status: "Searching",
    color: "Green",
    brand: "Campus RFID",
    reportedBy: {
      name: "Vimal Kumar",
      email: "vimal.cse@college.edu",
      role: "Student",
      department: "CSE",
      regNo: "211423104089",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "item-2",
    title: "Black Leather Wallet",
    type: "found",
    category: "Wallet",
    description: "Found a black WildHorn leather wallet containing some cash, metro card, and library token near Canteen entrance bench.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    location: "Campus Canteen",
    date: "2026-09-27",
    time: "01:15 PM",
    status: "Reported",
    color: "Black",
    brand: "WildHorn",
    reportedBy: {
      name: "Ananya Sharma",
      email: "ananya.ece@college.edu",
      role: "Student",
      department: "ECE",
      regNo: "211423106012",
      phone: "+91 98123 45678"
    }
  },
  {
    id: "item-3",
    title: "Blue Milton Stainless Steel Water Bottle",
    type: "lost",
    category: "Other",
    description: "Left my blue insulated water bottle with stickers (GitHub & IEEE stickers) in ECE Seminar Hall, 2nd floor.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    location: "ECE Seminar Hall",
    date: "2026-09-25",
    time: "03:45 PM",
    status: "Possible Match",
    color: "Blue",
    brand: "Milton",
    reportedBy: {
      name: "Rohan Verma",
      email: "rohan.ece@college.edu",
      role: "Student",
      department: "ECE",
      regNo: "211423106088",
      phone: "+91 97654 32109"
    }
  },
  {
    id: "item-4",
    title: "65W Type-C Laptop Charger",
    type: "found",
    category: "Charger",
    description: "Found a black Lenovo 65W USB Type-C power adapter plugged into power socket in Lab 3, CSE Block.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    location: "CSE Block Lab 3",
    date: "2026-09-27",
    time: "05:00 PM",
    status: "Reported",
    color: "Black",
    brand: "Lenovo",
    reportedBy: {
      name: "Dr. K. Rajesh",
      email: "rajesh.faculty@college.edu",
      role: "Faculty",
      department: "CSE",
      regNo: "FAC-8042",
      phone: "+91 94440 12345"
    }
  },
  {
    id: "item-5",
    title: "Black Wildcraft College Backpack",
    type: "lost",
    category: "Bag",
    description: "Lost black college backpack containing Data Structures notebook, pencil box, and scientific calculator near Mechanical Workshop.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    location: "Mechanical Workshop",
    date: "2026-09-24",
    time: "04:20 PM",
    status: "Searching",
    color: "Black",
    brand: "Wildcraft",
    reportedBy: {
      name: "Karthik Raja",
      email: "karthik.mech@college.edu",
      role: "Student",
      department: "Mechanical",
      regNo: "211423114045",
      phone: "+91 99887 76655"
    }
  },
  {
    id: "item-6",
    title: "CSE Data Structures Record Notebook",
    type: "found",
    category: "Books",
    description: "Found a spiral bound CSE lab record notebook with 'S. Priya, 3rd Year CSE' written on first page in Main Library Reading Hall.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    location: "Central Library",
    date: "2026-09-26",
    time: "02:30 PM",
    status: "Contacted",
    color: "Brown / White",
    brand: "Classmate",
    reportedBy: {
      name: "S. Priya",
      email: "priya.cse@college.edu",
      role: "Student",
      department: "CSE",
      regNo: "211423104112",
      phone: "+91 91234 56789"
    }
  },
  {
    id: "item-7",
    title: "White Apple AirPods Pro (in charging case)",
    type: "lost",
    category: "Earphones",
    description: "Lost white AirPods Pro in white wireless charging case with a red silicone sleeve near Sports Complex Badminton Court.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    location: "Sports Complex",
    date: "2026-09-27",
    time: "07:15 AM",
    status: "Searching",
    color: "White / Red",
    brand: "Apple",
    reportedBy: {
      name: "Deepak Sundar",
      email: "deepak.aids@college.edu",
      role: "Student",
      department: "AI & DS",
      regNo: "211423243019",
      phone: "+91 97890 12345"
    }
  },
  {
    id: "item-8",
    title: "House Keys with Superhero Keychain",
    type: "found",
    category: "Keys",
    description: "Bunch of 3 silver keys on a Batman metal keychain left on the table near Gate 1 security desk.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    location: "Bus Stop Gate 1",
    date: "2026-09-26",
    time: "08:45 AM",
    status: "Verified",
    color: "Silver",
    brand: "Godrej",
    reportedBy: {
      name: "M. Murugan",
      email: "security.gate1@college.edu",
      role: "Staff",
      department: "Other",
      regNo: "STF-102",
      phone: "+91 98400 99887"
    }
  },
  {
    id: "item-9",
    title: "Casio fx-991EX Scientific Calculator",
    type: "lost",
    category: "Other",
    description: "Lost Casio ClassWiz scientific calculator with name tag 'Arun EEE' on the back slider cover, during EEE semester exam in Hall B-204.",
    image: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e49e?auto=format&fit=crop&w=800&q=80",
    location: "Academic Block B-204",
    date: "2026-09-25",
    time: "12:00 PM",
    status: "Searching",
    color: "Black",
    brand: "Casio",
    reportedBy: {
      name: "Arun Kumar",
      email: "arun.eee@college.edu",
      role: "Student",
      department: "EEE",
      regNo: "211423105007",
      phone: "+91 96543 21098"
    }
  },
  {
    id: "item-10",
    title: "Course Completion College Certificate Folder",
    type: "found",
    category: "Documents",
    description: "Found blue leather certificate folder containing NPTEL certificate and workshop participation certificate under desk in Civil Auditorium.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    location: "Auditorium",
    date: "2026-09-26",
    time: "04:00 PM",
    status: "Reported",
    color: "Navy Blue",
    brand: "Official College Folder",
    reportedBy: {
      name: "Suresh Mani",
      email: "suresh.civil@college.edu",
      role: "Student",
      department: "Civil",
      regNo: "211423103031",
      phone: "+91 94321 09876"
    }
  },
  {
    id: "item-11",
    title: "Sony Noise Cancelling Over-Ear Headphones",
    type: "found",
    category: "Earphones",
    description: "Found matte silver Sony WH-1000XM4 headphones inside black hard case on table #14 in Quiet Study Zone.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    location: "Central Library",
    date: "2026-09-27",
    time: "06:30 PM",
    status: "Possible Match",
    color: "Silver",
    brand: "Sony",
    reportedBy: {
      name: "Divya Nair",
      email: "divya.it@college.edu",
      role: "Student",
      department: "IT",
      regNo: "211423205022",
      phone: "+91 98765 11223"
    }
  },
  {
    id: "item-12",
    title: "Fastrack Mesh Strap Watch",
    type: "lost",
    category: "Other",
    description: "Lost black analog watch with metal mesh strap during physical education class at Basketball Court.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    location: "Sports Complex",
    date: "2026-09-24",
    time: "05:30 PM",
    status: "Returned",
    color: "Black",
    brand: "Fastrack",
    reportedBy: {
      name: "Vimal Kumar",
      email: "vimal.cse@college.edu",
      role: "Student",
      department: "CSE",
      regNo: "211423104089",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "item-13",
    title: "Faculty Smart Access Keycard",
    type: "lost",
    category: "ID Card",
    description: "Lost silver RFID faculty door pass with blue lanyard, likely misplaced near Staff Quarter 4 or Admin Block.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    location: "Admin Block",
    date: "2026-09-26",
    time: "10:10 AM",
    status: "Reported",
    color: "Silver / Blue",
    brand: "Campus Access Control",
    reportedBy: {
      name: "Prof. S. Meenakshi",
      email: "meenakshi.faculty@college.edu",
      role: "Faculty",
      department: "ECE",
      regNo: "FAC-7011",
      phone: "+91 94433 22110"
    }
  },
  {
    id: "item-14",
    title: "Transparent Geometry Box with Pens",
    type: "found",
    category: "Other",
    description: "Found transparent Maped geometry box containing compass, scale, highlighters, and USB drive in Drawing Hall D-101.",
    image: "https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&w=800&q=80",
    location: "Mechanical Workshop",
    date: "2026-09-25",
    time: "11:00 AM",
    status: "Returned",
    color: "Transparent",
    brand: "Maped",
    reportedBy: {
      name: "Nikhil Dass",
      email: "nikhil.mech@college.edu",
      role: "Student",
      department: "Mechanical",
      regNo: "211423114012",
      phone: "+91 91122 33445"
    }
  },
  {
    id: "item-15",
    title: "Sandisk Ultra 128GB Dual Drive USB-C",
    type: "found",
    category: "Other",
    description: "Found silver metal dual USB flash drive attached to a blue cord on keyboard tray in AI & DS Cloud Computing Lab.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    location: "CSE Block Lab 3",
    date: "2026-09-27",
    time: "03:15 PM",
    status: "Reported",
    color: "Silver",
    brand: "SanDisk",
    reportedBy: {
      name: "Meera Krishnan",
      email: "meera.aids@college.edu",
      role: "Student",
      department: "AI & DS",
      regNo: "211423243004",
      phone: "+91 97766 55443"
    }
  }
];

export const CATEGORIES = [
  "ID Card",
  "Books",
  "Wallet",
  "Keys",
  "Earphones",
  "Charger",
  "Bag",
  "Documents",
  "Other"
];

export const LOCATIONS = [
  "Central Library",
  "Campus Canteen",
  "CSE Block Lab 3",
  "ECE Seminar Hall",
  "Mechanical Workshop",
  "Academic Block B-204",
  "Sports Complex",
  "Auditorium",
  "Bus Stop Gate 1",
  "Admin Block",
  "Hostel Area",
  "Other"
];

export const DEPARTMENTS = [
  "CSE",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "IT",
  "AI & DS",
  "Other"
];

export const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year"
];

export const ROLES = [
  "Student",
  "Faculty",
  "Staff"
];

export const STATUS_OPTIONS = [
  "Reported",
  "Searching",
  "Possible Match",
  "Contacted",
  "Verified",
  "Returned"
];

// Helper functions for mock data persistence in localStorage
export function getStoredItems() {
  const stored = localStorage.getItem("campusfind_items");
  if (!stored) {
    localStorage.setItem("campusfind_items", JSON.stringify(INITIAL_MOCK_ITEMS));
    return INITIAL_MOCK_ITEMS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MOCK_ITEMS;
  }
}

export function saveStoredItems(items) {
  localStorage.setItem("campusfind_items", JSON.stringify(items));
}

export function getRegisteredUsers() {
  const stored = localStorage.getItem("campusfind_registered_users");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const cleanEmail = user.email?.toLowerCase();
  const cleanId = user.studentId?.toLowerCase() || user.regNo?.toLowerCase();

  const existingIndex = users.findIndex(
    (u) => (cleanEmail && u.email?.toLowerCase() === cleanEmail) || (cleanId && (u.studentId?.toLowerCase() === cleanId || u.regNo?.toLowerCase() === cleanId))
  );
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem("campusfind_registered_users", JSON.stringify(users));
}

export function getStoredUser() {
  const stored = localStorage.getItem("campusfind_user");
  if (!stored) {
    // Default mock user
    const defaultUser = {
      name: "Kumar CSE",
      email: "kumar.cse@college.edu",
      role: "Student",
      department: "CSE",
      year: "3rd Year",
      regNo: "211423104089",
      studentId: "211423104089",
      isAdmin: false,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    };
    return defaultUser;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function saveStoredUser(user) {
  localStorage.setItem("campusfind_user", JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('campusfind_user_updated', { detail: user }));
}

export function removeStoredUser() {
  localStorage.removeItem("campusfind_user");
}

