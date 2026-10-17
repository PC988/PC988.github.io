/* =====================================================================
   CONTENT.JS  ·  The only file you need to edit.
   ---------------------------------------------------------------------
   ADD A PROJECT IN 3 STEPS
   1. Make a folder:   projects/<slug>/          e.g. projects/my-drone/
   2. Put photos in it. Name the main one  cover.jpg  (it becomes the slide).
   3. Copy one { ... } block below, paste it at the TOP of PROJECTS,
      and change the text. Newest project first = first slide.

   Fields
   - slug     folder name, lowercase, dashes, no spaces (also the URL)
   - title    shown on the slide and the project page
   - year     shown next to the title
   - tags     short labels (parts, tools, skills)
   - summary  1 to 3 sentences, shown on the project page
   - cover    optional. Defaults to projects/<slug>/cover.jpg
   - images   gallery photos inside the folder. Either "file.jpg"
              or { src: "file.jpg", caption: "what this shows" }
   - links    optional buttons, e.g. { label: "GitHub", href: "https://..." }

   No photo yet? Leave it. The slide shows a cyan placeholder instead.
   ===================================================================== */

const ABOUT = {
  name: "Preston Chen",

  // Big statement on the About page. One line per entry.
  statement: [
    "Preston",
    "is a student",
    "engineer in Taiwan",
    "building hardware",
    "and designing projects.",
  ],

  // Short paragraphs under the statement.
  bio: [
    "I design, prototype and test my own hardware: wearables, robots and medical devices. Most of it starts in CAD, gets 3D printed, and goes through a lot of versions before it works.",
  ],

  // Contact / social links. Delete any you don't want.
  links: [
    { label: "Email", href: "prestonc988@gmail.com" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Instagram", href: "https://www.instagram.com/prestonc_988/" },
  ],
};

const PROJECTS = [
  
  {
    slug: "ai-reader",
    title: "Assistive Reading Device",
    year: "2026",
    tags: ["Raspberry Pi Zero 2 W", "Camera Module 3", "OCR", "TTS"],
    summary:
      "An cheap assistive pointer that reads printed text out loud. A Raspberry Pi Zero 2 W and Camera Module 3 capture the page, and a custom button HAT controls it.",
    images: [],
    links: [],
  },
  {
    slug: "adaptive-insole",
    title: "Adaptive Insole",
    year: "2026",
    tags: ["ESP32", "Servo", "TPU", "Onshape", "Three.js"],
    summary:
      "A pressure-offloading insole designed to help prevent foot ulcers. Pods deflate under high-pressure zones instead of lifting the foot. Two prototypes: a static 3D-printed four-zone insole and a servo-driven single-pod demonstrator.",
    images: [
      // { src: "prototype-1.jpg", caption: "Four-zone static insole, printed in TPU" },
      // { src: "pod-demo.jpg", caption: "Servo-driven single-pod demonstrator" },
    ],
    links: [],
  },
  {
    slug: "vex-4253z",
    title: "VEX Robot · 4253Z",
    year: "2026",
    tags: ["VEX V5", "Robotics", "Team 4253Z"],
    summary:
      "Competition robot for VEX team 4253Z Raid Zero Z. Designed, built and documented across the season in a full engineering notebook.",
    images: [],
    links: [],
  },
];
