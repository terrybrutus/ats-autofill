import { readFile } from "node:fs/promises";
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
const port = Number.parseInt(process.env.PORT ?? "4321", 10);

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

server.listen(port, () => {
  console.log(
    `Caffeine Job Copilot backend running at http://localhost:${port}`,
  );
});
