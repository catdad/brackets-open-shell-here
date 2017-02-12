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

There are other extensions already that have pretty robust Linux support. I did not find one for Windows (an OS I use regularly), and so I made one. I plan on adding [Linux](https://github.com/catdad/brackets-open-shell-here/issues/1) and [macOS](https://github.com/catdad/brackets-open-shell-here/issues/2) support as I get time. For now, this module will do nothing on those operating systems.

## Building the extension

```bash
gulp
```

This will create the requires zip file in the `output` folder.
