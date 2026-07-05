import { mkdir, readFile, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createDraftSuggestions,
  mockAnswerBank,
  mockApplications,
  mockProfile,
} from "../shared/mock-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const scanCapturesPath = path.join(dataDir, "scan-captures.json");
const port = Number.parseInt(process.env.PORT ?? "4321", 10);
let scanCaptures = [];
let nextScanCaptureId = 1;

const loadScanCaptures = async () => {
  try {
    const contents = await readFile(scanCapturesPath, "utf8");
    const parsed = JSON.parse(contents);
    scanCaptures = Array.isArray(parsed.captures) ? parsed.captures : [];
    nextScanCaptureId =
      Number.isInteger(parsed.nextScanCaptureId) && parsed.nextScanCaptureId > 0
        ? parsed.nextScanCaptureId
        : scanCaptures.length + 1;
  } catch {
    scanCaptures = [];
    nextScanCaptureId = 1;
  }
};

const saveScanCaptures = async () => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(
    scanCapturesPath,
    JSON.stringify({ nextScanCaptureId, captures: scanCaptures }, null, 2),
  );
};

const json = (response, status, body) => {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body, null, 2));
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
};

const sendStatic = async (response, pathname) => {
  const filePath = pathname === "/" ? "web/index.html" : pathname.slice(1);
  const absolutePath = path.join(rootDir, filePath);
  const ext = path.extname(absolutePath);
  const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
  };

  try {
    const contents = await readFile(absolutePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[ext] ?? "text/plain; charset=utf-8",
    });
    response.end(contents);
  } catch {
    json(response, 404, { error: "Not found" });
  }
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    json(response, 204, {});
    return;
  }

  if (url.pathname === "/api/health") {
    json(response, 200, {
      ok: true,
      service: "caffeine-job-copilot",
      mode: "local",
    });
    return;
  }

  if (url.pathname === "/api/profile") {
    json(response, 200, mockProfile);
    return;
  }

  if (url.pathname === "/api/answers") {
    json(response, 200, mockAnswerBank);
    return;
  }

  if (url.pathname === "/api/applications") {
    json(response, 200, mockApplications);
    return;
  }

  if (url.pathname === "/api/scan-captures" && request.method === "GET") {
    json(response, 200, scanCaptures.slice(-25).reverse());
    return;
  }

  if (url.pathname === "/api/scan-captures" && request.method === "POST") {
    const body = await readBody(request);
    const capture = {
      id: `scan_${nextScanCaptureId}`,
      sequence: nextScanCaptureId,
      platform: body.platform ?? "generic",
      url: body.url ?? "",
      pageTitle: body.pageTitle ?? "",
      fieldCount: Array.isArray(body.fields) ? body.fields.length : 0,
      fields: Array.isArray(body.fields) ? body.fields : [],
      suggestions: Array.isArray(body.suggestions) ? body.suggestions : [],
      createdAt: new Date().toISOString(),
    };
    nextScanCaptureId += 1;
    scanCaptures = [...scanCaptures, capture].slice(-100);
    await saveScanCaptures();
    json(response, 201, capture);
    return;
  }

  if (url.pathname === "/api/draft" && request.method === "POST") {
    const body = await readBody(request);
    json(response, 200, createDraftSuggestions(body));
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    json(response, 404, { error: "Unknown API route" });
    return;
  }

  await sendStatic(response, url.pathname);
});

await loadScanCaptures();

server.listen(port, () => {
  console.log(
    `Caffeine Job Copilot backend running at http://localhost:${port}`,
  );
});
