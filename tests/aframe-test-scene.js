/* global aframeUtils */

var aframeTestScene = function(options = {recreateOnReset: false}) {
  const au = aframeUtils
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
      withMark: vector3 => {
        let markPos = au.xyzTriplet(vector3)
        console.log('mark pos', markPos)
        scene.addHtmlTo(rootEl, `<a-sphere radius="0.02" color="red" position="${markPos}"></a-sphere>`)
        return vector3
      }
    }


    let attributeHtml = (properties) => {
      return Object.keys(properties).map(key => `${key}: ${properties[key]}`).join('; ')
    }
    
    let attributeValue = (value) => {
      if (typeof(value) == 'object') {
        return attributeHtml(value)
      }
      return value
    }
    
    let entityHtml = (entity, attributes) => {
      let attribString = Object.keys(attributes).map(key => `${key}="${attributeValue(attributes[key])}"`).join(' ')
      return '<' + entity + ' ' + attribString + '></' + entity + '>'
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
      
      return entityHtml('a-box', attributes)
    }
    
    root.addTestBoxTo = (parent, name, pos, color, options, extraAttributes) => {
      let testBoxId = `${prefix}-${name}`

      let html = testBoxHtml(testBoxId, name, pos, color, options, extraAttributes)      
      
      return root.addHtmlTo(parent, html, '#' + testBoxId)
    }
    
    root.addTestBox = (name, pos, color, options, extraAttributes) => {
      return root.addTestBoxTo(rootEl, name, pos, color, options, extraAttributes)
    }
    
    return root
  }
  
  scene.addRoot = (prefix) => {
    if (!roots[prefix]) {
      roots[prefix] = Root(prefix)
    }
    return roots[prefix]
  }


  scene.reset()

  return scene
}