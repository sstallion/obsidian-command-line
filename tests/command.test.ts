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

import { test as base, expect } from "vitest";
import { CommandLineParser } from "../src/command";

const test = base.extend({
    parser: new CommandLineParser({
        defaultPrompt: "$",
        promptPattern: "^\\$\\s*",
        continuationPattern: "\\\\$",
    }),
});

test("parse empty string", ({ parser }) => {
    const actual = parser.parse("");
    expect(actual.toString()).toBe("");
});

test("parse with prompt", ({ parser }) => {
    const actual = parser.parse("$ command with prompt");
    expect(actual.toString()).toBe("command with prompt");
});

test("parse with continuations", ({ parser }) => {
    const actual = parser.parse("command \\\nwith \\\ncontinuations");
    expect(actual.toString()).toBe("command \\\nwith \\\ncontinuations");
});

test("parse with output", ({ parser }) => {
    const actual = parser.parse("command\nwith\noutput");
    expect(actual.toString()).toBe("command"); // with output
});

test("normalize with continuations", ({ parser }) => {
    const actual = parser.parse("command \\\nwith \\\ncontinuations");
    expect(actual.normalize()).toBe("command with continuations");
});

test("normalize with inner white space", ({ parser }) => {
    const actual = parser.parse("command   with inner  white space preserved");
    expect(actual.normalize()).toBe("command   with inner  white space preserved");
});

test("normalize with outer white space", ({ parser }) => {
    const actual = parser.parse("  command with outer white space removed  ");
    expect(actual.normalize()).toBe("command with outer white space removed");
});

test("normalize the kitchen sink", ({ parser }) => {
    const actual = parser.parse(`$ command with     \\
                                   entirely too     \\
                                   much formatting
                                 and a couple lines
                                 of output\n`);
    expect(actual.normalize()).toBe("command with entirely too much formatting");
});
