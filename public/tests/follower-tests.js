/* global aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('follower component', () => {
  
  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  au.log.active = true

  let leader, follower

  it('should follow another entity functionally', done => {
    scene.actions(() => {
      leader = root.addHtml('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>')
      follower = root.addHtml('<a-sphere color="red" ' +
        'follower="leader: #theleader" ' +
        'radius="0.4" position="1 1 -2"></a-sphere>')
    },
    () => {
      expect(follower.position).to.shallowDeepEqual(leader.position)
      leader.position.set(2, 2, 2)
    },
    () => {
      expect(follower.position).to.shallowDeepEqual(leader.position)
      done()
    })
  })

  describe('with follower-constraint on follower', () => {

    context('with lock rotation on', () => {
      it('should follow another entity but keep rotation locked at original', done => {
        scene.actions(() => {
            leader = root.addHtml('<a-box id="lockleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>')
            follower = root.addHtml('<a-sphere color="red" ' +
              'follower="leader: #lockleader" ' +
              'follower-constraint="lock: rotation" ' +
              'rotation="0 0 0"' +
              'radius="0.4" position="1 1 -2"></a-sphere>')
          },
          () => {
            expect(follower.position).to.shallowDeepEqual(leader.position)
            leader.rotation.set(1, 2, 3)
            leader.position.set(2, 2, 2)
          },
          () => {
            expect(follower.position).to.shallowDeepEqual(leader.position)
            expect(follower.rotation).to.shallowDeepEqual({ x: 0, y: 0, z: 0 })
            done()
          })
      })
    })

    context('with snap-to-grid set', () => {
      it('should follow another entity but move only to nearest discrete step in each axis', done => {
        scene.actions(() => {
            leader = root.addHtml('<a-box id="snapleader" opacity="0.2" color="yellow" position="0 0 0"></a-box>')
            follower = root.addHtml('<a-sphere color="red" ' +
              'follower="leader: #snapleader" ' +
              'follower-constraint="snap-to-grid: 0.5" ' +
              'radius="0.4" position="0 0 0"></a-sphere>')
          },
          () => {
            expect(follower.position).to.shallowDeepEqual(leader.position)
            leader.position.set(1.1, 1.2, -1.2)
          },
          () => {
            expect(follower.position).to.shallowDeepEqual({ x: 1, y: 1, z: -1 })
            done()
          })
      })
    })
  })

  describe('snapAxisValueToGrid', () => {
    it ('returns raw value if gridSize is -1', () => {
      expect(snapAxisValueToGrid(-1, 3.3)).to.eql(3.3)
    })

    it ('rounds up value to nearest multiple of integer gridSize when it is higher', () => {
      expect(snapAxisValueToGrid(2, 3.3)).to.eql(4)
    })

    it ('rounds down value to nearest multiple of integer gridSize when it is lower', () => {
      expect(snapAxisValueToGrid(2, 2.99)).to.eql(2)
    })

    it ('rounds down value to nearest multiple of non-integer decimal gridSize', () => {
      expect(snapAxisValueToGrid(0.2, 2.89)).to.be.closeTo(2.8, TOLERANCE)
    })

    it ('rounds up value to nearest multiple of non-integer decimal gridSize', () => {
      expect(snapAxisValueToGrid(0.2, 2.92)).to.be.closeTo(3.0, TOLERANCE)
    })

    it ('returns raw value if gridSize is less than zero', () => {
      expect(snapAxisValueToGrid(-0.01, 2.3)).to.be.closeTo(2.3, TOLERANCE)
    })

    it ('returns raw value if gridSize is zero', () => {
      expect(snapAxisValueToGrid(0, 4)).to.eql(4)
    })

    it ('returns raw value if gridSize is undefined', () => {
      expect(snapAxisValueToGrid(undefined, 99)).to.eql(99)
    })

    it ('returns raw value if gridSize is null', () => {
      expect(snapAxisValueToGrid(null, 99)).to.eql(99)
    })
  })
})
