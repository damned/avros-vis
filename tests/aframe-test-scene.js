var aframeTestScene = function(recreateOnReset = false) {
  const aframeContainer = document.getElementById('aframe-container')
  let sceneEl = aframeContainer.querySelector('a-scene')
  let select = selector => document.querySelector(selector)

  const scene = {
    reset: () => {
      console.log('called reset...')
      if (recreateOnReset || aframeContainer.querySelector('a-scene') === null) {
        aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
      }
      console.log('before slect in reset...')
      sceneEl = select('a-scene')
      console.log('finished reset...')
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
    addHtmlTo: (root, html, selector) => {
      root.insertAdjacentHTML('afterbegin', html)
      if (selector) {
        return select(selector)
      }
      return undefined
    },
    addHtml: (html, selector) => scene.addHtmlTo(sceneEl, html, selector)
  }
  scene.inScene = scene.within

  scene.reset()

  return scene
}