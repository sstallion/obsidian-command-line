import editorconfig from "editorconfig";
import { readFileSync, writeFileSync } from "node:fs";
import { env } from "node:process";

// Update manifest.json and versions.json based on package.json. EditorConfig
// rules are applied when updating to ensure consistent formatting.
const version = env.npm_package_version;

function readJSON(path) {
    return JSON.parse(readFileSync(path, "utf8"));
}

function writeJSON(path, data) {
    const { indent_size, indent_style, insert_final_newline } =
        editorconfig.parseSync(path);
    const space = indent_style === "tab" ? "\t" : (indent_size ?? 2);
    const newline = insert_final_newline ? "\n" : "";
    writeFileSync(path, JSON.stringify(data, null, space) + newline);
}

const manifest = readJSON("manifest.json");
manifest.version = version;
writeJSON("manifest.json", manifest);

const versions = readJSON("versions.json");
versions[version] = manifest.minAppVersion;
writeJSON("versions.json", versions);
