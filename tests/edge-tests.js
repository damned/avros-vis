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
    aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'

    scene = select('a-scene')
  })
  
  describe('using from property on destination', () => {
    it('should create a line from source to destination', (done) => {
      addToScene('<a-sphere id="source" radius="0.1" position="-1 2 -2">')
      source = select('#source')
      addToScene('<a-sphere id="dest" radius="0.1" edge="from: #source" position="1 1 -1">')
      dest = select('#dest')

      dest.addEventListener('edged', () => {
        let addedLine = dest.components.line__undefined
        expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.start).to.eql({x: -2, y: 1, z: -1})
        done()
      })
    })

    describe('when source is already loaded', () => {
      it('should create a line from source to destination', (done) => {
        addToScene('<a-sphere id="source" radius="0.1" position="1 2 -1">')
        source = select('#source')
        
        source.addEventListener('loaded', () => {
          addToScene('<a-sphere id="dest" radius="0.1" edge="from: #source; color: red" position="0 0 -1">')
          dest = select('#dest')

          dest.addEventListener('edged', () => {
            let addedLine = dest.components.line__undefined
            expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
            expect(addedLine.data.start).to.eql({x: 1, y: 2, z: 0})
            done()
          })
        })
      })
    })
  })

  describe('using to property on source', () => {
    it('should create a line from source to destination', (done) => {
      addToScene('<a-sphere id="dest" radius="0.1" position="1 1 -1">')
      dest = select('#dest')
      addToScene('<a-sphere id="source" edge="to: #dest" radius="0.1" position="-1 2 -2">')
      source = select('#source')

      source.addEventListener('edged', () => {
        let addedLine = source.components.line__undefined
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 2, y: -1, z: 1})
        done()
      })
    })
  })

})