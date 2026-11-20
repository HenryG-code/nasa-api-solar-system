const NASA_APOD_ENDPOINT = "https://api.nasa.gov/planetary/apod";
const NASA_LIBRARY_ENDPOINT = "https://images-api.nasa.gov/search";
const DEFAULT_API_KEY = "DEMO_KEY";
const API_STORAGE_KEY = "universe-atlas:nasa-api-key";
const GALLERY_PAGE_SIZE = 12;
const LIBRARY_PAGE_SIZE = 100;

// Iconic NASA archive images (all with large renditions) used for the hero
// backdrop and as the spotlight when the APOD API is down or rate limited.
const SPOTLIGHT_FALLBACKS = [
  "carina_nebula",
  "GSFC_20171208_Archive_e000842",
  "PIA03606",
  "GSFC_20171208_Archive_e001651",
  "southern_ring_nebula",
  "GSFC_20171208_Archive_e001935",
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

const SOLAR_SYSTEM_REFERENCE = {
  x: 0.5,
  y: 0.5,
  orbitTilt: 0.33,
};

const SOLAR_DISPLAY_ARC = {
  start: 186,
  end: -38,
  rotationSpeed: 0.0000032,
};

const MAP_LABEL_CONFIG = {
  desktop: {
    bottomSafeArea: 130,
    labelHeight: 56,
    labelWidth: 148,
    padding: 18,
  },
  mobile: {
    bottomSafeArea: 162,
    labelHeight: 50,
    labelWidth: 128,
    padding: 12,
  },
};

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
    orbit: 0.11,
    angle: -58,
    orbitSpeed: 0.00002,
    size: 14,
    color: "#b8ac97",
    labelDx: 18,
    labelDy: -72,
    preferredTerms: ["mercury", "planet", "surface", "mosaic", "crater", "global", "messenger"],
    excludedTerms: ["mercury program", "mercury-redstone", "mercury-atlas", "freedom 7", "friendship 7"],
  },
  {
    id: "venus",
    title: "Venus",
    kicker: "Cloud-shrouded",
    queries: ["Venus planet", "Venus Magellan"],
    description: "Sulfur clouds conceal a volcanic world glowing with trapped heat.",
    orbit: 0.17,
    angle: 20,
    orbitSpeed: 0.000014,
    size: 18,
    color: "#d7be93",
    labelDx: -156,
    labelDy: 10,
    preferredTerms: ["venus", "planet", "cloud", "global", "hemisphere", "ultraviolet", "magellan", "radar"],
    excludedTerms: ["transit"],
  },
  {
    id: "earth",
    title: "Earth",
    kicker: "Blue marble",
    queries: ["blue marble", "Earth from space", "Earth globe"],
    description: "Our ocean world with weather bands, auroras, and the blue marble view.",
    orbit: 0.24,
    angle: -12,
    orbitSpeed: 0.00001,
    size: 21,
    color: "#4fbfff",
    labelDx: 20,
    labelDy: -76,
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
    orbit: 0.024,
    angle: 54,
    orbitSpeed: 0.000055,
    size: 10,
    color: "#d7d8d6",
    labelDx: 16,
    labelDy: 18,
    preferredTerms: ["moon", "lunar", "surface", "mosaic", "crater", "orbit"],
    excludedTerms: ["apollo", "astronaut", "lander", "flag", "footprint", "rover"],
  },
  {
    id: "mars",
    title: "Mars",
    kicker: "Red planet",
    queries: ["Mars global", "Mars Hubble", "Mars planet"],
    description: "Rust-red deserts, canyon walls, and dust plains stretching across ancient ground.",
    orbit: 0.34,
    angle: 32,
    orbitSpeed: 0.000008,
    size: 17,
    color: "#d9714d",
    labelDx: 22,
    labelDy: 18,
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
    orbit: 0.49,
    angle: -30,
    orbitSpeed: 0.000004,
    size: 37,
    color: "#d8ab87",
    labelDx: 22,
    labelDy: -48,
    preferredTerms: ["jupiter", "planet", "storm", "great red spot", "cloud", "global"],
  },
  {
    id: "saturn",
    title: "Saturn",
    kicker: "Ringed world",
    queries: ["Saturn Cassini", "Saturn rings"],
    description: "Rings, storms, and golden cloud belts spread across the outer system.",
    orbit: 0.63,
    angle: 12,
    orbitSpeed: 0.0000027,
    size: 30,
    color: "#d8c690",
    labelDx: 28,
    labelDy: -46,
    hasRings: true,
    preferredTerms: ["saturn", "planet", "rings", "cloud", "global", "cassini"],
  },
  {
    id: "neptune",
    title: "Neptune",
    kicker: "Ice giant",
    queries: ["Neptune Voyager", "Neptune"],
    description: "Blue high-speed winds roll at the edge of the known planetary family.",
    orbit: 0.79,
    angle: -10,
    orbitSpeed: 0.0000015,
    size: 24,
    color: "#6e9fff",
    labelDx: -162,
    labelDy: -32,
    preferredTerms: ["neptune", "planet", "blue", "storm", "global", "voyager"],
  },
  {
    id: "orion",
    title: "Orion Nebula",
    kicker: "Deep sky",
    queries: ["Orion Nebula", "Orion Nebula Hubble"],
    description: "A luminous stellar nursery far beyond the planets, alive with newborn stars.",
    mapX: 0.34,
    mapY: 0.18,
    size: 16,
    color: "#8fe9ff",
    labelDx: -166,
    labelDy: -18,
    labelWidth: 164,
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
    mapX: 0.56,
    mapY: 0.12,
    size: 14,
    color: "#ffe0aa",
    labelDx: -86,
    labelDy: -78,
    labelWidth: 176,
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
    mapX: 0.82,
    mapY: 0.24,
    size: 15,
    color: "#adc3ff",
    labelDx: -178,
    labelDy: -24,
    labelWidth: 170,
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
  heroCredit: document.querySelector("#heroCredit"),
  siteNav: document.querySelector("#siteNav"),
  destinationRail: document.querySelector("#destinationRail"),
  statDestinations: document.querySelector("#statDestinations"),
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
  elements.statDestinations.textContent = String(nodeDefinitions.length);

  elements.destinationRail.innerHTML = nodeDefinitions
    .map((node, index) => {
      const divider =
        node.realm === "deep" && nodeDefinitions[index - 1]?.realm !== "deep"
          ? '<span class="rail-divider" aria-hidden="true"></span>'
          : "";

      return `${divider}<button class="rail-chip" type="button" data-node-id="${node.id}" aria-pressed="false" style="--chip-color:${node.color}">${escapeHtml(node.title)}</button>`;
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

      return `
        <button
          class="map-node${activeClass}${ringClass}${deepClass}"
          data-node-id="${node.id}"
          type="button"
          style="
            --planet-size:${node.size}px;
            --planet-color:${node.color};
            --planet-glow:${hexToRgba(node.color, 0.52)};
            --label-x:${node.labelDx}px;
            --label-y:${node.labelDy}px;
            --label-width:${node.labelWidth || MAP_LABEL_CONFIG.desktop.labelWidth}px;
          "
        >
          <span class="map-node__body" aria-hidden="true"></span>
          <span class="map-node__label">
            <strong>${escapeHtml(node.title)}</strong>
            <small>${escapeHtml(node.kicker)}</small>
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
  });

  syncMapLayout();
}

function syncMapLayout(time = 0) {
  const frame = elements.mapOverlay.getBoundingClientRect();

  if (!frame.width || !frame.height) {
    return;
  }

  const layout = computeSolarLayout(frame.width, frame.height, time);
  state.solarLayout = layout;
  const labelLayouts = computeLabelLayout(layout, frame.width, frame.height);
  state.labelLayouts = labelLayouts;

  if (elements.solarReference) {
    elements.solarReference.style.setProperty("--sun-x", `${layout.sun.x}px`);
    elements.solarReference.style.setProperty("--sun-y", `${layout.sun.y}px`);
  }

  elements.mapNodes.forEach((mapNode) => {
    const layoutNode = layout.nodes.get(mapNode.dataset.nodeId);

    if (!layoutNode) {
      return;
    }

    mapNode.style.left = `${layoutNode.x}px`;
    mapNode.style.top = `${layoutNode.y}px`;

    const labelLayout = labelLayouts.get(mapNode.dataset.nodeId);

    if (labelLayout) {
      mapNode.style.setProperty("--label-x", `${labelLayout.dx}px`);
      mapNode.style.setProperty("--label-y", `${labelLayout.dy}px`);
      mapNode.style.setProperty("--label-width", `${labelLayout.width}px`);
    }
  });
}

function computeSolarLayout(width, height, time = 0) {
  const mobile = width <= 720;
  const primaryNodes = nodeDefinitions.filter((node) => !node.parentId && node.realm !== "deep");
  const sun = {
    x: width * SOLAR_SYSTEM_REFERENCE.x,
    y: height * SOLAR_SYSTEM_REFERENCE.y,
  };
  const horizontalPadding = mobile ? 58 : 120;
  const topPadding = mobile ? 96 : 88;
  const bottomPadding = mobile ? 210 : 176;
  const outerOrbitX = Math.min(
    sun.x - horizontalPadding,
    width - sun.x - horizontalPadding,
    (sun.y - topPadding) / SOLAR_SYSTEM_REFERENCE.orbitTilt,
    (height - sun.y - bottomPadding) / SOLAR_SYSTEM_REFERENCE.orbitTilt,
  );
  const innerOrbitX = Math.max(mobile ? 58 : 92, outerOrbitX * (mobile ? 0.29 : 0.26));
  const orbitSpan = Math.max(1, outerOrbitX - innerOrbitX);
  const arcRotation = time * SOLAR_DISPLAY_ARC.rotationSpeed;

  const nodes = new Map();

  nodeDefinitions.forEach((node) => {
    if (typeof node.mapX === "number" && typeof node.mapY === "number") {
      nodes.set(node.id, {
        ...node,
        x: width * node.mapX,
        y: height * node.mapY,
        orbitX: 0,
        orbitY: 0,
      });

      return;
    }

    if (node.parentId) {
      const parent = nodes.get(node.parentId);

      if (!parent) {
        return;
      }

      const orbitX = Math.max(24, Math.min(36, innerOrbitX * 0.34));
      const orbitY = orbitX * 0.62;
      const angle = degreesToRadians(node.angle) + time * (node.orbitSpeed || 0);

      nodes.set(node.id, {
        ...node,
        x: parent.x + Math.cos(angle) * orbitX,
        y: parent.y + Math.sin(angle) * orbitY,
        orbitX,
        orbitY,
        parentId: node.parentId,
      });

      return;
    }

    const nodeIndex = primaryNodes.findIndex((entry) => entry.id === node.id);
    const nodeRatio =
      primaryNodes.length <= 1 ? 0.5 : nodeIndex / (primaryNodes.length - 1);
    const orbitX = innerOrbitX + orbitSpan * nodeRatio;
    const orbitY = orbitX * SOLAR_SYSTEM_REFERENCE.orbitTilt;
    const displayAngle = lerp(SOLAR_DISPLAY_ARC.start, SOLAR_DISPLAY_ARC.end, nodeRatio);
    const angle = degreesToRadians(displayAngle) + arcRotation;

    nodes.set(node.id, {
      ...node,
      x: sun.x + Math.cos(angle) * orbitX,
      y: sun.y + Math.sin(angle) * orbitY,
      orbitX,
      orbitY,
    });
  });

  return { sun, nodes };
}

function computeLabelLayout(layout, width, height) {
  const mobile = width <= 720;
  const config = mobile ? MAP_LABEL_CONFIG.mobile : MAP_LABEL_CONFIG.desktop;
  const safeTop = config.padding + 40;
  const safeBottom = config.bottomSafeArea;
  const labelLayouts = new Map();
  const placedRects = [];
  const planets = Array.from(layout.nodes.values()).map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
    radius: Math.max(node.size * 0.7, 10),
  }));
  const sunRadius = Math.min(96, Math.max(68, width * 0.07));

  nodeDefinitions.forEach((nodeDefinition) => {
    const node = layout.nodes.get(nodeDefinition.id);
    const previousLabelLayout = state.labelLayouts.get(nodeDefinition.id);

    if (!node) {
      return;
    }

    const labelWidth =
      node.labelWidth || (node.id === "moon" && mobile ? 118 : config.labelWidth);
    const labelHeight = config.labelHeight;
    const candidates = buildLabelCandidates(node, labelWidth, labelHeight, config.padding);
    let bestCandidate = null;

    candidates.forEach((candidate, index) => {
      const rawRect = {
        x: node.x + candidate.dx,
        y: node.y + candidate.dy,
        width: labelWidth,
        height: labelHeight,
      };
      const rect = {
        x: clamp(rawRect.x, config.padding, width - labelWidth - config.padding),
        y: clamp(rawRect.y, safeTop, height - labelHeight - safeBottom),
        width: labelWidth,
        height: labelHeight,
      };
      const score = measureLabelScore({
        rect,
        node,
        planets,
        placedRects,
        previousRect: previousLabelLayout
          ? {
              x: node.x + previousLabelLayout.dx,
              y: node.y + previousLabelLayout.dy,
              width: previousLabelLayout.width,
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

    if (!bestCandidate) {
      return;
    }

    placedRects.push({ ...bestCandidate.rect, id: node.id });
    labelLayouts.set(node.id, {
      dx: bestCandidate.rect.x - node.x,
      dy: bestCandidate.rect.y - node.y,
      width: labelWidth,
    });
  });

  return labelLayouts;
}

function buildLabelCandidates(node, labelWidth, labelHeight, gap) {
  const sideGap = gap + node.size * 0.5;
  const verticalGap = gap + node.size * 0.25;

  return dedupeCandidates([
    { dx: node.labelDx, dy: node.labelDy },
    { dx: sideGap, dy: -labelHeight - verticalGap },
    { dx: sideGap, dy: verticalGap },
    { dx: -labelWidth - sideGap, dy: -labelHeight - verticalGap },
    { dx: -labelWidth - sideGap, dy: verticalGap },
    { dx: -labelWidth * 0.5, dy: -labelHeight - verticalGap },
    { dx: -labelWidth * 0.5, dy: verticalGap },
    { dx: sideGap, dy: -labelHeight * 0.5 },
    { dx: -labelWidth - sideGap, dy: -labelHeight * 0.5 },
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
    score += Math.abs(rect.x - previousRect.x) * 0.35;
    score += Math.abs(rect.y - previousRect.y) * 0.35;
  }

  placedRects.forEach((placedRect) => {
    const overlap = rectOverlapArea(rect, placedRect);

    if (overlap > 0) {
      score += 5000 + overlap * 4;
    }
  });

  planets.forEach((planet) => {
    if (planet.id === node.id) {
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
  elements.galleryTitle.innerHTML = `${escapeHtml(node.title)}, <em>in frames.</em>`;

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
    elements.apodMedia.innerHTML = `<img src="${escapeAttribute(previewUrl)}" alt="${escapeAttribute(title)}" />`;
  } else {
    elements.apodMedia.innerHTML =
      '<div class="media-placeholder"><span>NASA returned this feature without preview media.</span></div>';
  }

  if (previewUrl) {
    setHeroBackdrop(previewUrl, `Backdrop: ${title} (NASA APOD)`);
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
    const images = pickImageRenditions(item?.links || []);

    if (!metadata || !images) {
      throw new Error("Spotlight fallback returned no image");
    }

    const title = metadata.title || "From the NASA archive";
    setHeroBackdrop(images.full, `Backdrop: ${title} (NASA)`);

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
    elements.apodMedia.innerHTML = `<img src="${escapeAttribute(images.full)}" alt="${escapeAttribute(title)}" />`;
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

function setHeroBackdrop(src, credit) {
  const image = elements.heroBackdrop;

  image.onload = () => {
    image.classList.add("is-loaded");
    elements.heroCredit.textContent = credit;
  };
  image.src = src;
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
  score += images.hasLarge ? 6 : 0;

  return {
    id: nasaId || images.card,
    title: metadata.title || "Untitled NASA image",
    description:
      truncateCopy(rawDescription, 900) || "No description was included with this NASA archive image.",
    meta: [formatYear(metadata.date_created), metadata.center].filter(Boolean).join(" · "),
    imageUrl: images.card,
    fullImageUrl: images.full,
    libraryUrl: nasaId
      ? `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`
      : "https://images.nasa.gov/",
    score,
  };
}

// NASA lists several renditions per asset (~thumb, ~small, ~medium, ~large,
// ~orig). Cards use a medium-weight one; the dialog uses the largest web-sized one.
function pickImageRenditions(links) {
  const imageLinks = links.filter((link) => link.render === "image" && link.href);

  if (!imageLinks.length) {
    return null;
  }

  const byVariant = (variant) =>
    imageLinks.find((link) => link.href.toLowerCase().includes(`~${variant}.`))?.href;
  const fallback = imageLinks[0].href;
  const large = byVariant("large");
  const medium = byVariant("medium");

  return {
    card: medium || byVariant("small") || fallback,
    full: large || medium || byVariant("orig") || fallback,
    hasLarge: Boolean(large || medium),
  };
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
            <img src="${escapeAttribute(item.imageUrl)}" alt="" loading="lazy" decoding="async" />
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
  elements.dialogImage.src = item.imageUrl;
  elements.dialogImage.alt = item.title;

  // Show the already-cached card image instantly, then swap in the larger one.
  if (item.fullImageUrl !== item.imageUrl) {
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
    starState.asteroidBelt = Array.from({ length: 180 }, () => createAsteroid());
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
    spread: Math.random() * 36 - 18,
    size: Math.random() * 1.7 + 0.25,
    alpha: Math.random() * 0.3 + 0.16,
  };
}

function drawSolarSystemGuides(context, time) {
  const layout = state.solarLayout;

  if (!layout) {
    return;
  }

  drawEclipticBand(context, layout);
  drawOrbitGuides(context, layout);
  drawAsteroidBelt(context, layout, time);
  drawMoonOrbit(context, layout);
  drawDeepSpaceBridge(context, layout);
}

function drawEclipticBand(context, layout) {
  const earth = layout.nodes.get("earth");
  const jupiter = layout.nodes.get("jupiter");
  const saturn = layout.nodes.get("saturn");

  if (!earth || !jupiter || !saturn) {
    return;
  }

  const gradient = context.createLinearGradient(
    layout.sun.x,
    layout.sun.y,
    saturn.x + 40,
    saturn.y,
  );

  gradient.addColorStop(0, "rgba(255, 176, 70, 0.11)");
  gradient.addColorStop(0.28, "rgba(114, 230, 255, 0.07)");
  gradient.addColorStop(0.72, "rgba(74, 143, 255, 0.04)");
  gradient.addColorStop(1, "rgba(12, 33, 74, 0)");

  context.save();
  context.strokeStyle = gradient;
  context.lineCap = "round";
  context.lineWidth = Math.min(88, starState.height * 0.125);
  context.beginPath();
  context.moveTo(layout.sun.x + 18, layout.sun.y - 8);
  context.bezierCurveTo(
    earth.x - 50,
    earth.y - 88,
    jupiter.x - 80,
    jupiter.y + 62,
    saturn.x - 22,
    saturn.y - 4,
  );
  context.stroke();
  context.restore();
}

function drawOrbitGuides(context, layout) {
  context.save();
  context.strokeStyle = "rgba(153, 194, 235, 0.17)";
  context.lineWidth = 1;

  nodeDefinitions
    .filter((node) => !node.parentId && node.realm !== "deep")
    .forEach((node, index) => {
      const positionedNode = layout.nodes.get(node.id);

      if (!positionedNode) {
        return;
      }

      context.setLineDash(index % 2 === 0 ? [5, 10] : [2, 8]);
      context.beginPath();
      context.ellipse(
        layout.sun.x,
        layout.sun.y,
        positionedNode.orbitX,
        positionedNode.orbitY,
        0,
        0,
        Math.PI * 2,
      );
      context.stroke();
    });

  context.restore();
}

function drawAsteroidBelt(context, layout, time) {
  const mars = layout.nodes.get("mars");
  const jupiter = layout.nodes.get("jupiter");

  if (!mars || !jupiter) {
    return;
  }

  const beltOrbitX = (mars.orbitX + jupiter.orbitX) * 0.5;
  const beltOrbitY = beltOrbitX * SOLAR_SYSTEM_REFERENCE.orbitTilt;

  context.save();

  starState.asteroidBelt.forEach((asteroid) => {
    const orbitX = beltOrbitX + asteroid.spread;
    const orbitY = beltOrbitY + asteroid.spread * SOLAR_SYSTEM_REFERENCE.orbitTilt;
    const angle = asteroid.angle + time * 0.00004;
    const x = layout.sun.x + Math.cos(angle) * orbitX;
    const y = layout.sun.y + Math.sin(angle) * orbitY;

    context.beginPath();
    context.fillStyle = `rgba(201, 185, 148, ${asteroid.alpha})`;
    context.arc(x, y, asteroid.size, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawMoonOrbit(context, layout) {
  const earth = layout.nodes.get("earth");
  const moon = layout.nodes.get("moon");

  if (!earth || !moon) {
    return;
  }

  context.save();
  context.strokeStyle = "rgba(190, 216, 255, 0.18)";
  context.lineWidth = 1;
  context.setLineDash([3, 5]);
  context.beginPath();
  context.ellipse(earth.x, earth.y, moon.orbitX, moon.orbitY, 0, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawDeepSpaceBridge(context, layout) {
  const orion = layout.nodes.get("orion");
  const pillars = layout.nodes.get("pillars");
  const andromeda = layout.nodes.get("andromeda");
  const neptune = layout.nodes.get("neptune");

  if (!orion || !pillars || !andromeda || !neptune) {
    return;
  }

  context.save();
  context.strokeStyle = "rgba(143, 233, 255, 0.2)";
  context.lineWidth = 1.1;
  context.setLineDash([4, 9]);

  context.beginPath();
  context.moveTo(orion.x, orion.y);
  context.quadraticCurveTo(pillars.x - 20, pillars.y - 35, pillars.x, pillars.y);
  context.quadraticCurveTo(andromeda.x - 80, andromeda.y + 25, andromeda.x, andromeda.y);
  context.stroke();

  context.beginPath();
  context.moveTo(neptune.x + 18, neptune.y - 18);
  context.quadraticCurveTo(
    neptune.x + 60,
    neptune.y - 120,
    andromeda.x - 22,
    andromeda.y + 8,
  );
  context.stroke();
  context.restore();
}

async function bootstrap() {
  initializeNav();
  initializeDestinationRail();
  initializeMapNodes();
  initializeApiKeyForm();
  initializeDialog();
  initializeGalleryClicks();
  initializeLoadMore();
  initializeSurpriseButton();
  initializeStarfield();
  setSelectedNodeUI(state.selectedNode);
  setStatus("Initializing NASA feed...");
  // Independent requests: load the spotlight and the gallery in parallel.
  await Promise.all([loadApod(), loadGallery(state.selectedNode)]);
}

bootstrap();
