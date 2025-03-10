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

import { describe, expect, test, vi } from "vitest";
import * as util from "../src/util";

describe("getLanguage()", () => {
    test("defaults to empty string", () => {
        const codeEl = document.createElement("code");
        expect(util.getLanguage(codeEl)).toBe("");
    });

    test("returns language", () => {
        const codeEl = document.createElement("code");
        codeEl.classList.add("language-test");
        expect(util.getLanguage(codeEl)).toBe("test");
    });

    test("returns first language in list", () => {
        const codeEl = document.createElement("code");
        for (const name of ["first", "next", "last"]) {
            codeEl.classList.add(`language-${name}`);
        }
        expect(util.getLanguage(codeEl)).toBe("first");
    });
});

describe("mapTail()", () => {
    test("defaults to empty array", () => {
        expect(util.mapTail([], vi.fn())).toStrictEqual([]);
    });

    test("accumulates head and tail elements", () => {
        expect(
            util.mapTail(["head", "", ""], (value) => value + "tail"),
        ).toStrictEqual(["head", "tail", "tail"]);
    });

    test("skips callbacks without tail elements", () => {
        const callbackFn = vi.fn();
        util.mapTail(["head"], callbackFn);
        expect(callbackFn).not.toHaveBeenCalled();
    });
});
