/* globals AFRAME THREE aframeUtils */
AFRAME.registerComponent('edge', {
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
      
      let vector = (here, other) => {
        let otherPos = other.object3D.position
        let herePos = here.object3D.position
        log(() => ['other pos: ', JSON.stringify(otherPos)])
        log(() => ['here pos: ', JSON.stringify(herePos)])

        return otherPos.clone().sub(herePos)
      }
      
      
      let addLine = () => {
        au.catching(() => {
          log('addLine: other is loaded: ', other.hasLoaded)

          let otherRelativePos = vector(host, other)

          if (fromHere) {
            host.setAttribute('line', `start: 0 0 0; end: ${au.xyzTriplet(otherRelativePos)}; color: ${color}`)
            log(() => 'using to: setting end pos to ' + JSON.stringify(otherRelativePos))
          }
          else {
            host.setAttribute('line', `start: ${au.xyzTriplet(otherRelativePos)}; end: 0 0 0; color: ${color}`)
            log(() => 'using from: setting start pos to ' + JSON.stringify(otherRelativePos))
          }
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
