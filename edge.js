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

          let start = '0 0 0'
          let end = '0 0 0'
          if (fromHere) {
            end = au.xyzTriplet(otherRelativePos)
          }
          else {
            start = au.xyzTriplet(otherRelativePos)
          }
          host.setAttribute('line__' + self.id, `start: ${start}; end: ${end}; color: ${color}`)
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
