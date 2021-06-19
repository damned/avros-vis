var aframeTestScene = function(resetBeforeEach = false) {
  const aframeContainer = document.getElementById('aframe-container')
  let sceneEl = aframeContainer.querySelector('a-scene')

  const scene = {
    recreate: () => {
      if (resetBeforeEach || aframeContainer.querySelector('a-scene') === null) {
        aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
      }
      sceneEl = select('a-scene')
    }
  }

  if (!sceneEl) {
    scene.recreate()
  }
  
  
  let inScene = (handler) => {
    if (sceneEl.renderStarted) {
      handler(sceneEl)
    }
    else {
      sceneEl.addEventListener('renderstart', () => {
        handler(sceneEl)
      })
    }
  }


  let select = selector => document.querySelector(selector)
  let addHtmlTo = (root, html, selector) => {
    root.insertAdjacentHTML('afterbegin', html)
    if (selector) {
      return select(selector)
    }
    return undefined
  }
  let addToScene = (html, selector) => addHtmlTo(sceneEl, html, selector)

  return scene
}