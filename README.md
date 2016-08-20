# brackets-open-shell-here

## Windows

Opening `cmd` from Node directly using `spawn`, and detaching the process, causes `stdin` to get lost. If you start a long-running task (like `mocha --watch`), you will not be able to quit it. Ctrl+C will not be sent to the process, and you will have to close the command prompt and open a new one in order to keep working.

C to the rescue. Some native code solves this nicely. To make it as simple as possible, we will spawn the compiled binary using an absolute path, and set the `cwd` of the spawn to the directory path that we want to open. This keeps all the logic in Node and out of C code. Yay.

### Building the native module

The `gulp` build is now capable of building the native C code, provided you have Visual Studio installed. It currently uses some env variables that are only available when Visual Studio is installed. To build it, run:

```bash
gulp compile
```

The output will be created in the correct location.

### Manually building the native module

Ugh. I still don't have a great way of doing this. Basically, install the [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools) (or VS 2015 with C++ enabled). Then, open the "Developer Command Prompt" (this is not the regular `cmd`), and use that to build the file.

```bash
"C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\cl.exe" open.c
```

This will output the `open.exe` binary file. I just copy it manually to the bin directory for now. Ideally, I want to automate all of this, but I have not figured out a good way to do that quite yet. Of course, you have to do this all on Windows.

## Linux and macOS

There are other extensions already that have pretty robust Linux support. I did not find one for Windows (an OS I use regularly), and so I made one. I plan on adding Linux and macOS support as I get time. For now, this module will do nothing on those operating systems.

## Building the extension

_Since this extension currently requires a native module to be build for Windows, it must be run on Windows._

```bash
gulp
```

This will create the requires zip file in the `output` folder.
