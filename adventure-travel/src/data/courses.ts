export interface CourseItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface CourseInclusion {
  icon: string;
  label: string;
  description: string;
}

export interface CourseTestimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface Course {
  id: number;
  name: string;
  slug: string;
  type: "Skiing" | "Snowboarding" | "Backcountry";
  title: string;
  price: number;
  currency: string;
  duration: string;
  dates: string;
  location: string;
  level: string;
  description: string;
  shortDescription: string;
  itinerary: CourseItineraryDay[];
  inclusions: CourseInclusion[];
  testimonials: CourseTestimonial[];
  image: string;
  gallery?: string[];
  /** Cinematic backdrop video for the course page (real course footage). */
  video?: string;
  featured?: boolean;
  /** ponytail: optional SIA-style fields */
  levelRequirement?: string;
  instructorRatio?: string;
  weeklyHours?: string;
  highlights?: string[];
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const courses: Course[] = [
  {
    id: 1,
    name: "7-Day Skiing Course",
    slug: "skiing-course",
    type: "Skiing",
    title: "Learn to Ski in the Himalayas",
    price: 30000,
    currency: "Rs.",
    duration: "7 Days",
    dates: "Dec 2026 — Mar 2027",
    location: "Auli, Uttarakhand",
    level: "All Levels",
    levelRequirement: "No prior experience needed. We start from the basics.",
    instructorRatio: "6:1 student-to-instructor ratio",
    weeklyHours: "20+ hours of practical training per week",
    description: "Whether you're a complete beginner or looking to refine your technique, our certified instructors guide you through a structured 7-day progression on the slopes of Auli — with the majestic Nanda Devi (7,816m) as your backdrop. Inspired by international snow school standards, you'll receive personalised coaching, HD video analysis, and a course completion certificate recognised across India's snow sports community.",
    shortDescription: "Master the slopes with certified instructors on Auli's pristine powder runs beneath Nanda Devi.",
    highlights: [
      "20+ hours of practical coaching per week from certified instructors",
      "Small group sizes (max 6:1) for personal attention",
      "HD video movement analysis of your technique",
      "Structured weekly progression with personalised evaluations",
      "Full Auli lift pass — cable car & chairlift access",
      "Off-snow seminars: mountain safety, equipment care, snow science",
      "Weekly social après sessions with fellow riders",
      "Course completion certificate",
    ],
    itinerary: [
      { day: 1, title: "Arrive Joshimath & Gear Up", description: "Transfer from Joshimath to Auli. Meet your instructors, get fitted for boots and skis by our equipment specialists, and settle into your mountain-view accommodation." },
      { day: 2, title: "First Turns on the Nursery Slopes", description: "Ride the Auli cable car up (one of the world's highest) and learn the fundamentals — stance, balance, snowplough, and how to stop with confidence. Afternoon: theory session on mountain safety and weather." },
      { day: 3, title: "Snowplough & Controlled Stops", description: "Build control on gentle gradients: snowplough turns, edging, and safe falling techniques. Afternoon: equipment tuning clinic — learn to maintain your own gear." },
      { day: 4, title: "Linking Your Turns", description: "Start linking turns down beginner blue runs. Your instructor films your technique for afternoon video analysis session — see exactly what to improve." },
      { day: 5, title: "Chairlift & Longer Descents", description: "Take the chairlift for longer runs across Auli's varied terrain. Refine your parallel turns and carry more speed across wider pistes. Afternoon: snow science seminar." },
      { day: 6, title: "Intermediate Slopes & Off-Piste Taster", description: "Progress to steeper runs and a guided taste of soft off-piste powder beneath Nanda Devi. End with a group challenge run and celebratory après." },
      { day: 7, title: "Assessment & Certification", description: "A final assessed run demonstrating your progression, personalised written evaluation from your Level 4 Pro, course certificate, and a celebratory send-off." },
    ],
    inclusions: [
      { icon: "structor", label: "Certified Instructor", description: "20+ hrs/week from Level 4 qualified coaches" },
      { icon: "equipment", label: "All Equipment", description: "Skis, boots, helmets & poles fitted by specialists" },
      { icon: "lift", label: "Lift Passes", description: "Full Auli cable car & chairlift access" },
      { icon: "bed", label: "Accommodation", description: "7 nights in Auli mountain-view stay" },
      { icon: "food", label: "All Meals", description: "Breakfast, lunch & dinner included daily" },
      { icon: "certificate", label: "Certification", description: "Course completion certificate + personalised evaluation" },
      { icon: "firstaid", label: "Safety Support", description: "Emergency first aid & mountain rescue protocol" },
      { icon: "photos", label: "HD Video Analysis", description: "Movement analysis + professional course photos" },
    ],
    testimonials: [
      { name: "Priya M.", location: "Mumbai", text: "Best week of my life! The instructors were patient and I went from zero to linking turns in 5 days. The video analysis sessions were a game-changer — you can see exactly what to fix. Nanda Devi views are unreal.", rating: 5 },
      { name: "Arjun K.", location: "Delhi", text: "Professional setup, great gear, and the guides know every inch of these mountains. The small group size meant I got real attention. Highly recommend for beginners.", rating: 5 },
      { name: "Sneha R.", location: "Bangalore", text: "The Auli cable car ride alone is worth the trip. But the structured progression and the après sessions with other riders made it special. Already booked for next season!", rating: 5 },
    ],
    image: "https://images.pexels.com/photos/848591/pexels-photo-848591.jpeg?w=800&q=80",
    gallery: [
      "https://images.pexels.com/photos/848591/pexels-photo-848591.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/352092/pexels-photo-352092.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/163444/ski-snow-winter-sports-163444.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/30309572/pexels-photo-30309572.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/6815358/pexels-photo-6815358.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/6575867/pexels-photo-6575867.jpeg?w=800&q=80",
    ],
  },
  {
    id: 2,
    name: "7-Day Snowboarding Course",
    slug: "snowboarding-course",
    type: "Snowboarding",
    title: "Snowboard the Himalayan Powder",
    price: 35000,
    currency: "Rs.",
    duration: "7 Days",
    dates: "Dec 2026 — Mar 2027",
    location: "Auli, Uttarakhand",
    level: "All Levels",
    levelRequirement: "No prior experience needed. Must be comfortable on snow (skiing or boarding) for intermediate+ courses.",
    instructorRatio: "6:1 student-to-instructor ratio",
    weeklyHours: "20+ hours of practical training per week",
    description: "Learn to snowboard on Auli's legendary powder with certified instructors. From your first heel-side turns to carving down intermediate runs, all beneath the gaze of Nanda Devi. Our structured programme follows international snow school standards — 20+ hours of coaching weekly, HD video analysis, theory seminars on mountain safety, and a personalised evaluation from your Level 4 Pro.",
    shortDescription: "Carve through Himalayan powder on a board — certified instruction from first turns to confident riding.",
    highlights: [
      "20+ hours of practical coaching per week from certified instructors",
      "Small group sizes (max 6:1) for personal attention",
      "HD video movement analysis — see your progression",
      "Weekly personalised evaluations from Level 4 Pros",
      "Theory seminars: mountain safety, equipment tuning, snow science",
      "Weekly social après with fellow riders",
      "Full Auli lift pass — cable car & chairlift access",
      "Course completion certificate",
    ],
    itinerary: [
      { day: 1, title: "Arrive Joshimath & Gear Up", description: "Transfer from Joshimath to Auli. Meet your instructors, get fitted for a board and boots by our equipment specialists, and settle into your mountain-view accommodation." },
      { day: 2, title: "First Rides on the Nursery Slopes", description: "Ride the Auli cable car up and learn the fundamentals — stance, balance, heel-side stops, and how to fall safely. Afternoon: theory session on mountain safety and weather patterns." },
      { day: 3, title: "Toe-Side Turns & Edge Control", description: "Build control on gentle gradients: toe-side turns, edge transitions, and linking heel-to-toe. Afternoon: equipment tuning clinic — waxing, edge sharpening, and board care." },
      { day: 4, title: "Linking Turns & Speed Control", description: "Start linking turns down beginner blue runs. Your instructor films your technique for the afternoon video analysis session — see your stance, edge angle, and body position in detail." },
      { day: 5, title: "Chairlift & Longer Descents", description: "Take the chairlift for longer runs across Auli's varied terrain. Refine your carving and carry more speed across wider pistes. Afternoon: snow science seminar." },
      { day: 6, title: "Intermediate Slopes & Freestyle Taster", description: "Progress to steeper runs and a guided introduction to the terrain park — ollies, flat-ground tricks, and small features. End with a group challenge and celebratory après." },
      { day: 7, title: "Assessment & Certification", description: "A final assessed run demonstrating your progression, personalised written evaluation from your Level 4 Pro, course certificate, and a celebratory send-off." },
    ],
    inclusions: [
      { icon: "structor", label: "Certified Instructor", description: "20+ hrs/week from Level 4 qualified coaches" },
      { icon: "equipment", label: "All Equipment", description: "Boards, boots, helmets & bindings fitted by specialists" },
      { icon: "lift", label: "Lift Passes", description: "Full Auli cable car & chairlift access" },
      { icon: "bed", label: "Accommodation", description: "7 nights in Auli mountain-view stay" },
      { icon: "food", label: "All Meals", description: "Breakfast, lunch & dinner included daily" },
      { icon: "certificate", label: "Certification", description: "Course completion certificate + personalised evaluation" },
      { icon: "firstaid", label: "Safety Support", description: "Emergency first aid & mountain rescue protocol" },
      { icon: "photos", label: "HD Video Analysis", description: "Movement analysis + professional course photos" },
    ],
    testimonials: [
      { name: "Vikram S.", location: "Pune", text: "The snowboarding course was incredible. Went from never touching a board to confidently linking turns in 7 days. The video analysis was a game-changer — I could see my stance improving daily. World-class instructors.", rating: 5 },
      { name: "Meera J.", location: "Chennai", text: "Auli's powder is something else! The 20+ hours of coaching meant I improved every single day. The après sessions with other riders were a highlight. Best investment in a new skill.", rating: 5 },
      { name: "Rahul P.", location: "Delhi", text: "The structured progression from nursery slopes to intermediate runs was exactly what I needed. The small group size meant real personal attention. Professional setup all the way.", rating: 5 },
    ],
    image: "/assets/snowboarding/IMG_5472.jpg",
    video: "/assets/snowboarding/IMG_5201.MOV",
    gallery: [
      "/assets/snowboarding/IMG_5472.jpg",
      "/assets/snowboarding/IMG_4063.jpg",
      "/assets/snowboarding/IMG_5455.jpg",
      "/assets/snowboarding/IMG_5201.MOV",
      "/assets/snowboarding/IMG_0942.MOV",
    ],
    featured: true,
  },
  {
    id: 4,
    name: "2-Week Snowboard Intensive",
    slug: "snowboard-intensive-2week",
    type: "Snowboarding",
    title: "2-Week Snowboard Intensive — Auli",
    price: 60000,
    currency: "Rs.",
    duration: "14 Days",
    dates: "Dec 2026 — Feb 2027",
    location: "Auli, Uttarakhand",
    level: "Beginner to Intermediate",
    levelRequirement: "No prior experience needed. Open to complete beginners.",
    instructorRatio: "5:1 student-to-instructor ratio",
    weeklyHours: "25+ hours of practical training per week",
    description: "Our flagship 2-week snowboard programme — double the time, double the progression. Go from absolute beginner to confidently carving intermediate blue runs in 14 days of structured training. With 25+ hours of coaching weekly, daily video analysis, theory seminars on mountain safety and avalanche awareness, and a final assessment that mirrors international instructor certification standards.",
    shortDescription: "14 days of intensive snowboard training — from first turns to carving intermediate runs with confidence.",
    highlights: [
      "25+ hours of practical coaching per week — the most training per day of any Indian snow school",
      "Small group sizes (max 5:1) for intensive personal attention",
      "Daily HD video analysis with personalised feedback",
      "Theory seminars: mountain safety, avalanche awareness, weather, equipment",
      "Progressive terrain: nursery → blue → intermediate red runs",
      "Off-snow fitness sessions designed for boarders",
      "Weekly social après with the group",
      "Final assessment + certificate of competency",
    ],
    itinerary: [
      { day: 1, title: "Arrive & Orientation", description: "Transfer to Auli. Equipment fitting, resort orientation, meet your instructors. Evening: welcome dinner and course overview." },
      { day: 2, title: "Stance & Balance", description: "Nursery slopes: board stance, heel-side edge, falling safely. Afternoon: theory — mountain safety & weather." },
      { day: 3, title: "Heel-Side Turns", description: "Linking heel-side turns on gentle terrain. Video analysis of stance and body position." },
      { day: 4, title: "Toe-Side Introduction", description: "First toe-side attempts on the magic carpet area. Equipment tuning clinic." },
      { day: 5, title: "Toe-Side Turns", description: "Build control on toe-side turns and edge transitions. Afternoon: snow science seminar." },
      { day: 6, title: "Linking Turns", description: "Link heel-to-toe turns on blue runs. Video review of progression." },
      { day: 7, title: "Speed Control & Carving", description: "Refine linked turns, introduce carving technique. Off-snow fitness session." },
      { day: 8, title: "Rest Day / Free Riding", description: "Explore Auli at your own pace. Optional group ride with instructor." },
      { day: 9, title: "Chairlift & Longer Runs", description: "Chairlift access for longer descents. Focus on consistent linked turns across varied terrain." },
      { day: 10, title: "Intermediate Terrain", description: "Progress to steeper blue and easy red runs. Afternoon: avalanche awareness seminar." },
      { day: 11, title: "Carving & Edge Work", description: "Advanced carving drills — heel-side and toe-side carves on groomed terrain." },
      { day: 12, title: "Freestyle Introduction", description: "Terrain park session: ollies, 180s, small boxes. Afternoon: video analysis of freestyle." },
      { day: 13, title: "Final Assessment", description: "Assessed run on intermediate terrain. Personalised written evaluation from your Level 4 Pro." },
      { day: 14, title: "Certification & Departure", description: "Course certificate ceremony, celebratory après, and departure." },
    ],
    inclusions: [
      { icon: "structor", label: "Certified Instructor", description: "25+ hrs/week from Level 4 qualified coaches" },
      { icon: "equipment", label: "All Equipment", description: "Boards, boots, helmets & bindings fitted by specialists" },
      { icon: "lift", label: "Lift Passes", description: "Full 14-day Auli cable car & chairlift access" },
      { icon: "bed", label: "Accommodation", description: "14 nights in Auli mountain-view stay" },
      { icon: "food", label: "All Meals", description: "Breakfast, lunch & dinner included daily" },
      { icon: "certificate", label: "Certification", description: "Certificate of competency + personalised evaluation" },
      { icon: "firstaid", label: "Safety Support", description: "Emergency first aid & mountain rescue protocol" },
      { icon: "photos", label: "HD Video Analysis", description: "Daily movement analysis + professional course photos" },
    ],
    testimonials: [
      { name: "Kavya N.", location: "Hyderabad", text: "The 2-week intensive was transformative. Day 1 I couldn't stand on the board, day 13 I was carving down intermediate runs. The daily video feedback was incredible — you see yourself improving in real time.", rating: 5 },
      { name: "Rohan D.", location: "Mumbai", text: "This is the real deal. 25+ hours a week of coaching, small groups, theory sessions — it's like a proper snow school, not a holiday course. The avalanche awareness seminar was eye-opening.", rating: 5 },
      { name: "Ananya S.", location: "Delhi", text: "Best two weeks of my life. The instructors pushed me just enough, the après sessions were amazing, and I left with a proper skill. Already planning my return for the advanced course.", rating: 5 },
    ],
    image: "/assets/snowboarding/IMG_4063.jpg",
    video: "/assets/snowboarding/IMG_4222.MOV",
    gallery: [
      "/assets/snowboarding/IMG_4063.jpg",
      "/assets/snowboarding/IMG_5455.jpg",
      "/assets/snowboarding/IMG_5472.jpg",
      "/assets/snowboarding/IMG_4222.MOV",
      "/assets/snowboarding/IMG_3983.MOV",
      "/assets/snowboarding/IMG_5220.MOV",
      "/assets/snowboarding/IMG_5272.MOV",
    ],
  },
  {
    id: 5,
    name: "4-Week Instructor Training",
    slug: "snowboard-instructor-training",
    type: "Snowboarding",
    title: "4-Week Snowboard Instructor Training — Auli",
    price: 120000,
    currency: "Rs.",
    duration: "4 Weeks",
    dates: "Jan — Feb 2027",
    location: "Auli, Uttarakhand",
    level: "Intermediate+ (must link turns on blue runs)",
    levelRequirement: "Must be able to link heel-side and toe-side turns on blue runs. A placement assessment is required before enrolment.",
    instructorRatio: "4:1 student-to-instructor ratio",
    weeklyHours: "30+ hours of practical training per week",
    description: "Our most comprehensive programme — a 4-week intensive that takes you from intermediate rider to instructor-ready. Inspired by CASI and Austrian instructor training standards, this course covers advanced riding technique, teaching methodology, lesson planning, guest management, and mountain leadership. Graduates receive our Instructor Competency Certificate and are eligible for placement at ski schools across India and the Himalayas.",
    shortDescription: "4 weeks of intensive training to become a certified snowboard instructor — advanced technique, teaching skills, and job readiness.",
    highlights: [
      "30+ hours of practical coaching per week — instructor-level training",
      "4:1 ratio — the most personal attention of any course",
      "Advanced riding: carving, powder technique, moguls, steeps, terrain parks",
      "Teaching methodology: lesson planning, guest management, communication",
      "Mountain leadership: avalanche safety (AST 1), weather reading, terrain assessment",
      "Daily video analysis with detailed technique breakdowns",
      "Final instructor-level assessment with external examiner",
      "Job placement assistance at Himalayan ski schools",
      "Certificate of Instructor Competency",
    ],
    itinerary: [
      { day: 1, title: "Arrive & Assessment", description: "Transfer to Auli. Equipment fitting, skill assessment, and placement into ability groups. Evening: welcome dinner and 4-week roadmap." },
      { day: 2, title: "Foundation Review", description: "Refine fundamental turns and stance on blue terrain. Afternoon: theory — anatomy of a snowboard turn." },
      { day: 3, title: "Advanced Carving", description: "Dynamic carving drills on intermediate terrain. Heel-side and toe-side carves with speed. Video analysis." },
      { day: 4, title: "Teaching Fundamentals", description: "Morning riding. Afternoon: teaching methodology seminar — how to break down skills, communication, demonstration." },
      { day: 5, title: "Variable Terrain", description: "Ride across varied snow conditions — hardpack, crud, soft snow. Adapt technique to conditions." },
      { day: 6, title: "Lesson Planning Workshop", description: "Morning group ride. Afternoon: design your first lesson plan for a beginner group." },
      { day: 7, title: "Rest Day", description: "Free riding or rest. Optional yoga session for boarders." },
      { day: 8, title: "Advanced Terrain", description: "Progress to red runs and steep terrain. Focus on short turns and speed control." },
      { day: 9, title: "Teaching Practise 1", description: "Teach a short lesson to your peers. Receive feedback from your Level 4 Pro." },
      { day: 10, title: "Powder Technique", description: "If conditions allow — off-piste powder riding. Weight distribution, stance adjustment, line choice." },
      { day: 11, title: "Avalanche Safety (AST 1)", description: "Full-day avalanche safety course: beacon search, probe lines, shovelling, terrain assessment." },
      { day: 12, title: "Teaching Practise 2", description: "Teach a longer lesson scenario. Afternoon: guest management and communication seminar." },
      { day: 13, title: "Freestyle & Park", description: "Terrain park session: jumps, rails, halfpipe introduction. Teaching freestyle safely." },
      { day: 14, title: "Rest Day / Free Riding", description: "Explore the mountain freely. Optional group backcountry tour." },
      { day: 15, title: "Steeps & Moguls", description: "Advanced terrain: steep runs and mogul fields. Short turn technique and balance." },
      { day: 16, title: "Teaching Practise 3", description: "Full lesson simulation with real scenarios. Video feedback on your teaching style." },
      { day: 17, title: "Weather & Mountain Leadership", description: "Morning riding in varied conditions. Afternoon: weather reading, terrain assessment, risk management." },
      { day: 18, title: "Terrain Park Instruction", description: "How to teach freestyle safely. Progression drills for park features." },
      { day: 19, title: "Advanced Riding Assessment", description: "Internal riding assessment — demonstrate advanced technique across all terrain types." },
      { day: 20, title: "Teaching Assessment", description: "Teach a full lesson to a group of real beginners. Evaluated by your Level 4 Pro." },
      { day: 21, title: "Rest Day", description: "Free riding or recovery. Evening: course social event." },
      { day: 22, title: "Mountain Leadership Day", description: "Full-day mountain leadership exercise: route planning, group management, emergency scenarios." },
      { day: 23, title: "Final Preparation", description: "Review all skills. Finalise portfolio. Mock assessment session." },
      { day: 24, title: "External Assessment", description: "Final instructor-level assessment with external examiner. Riding + teaching components." },
      { day: 25, title: "Results & Certification", description: "Results announced. Certificate ceremony. Job placement briefing and networking session." },
      { day: 26, title: "Departure", description: "Celebratory breakfast, farewell, and departure transfers." },
    ],
    inclusions: [
      { icon: "structor", label: "Expert Instructors", description: "30+ hrs/week from Level 4 Pros + external examiner" },
      { icon: "equipment", label: "All Equipment", description: "Premium boards, boots, helmets & backcountry gear" },
      { icon: "lift", label: "Lift Passes", description: "Full 4-week Auli cable car & chairlift access" },
      { icon: "bed", label: "Accommodation", description: "26 nights in Auli mountain-view stay" },
      { icon: "food", label: "All Meals", description: "Breakfast, lunch & dinner included daily" },
      { icon: "certificate", label: "Certification", description: "Instructor Competency Certificate + AST 1" },
      { icon: "firstaid", label: "Safety Training", description: "Avalanche rescue, mountain first aid, emergency protocol" },
      { icon: "photos", label: "HD Video Analysis", description: "Daily movement analysis + full teaching portfolio" },
    ],
    testimonials: [
      { name: "Arjun B.", location: "Bangalore", text: "This course changed my life. I came as a decent snowboarder and left as a proper instructor. The teaching methodology sessions were as valuable as the riding. Got placed at a Manali ski school within a month.", rating: 5 },
      { name: "Maya P.", location: "Mumbai", text: "The most intense and rewarding 4 weeks of my life. 30+ hours a week of training, daily video feedback, and the avalanche safety course was world-class. Worth every rupee.", rating: 5 },
      { name: "Dev R.", location: "Delhi", text: "If you're serious about a career in snow sports, this is the course. The external assessment gives it real credibility. I'm now teaching in Gulmarg — couldn't be happier.", rating: 5 },
    ],
    image: "https://images.pexels.com/photos/6575867/pexels-photo-6575867.jpeg?w=800&q=80",
    gallery: [
      "https://images.pexels.com/photos/6575867/pexels-photo-6575867.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/352092/pexels-photo-352092.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/848591/pexels-photo-848591.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/6815358/pexels-photo-6815358.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/30309572/pexels-photo-30309572.jpeg?w=800&q=80",
    ],
  },
  {
    id: 3,
    name: "Backcountry Ski Touring",
    slug: "backcountry-skiing",
    type: "Backcountry",
    title: "Backcountry Ski Touring Adventure",
    price: 45000,
    currency: "Rs.",
    duration: "7 Days",
    dates: "Jan — Mar 2027",
    location: "Auli, Uttarakhand",
    level: "Intermediate+",
    levelRequirement: "Must link parallel turns on red runs. Some off-piste experience recommended.",
    instructorRatio: "4:1 guide-to-client ratio",
    weeklyHours: "Full-day guided sessions",
    description: "For experienced skiers ready to explore beyond the resort. Tour through untouched Himalayan terrain, learn avalanche safety, and experience the freedom of backcountry skiing beneath Nanda Devi.",
    shortDescription: "Explore untouched Himalayan terrain with expert guides — avalanche safety, touring techniques, and wild powder.",
    highlights: [
      "4:1 guide-to-client ratio for maximum safety",
      "Certified avalanche guide with 15+ years Himalayan experience",
      "AST 1 avalanche safety certification included",
      "Tour through pristine backcountry beneath Nanda Devi",
      "Full touring equipment provided: skins, beacons, probes, shovels",
      "Emergency satellite communicator on every trip",
      "Professional photos from the mountains",
    ],
    itinerary: [
      { day: 1, title: "Arrive Joshimath & Safety Briefing", description: "Meet your guides, review avalanche safety protocols, check touring equipment, and settle in." },
      { day: 2, title: "Touring Fundamentals", description: "Learn skinning technique, kick turns, and efficient uphill travel on Auli's gentler slopes." },
      { day: 3, title: "Transition to Downhill", description: "Practice switching from touring to downhill mode, and refine your off-piste technique." },
      { day: 4, title: "First Backcountry Descent", description: "Tour to higher elevations and ski your first untracked backcountry line beneath Nanda Devi." },
      { day: 5, title: "Avalanche Rescue Practice", description: "Hands-on beacon search, probe lines, and shovelling techniques in a controlled environment." },
      { day: 6, title: "Extended Tour & Descent", description: "Full-day touring expedition with multiple descents through varied terrain." },
      { day: 7, title: "Final Run & Departure", description: "A morning backcountry run, course debrief, and celebratory lunch before departure." },
    ],
    inclusions: [
      { icon: "structor", label: "Mountain Guide", description: "Certified backcountry & avalanche guide (15+ yrs)" },
      { icon: "equipment", label: "Touring Equipment", description: "Skins, beacons, probes & shovels provided" },
      { icon: "lift", label: "Lift Access", description: "Initial cable car access for touring" },
      { icon: "bed", label: "Accommodation", description: "7 nights in Auli mountain-view stay" },
      { icon: "food", label: "All Meals", description: "Breakfast, lunch & dinner included" },
      { icon: "certificate", label: "Certification", description: "AST 1 avalanche safety certification" },
      { icon: "firstaid", label: "Safety Support", description: "Emergency satellite communicator on every trip" },
      { icon: "photos", label: "Course Photos", description: "Professional shots from the mountains" },
    ],
    testimonials: [
      { name: "Aditya K.", location: "Bangalore", text: "The backcountry touring was life-changing. Skiing untracked powder with Nanda Devi towering above — nothing compares.", rating: 5 },
      { name: "Zara M.", location: "Mumbai", text: "The avalanche safety training alone was worth the price. Professional, thorough, and empowering.", rating: 5 },
      { name: "Karthik L.", location: "Delhi", text: "For anyone who can already ski and wants the next step — this is it. The guides are world-class.", rating: 5 },
    ],
    image: "https://images.pexels.com/photos/23430553/pexels-photo-23430553.jpeg?w=800&q=80",
    gallery: [
      "https://images.pexels.com/photos/23430553/pexels-photo-23430553.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/31427172/pexels-photo-31427172.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/6575867/pexels-photo-6575867.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/1928073/pexels-photo-1928073.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/5044315/pexels-photo-5044315.jpeg?w=800&q=80",
      "https://images.pexels.com/photos/31427174/pexels-photo-31427174.jpeg?w=800&q=80",
    ],
  },
];
