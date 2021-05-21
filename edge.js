/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('edge', {
  schema: {
    from: { type: "selector" }
  },
  init: function () {
    let self = this
    let host = self.el
    let au = aframeUtils
    let log = aframeUtils.log
    
    self.update = () => {
      let from = self.data.from
      let justEdged = false
      let emitEdgedNext = false      
      
      let addLine = () => {
        au.catching(() => {
          log('addLine: from is loaded: ', from.hasLoaded)

          let fromPos = from3d.object3D.position
          let hostPos = host.object3D.position
          log(() => ['from pos: ', JSON.stringify(fromPos)])
          log(() => ['host pos: ', JSON.stringify(fromPos)])

          host.setAttribute('line', `start: ${au.xyzTriplet()}; end: ${au.}; color: red`)

          log(() => 'setting placement to ' + JSON.stringify(pos))

          host.setAttribute('position', au.xyzTriplet(pos))

          log(() => 'placement set to ' + JSON.stringify(pos))

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
      
      log('update: from is loaded: ', from.hasLoaded)

      if (from.hasLoaded) {
        addLine()
      }
      else {
        from.addEventListener('loaded', addLine)
      }
    }
  }
})
