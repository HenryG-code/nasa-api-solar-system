# Universe Atlas

**Watch Earth live from the International Space Station, see where the station is right now, and explore the solar system through NASA's own photos.**

**[Open the live site →](https://nasa-api-solar-system.gagianohenry.workers.dev/)**

<p align="center">
  <img src="./preview.png" alt="Universe Atlas: an interactive top-down solar system with the eight planets numbered in order from the Sun" width="1200" />
</p>

Universe Atlas is a single-page, full-screen space explorer built with plain HTML, CSS and JavaScript. There's no framework and no build step. It pulls everything live from public NASA and ESA sources.

## What you can do

| Section | What it is |
| --- | --- |
| **Live from the ISS** | The opening screen plays NASA's official live HD camera feed from the space station. Turn on the sound or go fullscreen. When the station is over Earth's night side, the dark feed blends with a nebula image. |
| **Spotlight** | NASA's Astronomy Picture of the Day, full-screen. If the APOD service is busy, it falls back to one of several iconic high-resolution NASA images. |
| **ISS tracker** | ESA's live ground-track map beside live position, altitude, speed and sunlight data, refreshed every few seconds. The header shows the station's speed and altitude wherever you are on the page. |
| **Solar system** | A top-down view of all eight planets in order from the Sun, each shown with a real NASA photograph and lit from the Sun so it shows its phase as it orbits. Each is labelled with its number and distance in AU, and they orbit at their relative speeds, so Mercury races and Neptune crawls. Select a planet to fly in for a close-up (with its diameter, day and year), then press Esc or **Back to solar system** to zoom out. Deep-sky objects like Andromeda load their photos too. |
| **Photo archive** | Real images from the NASA Image and Video Library for whatever you selected, ranked for relevance, de-duplicated, and served sharp on any screen. Open any photo full size and step through them with the arrow keys. |

<p align="center">
  <img src="./docs/iss-tracker.png" alt="ISS tracker: ESA ground-track map next to live latitude, longitude, altitude and speed" width="49%" />
  <img src="./docs/archive.png" alt="Photo archive: NASA images of Mars in an editorial grid" width="49%" />
</p>

## Data sources

| Source | Used for |
| --- | --- |
| [NASA ISS HD Earth views](https://eol.jsc.nasa.gov/esrs/hdev/) (YouTube) | Live video in the hero |
| [ESA ISS tracker](https://isstracker.spaceflight.esa.int/) | Live ground-track map |
| [wheretheiss.at](https://wheretheiss.at/) | Live ISS position, altitude, speed and sunlight |
| [NASA APOD API](https://api.nasa.gov/) | Astronomy Picture of the Day |
| [NASA Image and Video Library](https://images.nasa.gov/) | Planet and deep-sky photo galleries |

The image library and ISS sources need no key. APOD uses NASA's shared `DEMO_KEY` by default; visitors can paste their own free key (from [api.nasa.gov](https://api.nasa.gov/)) under the spotlight for reliable access.

## Details worth knowing

- **Sharp images everywhere.** Each photo gets a `srcset` built from NASA's own width data, so phones download small files and retina or 4K screens get large ones. Images NASA only has at low resolution are left out.
- **Realistic bodies.** Each planet and the Moon is a NASA full-disk photo, cropped to the disk and stored at 160&nbsp;px (about 70&nbsp;KB for all nine). A shading layer turns every frame to face the Sun, and Saturn keeps its photographed rings. The Sun is drawn with limb darkening and a slowly turning granulation texture.
- **Smooth zoom.** Selecting a planet flies the camera in. The planet travels in a straight line to its spot on screen while the zoom eases in logarithmically, then the camera locks onto the moving planet. Sharper 480&nbsp;px photos load only once a planet fills the view.
- **Readable orbits.** Orbit spacing blends even steps with the square root of real distance. Inner planets bunch up and outer ones spread out, as in reality, but every ring stays clickable. Speeds follow Kepler's third law, slowed so the outer planets still visibly move.
- **Light on resources.** The muted live video pauses when scrolled away, and ISS data is only fetched while the tracker is on screen.
- **Accessible.** It works with the keyboard, respects reduced-motion settings, and includes a skip link.

## Run locally

```bash
npm start
```

Then open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Tests

End-to-end tests use [Playwright](https://playwright.dev/) and run on desktop Chrome and an emulated Pixel 7. Every external service (NASA APIs, ISS telemetry, YouTube, ESA) is replaced with fixture data in `tests/fixtures.js`, so results are the same every run.

```bash
npm install
npx playwright install chromium   # first time only
npm test                          # tests a local server
npm run test:live                 # tests the deployed site
npm run test:ui                   # interactive runner
npm run test:report               # open the last HTML report
```

GitHub Actions runs the suite on every push and pull request (`.github/workflows/tests.yml`). A daily job (`live-check.yml`) tests the deployed site; if it fails it opens an issue labelled `live-site-failure`, and closes it automatically once the site passes again.

| Spec | Covers |
| --- | --- |
| `smoke.spec.js` | Page loads with no script errors, no sideways scrolling, nav links, skip link, versioned assets |
| `hero.spec.js` | Muted live ISS stream, calls to action, night-side mode, Sound control only when playing |
| `iss.spec.js` | Telemetry formatting, header chip, polling only while visible, ESA map scaling |
| `spotlight.spec.js` | APOD, archive fallback when APOD fails, unsafe video URLs rejected |
| `solar-system.spec.js` | Planet order and distances, textures, relative speeds, click-to-zoom, zoom-out controls, facts, frame rate |
| `gallery.spec.js` | Relevance filtering, de-duplication, Load more, full-size viewer with arrow keys |
| `images.spec.js` | No photo drawn larger than its file allows; every planet texture exists |

## Deploy

The site is deployed as a **Cloudflare Worker serving static assets** (`wrangler.jsonc`). It's connected to this repository, so every push to `main` deploys automatically.

- `.assetsignore` keeps local tooling (`server.mjs`, `wrangler.jsonc`, `.git`, …) out of the published site.
- `_headers` sets security headers and makes browsers revalidate CSS and JS on each visit, so a new deploy is never mixed with stale cached files.

## Project structure

```text
.
|-- index.html          # Page structure and copy
|-- styles.css          # Full-screen layout, typography, responsive rules
|-- app.js              # Live stream, ISS tracker, solar system, NASA galleries
|-- server.mjs          # Tiny static server for local development
|-- capture-preview.mjs # Headless-Chrome screenshots for this README
|-- tests/              # Playwright end-to-end tests
|-- playwright.config.js / playwright.live.config.js
|-- wrangler.jsonc      # Cloudflare Worker config
|-- _headers            # Response headers on Cloudflare
|-- .assetsignore       # Files kept out of the deployed site
|-- assets/planets/     # Cropped NASA photos of each planet and the Moon
|-- preview.png         # README and link-preview image
`-- docs/               # Additional README screenshots
```

To refresh the screenshots, run the local server and then:

```bash
node capture-preview.mjs http://127.0.0.1:3000 preview.png "#atlas"
```

## Credits

Imagery and video courtesy of NASA. Planet photos: NASA/JPL (PIA15162 Mercury, PIA00104 Venus, PIA18033 Earth, PIA00407 Mars, PIA00343 Jupiter, PIA05389 Saturn, PIA18182 Uranus, PIA01492 Neptune) and NASA/Goddard (Full Moon). ISS map © ESA. This is an independent project, not affiliated with NASA, ESA or SpaceX.

## License

[MIT](./LICENSE)
