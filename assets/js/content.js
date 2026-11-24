/*
 * He Siyu — 3D practice archive
 * ------------------------------------------------------------------
 * Edit this file to update the site. Everything visible comes from
 * the data below: profile, copy, studies, notes and contact details.
 *
 * TO REPLACE A STUDY:
 *   drop your .mp4 and .jpg into assets/videos and assets/images/posters,
 *   then update the `video` and `poster` fields for that project.
 *   `backgroundVideo` is an optional low-res, pre-blurred loop used by
 *   the home-page background. If omitted, the blurred poster is used.
 *
 * PLACEHOLDERS TO REPLACE LATER:
 *   profile.email, profile.socials, profile.location,
 *   the About copy, and any study notes that should be more specific.
 */
window.PORTFOLIO = {
  profile: {
    name: "He Siyu",
    nameCn: "何思雨",
    role: "Second-year student — 3D & CG",
    shortRole: "Second-year student / 3D practice",
    discipline: "Blender · Unreal Engine · PBR",
    location: "China",
    availability: "Student work — feedback welcome",
    email: "hello@hesiyu.studio", // ← replace with your email
    statement:
      "A working archive of 3D scenes, lighting and PBR studies — made as a second-year student.",
    socials: [
      // Add links when you have them, for example:
      // { label: "Instagram", url: "https://instagram.com/yourname" },
      // { label: "Vimeo", url: "https://vimeo.com/yourname" }
    ]
  },

  about: {
    eyebrow: "About / Student practice",
    lead: "A second-year student, building places that almost exist.",
    paragraphs: [
      "I am a second-year student exploring 3D through Blender and Unreal Engine. Most of the studies here begin with atmosphere — a colour, a surface, a room — and grow into an exercise in building that sensation.",
      "The archive moves between Blender environments, real-time Unreal Engine scenes — including a cave walkthrough test — lighting tests and PBR material practice. Some pieces are small, complete worlds; others are simply attempts to understand scale, light or texture.",
      "This is a learning record, not a professional reel. I will keep adding exercises, process notes and better versions as the practice develops."
    ],
    practice: [
      {
        label: "Blender scenes",
        text: "Scene building, lighting, camera and look-development exercises."
      },
      {
        label: "Unreal Engine",
        text: "Real-time environment, lighting and walkthrough tests."
      },
      {
        label: "PBR modelling",
        text: "Hard-surface modelling, material and texture practice."
      }
    ],
    info: [
      { label: "Based in", value: "China" },
      { label: "Studying", value: "Second year / 3D & CG" },
      { label: "Focus", value: "Blender, Unreal Engine, PBR" },
      { label: "Status", value: "Student work / feedback welcome" }
    ],
    closing: "A working study archive — updated as the practice grows."
  },

  projects: [
    {
      slug: "orbital",
      title: "ORBITAL",
      titleLines: ["ORBITAL"],
      category: "Blender Scene Study",
      context: "Scene exercise",
      year: "2026",
      duration: "00' 09\"",
      roles: ["Scene", "Scale", "Lighting"],
      video: "assets/videos/orbital.mp4",
      backgroundVideo: "assets/videos/backgrounds/orbital-bg.mp4",
      poster: "assets/images/posters/orbital.jpg",
      accent: "#ff4d2e",
      fit: "cover",
      hasAudio: true,
      synopsis:
        "A scene study built around a planet-scale structure and a slow camera move. The exercise looks at surface detail, scale and how little information is needed for the object to read as a world.",
      description: [
        "Orbital is an exercise in scale and surface noise. The camera keeps a respectful distance while the object turns, revealing signs of use and repair across its shell.",
        "The focus was on building a believable texture read at a distance, and using light to separate the sphere from the background."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Blender" },
        { label: "Format", value: "Looping scene" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "vertical",
      title: "VERTICAL",
      titleLines: ["VERTICAL"],
      category: "Blender Environment Study",
      context: "Scene exercise",
      year: "2026",
      duration: "00' 10\"",
      roles: ["Environment", "Camera"],
      video: "assets/videos/vertical.mp4",
      backgroundVideo: "assets/videos/backgrounds/vertical-bg.mp4",
      poster: "assets/images/posters/vertical.jpg",
      accent: "#cfd0ca",
      fit: "cover",
      hasAudio: true,
      synopsis:
        "A monochrome city scene viewed from street level, made as an exercise in rhythm, scale and camera movement.",
      description: [
        "Vertical is a scene and camera sketch built from repetition: windows, columns, clouds and the small human need to find a top. The image never quite settles on a horizon.",
        "A reduced palette keeps attention on silhouette, depth and the upward movement of the camera."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Blender" },
        { label: "Format", value: "Short scene" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "overgrown",
      title: "OVERGROWN",
      titleLines: ["OVERGROWN"],
      category: "UE Environment Study",
      context: "Real-time scene",
      year: "2026",
      duration: "00' 07\"",
      roles: ["Environment", "Lighting"],
      video: "assets/videos/overgrown.mp4",
      backgroundVideo: "assets/videos/backgrounds/overgrown-bg.mp4",
      poster: "assets/images/posters/overgrown.jpg",
      accent: "#a8d862",
      fit: "cover",
      hasAudio: false,
      synopsis:
        "A cave-garden environment built in Unreal Engine, with ferns, blossom, fragmented stone and small shifts in light.",
      description: [
        "Overgrown treats a garden as a ruin that is still growing. Plant life spills over columns and broken floors while the light changes as if the space is breathing.",
        "It belongs to the same Unreal Engine environment as Walkthrough and Shrine Test. This pass studies the scene as a still, wide view before the other two tests move through it."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Unreal Engine" },
        { label: "Format", value: "Short scene" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "walkthrough",
      title: "WALKTHROUGH",
      titleLines: ["WALKTHROUGH"],
      category: "UE Walkthrough Study",
      context: "Traversal test",
      year: "2026",
      duration: "00' 29\"",
      roles: ["UE", "Traversal", "Lighting"],
      video: "assets/videos/walkthrough.mp4",
      backgroundVideo: "assets/videos/backgrounds/walkthrough-bg.mp4",
      poster: "assets/images/posters/walkthrough.jpg",
      accent: "#8fd3bf",
      fit: "cover",
      hasAudio: false,
      synopsis:
        "A real-time walkthrough test in Unreal Engine. The character moves from the cave garden up through the shrine and out toward the water.",
      description: [
        "The test was made to see the environment at eye level rather than as a still composition. Moving through the space makes its scale and lighting easier to judge.",
        "The route moves from dense foliage to the open water, so the exterior light only becomes visible at the end of the shot."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Unreal Engine" },
        { label: "Format", value: "Walkthrough test" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "shrine-test",
      title: "SHRINE TEST",
      titleLines: ["SHRINE", "TEST"],
      category: "UE Camera Test",
      context: "Framing exercise",
      year: "2026",
      duration: "00' 05\"",
      roles: ["UE", "Camera", "Composition"],
      video: "assets/videos/shrine-test.mp4",
      backgroundVideo: "assets/videos/backgrounds/shrine-test-bg.mp4",
      poster: "assets/images/posters/shrine-test.jpg",
      accent: "#d8c594",
      fit: "cover",
      hasAudio: false,
      synopsis:
        "A short Unreal Engine camera test focused on the shrine statue, its framing and the contrast between the dark cave and the opening beyond.",
      description: [
        "This test looks at a single view: how the statue reads against the cave wall, whether the shrine holds focus, and how much of the surrounding foliage should stay in frame.",
        "It is a quick framing exercise in the same environment as Overgrown and Walkthrough."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Unreal Engine" },
        { label: "Format", value: "Short camera test" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "chlorine",
      title: "CHLORINE",
      titleLines: ["CHLORINE"],
      category: "Blender Colour Study",
      context: "Colour exercise",
      year: "2026",
      duration: "00' 42\"",
      roles: ["Lighting", "Colour"],
      video: "assets/videos/chlorine.mp4",
      backgroundVideo: "assets/videos/backgrounds/chlorine-bg.mp4",
      poster: "assets/images/posters/chlorine.jpg",
      accent: "#67d8d3",
      fit: "cover",
      hasAudio: false,
      synopsis:
        "A colour and lighting study set in a tiled pool space. Cold tile, warm daylight and small accents of pink and cyan do most of the work.",
      description: [
        "Chlorine was made as a colour exercise: balancing a limited palette, keeping the whites from flattening, and watching how daylight moves across tile and water.",
        "The camera stays quiet and lets the space carry the image, from the pool to the corridors around it."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Blender" },
        { label: "Format", value: "Sequence" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "bloom-study",
      title: "BLOOM STUDY",
      titleLines: ["BLOOM", "STUDY"],
      category: "Blender Process Study",
      context: "Reference note",
      year: "2026",
      duration: "00' 17\"",
      roles: ["Reference", "Process"],
      video: "assets/videos/bloom-study.mp4",
      backgroundVideo: "assets/videos/backgrounds/bloom-study-bg.mp4",
      poster: "assets/images/posters/bloom-study.jpg",
      accent: "#e6dcc9",
      fit: "cover",
      hasAudio: false,
      synopsis:
        "A short process note made alongside a 3D exercise: a flowering branch, a laptop and the model in progress.",
      description: [
        "Bloom Study records the gap between a physical object and its digital version, without trying to resolve it. The branch sits across the keyboard, still covered in small white flowers.",
        "The edit stays close to the desk — a mouse, a bottle, a tangle of cables — so the digital work remains part of the room instead of replacing it."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Tool", value: "Blender" },
        { label: "Format", value: "Process clip" },
        { label: "Year", value: "2026" }
      ]
    },
    {
      slug: "the-device",
      title: "THE DEVICE",
      titleLines: ["THE", "DEVICE"],
      category: "PBR Study",
      context: "Modelling exercise",
      year: "2026",
      duration: "—",
      roles: ["PBR", "Materials"],
      video: null,
      backgroundVideo: null,
      poster: "assets/images/posters/device.jpg",
      accent: "#b9d84b",
      fit: "contain",
      hasAudio: false,
      synopsis:
        "A PBR material study of an olive-green object with chipped paint, worn metal and a wooden handle.",
      description: [
        "The exercise focuses on layered wear and how roughness changes across different surfaces: metal, painted metal, wood and the small printed marks on the casing.",
        "Two views of the same object, lit simply, keep the attention on surface response rather than narrative."
      ],
      notes: [
        { label: "Type", value: "Second-year practice" },
        { label: "Format", value: "Stills" },
        { label: "Year", value: "2026" }
      ],
      stills: [
        "assets/images/stills/device-01.jpg",
        "assets/images/stills/device-02.jpg"
      ]
    }
  ]
};
