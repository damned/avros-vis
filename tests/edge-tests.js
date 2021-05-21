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
        '<a-scene embedded style="height: 300px; width: 600px;">' + 
        '</a-scene>')

    scene = select('a-scene')
  })
      
  it('should create a line from source to destination when using from property on destination', (done) => {
    addToScene('<a-box id="start" position="-1 2 -2">')
    source = select('#start')
    addToScene('<a-box id="dest" edge="from: #start" position="1 1 -1">')
    dest = select('#dest')
    
    dest.addEventListener('edged', () => {
      expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
      expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
      expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
      done()
    })
  })
  
  describe('when thing being placed on is already loaded', () => {
    it('should place its host entity directly on top of its on base', (done) => {
      base.addEventListener('loaded', () => {
        addToScene('<a-box id="host" placement="on: #base">')
        host = select('#host')

        host.addEventListener('placed', () => {
          expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
          expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
          expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
          done()
        })
      })
    })    
  })
})