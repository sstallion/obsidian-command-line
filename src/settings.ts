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

import { PluginSettingTab, Setting } from "obsidian";
import { CommandLineContext } from "./command";
import CommandLinePlugin from "./main";
import * as util from "./util";

const RELOAD_DELAY = 500;

export interface CommandLineSettings {
    highlight: boolean;
    normalize: boolean;
    languages: Record<string, CommandLineContext>;
}

export class CommandLineSettingsTab extends PluginSettingTab {
    readonly plugin: CommandLinePlugin;

    constructor(plugin: CommandLinePlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Highlight command lines")
            .setDesc("Enable highlighting and additional styling for command lines.")
            .then(({ descEl }) => {
                descEl
                    .createDiv("mod-warning")
                    .setText("Changing this option will reload the app.");
            })
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.highlight)
                    .onChange(async (value) => {
                        this.plugin.settings.highlight = value;
                        await this.plugin.saveSettings();
                        await util.sleep(RELOAD_DELAY).then(() => {
                            location.reload();
                        });
                    });
            });

        new Setting(containerEl)
            .setName("Normalize clipboard contents")
            .setDesc("Remove uneccessary white space when copying to the clipboard.")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.plugin.settings.normalize)
                    .onChange(async (value) => {
                        this.plugin.settings.normalize = value;
                        await this.plugin.saveSettings();
                    });
            });
    }
}
