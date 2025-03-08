import editorconfig from "editorconfig";
import fs from "node:fs";
import process from "node:process";

// Update manifest.json and versions.json based on changes made to package.json
// after running `npm version`. EditorConfig rules are respected when updating
// files to ensure consistent formatting.
const version = process.env.npm_package_version;

function readJSON(path) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
}

async function writeJSON(path, data) {
    const config = await editorconfig.parse(path);

    let space = config.indent_size ?? 2;
    if (config?.indent_style === "tab") {
        space = "\t";
    }

    let json = JSON.stringify(data, null, space);
    if (config?.insert_final_newline) {
        json += "\n";
    }
    fs.writeFileSync(path, json);
}

const manifest = readJSON("manifest.json");
manifest.version = version;
await writeJSON("manifest.json", manifest);

const versions = readJSON("versions.json");
versions[version] = manifest.minAppVersion;
await writeJSON("versions.json", versions);
