// Captures a viewport-sized screenshot of the site with headless Chrome.
//
// Usage: node capture-preview.mjs [url] [output.png] [#section] [width] [height]
//   node capture-preview.mjs https://nasa-api-solar-system.gagianohenry.workers.dev preview.png "#atlas"
//
// Set CHROME_PATH if Chrome is installed somewhere else.

import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [
  targetUrl = "http://127.0.0.1:3000",
  outputArg = "preview.png",
  sectionSelector = "",
  widthArg = "1440",
  heightArg = "900",
] = process.argv.slice(2);

const chromePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profileDir = join(tmpdir(), "universe-atlas-headless-profile");
const outputPath = resolve(outputArg);
const viewport = { width: Number(widthArg), height: Number(heightArg) };
const remotePort = 9223;

function delay(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

async function waitForWebSocketUrl(timeoutMs = 15000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${remotePort}/json/list`);

      if (response.ok) {
        const pages = await response.json();
        const page = pages.find((entry) => entry.type === "page" && entry.webSocketDebuggerUrl);

        if (page) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch {
      // Chrome may still be starting up.
    }

    await delay(250);
  }

  throw new Error("Timed out waiting for Chrome DevTools to become available.");
}

function createProtocolClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const listeners = new Map();
  let nextId = 0;

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id) {
      const request = pending.get(message.id);

      if (!request) {
        return;
      }

      pending.delete(message.id);

      if (message.error) {
        request.reject(new Error(message.error.message));
      } else {
        request.resolve(message.result);
      }

      return;
    }

    (listeners.get(message.method) || []).forEach((listener) => listener(message.params));
  });

  return {
    waitForOpen() {
      return new Promise((done, fail) => {
        socket.addEventListener("open", () => done(), { once: true });
        socket.addEventListener("error", fail, { once: true });
      });
    },
    send(method, params = {}) {
      return new Promise((done, fail) => {
        const id = ++nextId;
        pending.set(id, { resolve: done, reject: fail });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    waitForEvent(method, timeoutMs = 15000) {
      return new Promise((done, fail) => {
        const remove = () =>
          listeners.set(
            method,
            (listeners.get(method) || []).filter((listener) => listener !== onEvent),
          );
        const timer = setTimeout(() => {
          remove();
          fail(new Error(`Timed out waiting for ${method}.`));
        }, timeoutMs);

        function onEvent(params) {
          clearTimeout(timer);
          remove();
          done(params);
        }

        listeners.set(method, [...(listeners.get(method) || []), onEvent]);
      });
    },
    close() {
      socket.close();
    },
  };
}

async function main() {
  await rm(profileDir, { recursive: true, force: true });
  await mkdir(profileDir, { recursive: true });

  const chrome = spawn(
    chromePath,
    [
      `--user-data-dir=${profileDir}`,
      "--headless=new",
      "--hide-scrollbars",
      "--autoplay-policy=no-user-gesture-required",
      `--remote-debugging-port=${remotePort}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  try {
    const client = createProtocolClient(await waitForWebSocketUrl());

    await client.waitForOpen();
    await client.send("Page.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const loadEvent = client.waitForEvent("Page.loadEventFired", 30000);
    await client.send("Page.navigate", { url: targetUrl });
    await loadEvent;
    await delay(2500);

    if (sectionSelector) {
      await client.send("Runtime.evaluate", {
        expression: `document.querySelector(${JSON.stringify(sectionSelector)})?.scrollIntoView({ behavior: "instant" })`,
      });
    }

    // Let images, fonts and the animation settle.
    await delay(6000);

    const { data } = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });

    await writeFile(outputPath, Buffer.from(data, "base64"));
    console.log(`Saved ${outputPath}`);
    client.close();
  } finally {
    chrome.kill();
    await delay(750);

    try {
      await rm(profileDir, { recursive: true, force: true });
    } catch {
      // Chrome can hold short-lived locks on profile files after exit.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
