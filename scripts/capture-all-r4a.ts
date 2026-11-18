import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = path.join(__dirname, "..", "docs", "r4a-screenshots");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const tasks = [
  { url: "http://localhost:3000/", w: 1440, h: 1000, name: "home-1440.png", mobile: false },
  { url: "http://localhost:3000/", w: 375, h: 812, name: "home-375.png", mobile: true },
  { url: "http://localhost:3000/join", w: 1440, h: 1000, name: "join-1440.png", mobile: false },
  { url: "http://localhost:3000/join", w: 375, h: 812, name: "join-375.png", mobile: true },
  { url: "http://localhost:3000/membership", w: 1440, h: 1000, name: "membership-1440.png", mobile: false },
  { url: "http://localhost:3000/membership", w: 375, h: 812, name: "membership-375.png", mobile: true },
  { url: "http://localhost:3000/", w: 1440, h: 1000, name: "home-reduced-motion-1440.png", mobile: false, reducedMotion: true },
];

async function captureAll() {
  const port = 9226;
  const proc = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    "http://localhost:3000/",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const tabs = (await listRes.json()) as Array<{ webSocketDebuggerUrl?: string }>;
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) throw new Error("No tab available");

    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let id = 1;
    function send(method: string, params: Record<string, unknown> = {}) {
      return new Promise<{ data: string }>((resolve) => {
        const curId = id++;
        const handler = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.id === curId) {
            ws.removeEventListener("message", handler);
            resolve(data.result);
          }
        };
        ws.addEventListener("message", handler as EventListener);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    for (const t of tasks) {
      console.log(`Navigating to ${t.url} for ${t.name}...`);
      await send("Page.navigate", { url: t.url });
      await new Promise((r) => setTimeout(r, 800));

      if (t.mobile) {
        await send("Emulation.setDeviceMetricsOverride", {
          width: t.w,
          height: t.h,
          deviceScaleFactor: 2,
          mobile: true,
        });
        await send("Emulation.setUserAgentOverride", {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
        });
      } else {
        await send("Emulation.setDeviceMetricsOverride", {
          width: t.w,
          height: t.h,
          deviceScaleFactor: 1,
          mobile: false,
        });
      }

      if (t.reducedMotion) {
        await send("Emulation.setEmulatedMedia", {
          features: [{ name: "prefers-reduced-motion", value: "reduce" }],
        });
      } else {
        await send("Emulation.setEmulatedMedia", {
          features: [{ name: "prefers-reduced-motion", value: "" }],
        });
      }

      await new Promise((r) => setTimeout(r, 800));

      const res = await send("Page.captureScreenshot", { format: "png" });
      const buf = Buffer.from(res.data, "base64");
      const outFile = path.join(outDir, t.name);
      fs.writeFileSync(outFile, buf);
      console.log(`Saved ${t.name} (${buf.length} bytes)`);
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

captureAll()
  .then(() => {
    console.log("All screenshots captured successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Capture failed:", err);
    process.exit(1);
  });
