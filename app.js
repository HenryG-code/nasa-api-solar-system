const NASA_APOD_ENDPOINT = "https://api.nasa.gov/planetary/apod";
const NASA_LIBRARY_ENDPOINT = "https://images-api.nasa.gov/search";
const DEFAULT_API_KEY = "DEMO_KEY";
const API_STORAGE_KEY = "universe-atlas:nasa-api-key";
const GALLERY_PAGE_SIZE = 12;
const LIBRARY_PAGE_SIZE = 100;

// Iconic NASA archive images used for the hero backdrop and as the spotlight
// when the APOD API is down or rate limited. Each has a JPEG original of
// 3,400px+ so it stays sharp full-screen on 4K and retina displays.
const SPOTLIGHT_FALLBACKS = [
  "PIA03515", // All Pillars Point to Eta (Carina Nebula)
  "PIA23647", // Tarantula Nebula, Spitzer 3-color
  "PIA03606", // Most Detailed Image of the Crab Nebula
  "PIA14415", // A New View of the Tarantula Nebula
  "PIA09178", // Comets Kick up Dust in Helix Nebula
];

// Images that are on-topic but usually less striking: diagrams, renders, slides.
const GENERIC_PENALTY_TERMS = [
  "illustration",
  "artist's concept",
  "artist concept",
  "artist's rendering",
  "animation",
  "diagram",
  "chart",
  "graph",
  "infographic",
  "poster",
  "logo",
  "model",
  "spacecraft",
  "map",
  "estimated",
  "simulated",
  "simulation",
  "plot",
  "dosage",
  "history of",
];

const GENERIC_EXCLUDED_TERMS = [
  "astronaut",
  "spacesuit",
  "crew",
  "launch",
  "rocket",
  "booster",
  "press conference",
  "training",
  "technician",
  "control room",
  "capsule",
  "space station",
  "mission patch",
  "countdown",
  "kennedy space center",
  "ksc",
  "payload",
  "clean room",
];

const nodeDefinitions = [
  {
    id: "mercury",
    title: "Mercury",
    kicker: "Sun-scorched world",
    queries: ["Mercury MESSENGER", "Mercury planet"],
    description: "Scorched cliffs and shadowed craters closest to the Sun.",
    au: 0.39,
    size: 12,
    color: "#b8ac97",
    preferredTerms: ["mercury", "planet", "surface", "mosaic", "crater", "global", "messenger"],
    excludedTerms: ["mercury program", "mercury-redstone", "mercury-atlas", "freedom 7", "friendship 7"],
  },
  {
    id: "venus",
    title: "Venus",
    kicker: "Cloud-shrouded",
    queries: ["Venus planet", "Venus Magellan"],
    description: "Sulfur clouds conceal a volcanic world glowing with trapped heat.",
    au: 0.72,
    size: 16,
    color: "#d7be93",
    atmosphere: "#ffe2a8",
    preferredTerms: ["venus", "planet", "cloud", "global", "hemisphere", "ultraviolet", "magellan", "radar"],
    excludedTerms: ["transit"],
  },
  {
    id: "earth",
    title: "Earth",
    kicker: "Blue marble",
    queries: ["blue marble", "Earth from space", "Earth globe"],
    description: "Our ocean world with weather bands, auroras, and the blue marble view.",
    au: 1,
    size: 17,
    color: "#4fbfff",
    atmosphere: "#7cc4ff",
    preferredTerms: ["earth", "blue marble", "planet", "globe", "clouds", "aurora"],
    excludedTerms: ["iss", "international space station", "spacesuit", "spacewalk"],
  },
  {
    id: "moon",
    title: "Moon",
    kicker: "Lunar world",
    queries: ["full moon", "Moon lunar"],
    description: "Lunar maria, crater rims, and the silver quiet of our nearest world.",
    parentId: "earth",
    distance: "Earth's moon",
    size: 7,
    color: "#d7d8d6",
    preferredTerms: ["moon", "lunar", "surface", "mosaic", "crater", "orbit"],
    excludedTerms: ["apollo", "astronaut", "lander", "flag", "footprint", "rover"],
  },
  {
    id: "mars",
    title: "Mars",
    kicker: "Red planet",
    queries: ["Mars global", "Mars Hubble", "Mars planet"],
    description: "Rust-red deserts, canyon walls, and dust plains stretching across ancient ground.",
    au: 1.52,
    size: 14,
    color: "#d9714d",
    preferredTerms: ["mars", "planet", "global", "hubble", "hemisphere", "full disk", "color", "valles marineris", "olympus mons"],
    excludedTerms: [
      "rover",
      "curiosity",
      "perseverance",
      "opportunity",
      "spirit",
      "ingenuity",
      "lander",
      "self-portrait",
      "mastcam",
      "wheel",
      "drill",
    ],
  },
  {
    id: "jupiter",
    title: "Jupiter",
    kicker: "Gas giant",
    queries: ["Jupiter Juno", "Jupiter planet"],
    description: "The striped giant of storms, lightning, and immense polar cyclones.",
    au: 5.2,
    size: 38,
    color: "#d8ab87",
    preferredTerms: ["jupiter", "planet", "storm", "great red spot", "cloud", "global"],
  },
  {
    id: "saturn",
    title: "Saturn",
    kicker: "Ringed world",
    queries: ["Saturn Cassini", "Saturn rings"],
    description: "Rings, storms, and golden cloud belts spread across the outer system.",
    au: 9.58,
    size: 30,
    color: "#d8c690",
    hasRings: true,
    preferredTerms: ["saturn", "planet", "rings", "cloud", "global", "cassini"],
  },
  {
    id: "uranus",
    title: "Uranus",
    kicker: "Tilted ice giant",
    queries: ["Uranus Voyager", "Uranus planet"],
    description: "A pale cyan world rolling on its side, wrapped in methane haze and faint rings.",
    au: 19.2,
    size: 22,
    color: "#9fe3e6",
    atmosphere: "#bff3f5",
    preferredTerms: ["uranus", "planet", "voyager", "rings", "ice giant", "methane"],
  },
  {
    id: "neptune",
    title: "Neptune",
    kicker: "Ice giant",
    queries: ["Neptune Voyager", "Neptune"],
    description: "Blue high-speed winds roll at the edge of the known planetary family.",
    au: 30.05,
    size: 22,
    color: "#6e9fff",
    atmosphere: "#7aa8ff",
    preferredTerms: ["neptune", "planet", "blue", "storm", "global", "voyager"],
  },
  {
    id: "orion",
    title: "Orion Nebula",
    kicker: "Deep sky",
    queries: ["Orion Nebula", "Orion Nebula Hubble"],
    description: "A luminous stellar nursery far beyond the planets, alive with newborn stars.",
    corner: [-1, -1],
    distance: "1,344 light-years",
    size: 12,
    color: "#8fe9ff",
    realm: "deep",
    preferredTerms: ["orion nebula", "nebula", "hubble", "stars", "gas", "dust"],
    requiredTerms: ["orion nebula", "m42", "m43"],
  },
  {
    id: "pillars",
    title: "Pillars of Creation",
    kicker: "Deep sky",
    queries: ["Pillars of Creation", "Eagle Nebula"],
    description: "Towering columns of dust and gas sculpted by radiation in the Eagle Nebula.",
    corner: [1, -1],
    distance: "6,500 light-years",
    size: 12,
    color: "#ffe0aa",
    realm: "deep",
    preferredTerms: ["pillars of creation", "eagle nebula", "nebula", "dust", "stars"],
    requiredTerms: ["pillars", "eagle nebula", "m16"],
  },
  {
    id: "andromeda",
    title: "Andromeda Galaxy",
    kicker: "Deep sky",
    queries: ["Andromeda galaxy", "Andromeda", "M31"],
    description: "A spiral galaxy of billions of stars glowing beyond the edge of our solar neighborhood.",
    corner: [1, 1],
    distance: "2.5M light-years",
    size: 12,
    color: "#adc3ff",
    realm: "deep",
    preferredTerms: ["andromeda", "galaxy", "spiral", "stars", "deep space"],
    requiredTerms: ["andromeda", "m31"],
  },
];

const state = {
  apiKey: readStoredApiKey(),
  selectedNode: nodeDefinitions.find((node) => node.id === "mars") || nodeDefinitions[0],
  // Gallery: every relevant item fetched so far (sorted), how many are on
  // screen, and the next NASA page to request for each query.
  galleryItems: [],
  galleryShown: 0,
  galleryCursors: [],
  gallerySeenIds: new Set(),
  galleryLoading: false,
  galleryRequestId: 0,
  dialogIndex: -1,
  hoverNodeId: null,
  mapSafe: null,
  animationTime: 0,
  labelLayouts: new Map(),
  solarLayout: null,
};

