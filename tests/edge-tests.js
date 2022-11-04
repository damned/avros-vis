/* global AFRAME THREE au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('edge component', () => {
  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })
  let source, dest

  describe('using from property on destination', () => {
    it('should create a line from source to destination', (done) => {
      source = root.addHtml('<a-sphere id="source0" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source0" position="1 1 -1">')

      dest.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.start).to.eql({x: -2, y: 1, z: -1})
        done()
      })
    })

    describe('when source is already loaded', () => {
      it('should create a line from source to destination', (done) => {
        source = root.addHtml('<a-sphere id="source10" radius="0.1" position="1 2 -1">')
        
        source.addEventListener('loaded', () => {
          dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source10; color: red" position="0 0 -1">')

          dest.addEventListener('edged', event => {
            let addedLine = event.detail.edgeEntity.components.line
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
      dest = root.addHtml('<a-sphere id="dest20" radius="0.1" position="1 1 -1">')
      source = root.addHtml('<a-sphere edge="to: #dest20" radius="0.1" position="-1 2 -2">')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 2, y: -1, z: 1})
        done()
      })
    })
  })

  describe('using multiple edges', () => {
    it('should create a line from source to two destinations', (done) => {
      dest = root.addHtml('<a-sphere id="dest-multi" radius="0.1" position="0 1 -1">')
      let dest2 = root.addHtml('<a-sphere id="dest-multi-2" radius="0.1" position="1 1 -1">')
      source = root.addHtml('<a-sphere edge="to: #dest-multi" edge__2="to: #dest-multi-2" radius="0.1" position="-1 2 -2">')

      let edgeCreatedCount = 0
      let addedLine1, addedLine2
      source.addEventListener('edged', event => {
        console.log('edged received in test')
        edgeCreatedCount += 1
        if (edgeCreatedCount < 2) {
          addedLine1 = event.detail.edgeEntity.components.line
          return
        }
        else {
          addedLine2 = event.detail.edgeEntity.components.line
        }
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
      dest = root.addHtml('<a-sphere id="destx" radius="0.1" position="1 1 1">')
      source = root.addHtml('<a-sphere id="sourcex" edge="to: #destx" radius="0.1" position="0 0 0" scale="0.5 0.5 0.5">')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 2, y: 2, z: 2})
        done()
      })
    })

    it('should create a line on source that compensates for scale to itself at origin', (done) => {
      dest = root.addHtml('<a-sphere id="destxx" radius="0.1" position="1 1 1">')
      source = root.addHtml('<a-sphere edge="from: #destxx" radius="0.1" position="-1 -1 -1" scale="0.5 0.5 0.5">')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.start).to.eql({x: 4, y: 4, z: 4})
        expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
        done()
      })
    })

    it('should create edge to a entity nested in a scaled space', (done) => {
      dest = root.addHtml('<a-entity position="2 0 0" scale="3 3 3"><a-sphere id="desty" radius="0.1" position="1 1 1"></a-entity>', '#desty')
      source = root.addHtml('<a-sphere edge="to: #desty" radius="0.1" position="1 1 1">')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: 4, y: 2, z: 2})
        done()
      })
    })

    it('should create edge from a entity nested in a scaled space', (done) => {
      dest = root.addHtml('<a-entity position="2 0 0" scale="3 3 3"><a-sphere id="destz" radius="0.1" position="1 1 1"></a-entity>', '#destz')
      source = root.addHtml('<a-sphere edge="from: #destz" radius="0.1" position="1 1 1">')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.end).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.start).to.eql({x: 4, y: 2, z: 2})
        done()
      })
    })

  })  

  describe('edges with space offsets', () => {
    it('should create edge on a source entity in an offset space', (done) => {
      dest = root.addHtml('<a-sphere id="desta" radius="0.1" position="1 1 1">')
      source = root.addHtml('<a-entity position="2 0 0" scale="2 2 2">' +
          '<a-sphere id="sourcea" edge="to: #desta" radius="0.1" position="1 1 1">' +
        '</a-entity>', '#sourcea')

      source.addEventListener('edged', event => {
        let addedLine = event.detail.edgeEntity.components.line
        expect(addedLine.data.start).to.eql({x: 0, y: 0, z: 0})
        expect(addedLine.data.end).to.eql({x: -1.5, y: -0.5, z: -0.5})
        done()
      })
    })
  })
})