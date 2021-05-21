/* global AFRAME THREE aframeUtils */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('edge component', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom
  const pos = el => el.object3D.position

  let scene, source, dest

  let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)  
  
  beforeEach(() => {
    aframeContainer.insertAdjacentHTML('afterbegin', 
        '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>')

    scene = select('a-scene')
  })
      
  it('should create a line from source to destination when using from property on destination', (done) => {
    addToScene('<a-sphere id="source" radius="0.1" position="-1 2 -2">')
    source = select('#source')
    addToScene('<a-sphere id="dest" radius="0.1" edge="from: #source" position="1 1 -1">')
    dest = select('#dest')
    
    dest.addEventListener('edged', () => {
      let addedLine = dest.components.line
      expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
      expect(addedLine.data.start).to.eql({x: -2, y: 1, z: -1})
      done()
    })
  })
  
  describe('when thing being placed on is already loaded', () => {
  })
})