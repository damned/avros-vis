/* global aframeTestScene */
var chai = chai || {}
var expect = chai.expect

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

  let leader, follower

  it('should follow another entity functionally', done => {

    scene.actions(() => {
      leader = root.addHtml('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>', '#theleader')
      follower = root.addHtml('<a-sphere id="thefollower" color="red" ' +
        'follower="leader: #theleader" ' +
        'radius="0.4" position="1 1 -2"></a-sphere>', '#thefollower')
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
    it('should follow another entity but keep rotation locked at original', done => {
      scene.actions(() => {
          leader = root.addHtml('<a-box id="lockleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>', '#lockleader')
          follower = root.addHtml('<a-sphere id="lockfollower" color="red" ' +
            'follower="leader: #lockleader" ' +
            'follower-constraint="lock: rotation" ' +
            'rotation="0 0 0"' +
            'radius="0.4" position="1 1 -2"></a-sphere>', '#lockfollower')
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
})
