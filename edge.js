/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('edge', {
  multiple: true,
  schema: {
    from: { type: "selector" },
    to: { type: "selector" },
    color: { type: "color", default: "blue" }
  },
  init: function () {
    let self = this
    let host = self.el
    let au = aframeUtils
    let log = aframeUtils.log
    
    self.update = () => {
      let from = self.data.from
      let to = self.data.to
      let fromHere = (from === null)
      let other = fromHere ? to : from
      
      let color = self.data.color
      let justEdged = false
      let emitEdgedNext = false      
      
      let createLineName = () => (self.id ? 'line__' + self.id : 'line')
      
      let addLine = () => {
        au.catching(() => {
          log('addLine: other is loaded: ', other.hasLoaded)

          let other3d = other.object3D
          let host3d = host.object3D
          
          log('addLine: other parent is loaded: ', other3d?.parent?.el?.hasLoaded)
          
          
          log('other world matrix now', JSON.stringify(other3d.matrixWorld))
          log('other world matrix', other3d.matrixWorld)
          other3d.updateWorldMatrix(true, false)
          other3d.updateMatrixWorld()
          let otherWorldPos = new THREE.Vector3()
          other3d.getWorldPosition(otherWorldPos)
          log('other local pos now', JSON.stringify(other3d.position))
          log('other local pos', other3d.position)
          log('other world pos', JSON.stringify(otherWorldPos))
          let transformedLocal = other3d.position.clone()
          log('transformed local to world', JSON.stringify(other3d.localToWorld(transformedLocal)))
          log('other id', other.id)

          host3d.updateMatrixWorld()
          let vectorToOther = host3d.worldToLocal(otherWorldPos)

          let start = '0 0 0'
          let end = '0 0 0'
          if (fromHere) {
            end = au.xyzTriplet(vectorToOther)
          }
          else {
            start = au.xyzTriplet(vectorToOther)
          }
          host.setAttribute(createLineName(), `start: ${start}; end: ${end}; color: ${color}`)
          log(() => 'setting start pos to ' + start + ' setting end to ' + end)
          justEdged = true
        })
        
      }
      
      self.tick = () => {
        if (justEdged) {
          justEdged = false
          emitEdgedNext = true
        }
        else if (emitEdgedNext) {
          emitEdgedNext = false
          host.emit('edged')          
        }
      }
      
      log('update: other is loaded: ', other.hasLoaded)

      if (other.hasLoaded) {
        addLine()
      }
      else {
        other.addEventListener('loaded', addLine)
      }
    }
  }
})
