/* global au THREE AFRAME */
let decorateAsTestable = (entity) => {
  Object.defineProperty(
    entity,
    'position',
    {
      get: function() {
        return entity.object3D.position
      }
    }
  )
  Object.defineProperty(
    entity,
    'rotation',
    {
      get: function() {
        return entity.object3D.rotation
      }
    }
  )
  entity.moveTo = pos => {
    entity.position.copy(pos)
  }
  return entity
}

const aframeTestScene = function(overrides) {
  const options = Object.assign({
    recreateOnReset: false
  }, overrides)
  const sceneName = () => {
    if (options.sceneName) {
      return options.sceneName
    }
    if (options.context) {
      console.log('context', options.context.test.parent)
      return options.context.test.parent.title
    }
    throw new Error('sceneName not set')
  }
  const sceneId = () => sceneName().toLowerCase().replaceAll(' ', '-')
  const aframeContainer = document.getElementById('aframe-container')
  let sceneEl = aframeContainer.querySelector('a-scene')
  let select = selector => document.querySelector(selector)
  let roots = {}
  console.log('initializing orderedRoots for scene ' + sceneId())
  let orderedRoots = []
  let currentReviewIndex = 0;
  let reviewerCameraRig = null;

  const debugVrMode = (context, sceneEl) => {
    console.log(context)
    console.log("is('vr-mode')", sceneEl.is('vr-mode'))
    console.log('headset connected', AFRAME.utils.device.checkHeadsetConnected())
    if (AFRAME.utils.device.checkHeadsetConnected()) {
      select('#elephant').setAttribute('color', 'blue')
    }
    console.log('is mobile (simple viewer)', AFRAME.utils.device.isMobile())
    if (AFRAME.utils.device.isMobile()) {
      select('#elephant').setAttribute('color', 'pink')
    }
  }
  
  const viewTest = index => {
    console.log('orderedRoots length', orderedRoots.length, 'in scene', sceneId())
    let rootToView = orderedRoots[Math.max(index, 0) % orderedRoots.length]
    if (rootToView !== undefined) {
      reviewerCameraRig.object3D.position.x = rootToView.el.object3D.position.x
    }
  }
  
  const KEYCODE_LEFT_ANGLE = 188
  const KEYCODE_RIGHT_ANGLE = 190
  
  const testReviewSetup = (sceneEl) => {
    sceneEl.addEventListener('enter-vr', () => {
      select('#elephant').setAttribute('color', 'red')
      debugVrMode('entered VR', sceneEl)
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        reviewerCameraRig = select('#camera-rig')
        viewTest(currentReviewIndex)
        const rightHand = scene.addHtmlTo(reviewerCameraRig, '<a-entity id="righty" oculus-touch-controls="hand: right"></a-entity>', '#righty')
        select('#elephant').setAttribute('color', 'pink')
        rightHand.addEventListener('abuttondown', event => {
          currentReviewIndex += 1            
          viewTest(currentReviewIndex)
          select('#elephant').setAttribute('color', 'white')
        })
      }
      if (!AFRAME.utils.device.checkHeadsetConnected()) {
        reviewerCameraRig = select('#camera-rig')
        viewTest(currentReviewIndex)
        window.addEventListener('keydown', event => {
          console.log('keydown', event.keyCode)
          if (event.keyCode === KEYCODE_LEFT_ANGLE) {
            currentReviewIndex -= 1
            viewTest(currentReviewIndex)
            select('#elephant').setAttribute('color', 'black')
          }
          else if (event.keyCode === KEYCODE_RIGHT_ANGLE) {
            currentReviewIndex += 1            
            viewTest(currentReviewIndex)
            select('#elephant').setAttribute('color', 'white')
          }
        })
      }
    }) 
    sceneEl.addEventListener('exit-vr', () => {
      select('#elephant').setAttribute('color', 'green')
      debugVrMode('exited VR', sceneEl)
      currentReviewIndex += 1
    })
    if (AFRAME.utils.device.checkHeadsetConnected()) {
      select('#elephant').setAttribute('color', 'yellow')
    }
    if (AFRAME.utils.device.isMobile()) {
      select('#elephant').setAttribute('color', 'orange')
    }

  }
  
  let consoleEl
  const scene = {
    reset: () => {
      au.log('running reset for scene: ' + sceneId())
      if (options.recreateOnReset || aframeContainer.querySelector('a-scene#' + sceneId()) === null) {
        aframeContainer.insertAdjacentHTML('afterbegin', '<a-scene id="' + sceneId() + '" embedded style="height: 300px; width: 600px;" background="color: lightgray">' 
            + '<a-entity id="camera-rig"><a-camera></a-camera></a-entity>' 
            + '<a-box id="elephant" position="2 2 2" scale="2 2 2" color="black"></a-box>' 
            + '</a-scene>')
        roots = {}
        sceneEl = select('a-scene#' + sceneId())
        testReviewSetup(sceneEl)
        console.log('wiring test review setup for scene: ' + sceneId())
      }
    },
    within: (handler) => {
      if (sceneEl.renderStarted) {
        handler(sceneEl)
      }
      else {
        sceneEl.addEventListener('renderstart', () => {
          handler(sceneEl)
        })
      }
    },
    addHtmlTo: (parent, html, selector) => {
      parent.insertAdjacentHTML('afterbegin', html)
      if (selector) {
        return decorateAsTestable(select(selector))
      }
      return undefined
    },
    addHtml: (html, selector) => scene.addHtmlTo(sceneEl, html, selector),
    turnOnConsole: () => {
      if (consoleEl === undefined) {
        consoleEl = scene.addHtml('<a-text class="console" position="0 2 -2" value="console"></a-text>', '#' + sceneId() + ' .console')
      }
    }
  }
  scene.inScene = scene.within
  let actionDelayMs = 20
  let applyAction = (handler) => {
    if (sceneEl.renderStarted) {
      console.log('render already started!')
      setTimeout(() => { // maybe really should be waiting for next render cycle (or complete this and another?)
        handler()
      }, actionDelayMs)
    }
    else {
      console.log('waiting for render to start')
      sceneEl.addEventListener('renderstart', handler)
    }
  }
  let applyActions = function() {
    let handlers = Array.from(arguments)
    handlers.forEach((handler, i) => {
      if (typeof handler === 'function') {
        au.log(`great, action handler ${i} is a function`, handler.toString())
      }
      else {
        au.log(`oh dear, action handler ${i} is not a function`, handler.toString())
      }
    })
    applyAction(() => {
      au.catching(handlers[0], 'handler 0')
      if (handlers.length > 1) {
        applyActions.apply(this, handlers.slice(1))
      }
    })
  }
  scene.actions = applyActions
  
  function Root(prefix, index) {
    let testContext = undefined
    let test = undefined
    const setTextContext = (ctx) => {
      if (ctx === window) {
        console.warn('testing using arrow test function? use normal test functions to allow access to test context with "this"')
      }
      else if (ctx.test === undefined) {
        console.warn('passed argument as test context does not have test information, should use "this" to access mocha test context')
      }
      test = ctx.test
      testContext = ctx
    }
    let splitIntoLines = (text, lineSize) => {
      let lines = ''
      let line = ''
      text.split(' ').forEach(word => {
        let separator = ''
        line += word
        if (lines.length > 0) {
          if (line.length > lineSize) {
            separator = '\n'
            line = ''            
          }
          else {
            separator = ' '
            line += ' '
          }
        }
        lines += separator + word
      })
      return lines
    }
    let testName = () => {
      if (test) {
        console.log('test', test)
        return splitIntoLines(test.title, 20)
        // return test.fullTitle() // including ancestor titles
      }
      return 'test-' + index
    }
    let rootEl = au.entity(sceneEl, 'a-entity', { id: `${prefix}-test-root`})
    const root = {
      addHtml: (html, selector) => scene.addHtmlTo(rootEl, html, selector),
      addHtmlTo: (parent, html, selector) => scene.addHtmlTo(parent, html, selector),
      el: rootEl,
      makeViewable: () => {
        scene.turnOnConsole()
        let x = -1 + index * 0.5
        let scale = 0.15        
        const displayRootWireframe = false
        if (displayRootWireframe) {
          const box = new THREE.BoxHelper( rootEl.object3D, 'lightyellow' );
          rootEl.object3D.add( box );          
        }
        
        rootEl.setAttribute('balloon-label', `label: ${testName()}; y-offset: 0; scale: 0.1`)
        rootEl.setAttribute('position', `${x} 1 -0.5`)
        rootEl.setAttribute('scale', `${scale} ${scale} ${scale}`)
      },
      prefix: prefix,
      select: selector => rootEl.querySelector(selector),
      testing: (testContext) => {
        setTextContext(testContext)
      },
      withMark: (vector3, color = 'red') => {
        let markPos = au.xyzTriplet(vector3)
        console.log('mark pos', markPos)
        au.entity(rootEl, 'a-sphere', { radius: 0.02, color: color, position: markPos})
        return vector3
      }
    }
    
    let testBoxHtml = (id, name, pos, color, options, extraAttributes) => {
      let attributes = Object.assign({
        id: id,
        depth: options.boxSize,
        width: options.boxSize,
        height: options.boxSize,
        'balloon-label': {
          label: name, 
          'y-offset': options.boxSize - 0.5
        },
        material: {
          color: color, 
          transparent: true, 
          opacity: 0.3
        },
        position: pos
      }, extraAttributes)
      
      return au.entityHtml('a-box', attributes)
    }
    
    root.id = name => {
      return `${prefix}-${name}`
    }

    root.addTestBoxTo = (parent, name, pos, color, options, extraAttributes) => {
      let testBoxId = root.id(name)

      let html = testBoxHtml(testBoxId, name, pos, color, options, extraAttributes)      
      
      return root.addHtmlTo(parent, html, '#' + testBoxId)
    }
    
    root.addTestBox = (name, pos, color, options, extraAttributes) => {
      return root.addTestBoxTo(rootEl, name, pos, color, options, extraAttributes)
    }
        
    root.testBoxIn = (parent, name, attributes = {}) => {
      let defaults = {
        'balloon-label': {
          label: name,
          'y-offset': 1.2
        },
        material: {
          color: attributes.color || 'purple',
          transparent: true, 
          opacity: 0.3
        },
      }
      let merged = Object.assign(defaults, { id: root.id(name) }, attributes)
      return au.entity(parent, 'a-box', merged)
    }

    root.testBox = (name, attributes = {}) => {
      return root.testBoxIn(rootEl, name, attributes)
    }
    
    let _markRootEl
    const markRoot = () => {
      if (_markRootEl === undefined) {
        _markRootEl = au.entity(rootEl, 'a-entity', { id: `${prefix}-test-mark-root`})
      }
      return _markRootEl
    }

    root.markBox = attributes => {
      let defaults = {
        material: {
          wireframe: true
        }
      }
      let merged = Object.assign(defaults, { id: root.id(name) }, attributes)
      return au.entity(markRoot(), 'a-box', merged)
    }
    
    root.entity = (entity, attributes) => {
      return au.entity(rootEl, entity, attributes)
    }
    
    return root
  }
  
  scene.addRoot = (prefix) => {
    const randomId = () => 'root' + Math.random().toString(36).substring(7)
    if (!prefix) {
      prefix = randomId()
    }
    
    if (!roots[prefix]) {
      let index = Object.keys(roots).length
      roots[prefix] = Root(prefix, index)
      console.log('adding to orderedRoots using index ' + index)
      orderedRoots[index] = roots[prefix]
      console.log('orderedRoots length ' + orderedRoots.length)
    }
    return roots[prefix]
  }


  scene.reset()

  return scene
}