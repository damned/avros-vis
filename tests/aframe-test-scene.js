/* global au */

var aframeTestScene = function(options = {recreateOnReset: false}) {
  const aframeContainer = document.getElementById('aframe-container')
  let sceneEl = aframeContainer.querySelector('a-scene')
  let select = selector => document.querySelector(selector)
  let roots = {}

  const scene = {
    reset: () => {
      if (options.recreateOnReset || aframeContainer.querySelector('a-scene') === null) {
        aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
        roots = {}
      }
      sceneEl = select('a-scene')
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
        return select(selector)
      }
      return undefined
    },
    addHtml: (html, selector) => scene.addHtmlTo(sceneEl, html, selector)
  }
  scene.inScene = scene.within
  
  function Root(prefix) {
    let rootEl = scene.addHtml(`<a-entity id="${prefix}-test-root">`, `#${prefix}-test-root`)
    const root = {
      addHtml: (html, selector) => scene.addHtmlTo(rootEl, html, selector),
      addHtmlTo: (parent, html, selector) => scene.addHtmlTo(parent, html, selector),
      el: rootEl,
      makeViewable: () => {
        rootEl.setAttribute('position', '0 1 0')
        rootEl.setAttribute('scale', '0.2 0.2 0.2')
      },
      prefix: prefix,
      select: selector => rootEl.querySelector(selector),
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
      roots[prefix] = Root(prefix)
    }
    return roots[prefix]
  }


  scene.reset()

  return scene
}