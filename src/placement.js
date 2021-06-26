/* globals AFRAME THREE au calcAreaXZSplit */
AFRAME.registerComponent('placement', {
  schema: {
    on: { type: 'selector' },
    constrain: { type: 'boolean', default: false }
  },
  init: function () {
    let self = this
    let host = self.el
    let log = au.log
    
    const PlacementBase = (baseEl) => {
      let onPlacements = []
      let instance = {
        placeOn: (placement) => {
          onPlacements.push(placement)
          let count = onPlacements.length
          let split = calcAreaXZSplit({ x: 1, z: 1 }, count)
          
          onPlacements.forEach((placementComponent, i) => {
            placementComponent.updatePlacement(i, count, split)
          })
        }
      }
      baseEl.placementBase = instance
      return instance
    }
    
    self.update = () => {
      let baseHost = self.data.on
      let justPlaced = false
      let emitPlacedNext = false

      let placeOn = () => {
        au.catching(() => {
          log('placeOn: baseHost is loaded: ', baseHost.hasLoaded)
          log('baseHost id: ', baseHost.id)
          log('host id: ', host.id)
          
          const calcCentrePercent = (index, total) => {
            let placeWidth = 100 / total
            let halfPlaceWidth = placeWidth / 2
            return halfPlaceWidth + placeWidth * index
          }
          
          self.updatePlacement = (placeIndex, placeTotalCount, split, ix, iz) => {
            log('placed id and count', placeIndex, placeTotalCount)
            log('host id: ', host.id)
            log(() => ['base parent hasLoaded: ', baseHost.parentNode?.hasLoaded])
            
            
            
            let targetPos = au.world.anchorPoint({
              x: calcCentrePercent(placeIndex, split.counts.x),
              y: 100, 
              z: 50
            }, baseHost)
            
            log(() => 'setting placement to ' + JSON.stringify(targetPos))
            log('constrain', self.data.constrain)
            if (self.data.constrain) {
              au.world.placeByAnchor({x:50, y:0, z:50}, host, targetPos, {x: split.sizes.x})
            }
            else {
              au.world.placeByAnchor({x:50, y:0, z:50}, host, targetPos)              
            }
          }

          let base = baseHost.placementBase || PlacementBase(baseHost)
          base.placeOn(self)

          justPlaced = true
        })
      }
      
      self.tick = () => {
        if (justPlaced) {
          justPlaced = false
          emitPlacedNext = true
        }
        else if (emitPlacedNext) {
          emitPlacedNext = false
          host.emit('placed')          
        }
      }
      
      log('update: baseHost is loaded: ', baseHost.hasLoaded)
      log('update: baseHost progenitor is loaded: ', au.earliestAncestor(baseHost).hasLoaded)

      if (au.earliestAncestor(baseHost).hasLoaded) {
        placeOn()
      }
      else {
        au.earliestAncestor(baseHost).addEventListener('loaded', placeOn)
      }
    }
  }
})
