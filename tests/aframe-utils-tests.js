/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('aframe utils', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  let scene
  let inScene = (handler) => scene.addEventListener('renderstart', () => {
    handler(scene)
    aframeContainer.removeChild(scene)
  })
  
  beforeEach(() => {
    let newScene = document.createElement('a-scene')
    newScene.innerHTML = 
    aframeContainer.appendChild(newScene)
    scene = getScene()
  })
    
  it('should create a box', (done) => {
    inScene(scene => {
      expect(scene.querySelector('a-box')).to.not.be.null
      done()
    })
  })
  
  it('the box should be red', (done) => {
    inScene(scene => {
      let box = scene.querySelector('a-box')
      expect(box.getAttribute('color')).to.equal('red')
      done()
    })
  })
})