/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('starting a boxes scene', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  let scene
  let inScene = (handler) => scene.addEventListener('renderstart', () => {
    handler(scene)
    aframeContainer.removeChild(scene)
  })
  
  beforeEach(() => {
    boxes.startScene('#aframe-container')
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