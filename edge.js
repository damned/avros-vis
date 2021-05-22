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
          
          other3d.updateMatrixWorld()
          
          let otherLocalPos = other3d.position.clone()
          log('other local pos', otherLocalPos)
          let otherWorldPos = other3d.localToWorld(otherLocalPos)
          log('other world pos', otherWorldPos)

          host3d.updateMatrixWorld()
          let vectorToOther = host3d.worldToLocal(otherLocalPos)

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
