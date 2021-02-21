/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('creating a boxes scene', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  
  it('should create a box', (done) => {
    boxes.startScene('#aframe-container')
    
    let scene = getScene()
    
    scene.addEventListener('renderstart', () => {
      expect(scene.querySelector('a-box')).to.not.be.null
    })
  })
})