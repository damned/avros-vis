/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('starting a boxes scene', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  
  beforeEach(() => {
    boxes.startScene('#aframe-container')    
  })
  
  it('should create a box', (done) => {
    let scene = getScene()
    
    scene.addEventListener('renderstart', () => {
      expect(scene.querySelector('a-box')).to.not.be.null
      done()
    })
  })
})