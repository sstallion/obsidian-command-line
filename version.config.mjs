import editorconfig from "editorconfig";
import { readFileSync, writeFileSync } from "node:fs";
import { env } from "node:process";

// Update manifest.json and versions.json based on the package version.
// EditorConfig rules are applied to ensure consistent formatting.
const version = env.npm_package_version;

function readJSON(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

function writeJSON(path, value) {
    const config = editorconfig.parseSync(path);
    const space = config.indent_style === "tab" ? "\t" : (config.indent_size ?? 2);
    const newline = config.insert_final_newline ? "\n" : "";
    writeFileSync(path, JSON.stringify(value, null, space) + newline);
}

const manifest = readJSON("manifest.json");
manifest.version = version;
writeJSON("manifest.json", manifest);

const versions = readJSON("versions.json");
versions[version] = manifest.minAppVersion;
writeJSON("versions.json", versions);