const elements = {
  apiKeyForm: document.querySelector("#apiKeyForm"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  apodMedia: document.querySelector("#apodMedia"),
  apodEyebrow: document.querySelector("#apodEyebrow"),
  apodMeta: document.querySelector("#apodMeta"),
  apodTitle: document.querySelector("#apodTitle"),
  heroBackdrop: document.querySelector("#heroBackdrop"),
  heroVideo: document.querySelector("#heroVideo"),
  livePillText: document.querySelector("#livePillText"),
  navIssValue: document.querySelector("#navIssValue"),
  canvasFrame: document.querySelector(".canvas-frame"),
  zoomOutButton: document.querySelector("#zoomOutButton"),
  selectionFacts: document.querySelector("#selectionFacts"),
  soundToggle: document.querySelector("#soundToggle"),
  soundLabel: document.querySelector("#soundLabel"),
  fullscreenToggle: document.querySelector("#fullscreenToggle"),
  fullscreenLabel: document.querySelector("#fullscreenLabel"),
  issUpdated: document.querySelector("#issUpdated"),
  issLat: document.querySelector("#issLat"),
  issLon: document.querySelector("#issLon"),
  issAlt: document.querySelector("#issAlt"),
  issSpeed: document.querySelector("#issSpeed"),
  issSun: document.querySelector("#issSun"),
  issOrbits: document.querySelector("#issOrbits"),
  heroCredit: document.querySelector("#heroCredit"),
  siteNav: document.querySelector("#siteNav"),
  destinationRail: document.querySelector("#destinationRail"),
  selectionKicker: document.querySelector("#selectionKicker"),
  galleryTitle: document.querySelector("#galleryTitle"),
  loadMoreButton: document.querySelector("#loadMoreButton"),
  dialogMeta: document.querySelector("#dialogMeta"),
  dialogPrev: document.querySelector("#dialogPrev"),
  dialogNext: document.querySelector("#dialogNext"),
  apodDescription: document.querySelector("#apodDescription"),
  apodLink: document.querySelector("#apodLink"),
  surpriseButton: document.querySelector("#surpriseButton"),
  selectionTitle: document.querySelector("#selectionTitle"),
  selectionDescription: document.querySelector("#selectionDescription"),
  statusPill: document.querySelector("#statusPill"),
  resultCount: document.querySelector("#resultCount"),
  galleryGrid: document.querySelector("#galleryGrid"),
  mapOverlay: document.querySelector("#mapOverlay"),
  mapNodes: [],
  solarReference: document.querySelector("#solarReference"),
  starfield: document.querySelector("#starfield"),
  imageDialog: document.querySelector("#imageDialog"),
  dialogClose: document.querySelector("#dialogClose"),
  dialogImage: document.querySelector("#dialogImage"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogDescription: document.querySelector("#dialogDescription"),
  dialogLink: document.querySelector("#dialogLink"),
};

const starState = {
  animationFrame: 0,
  stars: [],
  asteroidBelt: [],
  kuiperBelt: [],
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  width: 0,
  height: 0,
};

elements.apiKeyInput.value = state.apiKey === DEFAULT_API_KEY ? "" : state.apiKey;

function readStoredApiKey() {
  try {
    return localStorage.getItem(API_STORAGE_KEY) || DEFAULT_API_KEY;
  } catch {
    return DEFAULT_API_KEY;
  }
}

function writeStoredApiKey(value) {
  try {
    if (value === DEFAULT_API_KEY) {
      localStorage.removeItem(API_STORAGE_KEY);
    } else {
      localStorage.setItem(API_STORAGE_KEY, value);
    }
  } catch {
    // Storage can be blocked (private mode); the key still applies this visit.
  }
}

function initializeDestinationRail() {
  elements.destinationRail.innerHTML = nodeDefinitions
    .map((node, index) => {
      const divider =
        node.realm === "deep" && nodeDefinitions[index - 1]?.realm !== "deep"
          ? '<span class="rail-divider" aria-hidden="true"></span>'
          : "";

      return `${divider}<button class="rail-chip" type="button" data-node-id="${node.id}" aria-pressed="false" style="--chip-color:${node.color}">${planetOrder(node) ? `<span class="rail-order">${planetOrder(node)}</span>` : ""}${escapeHtml(node.title)}</button>`;
    })
    .join("");

  elements.destinationRail.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-node-id]");
    const node = chip && nodeDefinitions.find((entry) => entry.id === chip.dataset.nodeId);

    if (node) {
      selectNode(node);
    }
  });
}

