# Project Visualisation

Visualising a system in VR/AR in tabletop format using WebXR

## Stack

Built with [A-Frame](https://aframe.io), a web framework for building virtual reality experiences.

## Development

The project is a mix of manual spiking and some test-driven components.

The details of what's being done are tracked in [todo.txt](todo.txt)

If working on glitch, tests can be run by visiting here:

[https://tilt-viz.glitch.me/tests.html](https://tilt-viz.glitch.me/tests.html)

### Local development

The mocha tests can be opened locally in browser (chrome used for dev) by 
using local file path to `tests.html`, something like `xdg-open` makes that easy.

```
xdg-open tests.html
```

Of course a refresh will re-run the tests.

You can also run tests headless on chromium, actually seems pretty stable:

```
./test
```

Or

```
npm test
```

### Local running with images

Due to permissions limitations certain aspects, such as images, are not loaded
correctly from file locally, but you can start a server running
locally (on `http://localhost:8000/`) by running:

```
./run
```

This requires a working `python3` interpreter.
