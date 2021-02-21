/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('starting a boxes scene', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  let scene
  
  beforeEach(() => {
    boxes.startScene('#aframe-container')
    scene = getScene()
  })
  
  it('should create a box', (done) => {
    scene.addEventListener('renderstart', () => {
      expect(scene.querySelector('a-box')).to.not.be.null
      done()
    })
  })
})