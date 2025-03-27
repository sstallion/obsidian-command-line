# Command Line

[![](https://github.com/sstallion/obsidian-command-line/actions/workflows/ci.yml/badge.svg?branch=master)][1]
[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsstallion%2Fobsidian-command-line%2Frefs%2Fheads%2Fmaster%2Fmanifest.json&query=minAppVersion&suffix=%2B&label=Obsidian&color=7c3aed)][2]
[![](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsstallion%2Fobsidian-command-line%2Frefs%2Fheads%2Fmaster%2Fmanifest.json&query=version&label=latest)][3]
[![](https://img.shields.io/github/license/sstallion/obsidian-command-line.svg)][4]

This plugin adds enhanced support for command line code blocks to Obsidian.

## Features

- Copy command lines from your notes without selecting text.
- Prompts and output are removed from clipboard contents to support pasting into
  terminal sessions.
- Default prompts are provided for command lines that do not specify one.
- Optional syntax highlighting and styling using [Prism Command Line][5].
- Optional support for removing unnecessary white space from clipboard contents.
- Supports mobile and desktop.

## Getting Started

Command line code blocks are identified using one of the following languages:

| Name                 | Highlight    | Prompt Pattern | Default Prompt | Continuation |
| -------------------- | ------------ | -------------- | -------------- | ------------ |
| `batch-command`      | `batch`      | `/\S*?>/`      | `C:\>`         | `^`          |
| `powershell-command` | `powershell` | `/\S*?>/`      | `PS>`          | `` ` ``      |
| `shell-command`      | `shell`      | `/\S*?[#$%]/`  | `$`            | `\`          |

For example, copying the following code block to the clipboard will remove the
prompt and output while preserving line continuations and white space:

````
```shell-command
$ command with \
    line continuation
and output, which will be removed
from the clipboard.
```
````

> [!NOTE]
> If clipboard normalization is enabled in Settings, unnecessary white space
> (including line continuations) will be removed in addition to the prompt and
> output.

## Contributing

Pull requests are welcome! See [CONTRIBUTING.md][6] for details.

## License

Source code in this repository is licensed under a Simplified BSD License. See
[LICENSE][4] for details.

[1]: https://github.com/sstallion/obsidian-command-line/actions/workflows/ci.yml
[2]: https://github.com/sstallion/obsidian-command-line/blob/master/manifest.json
[3]: https://github.com/sstallion/obsidian-command-line/releases/latest
[4]: https://github.com/sstallion/obsidian-command-line/blob/master/LICENSE
[5]: https://prismjs.com/plugins/command-line/
[6]: https://github.com/sstallion/obsidian-command-line/blob/master/CONTRIBUTING.md
