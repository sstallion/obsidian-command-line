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

import * as util from "./util";

const CONTINUATION_PROMPT = " ";
const CONTINUATION_PREFIX = "(con)";
const OUTPUT_PREFIX = "(out)";

export interface CommandLineContext {
    defaultPrompt: string;
    promptPattern: string;
    continuationPattern: string;
    alias?: string;
}

export class CommandLine {
    private readonly ctx: CommandLineContext;
    prompt: string | undefined;
    command: string[];
    output: string[];

    constructor(
        ctx: CommandLineContext,
        prompt: string | undefined,
        command: string[],
        output: string[],
    ) {
        this.ctx = ctx;
        this.prompt = prompt;
        this.command = command;
        this.output = output;
    }

    isMultiline(): boolean {
        return this.command.length > 0;
    }

    hasOutput(): boolean {
        return this.output.length > 0;
    }

    highlight(codeEl: HTMLElement) {
        const preEl = codeEl.parentElement!;
        preEl.addClass("command-line");
        preEl.setAttrs({
            "data-prompt": this.prompt ?? this.ctx.defaultPrompt,
            "data-continuation-prompt": CONTINUATION_PROMPT,
            "data-filter-continuation": CONTINUATION_PREFIX,
            "data-filter-output": OUTPUT_PREFIX,
        });
        codeEl.setText(this.toCode());
    }

    normalize(): string {
        const re = new RegExp(this.ctx.continuationPattern);
        return this.command.map((line) => line.replace(re, "").trim()).join(" ");
    }

    toCode(): string {
        return util
            .mapTail(this.command, (line) => CONTINUATION_PREFIX + line)
            .concat(this.output.map((line) => OUTPUT_PREFIX + line))
            .join("\n");
    }

    toString(): string {
        return this.command.join("\n");
    }
}

const enum CommandLineParserState {
    Prompt,
    Command,
    Output,
}

export class CommandLineParser {
    private readonly ctx: CommandLineContext;
    private readonly re: Record<string, RegExp>;

    constructor(ctx: CommandLineContext) {
        this.ctx = ctx;
        this.re = {
            prompt: new RegExp(ctx.promptPattern),
            continuation: new RegExp(ctx.continuationPattern),
        };
    }

    parse(text: string): CommandLine {
        let line, prompt;
        const command = [];
        const output = [];
        let state = CommandLineParserState.Prompt;
        const lines = text.trim().split("\n");
        while ((line = lines.shift())) {
            switch (state) {
                case CommandLineParserState.Prompt: {
                    const match = line.match(this.re.prompt);
                    if (match) {
                        prompt = match[0].trim();
                        line = line.replace(this.re.prompt, "");
                    }
                    state = CommandLineParserState.Command;
                    // fallthrough
                }
                case CommandLineParserState.Command: {
                    command.push(line);
                    if (!line.match(this.re.continuation)) {
                        state = CommandLineParserState.Output;
                    }
                    break;
                }
                case CommandLineParserState.Output: {
                    output.push(line);
                    break;
                }
            }
        }
        return new CommandLine(this.ctx, prompt, command, output);
    }
}
