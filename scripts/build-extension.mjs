import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist", "extension");

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "extension"), output, { recursive: true });

console.log(`Extension copied to ${output}`);
