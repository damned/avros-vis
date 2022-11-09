/* global AFRAME THREE */
AFRAME.registerComponent('user-mover', {
  schema: {
    horizontal: { type: 'boolean', default: false }
  },
  init: function() {
    let self = this
    let host = self.el
    let host3d = host.object3D

    let userRig3d = document.getElementById('user-rig').object3D

    let moving = false
    let vector3 = new THREE.Vector3()
    let userGoalPoint = new THREE.Vector3()
    let worldAnchorPoint = new THREE.Vector3()
    let worldOffsetFromAnchor = new THREE.Vector3()

    host.addEventListener('grab', () => {
      au.log('user-mover', 'grab')
      host3d.getWorldPosition(worldAnchorPoint)
      moving = true
    })

    host.addEventListener('ungrasp',  () => {
      au.log('user-mover', 'ungrasp')
      moving = false
    })

    let translateToMatchAnchor = () => {
      worldOffsetFromAnchor.subVectors(worldAnchorPoint, host3d.getWorldPosition(vector3))
      if (self.data.horizontal) {
        worldOffsetFromAnchor.y = 0
      }
      userGoalPoint.addVectors(userRig3d.position, worldOffsetFromAnchor)
      userRig3d.position.lerp(userGoalPoint, 0.5)
    }

    self.tickHandler = () => {
      if (moving) {
        translateToMatchAnchor()
      }
    }
    self.tick = self.tickHandler
  }
})