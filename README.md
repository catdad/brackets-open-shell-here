# brackets-open-shell-here

[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![devDependencies Status][15]][16]

[1]: https://travis-ci.org/catdad/brackets-open-shell-here.svg?branch=master
[2]: https://travis-ci.org/catdad/brackets-open-shell-here

[3]: https://codeclimate.com/github/catdad/brackets-open-shell-here/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/brackets-open-shell-here/coverage

[5]: https://codeclimate.com/github/catdad/brackets-open-shell-here/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/brackets-open-shell-here

[15]: https://david-dm.org/catdad/brackets-open-shell-here/dev-status.svg
[16]: https://david-dm.org/catdad/brackets-open-shell-here?type=dev

## Windows

Supported shells include the default CMD, PowerShell, and on Windows 10, when enabled, bash is supported as well.

## Linux and macOS

Ubuntu is now supported, using `gnome-terminal`. If you requite any other distros, please feel free to [open a new issue](https://github.com/catdad/brackets-open-shell-here/issues/new) and I will take a look.

I plan on adding [macOS](https://github.com/catdad/brackets-open-shell-here/issues/2) support as I get time (and a system to test on). For now, this extension will do nothing on a Mac.

## Building the extension

```bash
gulp
```

This will create the requires zip file in the `output` folder.
