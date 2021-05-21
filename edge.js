/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('edge', {
  schema: {
    from: { type: "selector" },
    color: { type: "color", default: "blue" }
  },
  init: function () {
    let self = this
    let host = self.el
    let au = aframeUtils
    let log = aframeUtils.log
    
    self.update = () => {
      let from = self.data.from
      let color = self.data.color
      let justEdged = false
      let emitEdgedNext = false      
      
      let addLine = () => {
        au.catching(() => {
          log('addLine: from is loaded: ', from.hasLoaded)

          let fromPos = from.object3D.position
          let hostPos = host.object3D.position
          log(() => ['from pos: ', JSON.stringify(fromPos)])
          log(() => ['host pos: ', JSON.stringify(fromPos)])
          
          let fromRelativePos = hostPos.clone().sub(fromPos)

          host.setAttribute('line', `start: ${au.xyzTriplet(fromRelativePos)}; end: 0 0 0; color: ${color}`)

          log(() => 'using from: setting start pos to ' + JSON.stringify(fromRelativePos))

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
