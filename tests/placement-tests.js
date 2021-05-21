/* global AFRAME THREE aframeUtils */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('placement component', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive
  const bounds = au.world.bounds
  const height = au.world.height
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom
  const pos = el => el.object3D.position

  let scene, table, host

  let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)  
  
  beforeEach(() => {
    aframeContainer.insertAdjacentHTML('afterbegin', 
        '<a-scene embedded style="height: 300px; width: 600px;">' + 
          '<a-box id="table" position="0 0.6 -1.2" color="darkgray" height="1">' + 
        '</a-scene>')

    scene = select('a-scene')

    table = document.querySelector('#table')
    table.innerHTML = ''
  })
      
  let afterTick = au.tick
  let afterDoubleTick = au.doubleTick
  
  it('should place its host entity directly on top of its on base', (done) => {
    addToScene('<a-box id="host" placement="on: #table">')
    host = select('#host')
    
    host.addEventListener('placed', () => {
      expect(bottom(host)).to.be.closeTo(top(table), TOLERANCE)
      expect(pos(host).x).to.be.closeTo(pos(table).x, TOLERANCE)
      expect(pos(host).z).to.be.closeTo(pos(table).z, TOLERANCE)
      done()
    })
  })
  
  describe('when thing being placed on is already loaded')
})