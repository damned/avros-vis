/* global aframeTestScene */
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
  
  it('should follow another component functionally', function(done) {
    

    let leaderEl = root.addHtml('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>', '#theleader')
    let followerEl = root.addHtml('<a-sphere id="thefollower" color="red" follower="leader: #theleader" radius="0.4" position="1 1 -2"></a-sphere>', '#thefollower')

    let leader = testable(leaderEl)
    let follower = testable(followerEl)

    scene.actions(() => {
      expect(follower.position).to.shallowDeepEqual(leader.position)        
      leader.position.set(2, 2, 2)
    },
    () => {
      expect(follower.position).to.shallowDeepEqual({x: 2, y: 2, z: 2})
      done()
    })
  })
})
