/*
 * Copyright (c) 2025 Steven Stallion <sstallion@gmail.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

import { ButtonComponent, Plugin } from "obsidian";
import { CommandLine, CommandLineParser } from "./command";
import { CommandLineSettings, CommandLineSettingsTab } from "./settings";
import * as util from "./util";

const COPY_BUTTON_DELAY = 1000;

const DEFAULT_SETTINGS: Partial<CommandLineSettings> = {
    highlight: false,
    normalize: false,
    languages: {
        "command-line": {
            defaultPrompt: "C:\\>",
            promptPattern: "^\\S*?[#$%>]\\s*",
            continuationPattern: "[\\\\`^]$",
        },
        "batch-command": {
            defaultPrompt: "C:\\>",
            promptPattern: "^\\S*?>\\s*",
            continuationPattern: "\\^$",
            alias: "batch",
        },
        "powershell-command": {
            defaultPrompt: "PS>",
            promptPattern: "^\\S*?>\\s*",
            continuationPattern: "`$",
            alias: "powershell",
        },
        "shell-command": {
            defaultPrompt: "$",
            promptPattern: "^\\S*?[#$%]\\s*",
            continuationPattern: "\\\\$",
            alias: "shell",
        },
    },
};

export default class CommandLinePlugin extends Plugin {
    // @ts-ignore: Initialized by onload()
    settings: CommandLineSettings;

    addCopyButton(containerEl: HTMLElement, command: CommandLine): ButtonComponent {
        return new ButtonComponent(containerEl)
            .setIcon("lucide-copy")
            .setClass("copy-code-button")
            .then((button) => {
                button.onClick(async (evt) => {
                    evt.preventDefault();
                    await navigator.clipboard.writeText(
                        this.settings.normalize
                            ? command.normalize()
                            : command.toString(),
                    );
                    button // prettier-ignore
                        .setIcon("lucide-check")
                        .buttonEl.setCssStyles({
                            color: "var(--text-success)",
                            display: "inline-flex",
                        });
                    setTimeout(() => {
                        button // prettier-ignore
                            .setIcon("lucide-copy")
                            .buttonEl.setCssStyles({
                                color: "",
                                display: "",
                            });
                    }, COPY_BUTTON_DELAY);
                });
            });
    }

    async loadSettings() {
        const settings = (await this.loadData()) as CommandLineSettings;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, settings);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onExternalSettingsChange() {
        await this.loadSettings();
        location.reload();
    }

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new CommandLineSettingsTab(this));

        // Obsidian loads Prism asynchronously, however it does not bundle
        // additional plugins. A deferred dynamic import is needed to avoid a
        // race when registering plugins. Care must be taken to import plugins
        // from a compatible version of Prism for a given Obsidian release.
        if (this.settings.highlight) {
            this.app.workspace.onLayoutReady(async () => {
                await util.waitForGlobal("Prism").then(async () => {
                    await import(
                        // @ts-ignore: Bundled by esbuild
                        "https://unpkg.com/prismjs@v1.29.0/plugins/command-line/prism-command-line.js"
                    );
                    const entries = Object.entries(this.settings.languages);
                    for (const [language, ctx] of entries) {
                        if (ctx?.alias) {
                            Prism.languages[language] = Prism.languages[ctx.alias];
                        }
                        Prism.languages[language] ??= {};
                    }
                    Prism.highlightAll();
                });
            });
        }

        this.registerMarkdownPostProcessor((el) => {
            for (const codeEl of el.findAll("pre > code")) {
                const language = util.getLanguage(codeEl);
                if (!(language in this.settings.languages)) {
                    continue; // unsupported language
                }

                const ctx = this.settings.languages[language];
                const command = new CommandLineParser(ctx).parse(codeEl.getText());
                if (this.settings.highlight) {
                    command.highlight(codeEl);
                }

                // Due to the order in which builtin post processors are
                // registered, there does not appear to be a better method of
                // modifying clipboard behavior. Rather than fight event
                // handling, we replace the copy button a facsimile.
                const preEl = codeEl.parentElement!;
                const buttonEl = preEl.find(".copy-code-button");
                if (buttonEl) {
                    const button = this.addCopyButton(preEl, command);
                    buttonEl.replaceWith(button.buttonEl);
                }
            }
        });
    }
}
