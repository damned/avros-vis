/* global AFRAME THREE au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('edge component', () => {
  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(() => {
    scene.reset()
    root = scene.addRoot()
  })
  afterEach(() => root.makeViewable())
  let source, dest

  const worldPositionOfLocal = (entity, localPosition) => {
    entity.object3D.updateWorldMatrix(true, false)
    let local = new THREE.Vector3(localPosition.x, localPosition.y, localPosition.z)
    return entity.object3D.localToWorld(local)
  }

  const lineStartWorldPosition = (entity) => {
    return worldPositionOfLocal(entity, entity.components.fatline.data.start)
  }

  const lineEndWorldPosition = (entity) => {
    return worldPositionOfLocal(entity, entity.components.fatline.data.end)
  }

  describe('using from property on destination', () => {
    it('should create a line from source to destination', function (done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="source0" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source0" position="1 1 -1">')

      dest.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)
        done()
      })
    })

    it('should move line between source and destination to new position when source is moved', function(done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="sourcemv" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #sourcemv" position="1 1 -1">')

      scene.actions(() => {
        source.moveTo({x: -1, y: 2, z: -3})
        source.emit('moveend', {})

        dest.addEventListener('edged', event => {
          let lineEntity = event.detail.edgeEntity;
          expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
          expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)
          done()
        })
      })
    })

    it('should move line between source and destination to new position when destination is moved', function(done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="sourcemv2" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #sourcemv2" position="1 1 -1">')

      scene.actions(() => {
        dest.moveTo('1 2 -1')
        dest.emit('moveend', {})

        dest.addEventListener('edged', event => {
          let lineEntity = event.detail.edgeEntity;

          expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
          expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)

          done()
        })
      })
    })

    it('should move line when source has been automatically (re-)placed', function(done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="source-replace-1" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source-replace-1" position="1 1 -1">')

      scene.actions(() => {
        source.moveTo('-1 2 -3')
        source.emit('placed', {})

        dest.addEventListener('edged', event => {
          let lineEntity = event.detail.edgeEntity;
          expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
          expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)
          done()
        })
      })
    })

    it('should move line when destination has been automatically (re-)placed', function(done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="source-replace-2" radius="0.1" position="-1 2 -2">')
      dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source-replace-2" position="1 1 -1">')

      scene.actions(() => {
        dest.moveTo('1 2 -1')
        dest.emit('placed', {})

        dest.addEventListener('edged', event => {
          let lineEntity = event.detail.edgeEntity;

          expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
          expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)

          done()
        })
      })
    })

    describe('when source is already loaded', () => {
      it('should create a line from source to destination', function (done) {
        root.testing(this)

        source = root.addHtml('<a-sphere id="source10" radius="0.1" position="1 2 -1">')

        source.addEventListener('loaded', () => {
          dest = root.addHtml('<a-sphere radius="0.1" edge="from: #source10; color: red" position="0 0 -1">')

          dest.addEventListener('edged', event => {
            let lineEntity = event.detail.edgeEntity;

            expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
            expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)

            done()
          })
        })
      })
    })
  })

  describe('using to property on source', () => {
    it('should create a line from source to destination', function (done) {
      root.testing(this)

      dest = root.addHtml('<a-sphere id="dest20" radius="0.1" position="1 1 -1">')
      source = root.addHtml('<a-sphere edge="to: #dest20" radius="0.1" position="-1 2 -2">')

      source.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.position)
        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.position)

        done()
      })
    })
  })

  describe('using multiple edges', () => {
    it('should create a line from source to two destinations', function (done) {
      root.testing(this)

      dest = root.addHtml('<a-sphere id="dest-multi" radius="0.1" position="0 1 -1">')
      let dest2 = root.addHtml('<a-sphere id="dest-multi-2" radius="0.1" position="1 1 -1">')
      source = root.addHtml('<a-sphere edge="to: #dest-multi" edge__2="to: #dest-multi-2" radius="0.1" position="-1 2 -2">')

      let edgeCreatedCount = 0
      let addedLineHost1, addedLineHost2
      source.addEventListener('edged', event => {
        console.log('edged received in test')
        edgeCreatedCount += 1
        if (edgeCreatedCount < 2) {
          addedLineHost1 = event.detail.edgeEntity
          return
        } else {
          addedLineHost2 = event.detail.edgeEntity
        }

        expect(lineStartWorldPosition(addedLineHost1)).to.shallowDeepEqual(source.position)
        expect(lineStartWorldPosition(addedLineHost2)).to.shallowDeepEqual(source.position)
        expect(lineEndWorldPosition(addedLineHost1)).to.shallowDeepEqual(dest.position)
        expect(lineEndWorldPosition(addedLineHost2)).to.shallowDeepEqual(dest2.position)

        done()
      })
    })
  })
  
  describe('edges from entities not at default scale', () => {
    
    it('should create a line on source that compensates for scale from itself at origin', function (done) {
      root.testing(this)

      dest = root.addHtml('<a-sphere id="destx" radius="0.1" position="1 1 1">')
      source = root.addHtml('<a-sphere id="sourcex" edge="to: #destx" radius="0.1" position="0 0 0" scale="0.5 0.5 0.5">')

      source.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.worldPosition)
        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.worldPosition)

        done()
      })
    })

    it('should create a line on source that compensates for scale to itself at origin', function (done) {
      root.testing(this)

      source = root.addHtml('<a-sphere id="sourcexx" radius="0.1" position="1 1 1">')
      dest = root.addHtml('<a-sphere edge="from: #sourcexx" radius="0.1" position="-1 -1 -1" scale="0.5 0.5 0.5">')

      dest.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        // interestingly here position will be same as worldPosition as the scale only matters internally
        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.worldPosition)
        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.worldPosition)

        done()
      })
    })

    it('should create edge to a entity nested in a scaled space', function (done) {
      root.testing(this)

      dest = root.addHtml('<a-entity position="2 0 0" scale="3 3 3"><a-sphere id="desty" radius="0.1" position="1 1 1"></a-entity>', '#desty')
      source = root.addHtml('<a-sphere edge="to: #desty" radius="0.1" position="1 1 1">')

      source.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.worldPosition)
        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.worldPosition)

        done()
      })
    })

    it('should create edge from a entity nested in a scaled space', function (done) {
      root.testing(this)

      source = root.addHtml('<a-entity position="2 0 0" scale="3 3 3"><a-sphere id="sourcez" radius="0.1" position="1 1 1"></a-entity>',
        '#sourcez')
      dest = root.addHtml('<a-sphere edge="from: #sourcez" radius="0.1" position="1 1 1">')

      dest.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.worldPosition)
        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.worldPosition)

        done()
      })
    })

  })  

  describe('edges with space offsets', () => {
    it('should create edge on a source entity in an offset space', function (done) {
      root.testing(this)
      dest = root.addHtml('<a-sphere id="desta" radius="0.1" position="1 1 1">')
      source = root.addHtml('<a-entity position="2 0 0" scale="2 2 2">' +
          '<a-sphere id="sourcea" edge="to: #desta" radius="0.1" position="1 1 1">' +
        '</a-entity>', '#sourcea')

      source.addEventListener('edged', event => {
        let lineEntity = event.detail.edgeEntity;

        expect(lineStartWorldPosition(lineEntity)).to.shallowDeepEqual(source.worldPosition)
        expect(lineEndWorldPosition(lineEntity)).to.shallowDeepEqual(dest.worldPosition)

        done()
      })
    })
  })
})