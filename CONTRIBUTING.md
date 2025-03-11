# Contributing

If you have an idea or feature request please open an [issue][1], even if you do
not have time to contribute!

## Making Changes

> [!IMPORTANT]
> This guide assumes you have a functioning [Node.js and npm][2] installation. A
> recent release ([Node.js 20][3] or later) is required to build this plugin.
> Long-term support (LTS) releases are recommended for local development.

To get started, [fork][4] this repository on GitHub and clone a working copy for
development:

```
$ git clone git@github.com:YOUR-USERNAME/obsidian-command-line.git
```

> [!TIP]
> For local development, it is recommended to create the working copy in the
> `plugins` directory. The directory name should match the plugin ID. See the
> [Obsidian Docs][5] for details.

After cloning, install dependencies by issuing:

```
$ npm ci
```

Several scripts are defined in [package.json][6] to aid plugin development. Once
you have finished making changes, run tests by issuing:

```
$ npm test
```

Finally, commit changes and create a [pull request][8] against the default
branch for review. At a minimum, there should be no test regressions and
additional tests should be added for new functionality.

> [!TIP]
> Code quality checks are enabled for this repository. To run checks manually,
> issue `npm run check`. A Git pre-commit hook is also available to run checks
> automatically, which can be installed by issuing `npm run install-hooks`.

## Making Releases

Making releases is automated by [GitHub Actions][9]. Releases are created from
the default branch; as such, tests should be passing at all times.

To make a release, perform the following in a feature branch:

1. Create a new section in [CHANGELOG.md][7] for the release, and move items
   from Unreleased to this section. Links should be updated to point to the
   correct tags for comparison.

2. Run `npm version` with the appropriate arguments to bump the version.

3. Commit outstanding changes by issuing:

   ```
   $ git commit -a -m "Release <version>"
   ```

4. Push changes and open a pull request. Verify the results of the [CI][10]
   workflow before merging.

5. Once merged, pull changes and create a release tag from the default branch
   branch by issuing:

   ```
   $ git tag -a -m "Release <version>" <version>
   ```

6. Push the release tag to the remote repository and verify the results of the
   [Release][11] workflow:

   ```
   $ git push origin --tags
   ```

> [!IMPORTANT]
> Release tags must match the version specified in [manifest.json][12]. See the
> [Obsidian Docs][13] for more details.

## License

By contributing to this repository, you agree that your contributions will be
licensed under its Simplified BSD License.

[1]: https://github.com/sstallion/obsidian-command-line/issues
[2]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[3]: https://nodejs.org/en/about/previous-releases
[4]: https://docs.github.com/en/github/getting-started-with-github/fork-a-repo
[5]: https://docs.obsidian.md/Reference/Manifest
[6]: https://github.com/sstallion/obsidian-command-line/blob/master/package.json
[7]: https://github.com/sstallion/obsidian-command-line/blob/master/CHANGELOG.md
[8]: https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request
[9]: https://docs.github.com/en/actions
[10]: https://github.com/sstallion/obsidian-command-line/actions/workflows/ci.yml
[11]: https://github.com/sstallion/obsidian-command-line/actions/workflows/release.yml
[12]: https://github.com/sstallion/obsidian-command-line/blob/master/manifest.json
[13]: https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin#Step%202%20Create%20a%20release
