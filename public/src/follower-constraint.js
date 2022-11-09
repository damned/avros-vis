/* global AFRAME*/

AFRAME.registerComponent('follower-constraint', {
  schema: {
    axisLimit: {type: 'number', default: -1 },
    axisLock: {type: 'string', default: ''},
    lock: {type: 'string', default: ''},
    snapToGrid: {type: 'number', default: -1}
  },
  update(oldData) {

  }
})
