/* globals AFRAME THREE au */
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
    let log = au.log
    
    self.update = () => {
      let from = self.data.from
      let to = self.data.to
      let fromHere = (from === null)
      let other = fromHere ? to : from
      
      let otherProgenitor = au.earliestAncestor(other)
      let hostProgenitor = au.earliestAncestor(host)

      
      let color = self.data.color
      let justEdged = false
      let emitEdgedNext = false      
      
      let createLineName = () => (self.id ? 'line__' + self.id : 'line')
      
      const addSibling = entity => {
        const sibling = au.entity(entity.parentNode, 'a-entity', {
          position: au.xyzTriplet(entity.object3D.position),
          scale: au.xyzTriplet(entity.object3D.scale)
        })
        return sibling
      }
      
      let addLine = () => {
        au.catching(() => {
          log('addLine: host is loaded: ', host.hasLoaded)
          log('addLine: other is loaded: ', other.hasLoaded)
          log(() => 'addLine: host earliest ancestor is loaded: ' + au.earliestAncestor(host).hasLoaded)
          log(() => 'addLine: other earliest ancestor is loaded: ' + au.earliestAncestor(other).hasLoaded)

          let other3d = other.object3D
          let host3d = host.object3D

          log('other id', other.id)
          
          log(() => 'addLine: other parent is loaded: ' + other3d?.parent?.el?.hasLoaded)
          log(() => 'addLine: other parent matrix: ' + JSON.stringify(other3d?.parent?.matrix))
          log(() => 'addLine: other parent world matrix: ' + JSON.stringify(other3d?.parent?.matrixWorld))
          
          log(() => 'other world matrix now ' + JSON.stringify(other3d.matrixWorld))
          log(() => 'other world matrix ' + other3d.matrixWorld)
          other3d.updateWorldMatrix(true, false)
          let otherWorldPos = other3d.getWorldPosition(new THREE.Vector3())
          
          log(() => 'other local pos now ' + JSON.stringify(other3d.position))
          log(() => 'other local pos ' + other3d.position)
          log(() => 'other world pos now ' + JSON.stringify(otherWorldPos))
                    
          log(() => 'host local pos now ' + JSON.stringify(host3d.position))
          log(() => 'host local pos ' + host3d.position)

          host3d.updateWorldMatrix(true, false)
          let vectorToOther = host3d.worldToLocal(otherWorldPos)

          let start = '0 0 0'
          let end = '0 0 0'
          if (fromHere) {
            end = au.xyzTriplet(vectorToOther)
          }
          else {
            start = au.xyzTriplet(vectorToOther)
          }
          self.edgeEntity = addSibling(host)
          self.edgeEntity.setAttribute(createLineName(), `start: ${start}; end: ${end}; color: ${color}`)
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
          host.emit('edged', { edgeEntity: self.edgeEntity })          
        }
      }
      
      log('update: other is loaded: ', other.hasLoaded)

      let onceWorldPositionsAreResolvable = (fn) => {
        let runAlready = false
        let doIfFullyLoaded = (fn) => {
          if (otherProgenitor.hasLoaded && hostProgenitor.hasLoaded) {
            if (runAlready === false) {
              runAlready = true
              fn()
            }
            return true
          }
          return false
        }
        
        if (doIfFullyLoaded(fn)) {
          // done
        }
        else if (otherProgenitor.hasLoaded) {
          hostProgenitor.addEventListener('loaded', fn)
        }
        else if (hostProgenitor.hasLoaded) {
          otherProgenitor.addEventListener('loaded', fn)
        }
        else {
          hostProgenitor.addEventListener('loaded', () => doIfFullyLoaded(fn))
          otherProgenitor.addEventListener('loaded', () => doIfFullyLoaded(fn))
        }
      }
      
      onceWorldPositionsAreResolvable(addLine)
    }
  }
})
