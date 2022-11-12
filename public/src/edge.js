/* globals AFRAME THREE au */
AFRAME.registerSystem('edge', {
  init: function () {
    const self = this
    self.DEFAULT_TYPE = '_default'
    self.typesToAttributes = {
      'http': { color: 'lightblue', width: 0.015 },
      'queue': { color: 'orange', width: 0.03 }
    }
    self.typesToAttributes[self.DEFAULT_TYPE] = { color: 'blue', width: 0.01 }

    self.attributesOfType = type => {
      if (self.typesToAttributes.hasOwnProperty(type)) {
        return self.typesToAttributes[type]
      }
      return self.typesToAttributes[self.DEFAULT_TYPE]
    }
  },
});

AFRAME.registerComponent('edge', {
  multiple: true,
  schema: {
    from: { type: 'selector' },
    to: { type: 'selector' },
    label: { type: 'string', default: ''},
    type: { type: 'string', default: undefined }
  },
  init: function () {
    const LOADED_EVENT = 'loaded';
    const self = this
    const host = self.el
    let log = au.log
    
    self.update = () => {
      let from = self.data.from
      let to = self.data.to
      let fromHere = (from === null)
      let other = fromHere ? to : from
      
      let otherProgenitor = au.earliestAncestor(other)
      let hostProgenitor = au.earliestAncestor(host)

      let justEdged = false
      let emitEdgedNext = false      
      
      const addSibling = entity => {
        const sibling = au.entity(entity.parentNode, 'a-entity', {
          position: au.xyzTriplet(entity.object3D.position),
          scale: au.xyzTriplet(entity.object3D.scale)
        })
        return sibling
      }

      const addLabel = (parent, localPosition) => {
        const label = au.entity(parent, 'a-text', {
          position: au.xyzTriplet(localPosition),
          class: 'edge-label',
          align: 'center',
          baseline: 'bottom',
          value: self.data.label
        })
        return label
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
          let midpoint = new THREE.Vector3().copy(vectorToOther).divideScalar(2)
          if (self.edgeEntity === undefined) {
            self.edgeEntity = addSibling(host)
            self.labelEntity = addLabel(self.edgeEntity, midpoint)
            other.addEventListener('moveend', () => addLine())
            host.addEventListener('moveend', () => addLine())
            other.addEventListener('placed', () => addLine())
            host.addEventListener('placed', () => addLine())
          }
          else {
            self.edgeEntity.object3D.position.copy(host.object3D.position)
            self.labelEntity.object3D.position.copy(midpoint)
          }
          const typeAttributes = self.system.attributesOfType(self.data.type)
          const attributes = Object.assign({ start, end }, typeAttributes)
          self.edgeEntity.setAttribute('fatline', au.attributeValue(attributes))
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
          hostProgenitor.addEventListener(LOADED_EVENT, fn)
        }
        else if (hostProgenitor.hasLoaded) {
          otherProgenitor.addEventListener(LOADED_EVENT, fn)
        }
        else {
          hostProgenitor.addEventListener(LOADED_EVENT, () => doIfFullyLoaded(fn))
          otherProgenitor.addEventListener(LOADED_EVENT, () => doIfFullyLoaded(fn))
        }
      }
      
      onceWorldPositionsAreResolvable(addLine)
    }
  }
})
