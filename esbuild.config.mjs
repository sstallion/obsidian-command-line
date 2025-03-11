import { http } from "@hyrious/esbuild-plugin-http";
import esbuild from "esbuild";
import process from "node:process";

const options = {
    sourcemap: "inline",
    format: "cjs",
    target: "es2023",
    logLevel: "info",
    bundle: true,
    outdir: ".",
    external: [
        "obsidian",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
    ],
    entryPoints: ["src/main.ts", "src/styles.css"],
    plugins: [http()],
};

const args = process.argv.slice(2);
switch (args[0]) {
    case "release": {
        Object.assign(options, {
            sourcemap: false,
            minify: true,
            treeShaking: true,
        });
        // fallthrough
    }
    case "build": {
        await esbuild.build(options);
        break;
    }
    case "watch": {
        const context = await esbuild.context(options);
        await context.watch();
        break;
    }
    default: {
        throw new Error(`Unknown command: ${args[0]}`);
    }
}
