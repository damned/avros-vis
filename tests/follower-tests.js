describe('follow component', () => {
  it('should follow another component functionally', (done) => {
    let leaderEl = $('<a-box id="theleader" opacity="0.2" color="yellow" position="-1 1 -3"></a-box>').get(0)
    let followerEl = $('<a-sphere id="thefollower" color="red" follower="leader: #theleader" radius="0.4" position="1 1 -2"></a-sphere>').get(0)

    scene.append(leaderEl)
    scene.append(followerEl)

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
