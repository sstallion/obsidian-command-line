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

export function getLanguage(el: HTMLElement): string {
    for (const cls of el.classList) {
        const result = /^language-(.*)$/.exec(cls);
        if (result) {
            return result[1];
        }
    }
    return "";
}

export function mapTail<T>(array: T[], callbackFn: (thisArg: T) => T): T[] {
    return array.reduce((accumulator, currentValue) => {
        if (accumulator.length == 0) {
            accumulator.push(currentValue);
        } else {
            accumulator.push(callbackFn(currentValue));
        }
        return accumulator;
    }, [] as T[]);
}

export function sleep(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function waitForGlobal(name: string, delay = 100): Promise<void> {
    return new Promise((resolve) => {
        (function resolver() {
            if (name in window) {
                resolve();
            } else {
                setTimeout(resolver, delay);
            }
        })();
    });
}
