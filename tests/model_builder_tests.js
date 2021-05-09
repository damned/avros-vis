/* global AFRAME boxes */
var chai = chai || {}
var expect = chai.expect

describe('model builder', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let scene

  beforeEach(() => {
    aframeContainer.innerHTML = ''
    aframeContainer.appendChild(document.createElement('a-scene'))
    scene = aframeContainer.querySelector('a-scene')
  })
    
  it('should add a plate', (done) => {
    
  })
})