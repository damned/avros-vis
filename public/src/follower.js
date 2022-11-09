 /* global AFRAME THREE au */

function savePlacementBeforeFollow(follower) {
  if (!follower.positionBeforeFollow) {
    let followerObject3d = follower.el.object3D
    follower.positionBeforeFollow = new THREE.Vector3()
    follower.rotationBeforeFollow = new THREE.Euler()
    follower.positionBeforeFollow.copy(followerObject3d.position)
    follower.rotationBeforeFollow.copy(followerObject3d.rotation)
  }  
}
function resetToPlacementBeforeFollow(follower) {
  if (follower.positionBeforeFollow) {
    let followerObject3d = follower.el.object3D
    followerObject3d.position.copy(follower.positionBeforeFollow)
    followerObject3d.rotation.copy(follower.rotationBeforeFollow)
    follower.positionBeforeFollow = null
    follower.rotationBeforeFollow = null
  }
}

function snapAxisValueToGrid(gridSize, value) {
  au.log('grid size', gridSize)
  if (gridSize && gridSize > 0) {
    return Math.round(value / gridSize) * gridSize
  }
  return value
}

AFRAME.registerComponent('follower', {
  dependencies: ['follower-constraint'],
  schema: {
    leader: {type: 'string', default: ''},
    lock: {type: 'string', default: ''}
  },
  init: function() {
    this.leader = this.el.followComponentLeader || null
    this.lock = ''
    // this.el.setAttribute('debugged', 'follower: init')
    this.updateCount = 0
    this.tickCount = 0
    this.snapToGrid = -1

    this.axisLimit = -1
    this.axisLock = ''
    let constraints = this.el.getAttribute('follower-constraint')
    if (constraints) {
      this.axisLimit = constraints.axisLimit
      this.axisLock = constraints.axisLock
      this.lock += constraints.lock
      this.snapToGrid = constraints.snapToGrid
    }
  },
  update: function(oldData) {
    const log = au.log
    this.updateCount++
    log('follower update', this.data)
    // this.el.setAttribute('debugged', 'follower: update ' + this.updateCount)
    if (this.data == '' || Object.keys(this.data).length == 0) {
      return
    }
    this.lock += this.data.lock || ''
    if (this.leader != null) {
      return
    }
    let leaderSpec = this.data.leader
    // this.el.setAttribute('debugged', `follower: leaderSpec = ${leaderSpec}`)
    log('follower update', leaderSpec)
    this.leader = document.querySelector(leaderSpec)
    // this.el.setAttribute('debugged', 'follower: leader = ' + leaderSpec)
  },
  follow: function(leader, lock='') {
    this.leader = leader
    this.lock = lock
  },
  unfollow: function() {
    this.pause()
    resetToPlacementBeforeFollow(this)
  },
  tick: function() {
    const self = this
    self.tickCount++
    if (self.leader == null || self.leader == undefined) {
      return;
    }
    au.catching(() => {
      savePlacementBeforeFollow(self)
      let followerObject3d = this.el.object3D
      let leaderPos = followerObject3d.parent.worldToLocal(this.leader.object3D.getWorldPosition(new THREE.Vector3()))
      // log('follower', 'got leader pos:', leaderPos)
      
      let leaderRot = this.leader.object3D.rotation
      // this.el.setAttribute('debugged', 'follower: tick')
      // this.el.setAttribute('debugged', this.leader.tagName)
      // this.el.setAttribute('debugged', 'follower: position: ' + leaderPos)
      let limited = axisValue => {
        if (this.axisLimit >= 0) {
          if (axisValue > this.axisLimit) {
            return this.axisLimit
          }
          else if (axisValue < -this.axisLimit) {
            return -this.axisLimit
          }
        }
        return snapAxisValueToGrid(self.snapToGrid, axisValue)
      }
      if (this.lock !== 'position') {
        let z
        if (this.axisLock == 'z') {
          z = followerObject3d.position.z
        }
        else {
          z = limited(leaderPos.z)
        }
        followerObject3d.position.set(limited(leaderPos.x), limited(leaderPos.y), z)
      }
      if (this.lock !== 'rotation') {
        followerObject3d.rotation.copy(leaderRot)
      }
    })
  }
});