function initializeNav() {
  const update = () => {
    elements.siteNav.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initializeMapNodes() {
  renderMapNodes();
  window.addEventListener("resize", () => syncMapLayout(state.animationTime));
}

function renderMapNodes() {
  elements.mapOverlay.innerHTML = nodeDefinitions
    .map((node) => {
      const activeClass = node.id === state.selectedNode.id ? " is-active" : "";
      const ringClass = node.hasRings ? " map-node--ringed" : "";
      const deepClass = node.realm === "deep" ? " map-node--deep-space" : "";
      // Planets and the Moon use cropped NASA photos (assets/planets).
      const textured = node.realm !== "deep";
      // Saturn is a transparent PNG so its rings sit cleanly over the Sun's glow.
      const ext = node.hasRings ? "png" : "jpg";
      const textureClass = textured ? " map-node--textured" : "";
      const textureStyle = textured
        ? `--texture:url(./assets/planets/${node.id}.${ext});--texture-hi:url(./assets/planets/${node.id}-hi.${ext});`
        : "";
      const atmosphereStyle = node.atmosphere ? `--atmo:${hexToRgba(node.atmosphere, 0.55)};` : "";
      const order = planetOrder(node);

      return `
        <button
          class="map-node${activeClass}${ringClass}${deepClass}${textureClass}"
          data-node-id="${node.id}"
          type="button"
          style="
            --planet-size:${node.size}px;
            --planet-color:${node.color};
            --planet-glow:${hexToRgba(node.color, 0.5)};
            ${textureStyle}${atmosphereStyle}
          "
          aria-label="${escapeAttribute(`${node.title}, ${labelText(node).detail}`)}"
        >
          <span class="map-node__body" aria-hidden="true"></span>
          <span class="map-node__label" aria-hidden="true">
            <strong>${order ? `<span class="map-node__order">${order}</span> ` : ""}<span class="map-node__name">${escapeHtml(node.title)}</span></strong>
            <small>${escapeHtml(labelText(node).detail)}</small>
          </span>
        </button>
      `;
    })
    .join("");

  elements.mapNodes = Array.from(elements.mapOverlay.querySelectorAll(".map-node"));

  elements.mapNodes.forEach((mapNode) => {
    mapNode.addEventListener("click", () => {
      const selectedNode = nodeDefinitions.find(
        (definition) => definition.id === mapNode.dataset.nodeId,
      );

      if (!selectedNode) {
        return;
      }

      selectNode(selectedNode);
    });

    const hover = (id) => () => {
      state.hoverNodeId = id;
    };

    mapNode.addEventListener("pointerenter", hover(mapNode.dataset.nodeId));
    mapNode.addEventListener("pointerleave", hover(null));
    mapNode.addEventListener("focus", hover(mapNode.dataset.nodeId));
    mapNode.addEventListener("blur", hover(null));
  });

  syncMapLayout();
}

/* ---------- Camera: click a planet to zoom in ---------- */

// The camera maps world positions (the overview layout) to the screen:
//   screen = anchor + (world - pivot) * zoom
// Zooming in pivots on the chosen planet: during the move the planet travels
// in a straight line to its final spot while the zoom eases in logarithmically,
// so nothing swoops. Once there, the pivot is the planet's live position, so
// the camera tracks it exactly as it orbits.
const ZOOM_DURATION_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 1100;
const LABEL_ZOOM_THRESHOLD = 1.6;
const DETAIL_SIZE_PX = 56;

function identityCamera() {
  return { ax: 0, ay: 0, fx: 0, fy: 0, k: 1 };
}

state.camera = {
  targetId: null,
  from: identityCamera(),
  current: identityCamera(),
  progress: 1,
  lastTime: null,
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function isZoomable(node) {
  return Boolean(node) && node.realm !== "deep";
}

function zoomTo(nodeId) {
  const camera = state.camera;

  if (camera.targetId === nodeId && camera.progress >= 1) {
    return;
  }

  camera.from = { ...camera.current };
  camera.targetId = nodeId;
  camera.progress = 0;
  syncZoomUI();
}

function zoomOut() {
  if (!state.camera.targetId) {
    return;
  }

  state.camera.from = { ...state.camera.current };
  state.camera.targetId = null;
  state.camera.progress = 0;
  state.hoverNodeId = null;
  syncZoomUI();
}

function syncZoomUI() {
  const zoomed = Boolean(state.camera.targetId);
  elements.canvasFrame.classList.toggle("is-zoomed", zoomed);
  elements.zoomOutButton.hidden = !zoomed;
}

function planetScaleFactor(width) {
  return width <= 720 ? 0.72 : width <= 1100 ? 0.86 : 1;
}

// How large the chosen body should appear once zoomed in.
function zoomScaleFor(node, layout, width, height) {
  const mobileSpace = ((state.mapSafe || {}).hudTop || height - 200) - 170;
  const desired = layout.mobile
    ? Math.max(90, Math.min(width * 0.5, mobileSpace * 0.8))
    : Math.min(height * 0.36, width * 0.26, 300);
  const shown = node.size * planetScaleFactor(width);
  // Saturn's photo includes its rings; size the planet itself, not the rings.
  return Math.max(1, desired / (node.hasRings ? shown * 1.25 : shown));
}

function applyCamera(layout, width, height, time) {
  const camera = state.camera;
  const dt = camera.lastTime == null ? 16 : clamp(time - camera.lastTime, 0, 100);
  camera.lastTime = time;
  camera.progress = Math.min(1, camera.progress + dt / ZOOM_DURATION_MS);

  const target = camera.targetId ? layout.nodes.get(camera.targetId) : null;
  const pivot = target ? { x: target.x, y: target.y } : { x: layout.sun.x, y: layout.sun.y };
  // Zoomed in, the planet sits in the clear space: on phones between the Back
  // button and the selection card; on wider screens right of centre.
  const safe = state.mapSafe || {};
  const anchor = target
    ? layout.mobile
      ? { x: width / 2, y: (150 + (safe.hudTop || height - 200) - 12) / 2 }
      : { x: width * 0.6, y: (layout.top + layout.bottom) / 2 }
    : pivot;
  const targetZoom = target ? zoomScaleFor(target, layout, width, height) : 1;
  const from = camera.from;
  const eased = easeInOutCubic(camera.progress);

  // Where the pivot sits on screen under the starting camera.
  const startX = from.ax + (pivot.x - from.fx) * from.k;
  const startY = from.ay + (pivot.y - from.fy) * from.k;
  const zoom = Math.exp(Math.log(from.k) + (Math.log(targetZoom) - Math.log(from.k)) * eased);

  camera.current = {
    ax: startX + (anchor.x - startX) * eased,
    ay: startY + (anchor.y - startY) * eased,
    fx: pivot.x,
    fy: pivot.y,
    k: zoom,
  };

  const { ax, ay, fx, fy, k } = camera.current;
  const factor = planetScaleFactor(width);
  const toScreenX = (x) => ax + (x - fx) * k;
  const toScreenY = (y) => ay + (y - fy) * k;

  layout.sun = { x: toScreenX(layout.sun.x), y: toScreenY(layout.sun.y) };
  layout.nodes.forEach((node) => {
    node.x = toScreenX(node.x);
    node.y = toScreenY(node.y);
    node.orbitX *= k;
    node.orbitY *= k;
    node.size *= factor * k;
  });
  layout.zoom = k;
}

function initializeZoomControls() {
  elements.zoomOutButton.addEventListener("click", zoomOut);

  // Clicking empty space on the map zooms back out.
  elements.mapOverlay.addEventListener("click", (event) => {
    if (event.target === elements.mapOverlay) {
      zoomOut();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.imageDialog.open) {
      zoomOut();
    }
  });
}

/* ---------- Planet facts ---------- */

const KM_PER_AU = 149.6e6;

const NODE_FACTS = {
  mercury: [["Diameter", "4,879 km"], ["Day", "176 Earth days"], ["Year", "88 Earth days"]],
  venus: [["Diameter", "12,104 km"], ["Day", "117 Earth days"], ["Year", "225 Earth days"]],
  earth: [["Diameter", "12,742 km"], ["Day", "24 hours"], ["Year", "365 days"]],
  moon: [["Diameter", "3,475 km"], ["From Earth", "384,400 km"], ["Orbit", "27.3 days"]],
  mars: [["Diameter", "6,779 km"], ["Day", "24 h 40 min"], ["Year", "687 Earth days"]],
  jupiter: [["Diameter", "139,820 km"], ["Day", "9 h 56 min"], ["Year", "11.9 Earth years"]],
  saturn: [["Diameter", "116,460 km"], ["Day", "10 h 33 min"], ["Year", "29.4 Earth years"]],
  uranus: [["Diameter", "50,724 km"], ["Day", "17 h 14 min"], ["Year", "84 Earth years"]],
  neptune: [["Diameter", "49,244 km"], ["Day", "16 h 6 min"], ["Year", "165 Earth years"]],
  orion: [["Type", "Star-forming nebula"]],
  pillars: [["Type", "Columns of gas and dust"]],
  andromeda: [["Type", "Spiral galaxy"]],
};

function nodeFacts(node) {
  const facts = [];

  if (node.au) {
    facts.push(["From the Sun", `${node.au.toFixed(2)} AU · ${Math.round((node.au * KM_PER_AU) / 1e6).toLocaleString()}M km`]);
  } else if (node.realm === "deep") {
    facts.push(["Distance", node.distance]);
  }

  return facts.concat(NODE_FACTS[node.id] || []);
}

function renderNodeFacts(node) {
  elements.selectionFacts.innerHTML = nodeFacts(node)
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

/* ---------- Orrery layout ---------- */

// Orbit radii blend even steps with sqrt(real distance): the inner planets
// cluster near the Sun and the outer ones spread out, as in reality, while
// every ring stays readable. Periods follow Kepler's third law (T ~ a^1.5),
// softened so the outer planets still visibly move.
const ORRERY = {
  innerAu: 0.39,
  outerAu: 30.05,
  evenWeight: 0.42,
  innerPeriodMs: 28000,
  periodExponent: 1.05,
  moonPeriodMs: 7000,
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const planetDefinitions = nodeDefinitions.filter((node) => !node.parentId && node.realm !== "deep");

function planetOrder(node) {
  const index = planetDefinitions.indexOf(node);
  return index < 0 ? "" : String(index + 1).padStart(2, "0");
}

// Space reserved above (heading) and below (selection card) the orbits,
// measured from the overlay elements so the rings never sit under text.
function measureMapSafeArea() {
  const frame = elements.mapOverlay.getBoundingClientRect();
  // offsetTop/offsetHeight ignore the heading's fade-out transform, so a
  // measurement taken while zoomed in matches the overview layout.
  const heading = document.querySelector(".map-top");
  const hud = document.querySelector(".map-hud")?.getBoundingClientRect();

  state.mapSafe = {
    top: heading ? heading.offsetTop + heading.offsetHeight + 28 : 160,
    bottom: hud ? frame.bottom - hud.top + 20 : 160,
    hudTop: measureHudTop(frame),
  };
}

// Where the selection card starts, for placing a zoomed-in planet.
function measureHudTop(frame = elements.mapOverlay.getBoundingClientRect()) {
  const hud = document.querySelector(".map-hud")?.getBoundingClientRect();
  return hud ? hud.top - frame.top : frame.height - 160;
}

function syncMapLayout(time = 0) {
  const frame = elements.mapOverlay.getBoundingClientRect();

  if (!frame.width || !frame.height) {
    return;
  }

  if (!state.mapSafe || state.mapSafeWidth !== frame.width || state.mapSafeHeight !== frame.height) {
    measureMapSafeArea();
    state.mapSafeWidth = frame.width;
    state.mapSafeHeight = frame.height;
    applyPlanetScale(frame.width);
  } else if (state.hudChanged) {
    state.mapSafe.hudTop = measureHudTop(frame);
    // A taller card than any so far: grow the reserved space once. Shorter
    // cards never shrink it, so switching selections doesn't move the orbits.
    state.mapSafe.bottom = Math.max(state.mapSafe.bottom, frame.height - state.mapSafe.hudTop + 20);
  }

  state.hudChanged = false;

  const layout = computeSolarLayout(frame.width, frame.height, time);
  applyCamera(layout, frame.width, frame.height, time);
  state.solarLayout = layout;
  elements.canvasFrame.style.setProperty("--zoom", layout.zoom.toFixed(4));
  const labelLayouts = computeLabelLayout(layout, frame.width, frame.height);
  state.labelLayouts = labelLayouts;

  elements.solarReference.style.setProperty("--sun-x", `${layout.sun.x}px`);
  elements.solarReference.style.setProperty("--sun-y", `${layout.sun.y}px`);

  elements.mapNodes.forEach((mapNode) => {
    const layoutNode = layout.nodes.get(mapNode.dataset.nodeId);

    if (!layoutNode) {
      return;
    }

    mapNode.style.left = `${layoutNode.x}px`;
    mapNode.style.top = `${layoutNode.y}px`;
    mapNode.style.setProperty("--depth-scale", layoutNode.scale.toFixed(3));
    mapNode.classList.toggle("is-detailed", layoutNode.size > DETAIL_SIZE_PX);

    // Light each body from the Sun: the shading layer centres its bright
    // side on the direction of the Sun, so planets show phases as they orbit.
    if (!layoutNode.realm) {
      const dx = layout.sun.x - layoutNode.x;
      const dy = layout.sun.y - layoutNode.y;
      const distance = Math.hypot(dx, dy) || 1;
      mapNode.style.setProperty("--lx", `${(50 + (dx / distance) * 34).toFixed(1)}%`);
      mapNode.style.setProperty("--ly", `${(50 + (dy / distance) * 34).toFixed(1)}%`);
    }

    const labelLayout = labelLayouts.get(mapNode.dataset.nodeId);

    if (labelLayout) {
      mapNode.classList.toggle("is-label-hidden", Boolean(labelLayout.hidden));
      mapNode.style.setProperty("--label-x", `${labelLayout.dx}px`);
      mapNode.style.setProperty("--label-y", `${labelLayout.dy}px`);
      mapNode.style.setProperty("--label-width", `${labelLayout.width}px`);
    }
  });
}

// Planets shrink a little on small screens so the inner orbits stay clear.
function applyPlanetScale(width) {
  const factor = planetScaleFactor(width);

  elements.mapNodes.forEach((mapNode) => {
    const node = nodeDefinitions.find((entry) => entry.id === mapNode.dataset.nodeId);
    mapNode.style.setProperty("--planet-size", `${Math.round(node.size * factor)}px`);
  });
}

function computeSolarLayout(width, height, time = 0) {
  const mobile = width <= 720;
  const safe = state.mapSafe || { top: 160, bottom: 160 };
  const top = safe.top;
  const bottom = height - safe.bottom;
  const sun = { x: width / 2, y: (top + bottom) / 2 };
  const maxRx = width / 2 - (mobile ? 20 : 72);
  const maxRy = Math.max(80, (bottom - top) / 2);
  // A three-quarter overhead view where there is room; flatter screens get
  // a lower angle, tall phones look almost straight down.
  const tilt = clamp(maxRy / maxRx, mobile ? 0.62 : 0.4, 0.92);
  const outerRx = Math.min(maxRx, maxRy / tilt);
  const innerRx = mobile ? 40 : Math.max(64, outerRx * 0.11);
  const auSpan = Math.sqrt(ORRERY.outerAu) - Math.sqrt(ORRERY.innerAu);
  const nodes = new Map();

  planetDefinitions.forEach((node, index) => {
    const even = index / (planetDefinitions.length - 1);
    const real = (Math.sqrt(node.au) - Math.sqrt(ORRERY.innerAu)) / auSpan;
    const fraction = ORRERY.evenWeight * even + (1 - ORRERY.evenWeight) * real;
    const orbitX = innerRx + fraction * (outerRx - innerRx);
    const orbitY = orbitX * tilt;
    const period = ORRERY.innerPeriodMs * (node.au / ORRERY.innerAu) ** ORRERY.periodExponent;
    // Counter-clockwise as seen from above the Sun's north pole.
    const angle = index * GOLDEN_ANGLE + 0.9 - (time / period) * Math.PI * 2;
    const depth = Math.sin(angle); // +1 = nearest the viewer

    nodes.set(node.id, {
      ...node,
      x: sun.x + Math.cos(angle) * orbitX,
      y: sun.y + Math.sin(angle) * orbitY,
      orbitX,
      orbitY,
      angle,
      depth,
      scale: 0.88 + 0.12 * ((depth + 1) / 2),
    });
  });

  const earth = nodes.get("earth");
  const mars = nodes.get("mars");

  nodeDefinitions.forEach((node) => {
    if (node.parentId && earth) {
      const gap = mars ? mars.orbitX - earth.orbitX : 30;
      const orbitX = clamp(gap * 0.32, 9, 18);
      const angle = 1.2 - (time / ORRERY.moonPeriodMs) * Math.PI * 2;

      nodes.set(node.id, {
        ...node,
        x: earth.x + Math.cos(angle) * orbitX,
        y: earth.y + Math.sin(angle) * orbitX * tilt,
        orbitX,
        orbitY: orbitX * tilt,
        angle,
        depth: earth.depth,
        scale: earth.scale,
      });
    }

    if (node.realm === "deep") {
      const [cx, cy] = node.corner;
      const outerRy = outerRx * tilt;

      nodes.set(node.id, {
        ...node,
        x: clamp(sun.x + cx * outerRx * 0.97, 28, width - 28),
        y: clamp(sun.y + cy * outerRy * 0.97, top + 10, bottom - 10),
        orbitX: 0,
        orbitY: 0,
        depth: 0,
        scale: 1,
      });
    }
  });

  return { sun, nodes, tilt, top, bottom, mobile };
}

/* ---------- Labels ---------- */

function labelText(node) {
  const order = planetOrder(node);

  return {
    title: order ? `${order} ${node.title}` : node.title,
    detail: node.au ? `${node.au.toFixed(2)} AU` : node.distance || node.kicker,
  };
}

// Phones show just the order number beside each planet (the full name
// appears on the selected one) so twelve labels never crowd the view.
function labelSize(node, mobile, active) {
  const text = labelText(node);
  const compact = mobile && !active;

  if (compact) {
    return { width: planetOrder(node) ? 30 : Math.ceil(node.title.length * 6.4) + 16, height: 22 };
  }

  return {
    width: Math.ceil(Math.max(text.title.length * 8.3, text.detail.length * 6.6)) + 24,
    height: 38,
  };
}

function computeLabelLayout(layout, width, height) {
  const padding = layout.mobile ? 8 : 16;
  const labelLayouts = new Map();
  const placedRects = [];
  const planets = Array.from(layout.nodes.values()).map((node) => ({
    id: node.id,
    parentId: node.parentId,
    x: node.x,
    y: node.y,
    radius: Math.max(node.size * 0.6, 7),
  }));
  const sunRadius = layout.mobile ? 34 : 52;
  const focusId = state.hoverNodeId || state.selectedNode.id;

  // Place the selected label first so it always gets its best spot.
  const ordered = [...nodeDefinitions].sort(
    (first, second) =>
      Number(second.id === state.selectedNode.id) - Number(first.id === state.selectedNode.id),
  );

  ordered.forEach((nodeDefinition) => {
    const node = layout.nodes.get(nodeDefinition.id);

    if (!node) {
      return;
    }

    const active = node.id === state.selectedNode.id;

    if (layout.zoom > LABEL_ZOOM_THRESHOLD && node.id !== state.camera.targetId) {
      labelLayouts.set(node.id, { dx: 0, dy: 0, width: 0, hidden: true });
      return;
    }

    // A moon sits right beside its planet; label it only when in focus.
    if (node.parentId && node.id !== focusId) {
      labelLayouts.set(node.id, { dx: 0, dy: 0, width: 0, hidden: true });
      return;
    }

    const { width: labelWidth, height: labelHeight } = labelSize(node, layout.mobile, active);
    const previousLabelLayout = state.labelLayouts.get(node.id);
    const candidates = buildLabelCandidates(node, labelWidth, labelHeight, layout.mobile ? 6 : 10);
    let bestCandidate = null;

    candidates.forEach((candidate, index) => {
      const rawRect = {
        x: node.x + candidate.dx,
        y: node.y + candidate.dy,
        width: labelWidth,
        height: labelHeight,
      };
      const rect = {
        x: clamp(rawRect.x, padding, width - labelWidth - padding),
        y: clamp(rawRect.y, layout.top - 16, layout.bottom - labelHeight + 16),
        width: labelWidth,
        height: labelHeight,
      };
      const score = measureLabelScore({
        rect,
        node,
        planets,
        placedRects,
        previousRect:
          previousLabelLayout && previousLabelLayout.width === labelWidth
            ? {
                x: node.x + previousLabelLayout.dx,
                y: node.y + previousLabelLayout.dy,
                width: labelWidth,
                height: labelHeight,
              }
            : null,
        sun: { x: layout.sun.x, y: layout.sun.y, radius: sunRadius },
        preferredRect: rawRect,
        candidateIndex: index,
      });

      if (!bestCandidate || score < bestCandidate.score) {
        bestCandidate = { rect, score };
      }
    });

    placedRects.push({ ...bestCandidate.rect, id: node.id });
    labelLayouts.set(node.id, {
      dx: bestCandidate.rect.x - node.x,
      dy: bestCandidate.rect.y - node.y,
      width: labelWidth,
    });
  });

  return labelLayouts;
}

// Saturn's photo includes its rings, about 2.4 times wider than the planet.
const RING_WIDTH_RATIO = 2.37;

function buildLabelCandidates(node, labelWidth, labelHeight, gap) {
  const radius = (node.size * (node.scale || 1)) / 2;
  const halfWidth = node.hasRings ? radius * RING_WIDTH_RATIO : radius;
  const side = halfWidth + gap;
  const vertical = radius + gap * 0.5;

  return dedupeCandidates([
    { dx: side, dy: -labelHeight / 2 },
    { dx: -labelWidth - side, dy: -labelHeight / 2 },
    { dx: side * 0.6, dy: -labelHeight - vertical },
    { dx: side * 0.6, dy: vertical },
    { dx: -labelWidth - side * 0.6, dy: -labelHeight - vertical },
    { dx: -labelWidth - side * 0.6, dy: vertical },
    { dx: -labelWidth / 2, dy: -labelHeight - vertical },
    { dx: -labelWidth / 2, dy: vertical },
  ]);
}

function dedupeCandidates(candidates) {
  const seen = new Set();

  return candidates.filter((candidate) => {
    const key = `${Math.round(candidate.dx)}:${Math.round(candidate.dy)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function measureLabelScore({
  rect,
  node,
  planets,
  placedRects,
  previousRect,
  sun,
  preferredRect,
  candidateIndex,
}) {
  let score = candidateIndex * 5;
  score += Math.abs(rect.x - preferredRect.x) * 0.8;
  score += Math.abs(rect.y - preferredRect.y) * 0.8;

  if (previousRect) {
    score += Math.abs(rect.x - previousRect.x) * 1.2;
    score += Math.abs(rect.y - previousRect.y) * 1.2;
  }

  placedRects.forEach((placedRect) => {
    const overlap = rectOverlapArea(rect, placedRect);

    if (overlap > 0) {
      score += 5000 + overlap * 4;
    }
  });

  planets.forEach((planet) => {
    // A planet and its own moon never push each other's labels around.
    if (planet.id === node.id || planet.parentId === node.id || planet.id === node.parentId) {
      return;
    }

    if (circleIntersectsRect(planet, rect, 10)) {
      score += 3000;
    }
  });

  if (circleIntersectsRect(sun, rect, 32)) {
    score += 6500;
  }

  return score;
}

function rectOverlapArea(first, second) {
  const width = Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x),
  );
  const height = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y),
  );

  return width * height;
}

function circleIntersectsRect(circle, rect, padding = 0) {
  const nearestX = clamp(circle.x, rect.x - padding, rect.x + rect.width + padding);
  const nearestY = clamp(circle.y, rect.y - padding, rect.y + rect.height + padding);
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;

  return dx * dx + dy * dy < circle.radius * circle.radius;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, ratio) {
  return start + (end - start) * ratio;
}

function initializeApiKeyForm() {
  elements.apiKeyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nextKey = elements.apiKeyInput.value.trim() || DEFAULT_API_KEY;

    state.apiKey = nextKey;
    writeStoredApiKey(nextKey);

    setStatus("Refreshing NASA spotlight...");
    await loadApod();
    setStatus(`Locked onto ${state.selectedNode.title}`);
  });
}

function initializeDialog() {
  elements.dialogClose.addEventListener("click", closeDialog);
  elements.dialogPrev.addEventListener("click", () => stepDialog(-1));
  elements.dialogNext.addEventListener("click", () => stepDialog(1));

  elements.imageDialog.addEventListener("click", (event) => {
    if (event.target === elements.imageDialog) {
      closeDialog();
    }
  });

  elements.imageDialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      stepDialog(-1);
    } else if (event.key === "ArrowRight") {
      stepDialog(1);
    }
  });
}

function initializeSurpriseButton() {
  elements.surpriseButton.addEventListener("click", () => {
    const options = nodeDefinitions.filter((node) => node.id !== state.selectedNode.id);
    selectNode(options[Math.floor(Math.random() * options.length)]);
  });
}

function initializeLoadMore() {
  elements.loadMoreButton.addEventListener("click", () => showMoreGallery());
}

function setStatus(message) {
  elements.statusPill.textContent = message;
}

function setSelectedNodeUI(node) {
  state.selectedNode = node;
  elements.selectionKicker.textContent = node.kicker;
  elements.selectionTitle.textContent = node.title;
  elements.selectionDescription.textContent = node.description;
  elements.galleryTitle.textContent = `Photos of ${node.title}`;
  renderNodeFacts(node);
  // The card may have changed height: re-measure only where it starts, so the
  // overview orbits never jump when the selection changes.
  state.hudChanged = true;

  elements.mapNodes.forEach((mapNode) => {
    mapNode.classList.toggle("is-active", mapNode.dataset.nodeId === node.id);
  });

  elements.destinationRail.querySelectorAll("[data-node-id]").forEach((chip) => {
    const active = chip.dataset.nodeId === node.id;
    chip.setAttribute("aria-pressed", String(active));

    if (active) {
      // Scroll only the rail horizontally; scrollIntoView would also move the page.
      const rail = elements.destinationRail;
      const chipLeft = chip.offsetLeft - rail.offsetLeft;
      const chipRight = chipLeft + chip.offsetWidth;

      if (chipLeft < rail.scrollLeft || chipRight > rail.scrollLeft + rail.clientWidth) {
        rail.scrollTo({ left: chipLeft - 16, behavior: "smooth" });
      }
    }
  });
}

async function selectNode(node) {
  if (!node) {
    return;
  }

  setSelectedNodeUI(node);

  if (isZoomable(node)) {
    zoomTo(node.id);
  } else {
    zoomOut();
  }

  setStatus(`Scanning NASA archives for ${node.title}...`);
  await loadGallery(node);
}

/* ---------- Spotlight (APOD with archive fallback) ---------- */

async function loadApod() {
  const url = new URL(NASA_APOD_ENDPOINT);
  url.searchParams.set("api_key", state.apiKey);
  url.searchParams.set("thumbs", "true");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`APOD request failed: ${response.status}`);
    }

    renderApod(await response.json());
  } catch (error) {
    console.warn(error);
    await loadFallbackSpotlight();
  }
}

function renderApod(apod) {
  const title = apod.title || "Astronomy Picture of the Day";
  const mediaUrl = safeHttpUrl(apod.url);
  const previewUrl = apod.media_type === "video" ? safeHttpUrl(apod.thumbnail_url) : mediaUrl;
  const hdUrl = apod.media_type === "image" ? safeHttpUrl(apod.hdurl) : "";
  // APOD's standard image is ~1000px wide; big or high-DPI screens need the HD one.
  const needsHd = (minDevicePixels) =>
    Boolean(hdUrl) && window.innerWidth * window.devicePixelRatio > minDevicePixels;

  elements.apodEyebrow.textContent = "Astronomy Picture of the Day";
  elements.apodMeta.textContent = [formatDate(apod.date), apod.copyright && `© ${apod.copyright.trim()}`]
    .filter(Boolean)
    .join(" · ");
  elements.apodTitle.textContent = title;
  elements.apodDescription.textContent =
    apod.explanation || "NASA did not return a description for this daily feature.";
  elements.apodLink.href =
    safeHttpUrl(apod.hdurl) || mediaUrl || "https://apod.nasa.gov/apod/astropix.html";
  elements.apodLink.textContent = "Open full NASA feature";

  if (apod.media_type === "video" && mediaUrl) {
    elements.apodMedia.innerHTML = `<iframe src="${escapeAttribute(mediaUrl)}" title="${escapeAttribute(
      title,
    )}" allow="fullscreen" loading="lazy"></iframe>`;
  } else if (previewUrl) {
    const panelUrl = needsHd(1100) ? hdUrl : previewUrl;
    elements.apodMedia.innerHTML = `<img src="${escapeAttribute(panelUrl)}" alt="${escapeAttribute(title)}" />`;
  } else {
    elements.apodMedia.innerHTML =
      '<div class="media-placeholder"><span>NASA returned this feature without preview media.</span></div>';
  }

  if (previewUrl) {
    setHeroBackdrop(needsHd(1000) ? hdUrl : previewUrl, `Backdrop: ${title} (NASA APOD)`);
  } else {
    loadFallbackSpotlight({ backdropOnly: true });
  }
}

async function loadFallbackSpotlight({ backdropOnly = false } = {}) {
  const dayOfYear = Math.floor(
    (Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000,
  );
  const nasaId = SPOTLIGHT_FALLBACKS[dayOfYear % SPOTLIGHT_FALLBACKS.length];

  try {
    const url = new URL(NASA_LIBRARY_ENDPOINT);
    url.searchParams.set("nasa_id", nasaId);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA library request failed: ${response.status}`);
    }

    const payload = await response.json();
    const item = payload.collection?.items?.[0];
    const metadata = item?.data?.[0];
    const images = pickImageRenditions(item?.links || [], HERO_LIMITS);

    if (!metadata || !images) {
      throw new Error("Spotlight fallback returned no image");
    }

    const title = metadata.title || "From the NASA archive";
    setHeroBackdrop(images, `Backdrop: ${title} (NASA)`);

    if (backdropOnly) {
      return;
    }

    elements.apodEyebrow.textContent = "Archive spotlight";
    elements.apodMeta.textContent = [formatDate(metadata.date_created), metadata.center]
      .filter(Boolean)
      .join(" · ");
    elements.apodTitle.textContent = title;
    elements.apodDescription.textContent = truncateCopy(
      stripHtml(metadata.description || metadata.description_508 || ""),
      620,
    );
    elements.apodMedia.innerHTML = imageMarkup(
      images,
      `(max-width: 1024px) ${coverSize("calc(100vw - 32px)", 360, images.aspect)}, ${coverSize("715px", 670, images.aspect)}`,
      title,
    );
    elements.apodLink.href = `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`;
    elements.apodLink.textContent = "View in NASA Library";
  } catch (error) {
    console.error(error);

    if (backdropOnly) {
      return;
    }

    elements.apodTitle.textContent = "NASA spotlight unavailable right now";
    elements.apodDescription.textContent =
      "The daily spotlight could not be loaded. The atlas and archive below still work, and a personal NASA API key often helps.";
    elements.apodMedia.innerHTML =
      '<div class="media-placeholder"><span>Spotlight could not be loaded.</span></div>';
    elements.apodLink.href = "https://api.nasa.gov/";
    elements.apodLink.textContent = "Get a free NASA API key";
  }
}

// Accepts either a rendition set (archive images) or a plain URL (APOD).
function setHeroBackdrop(source, credit) {
  const image = elements.heroBackdrop;

  image.onload = () => {
    image.classList.add("is-loaded");

    if (!liveStream.playing) {
      elements.heroCredit.textContent = credit;
    }
  };

  if (typeof source === "string") {
    image.removeAttribute("srcset");
    image.src = source;
    return;
  }

  if (source.srcset) {
    image.sizes = coverSize("100vw", Math.min(window.innerHeight, 980), source.aspect);
    image.srcset = source.srcset;
  }

  image.src = source.src;
}

/* ---------- Gallery ---------- */

async function loadGallery(node) {
  const requestId = ++state.galleryRequestId;

  state.galleryItems = [];
  state.galleryShown = 0;
  state.gallerySeenIds = new Set();
  state.galleryCursors = getNodeQueries(node).map((query) => ({ query, page: 1, done: false }));
  elements.resultCount.textContent = "Loading images";
  renderGallerySkeleton();

  try {
    await fetchMoreLibraryItems(node, requestId);

    if (requestId !== state.galleryRequestId) {
      return;
    }

    state.galleryShown = Math.min(GALLERY_PAGE_SIZE, state.galleryItems.length);
    arrangeForLayout(0, state.galleryShown);
    renderGallery();
    setStatus(`Locked onto ${node.title}`);
  } catch (error) {
    if (requestId !== state.galleryRequestId) {
      return;
    }

    state.galleryItems = [];
    state.galleryShown = 0;
    renderGallery(
      "NASA's image library did not respond for this destination. Try another destination or reload the page.",
    );
    setStatus("NASA archive request failed");
    console.error(error);
  }
}

async function showMoreGallery() {
  const node = state.selectedNode;
  const requestId = state.galleryRequestId;

  if (state.galleryLoading) {
    return;
  }

  state.galleryLoading = true;
  elements.loadMoreButton.disabled = true;
  elements.loadMoreButton.textContent = "Loading...";

  try {
    if (state.galleryItems.length - state.galleryShown < GALLERY_PAGE_SIZE) {
      await fetchMoreLibraryItems(node, requestId);
    }

    if (requestId !== state.galleryRequestId) {
      return;
    }

    const previous = state.galleryShown;
    state.galleryShown = Math.min(previous + GALLERY_PAGE_SIZE, state.galleryItems.length);
    arrangeForLayout(previous, state.galleryShown);
    renderGallery(undefined, previous);
  } catch (error) {
    console.error(error);
  } finally {
    state.galleryLoading = false;
    elements.loadMoreButton.disabled = false;
    elements.loadMoreButton.textContent = "Load more images";
  }
}

// Fetch the next NASA page for every query that still has results, then
// merge in new relevant items. Already-shown items keep their order; only the
// not-yet-shown tail is re-sorted by relevance.
async function fetchMoreLibraryItems(node, requestId) {
  const cursors = state.galleryCursors.filter((cursor) => !cursor.done);

  if (!cursors.length) {
    return;
  }

  const results = await Promise.allSettled(
    cursors.map(async (cursor) => {
      const url = new URL(NASA_LIBRARY_ENDPOINT);
      url.searchParams.set("q", cursor.query);
      url.searchParams.set("media_type", "image");
      url.searchParams.set("page_size", String(LIBRARY_PAGE_SIZE));
      url.searchParams.set("page", String(cursor.page));

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`NASA library request failed: ${response.status}`);
      }

      const payload = await response.json();
      const collection = payload.collection || {};
      cursor.page += 1;
      cursor.done =
        !(collection.links || []).some((link) => link.rel === "next") ||
        cursor.page > 10; // NASA caps deep paging; 10 pages is plenty

      return collection.items || [];
    }),
  );

  if (requestId !== state.galleryRequestId) {
    return;
  }

  const fulfilled = results.filter((result) => result.status === "fulfilled");

  if (!fulfilled.length) {
    cursors.forEach((cursor) => {
      cursor.done = true;
    });
    throw results[0].reason;
  }

  // NASA often lists the same picture under several IDs, so also dedupe by title.
  const freshItems = [];

  fulfilled
    .flatMap((result) => result.value)
    .map((item) => normalizeLibraryItem(item, node))
    .forEach((item) => {
      const titleKey = `title:${item?.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}`;

      if (!item || state.gallerySeenIds.has(item.id) || state.gallerySeenIds.has(titleKey)) {
        return;
      }

      state.gallerySeenIds.add(item.id);
      state.gallerySeenIds.add(titleKey);
      freshItems.push(item);
    });

  const shown = state.galleryItems.slice(0, state.galleryShown);
  const pending = state.galleryItems
    .slice(state.galleryShown)
    .concat(freshItems)
    .sort((first, second) => second.score - first.score);

  state.galleryItems = shown.concat(pending);
}

function getNodeQueries(node) {
  return node.queries || [node.query || node.title];
}

function hasMoreGallery() {
  return (
    state.galleryShown < state.galleryItems.length ||
    state.galleryCursors.some((cursor) => !cursor.done)
  );
}

function normalizeLibraryItem(item, node) {
  const metadata = item.data?.[0];
  const images = pickImageRenditions(item.links || []);

  if (!metadata || !images) {
    return null;
  }

  // Too small to look good anywhere in the layout.
  if (images.maxWidth && images.maxWidth < MIN_USABLE_WIDTH) {
    return null;
  }

  const nasaId = metadata.nasa_id;
  const rawDescription = stripHtml(metadata.description || metadata.description_508 || "");
  const keywords = Array.isArray(metadata.keywords) ? metadata.keywords.join(" ") : "";
  const searchableText = [
    metadata.title,
    rawDescription,
    keywords,
    metadata.location,
    metadata.photographer,
    metadata.secondary_creator,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (includesAnyTerm(searchableText, GENERIC_EXCLUDED_TERMS)) {
    return null;
  }

  if (includesAnyTerm(searchableText, node.excludedTerms || [])) {
    return null;
  }

  // Must actually be about this destination, not just mention a keyword.
  const titleAndKeywords = `${metadata.title || ""} ${keywords}`.toLowerCase();
  const requiredTerms = node.requiredTerms || (node.preferredTerms || []).slice(0, 1);

  if (requiredTerms.length && !includesAnyTerm(searchableText, requiredTerms)) {
    return null;
  }

  let score = 0;
  score += countTermMatches(searchableText, node.preferredTerms || []) * 8;
  score += includesAnyTerm(titleAndKeywords, requiredTerms) ? 12 : 0;
  score -= countTermMatches(searchableText, GENERIC_PENALTY_TERMS) * 10;
  score += images.maxWidth >= 1600 ? 8 : images.maxWidth >= 1200 ? 4 : -10;

  return {
    id: nasaId || images.src,
    title: metadata.title || "Untitled NASA image",
    description:
      truncateCopy(rawDescription, 900) || "No description was included with this NASA archive image.",
    meta: [formatYear(metadata.date_created), metadata.center].filter(Boolean).join(" · "),
    images,
    imageUrl: images.src,
    fullImageUrl: images.full,
    maxWidth: images.maxWidth,
    libraryUrl: nasaId
      ? `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`
      : "https://images.nasa.gov/",
    score,
  };
}

// NASA lists several renditions per asset (~thumb, ~small, ~medium, ~large,
// ~orig), each with its pixel width and file size. Build a srcset from every
// web-friendly rendition so the browser picks one sharp enough for the
// screen's size and pixel density.
const MAX_SRCSET_BYTES = 3.5 * 1024 * 1024;
const MAX_PNG_BYTES = 1.5 * 1024 * 1024;
const MIN_USABLE_WIDTH = 640;

// Hero-sized images may use bigger files; srcset still serves phones small ones.
const HERO_LIMITS = { maxBytes: 8 * 1024 * 1024, maxPngBytes: 6 * 1024 * 1024 };

function pickImageRenditions(links, { maxBytes = MAX_SRCSET_BYTES, maxPngBytes = MAX_PNG_BYTES } = {}) {
  const imageLinks = links.filter((link) => link.render === "image" && link.href);

  if (!imageLinks.length) {
    return null;
  }

  const byWidth = new Map();

  imageLinks.forEach((link) => {
    const href = link.href;
    const lower = href.toLowerCase();
    const width = Number(link.width) || 0;
    const height = Number(link.height) || 0;
    const size = Number(link.size) || 0;
    const isPng = lower.endsWith(".png");
    const webFriendly =
      /\.(jpe?g|png|webp)$/.test(lower) &&
      width > 0 &&
      size > 0 &&
      size <= (isPng ? maxPngBytes : maxBytes);

    // thumb and small are often the same file; keep the first per width.
    if (webFriendly && !byWidth.has(width)) {
      byWidth.set(width, { url: href, width, height });
    }
  });

  const candidates = [...byWidth.values()].sort((first, second) => first.width - second.width);

  if (!candidates.length) {
    // Very old records lack width data; fall back to the named renditions.
    const byVariant = (variant) =>
      imageLinks.find((link) => link.href.toLowerCase().includes(`~${variant}.`))?.href;
    const url = byVariant("large") || byVariant("medium") || imageLinks[0].href;

    return { srcset: "", src: url, full: url, maxWidth: 0, aspect: 1.5 };
  }

  const largest = candidates[candidates.length - 1];
  // Default src for browsers without srcset support: a mid-size rendition.
  const mid = candidates.find((candidate) => candidate.width >= 1000) || largest;

  return {
    srcset: candidates.map((candidate) => `${candidate.url} ${candidate.width}w`).join(", "),
    src: mid.url,
    full: largest.url,
    maxWidth: largest.width,
    aspect: largest.height ? largest.width / largest.height : 1.5,
  };
}

// An object-fit: cover image must be at least as wide as its box AND tall
// enough to fill it, so the width the browser should fetch is
// max(box width, box height x image aspect ratio).
function coverSize(boxWidth, boxHeight, aspect) {
  return `max(${boxWidth}, ${Math.round(boxHeight * aspect)}px)`;
}

// Gallery tile boxes per layout slot (see .gallery-card rules in styles.css).
function gallerySizes(index, aspect) {
  const slot = index % 12;
  const desktop =
    slot === 0
      ? coverSize("825px", 690, aspect)
      : slot === 1
        ? coverSize("404px", 690, aspect)
        : [5, 6, 10, 11].includes(slot)
          ? coverSize("614px", 455, aspect)
          : coverSize("404px", 455, aspect);
  const tablet =
    slot === 0
      ? coverSize("calc(100vw - 32px)", 455, aspect)
      : coverSize("calc(50vw - 23px)", 455, aspect);
  const mobile = coverSize("calc(100vw - 32px)", 260, aspect);

  return `(max-width: 720px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop}`;
}

// The two big tiles at the start of each 12-image block need high-resolution
// sources; swap a sharper not-yet-shown image into those slots when needed.
const SLOT_MIN_WIDTH = { 0: 1600, 1: 1200 };

function arrangeForLayout(from, to) {
  const items = state.galleryItems;

  for (let index = from; index < to; index += 1) {
    const required = SLOT_MIN_WIDTH[index % 12];

    if (!required || items[index].maxWidth >= required) {
      continue;
    }

    const swapIndex = items.findIndex(
      (item, candidateIndex) => candidateIndex > index && item.maxWidth >= required,
    );

    if (swapIndex > -1) {
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
  }
}

function imageMarkup(images, sizes, alt, extra = "") {
  const srcset = images.srcset
    ? ` srcset="${escapeAttribute(images.srcset)}" sizes="${sizes}"`
    : "";
  return `<img src="${escapeAttribute(images.src)}"${srcset} alt="${escapeAttribute(alt)}"${extra} />`;
}

function renderGallerySkeleton() {
  elements.loadMoreButton.hidden = true;
  elements.galleryGrid.setAttribute("aria-busy", "true");
  elements.galleryGrid.innerHTML = Array.from(
    { length: 6 },
    () => '<div class="gallery-skeleton" aria-hidden="true"></div>',
  ).join("");
}

function renderGallery(message, appendFrom = 0) {
  elements.galleryGrid.removeAttribute("aria-busy");
  elements.loadMoreButton.hidden = !hasMoreGallery();
  elements.resultCount.textContent = `${state.galleryShown} image${state.galleryShown === 1 ? "" : "s"}`;

  if (!state.galleryShown) {
    elements.loadMoreButton.hidden = true;
    elements.galleryGrid.innerHTML = `<div class="gallery-empty">${escapeHtml(
      message || "No images matched this destination yet.",
    )}</div>`;
    return;
  }

  const markup = state.galleryItems
    .slice(appendFrom, state.galleryShown)
    .map((item, offset) => {
      const index = appendFrom + offset;

      return `
        <article class="gallery-card" style="animation-delay:${offset * 60}ms">
          <button type="button" data-gallery-index="${index}" aria-label="${escapeAttribute(item.title)}">
            ${imageMarkup(item.images, gallerySizes(index, item.images.aspect), "", ' loading="lazy" decoding="async"')}
          </button>
          <div class="gallery-copy">
            ${item.meta ? `<p class="meta-line">${escapeHtml(item.meta)}</p>` : ""}
            <h3>${escapeHtml(item.title)}</h3>
          </div>
        </article>
      `;
    })
    .join("");

  if (appendFrom === 0) {
    elements.galleryGrid.innerHTML = markup;
  } else {
    elements.galleryGrid.insertAdjacentHTML("beforeend", markup);
  }
}

function initializeGalleryClicks() {
  elements.galleryGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-index]");

    if (button) {
      openDialog(Number(button.dataset.galleryIndex));
    }
  });
}

/* ---------- Dialog ---------- */

function openDialog(index) {
  const item = state.galleryItems[index];

  if (!item) {
    return;
  }

  state.dialogIndex = index;
  const cardImage = elements.galleryGrid.querySelector(`[data-gallery-index="${index}"] img`);
  elements.dialogImage.removeAttribute("srcset");
  elements.dialogImage.src = cardImage?.currentSrc || item.imageUrl;
  elements.dialogImage.alt = item.title;

  // Show the already-cached card image instantly, then swap in the larger one.
  if (item.fullImageUrl !== elements.dialogImage.src) {
    const fullImage = new Image();
    fullImage.onload = () => {
      if (state.dialogIndex === index) {
        elements.dialogImage.src = item.fullImageUrl;
      }
    };
    fullImage.src = item.fullImageUrl;
  }

  elements.dialogTitle.textContent = item.title;
  elements.dialogMeta.textContent = item.meta;
  elements.dialogDescription.textContent = item.description;
  elements.dialogLink.href = item.libraryUrl;
  elements.dialogPrev.disabled = index <= 0;
  elements.dialogNext.disabled = index >= state.galleryShown - 1;

  if (!elements.imageDialog.open) {
    if (typeof elements.imageDialog.showModal === "function") {
      elements.imageDialog.showModal();
    } else {
      elements.imageDialog.setAttribute("open", "open");
    }
  }
}

function stepDialog(direction) {
  const nextIndex = state.dialogIndex + direction;

  if (nextIndex >= 0 && nextIndex < state.galleryShown) {
    openDialog(nextIndex);
  }
}

function closeDialog() {
  state.dialogIndex = -1;

  if (typeof elements.imageDialog.close === "function") {
    elements.imageDialog.close();
    return;
  }

  elements.imageDialog.removeAttribute("open");
}

/* ---------- Helpers ---------- */

function safeHttpUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function formatYear(value) {
  const year = value ? new Date(value).getUTCFullYear() : NaN;
  return Number.isNaN(year) ? "" : String(year);
}

function stripHtml(text) {
  const parsed = new DOMParser().parseFromString(text, "text/html");
  return (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
}

function truncateCopy(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(text) {
  return escapeHtml(text);
}

// Whole-word matching, so e.g. "iss" no longer matches inside "mission".
const termPatternCache = new Map();

function termPattern(term) {
  const key = term.toLowerCase();

  if (!termPatternCache.has(key)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    termPatternCache.set(key, new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`));
  }

  return termPatternCache.get(key);
}

function includesAnyTerm(text, terms) {
  return terms.some((term) => termPattern(term).test(text));
}

function countTermMatches(text, terms) {
  return terms.reduce((count, term) => (termPattern(term).test(text) ? count + 1 : count), 0);
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const chunkSize = normalized.length === 3 ? 1 : 2;
  const values = normalized.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
  const [r, g, b] = values.map((value) => {
    const channel = chunkSize === 1 ? `${value}${value}` : value;
    return Number.parseInt(channel, 16);
  });

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function initializeStarfield() {
  const context = elements.starfield.getContext("2d");

  if (!context) {
    return;
  }

  function resize() {
    const frame = elements.starfield.getBoundingClientRect();
    starState.width = frame.width;
    starState.height = frame.height;

    elements.starfield.width = frame.width * starState.dpr;
    elements.starfield.height = frame.height * starState.dpr;
    context.setTransform(starState.dpr, 0, 0, starState.dpr, 0, 0);

    const starCount = Math.max(720, Math.floor((frame.width * frame.height) / 1300));
    starState.stars = createStarField(frame.width, frame.height, starCount);
    starState.asteroidBelt = Array.from({ length: 240 }, () => createAsteroid());
    starState.kuiperBelt = Array.from({ length: 200 }, () => createKuiperObject());
    state.mapSafe = null;
    syncMapLayout(state.animationTime);
  }

  function render(time = 0) {
    state.animationTime = time;
    syncMapLayout(time);
    context.clearRect(0, 0, starState.width, starState.height);

    starState.stars.forEach((star) => {
      const driftX = Math.sin(time * star.twinkleSpeed + star.phase) * star.drift;
      const driftY =
        Math.cos(time * star.twinkleSpeed * 0.6 + star.phase) * star.drift * 0.38;
      const alpha =
        star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.2;

      context.beginPath();
      context.fillStyle = star.tint(alpha);
      context.arc(star.x + driftX, star.y + driftY, star.radius, 0, Math.PI * 2);
      context.fill();
    });

    drawSolarSystemGuides(context, time);
    starState.animationFrame = window.requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize);
  render();
}

function createStarField(width, height, count) {
  const aspectRatio = width / Math.max(height, 1);
  const columns = Math.max(1, Math.round(Math.sqrt(count * aspectRatio)));
  const rows = Math.max(1, Math.ceil(count / columns));
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const stars = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (stars.length >= count) {
        break;
      }

      stars.push(
        createStar(
          column * cellWidth + Math.random() * cellWidth,
          row * cellHeight + Math.random() * cellHeight,
        ),
      );
    }
  }

  return stars;
}

function createStar(x, y) {
  const warm = Math.random() > 0.82;

  return {
    x,
    y,
    radius: Math.random() * 1.35 + 0.16,
    baseAlpha: Math.random() * 0.48 + 0.24,
    twinkleSpeed: Math.random() * 0.0017 + 0.0004,
    phase: Math.random() * Math.PI * 2,
    drift: Math.random() * 1.25 + 0.15,
    tint(alpha) {
      return warm
        ? `rgba(255, 228, 188, ${alpha})`
        : `rgba(222, 239, 255, ${alpha})`;
    },
  };
}

function createAsteroid() {
  return {
    angle: Math.random() * Math.PI * 2,
    band: Math.random(),
    size: Math.random() * 1.3 + 0.3,
    alpha: Math.random() * 0.35 + 0.12,
    speed: 0.6 + Math.random() * 0.5,
  };
}

function createKuiperObject() {
  return {
    angle: Math.random() * Math.PI * 2,
    band: Math.random(),
    size: Math.random() * 1 + 0.25,
    alpha: Math.random() * 0.16 + 0.05,
  };
}

function drawSolarSystemGuides(context, time) {
  const layout = state.solarLayout;

  if (!layout) {
    return;
  }

  drawOrbitRings(context, layout);
  drawBelt(context, layout, time);
  drawTrails(context, layout);
  drawMoonOrbit(context, layout);
}

function highlightedNodeId() {
  return state.hoverNodeId || state.selectedNode.id;
}

// Each ring is drawn faintly all round, then its near half again slightly
// brighter, which reads as depth. The selected or hovered orbit lights up.
function drawOrbitRings(context, layout) {
  const highlighted = highlightedNodeId();
  const highlightedParent = layout.nodes.get(highlighted)?.parentId;

  context.save();

  planetDefinitions.forEach((definition) => {
    const node = layout.nodes.get(definition.id);
    const active = node.id === highlighted || node.id === highlightedParent;

    context.lineWidth = active ? 1.4 : 1;
    context.strokeStyle = active ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.09)";
    context.beginPath();
    context.ellipse(layout.sun.x, layout.sun.y, node.orbitX, node.orbitY, 0, 0, Math.PI * 2);
    context.stroke();

    if (!active) {
      context.strokeStyle = "rgba(255, 255, 255, 0.07)";
      context.beginPath();
      context.ellipse(layout.sun.x, layout.sun.y, node.orbitX, node.orbitY, 0, 0, Math.PI);
      context.stroke();
    }
  });

  context.restore();
}

// A short fading arc behind each planet shows its direction of travel.
function drawTrails(context, layout) {
  const segments = 18;
  const length = 0.6;

  context.save();
  context.lineCap = "round";

  planetDefinitions.forEach((definition) => {
    const node = layout.nodes.get(definition.id);
    const rgb = hexToRgba(node.color, 1).slice(5, -4);
    const width = Math.max(1.4, Math.min(3, node.size * 0.16));

    for (let index = 0; index < segments; index += 1) {
      const start = node.angle + (index / segments) * length;
      const end = node.angle + ((index + 1) / segments) * length;
      const alpha = 0.55 * (1 - index / segments) ** 1.6;

      context.strokeStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
      context.lineWidth = width;
      context.beginPath();
      context.ellipse(layout.sun.x, layout.sun.y, node.orbitX, node.orbitY, 0, start, end);
      context.stroke();
    }
  });

  context.restore();
}

// Asteroid belt between Mars and Jupiter; Kuiper belt just past Neptune.
function drawBelt(context, layout, time) {
  const mars = layout.nodes.get("mars");
  const jupiter = layout.nodes.get("jupiter");
  const neptune = layout.nodes.get("neptune");

  context.save();

  if (mars && jupiter) {
    const inner = mars.orbitX + (jupiter.orbitX - mars.orbitX) * 0.3;
    const outer = mars.orbitX + (jupiter.orbitX - mars.orbitX) * 0.66;

    starState.asteroidBelt.forEach((asteroid) => {
      const radius = inner + (outer - inner) * asteroid.band;
      const angle = asteroid.angle - time * 0.000035 * asteroid.speed;

      context.fillStyle = `rgba(214, 196, 160, ${asteroid.alpha})`;
      context.beginPath();
      context.arc(
        layout.sun.x + Math.cos(angle) * radius,
        layout.sun.y + Math.sin(angle) * radius * layout.tilt,
        asteroid.size,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  }

  if (neptune) {
    starState.kuiperBelt.forEach((object) => {
      const radius = neptune.orbitX * (1.04 + object.band * 0.07);
      const angle = object.angle - time * 0.000004;

      context.fillStyle = `rgba(190, 210, 255, ${object.alpha})`;
      context.beginPath();
      context.arc(
        layout.sun.x + Math.cos(angle) * radius,
        layout.sun.y + Math.sin(angle) * radius * layout.tilt,
        object.size,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  }

  context.restore();
}

function drawMoonOrbit(context, layout) {
  const earth = layout.nodes.get("earth");
  const moon = layout.nodes.get("moon");

  if (!earth || !moon) {
    return;
  }

  context.save();
  context.strokeStyle = "rgba(255, 255, 255, 0.22)";
  context.lineWidth = 0.8;
  context.setLineDash([2, 3]);
  context.beginPath();
  context.ellipse(earth.x, earth.y, moon.orbitX, moon.orbitY, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

/* ---------- Live ISS stream (hero) ---------- */

// NASA's official "Live High-Definition Views from the International Space
// Station" stream, the same one the ISS HDEV page embeds.
const ISS_STREAM_ID = "ROboUHfPUrU";
const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";
const PLAYER_PLAYING = 1;
const PLAYER_ENDED = 0;

const liveStream = {
  iframe: null,
  playing: false,
  daylight: null,
  muted: true,
  inView: true,
};

function initializeLiveStream() {
  const hero = document.querySelector(".hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  liveStream.reducedMotion = reduceMotion;

  elements.soundToggle.addEventListener("click", toggleStreamSound);
  elements.fullscreenToggle.addEventListener("click", toggleHeroFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreenLabel);

  if (document.fullscreenEnabled) {
    elements.fullscreenToggle.hidden = false;
  }

  window.addEventListener("message", (event) => {
    if (!liveStream.iframe || event.source !== liveStream.iframe.contentWindow) {
      return;
    }

    let data;

    try {
      data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    const state =
      data?.event === "onStateChange" ? data.info : data?.info?.playerState;

    if (state === PLAYER_PLAYING && !liveStream.playing) {
      liveStream.playing = true;
      hero.classList.add("is-live");
      elements.soundToggle.hidden = false;
      elements.soundToggle.disabled = false;
      elements.soundToggle.setAttribute("aria-pressed", String(!liveStream.muted));
      elements.soundLabel.textContent = liveStream.muted ? "Sound on" : "Sound off";
      elements.heroCredit.textContent = "Live: NASA ISS HD Earth views";
      liveStream.awaitingRetry = false;
      renderLivePill();
    }

    // Broadcast ended or the player failed: fall back to the still image.
    // (Paused is not "stopped": the page pauses a muted stream off screen.)
    const failed = data?.event === "onError" || state === PLAYER_ENDED;

    if (failed && liveStream.playing) {
      liveStream.playing = false;
      hero.classList.remove("is-live");

      if (liveStream.reducedMotion) {
        // The button is this visitor's only control: turn it into a retry.
        liveStream.awaitingRetry = true;
        elements.soundLabel.textContent = "Play live";
        elements.soundToggle.setAttribute("aria-pressed", "false");
      } else {
        elements.soundToggle.hidden = true;
      }

      elements.heroCredit.textContent = "";
      renderLivePill();
    }
  });

  // Visitors who prefer reduced motion get a still image and a play button.
  if (reduceMotion) {
    elements.soundToggle.hidden = false;
    elements.soundLabel.textContent = "Play live";
    elements.soundToggle.addEventListener(
      "click",
      () => {
        mountStreamPlayer();
        elements.soundLabel.textContent = "Starting...";
        elements.soundToggle.disabled = true;
      },
      { once: true },
    );
    return;
  }

  mountStreamPlayer();

  // Save bandwidth and CPU: pause a muted stream while the hero is off screen.
  new IntersectionObserver(([entry]) => {
    liveStream.inView = entry.isIntersecting;

    if (!liveStream.muted) {
      return;
    }

    streamCommand(entry.isIntersecting ? "playVideo" : "pauseVideo");
  }, { threshold: 0.05 }).observe(hero);
}

function mountStreamPlayer() {
  if (liveStream.iframe) {
    return;
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    enablejsapi: "1",
    origin: window.location.origin,
  });
  const iframe = document.createElement("iframe");

  iframe.src = `${PLAYER_ORIGIN}/embed/${ISS_STREAM_ID}?${params}`;
  iframe.title = "NASA live view of Earth from the International Space Station";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.tabIndex = -1;
  iframe.addEventListener("load", () => {
    // Ask the player to send state events back to this page.
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
      PLAYER_ORIGIN,
    );
  });

  liveStream.iframe = iframe;
  elements.heroVideo.append(iframe);
}

function streamCommand(func, args = []) {
  liveStream.iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    PLAYER_ORIGIN,
  );
}

function toggleStreamSound() {
  if (!liveStream.iframe) {
    return;
  }

  if (liveStream.awaitingRetry) {
    liveStream.awaitingRetry = false;
    elements.soundLabel.textContent = "Starting...";
    elements.soundToggle.disabled = true;
    streamCommand("playVideo");
    return;
  }

  liveStream.muted = !liveStream.muted;

  if (liveStream.muted) {
    streamCommand("mute");

    if (!liveStream.inView) {
      streamCommand("pauseVideo");
    }
  } else {
    streamCommand("unMute");
    streamCommand("setVolume", [100]);
    streamCommand("playVideo");
  }

  elements.soundToggle.setAttribute("aria-pressed", String(!liveStream.muted));
  elements.soundLabel.textContent = liveStream.muted ? "Sound on" : "Sound off";
}

function toggleHeroFullscreen() {
  const hero = document.querySelector(".hero");

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    hero.requestFullscreen?.().catch(() => {});
  }
}

function syncFullscreenLabel() {
  elements.fullscreenLabel.textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen";
}

/* ---------- ISS tracker ---------- */

const ISS_API = "https://api.wheretheiss.at/v1/satellites/25544";
const ISS_POLL_MS = 5000;
const EARTH_RADIUS_KM = 6371;
const EARTH_MU = 398600.4418; // km^3/s^2

const issTracker = {
  timer: 0,
  visible: false,
  failures: 0,
};

const ESA_WIDGET_WIDTH = 625;

// ESA's widget sometimes stalls on its splash screen while it fetches orbit
// data. The page can't see inside it (another origin), so 30 s after the map
// comes into view it is reloaded once, in the background: a fresh copy loads
// invisibly behind the current one and is swapped in only after it loads.
const ESA_RELOAD_DELAY_MS = 30_000;
const ESA_SWAP_SETTLE_MS = 4_000;

function scheduleEsaMapReload(mapFrame) {
  if (issTracker.esaReloadScheduled) {
    return;
  }

  issTracker.esaReloadScheduled = true;
  window.setTimeout(() => reloadEsaMap(mapFrame), ESA_RELOAD_DELAY_MS);
}

function reloadEsaMap(mapFrame) {
  const current = mapFrame.querySelector("iframe");

  if (!current) {
    return;
  }

  const fresh = current.cloneNode(false);
  fresh.removeAttribute("loading");
  fresh.classList.add("is-preloading");
  fresh.setAttribute("aria-hidden", "true");
  fresh.tabIndex = -1;

  fresh.addEventListener(
    "load",
    () => {
      // Give the widget time to draw its map before swapping it in.
      window.setTimeout(() => {
        fresh.classList.remove("is-preloading");
        fresh.removeAttribute("aria-hidden");
        fresh.removeAttribute("tabindex");
        current.remove();
        mapFrame.dataset.reloaded = "true";
      }, ESA_SWAP_SETTLE_MS);
    },
    { once: true },
  );

  mapFrame.append(fresh);
}

function initializeIssTracker() {
  const section = document.querySelector("#iss");
  const mapFrame = section.querySelector(".iss-map");

  // ESA's widget has a fixed native size; shrink it to fit narrow screens.
  new ResizeObserver(([entry]) => {
    const scale = Math.min(1, entry.contentRect.width / ESA_WIDGET_WIDTH);
    mapFrame.style.setProperty("--iss-scale", String(scale));
  }).observe(mapFrame);

  refreshHeroDaylight();

  new IntersectionObserver(([entry]) => {
    issTracker.visible = entry.isIntersecting;
    scheduleIssPoll(0);

    if (entry.isIntersecting) {
      scheduleEsaMapReload(mapFrame);
    }
  }, { rootMargin: "200px" }).observe(section);

  document.addEventListener("visibilitychange", () => scheduleIssPoll(0));
}

function scheduleIssPoll(delay) {
  window.clearTimeout(issTracker.timer);

  // Only poll while the tracker is on screen and the tab is visible.
  if (!issTracker.visible || document.hidden) {
    return;
  }

  issTracker.timer = window.setTimeout(pollIss, delay);
}

async function pollIss() {
  try {
    const response = await fetch(ISS_API);

    if (!response.ok) {
      throw new Error(`ISS position request failed: ${response.status}`);
    }

    renderIss(await response.json());
    issTracker.failures = 0;
  } catch (error) {
    issTracker.failures += 1;
    elements.issUpdated.textContent = "Live position temporarily unavailable";
    console.warn(error);
  }

  // Back off when the API is struggling.
  scheduleIssPoll(ISS_POLL_MS * Math.min(2 ** issTracker.failures, 12));
}

function setNavIss(position) {
  const speed = Math.round(Number(position.velocity)).toLocaleString();
  elements.navIssValue.textContent = `${speed} km/h · ${Math.round(Number(position.altitude))} km`;
}

// On the night side the live feed is mostly dark. It is shown as-is (no
// blending); the label says "night side" so the darkness reads as intended.
function setHeroDaylight(isDaylight) {
  liveStream.daylight = isDaylight;
  document.querySelector(".hero").classList.toggle("is-night", !isDaylight);
  renderLivePill();
}

function renderLivePill() {
  const night = liveStream.daylight === false;

  if (!liveStream.playing) {
    elements.livePillText.textContent = night ? "From the ISS · night side" : "From the ISS";
    return;
  }

  elements.livePillText.textContent = night ? "Live from the ISS · night side" : "Live from the ISS";
}

async function refreshHeroDaylight() {
  if (!document.hidden && !issTracker.visible) {
    try {
      const response = await fetch(ISS_API);

      if (response.ok) {
        const position = await response.json();
        setHeroDaylight(position.visibility === "daylight");
        setNavIss(position);
      }
    } catch {
      // Non-essential; the hero simply keeps its current look.
    }
  }

  window.setTimeout(refreshHeroDaylight, 60000);
}

function renderIss(position) {
  const lat = Number(position.latitude);
  const lon = Number(position.longitude);
  const altitude = Number(position.altitude);
  const speed = Number(position.velocity);
  const radius = EARTH_RADIUS_KM + altitude;
  const periodSeconds = 2 * Math.PI * Math.sqrt(radius ** 3 / EARTH_MU);

  elements.issLat.textContent = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`;
  elements.issLon.textContent = `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
  elements.issAlt.textContent = `${Math.round(altitude)} km`;
  elements.issSpeed.textContent = `${Math.round(speed).toLocaleString()} km/h`;
  elements.issSun.textContent = position.visibility === "daylight" ? "Daylight" : "Earth's shadow";
  setHeroDaylight(position.visibility === "daylight");
  setNavIss(position);
  elements.issOrbits.textContent = (86400 / periodSeconds).toFixed(1);

  const time = new Date(Number(position.timestamp) * 1000);
  elements.issUpdated.textContent = `Updated ${time.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}`;
}

async function bootstrap() {
  initializeNav();
  initializeLiveStream();
  initializeIssTracker();
  initializeDestinationRail();
  initializeMapNodes();
  initializeZoomControls();
  initializeApiKeyForm();
  initializeDialog();
  initializeGalleryClicks();
  initializeLoadMore();
  initializeSurpriseButton();
  initializeStarfield();
  // The heading's height depends on the web font; measure again once it loads.
  document.fonts?.ready.then(() => {
    state.mapSafe = null;
  });
  setSelectedNodeUI(state.selectedNode);
  setStatus("Initializing NASA feed...");
  // Independent requests: load the spotlight and the gallery in parallel.
  await Promise.all([loadApod(), loadGallery(state.selectedNode)]);
}

bootstrap();
