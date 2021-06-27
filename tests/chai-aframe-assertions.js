/* global AFRAME THREE */
var aframeAssertions = function () {
  return function (chai, utils) {
    let Assertion = chai.Assertion;
    let flag = utils.flag

    const getPosition = (el) => {
      return AFRAME.utils.coordinates.stringify(el.object3D.position)
    }

    const getSize = (el) => {
      const sizeBox = new THREE.Box3()
      el.object3D.updateWorldMatrix(true, false)
      const size = sizeBox.setFromObject(el.object3D).getSize(new THREE.Vector3())
      return AFRAME.utils.coordinates.stringify(size)
    }

    Assertion.addMethod('occupy', function(rawExpected, msg) {
      let self = this
      let rawActual = self._obj

      const asArray = (raw) => {
        if (Array.isArray(rawActual)) {
          return raw
        }
        return [raw]
      }
      
      let actuals = asArray(rawActual)
      let expecteds = asArray(rawExpected)

      const positionFailureDetail = (last) => ` - actual position ${last.actualPosition} did not match expected position ${last.expectedPosition}`
      const sizeFailureDetail = (last) => ` - actual size ${last.actualSize} did not match expected size ${last.expectedSize}`

      const failureMessageDetail = (last) => {
        if (!last.positionMatch) {
          return positionFailureDetail(last)
        }
        if (!last.sizeMatch) {
          return sizeFailureDetail(last)
        }
        return 'problem composing assert failure message in aframeAssertions'
      }
      const inverseFailureDetail = (last) => ` - at ${last.expectedPosition} and size ${last.expectedSize}`
      
      let last = {}
      expecteds.forEach(expected => {
        let match = false
        let last = {}
        last.expectedPosition = getPosition(expected)
        last.expectedSize = getSize(expected)
        
        actuals.forEach(actual => {
          last.actualPosition = getPosition(actual)
          last.actualSize = getSize(actual)

          last.positionMatch = last.actualPosition === last.expectedPosition
          last.sizeMatch = last.actualSize === last.expectedSize
      
          if (last.sizeMatch && last.positionMatch) {
            match = true
            return;
          }
        })
        if (!match) {
          self.assert(false,
                     'expected entity to occupy same space as comparison entity' + failureMessageDetail(last),
                     'expected entity not to occupy same space as comparison entity' + inverseFailureDetail(last))
          return
        }

      })

      // all must have matched
      self.assert(true,
                 'expected entity to occupy same space as comparison entity' + failureMessageDetail(last),
                 'expected entity not to occupy same space as comparison entity' + inverseFailureDetail(last))
      
    })
  }
}
