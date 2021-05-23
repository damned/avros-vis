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
        let addedLine = dest.components.line
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
            let addedLine = dest.components.line
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
        let addedLine = source.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 2, y: -1, z: 1})
        done()
      })
    })
  })

  describe('using multiple edges', () => {
    it('should create a line from source to two destinations', (done) => {
      addToScene('<a-sphere id="dest" radius="0.1" position="0 1 -1">')
      dest = select('#dest')
      addToScene('<a-sphere id="dest2" radius="0.1" position="1 1 -1">')
      let dest2 = select('#dest2')
      addToScene('<a-sphere id="source" edge="to: #dest" edge__2="to: #dest2" radius="0.1" position="-1 2 -2">')
      source = select('#source')

      let edgeCreatedCount = 0
      source.addEventListener('edged', () => {
        edgeCreatedCount += 1
        if (edgeCreatedCount < 2) return
        let addedLine1 = source.components.line
        let addedLine2 = source.components.line__2
        expect(addedLine1.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine2.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine1.data.end).to.eql({x: 1, y: -1, z: 1})
        expect(addedLine2.data.end).to.eql({x: 2, y: -1, z: 1})
        done()
      })
    })
  })
  
  describe('edges from entities not at default scale', () => {
    it('should create a line on source that compensates for scale from itself at origin', (done) => {
      addToScene('<a-sphere id="dest" radius="0.1" position="1 1 1">')
      dest = select('#dest')
      addToScene('<a-sphere id="source" edge="to: #dest" radius="0.1" position="0 0 0" scale="0.5 0.5 0.5">')
      source = select('#source')

      source.addEventListener('edged', () => {
        let addedLine = source.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 2, y: 2, z: 2})
        done()
      })
    })

    it('should create a line on source that compensates for scale to itself at origin', (done) => {
      addToScene('<a-sphere id="dest" radius="0.1" position="1 1 1">')
      dest = select('#dest')
      addToScene('<a-sphere id="source" edge="from: #dest" radius="0.1" position="-1 -1 -1" scale="0.5 0.5 0.5">')
      source = select('#source')

      source.addEventListener('edged', () => {
        let addedLine = source.components.line
        expect(addedLine.data.start).to.eql({x: 4, y: 4, z: 4})
        expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
        done()
      })
    })

    it('should create edge to a entity nested in a scaled space', (done) => {
      addToScene('<a-entity position="2 0 0" scale="3 3 3"><a-sphere id="dest" radius="0.1" position="1 1 1"></a-entity>')
      dest = select('#dest')
      addToScene('<a-sphere id="source" edge="to: #dest" radius="0.1" position="1 1 1">')
      source = select('#source')

      source.addEventListener('edged', () => {
        let addedLine = source.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 4, y: 2, z: 2})
        done()
      })
    })

  })  

  describe('edges with space offsets', () => {
    it('should create edge on a source entity in an offset space', (done) => {
      addToScene('<a-sphere id="dest" radius="0.1" position="1 1 1">')
      dest = select('#dest')
      addToScene('<a-entity position="2 0 0" scale="3 3 3">' + 
                   '<a-sphere id="source" edge="to: #dest" radius="0.1" position="1 1 1">' + 
                 '</-a-entity>')
      source = select('#source')

      source.addEventListener('edged', () => {
        let addedLine = source.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: -4, y: -2, z: -2})
        done()
      })
    })
  })
})