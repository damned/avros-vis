/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('creating a boxes scene', () => {
  it('should create a box', () => {
    let aframeContainer = document.getElementById('aframe-container')
    
    boxes.startScene('#aframe-container')
    
    let sceneEl = document.querySelector('a-scene')
    
    
    let box
  })
})