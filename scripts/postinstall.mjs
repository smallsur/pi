import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const canvasDir = join(import.meta.dirname, "..", "node_modules", "canvas");

if (!existsSync(canvasDir)) {
	process.exit(0);
}

if (existsSync(join(canvasDir, "build", "Release", "canvas.node"))) {
	process.exit(0);
}

const needsCpp20 = parseInt(process.versions.node.split(".")[0], 10) >= 23;
const cxxflags = needsCpp20 ? "-std=c++20" : "";

console.log("Rebuilding canvas native module (C++20 required for Node >= 23)...");
try {
	execSync("npm rebuild canvas", {
		cwd: join(import.meta.dirname, ".."),
		stdio: "inherit",
		env: { ...process.env, ...(cxxflags ? { CXXFLAGS: cxxflags } : {}) },
	});
} catch {
	console.warn("Warning: canvas native module build failed. Image tests may not work.");
}
