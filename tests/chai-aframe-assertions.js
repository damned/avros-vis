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

      expecteds.forEach(expected => {
        actuals.forEach(actual => {
          let actualPosition = getPosition(actual)
          let expectedPosition = getPosition(expected)

          let actualSize = getSize(actual)
          let expectedSize = getSize(expected)

        })

      
        const positionFailureDetail = (actualPosition, expectedPosition) => ` - actual position ${actualPosition} did not match expected position ${expectedPosition}`
        const sizeFailureDetail = (actualSize, expectedSize) => ` - actual size ${actualSize} did not match expected size ${expectedSize}`

        const positionMatch = actualPosition === expectedPosition
        const sizeMatch = actualSize === expectedSize

        const failureMessageDetail = () => {
          if (!positionMatch) {
            return positionFailureDetail()
          }
          if (!sizeMatch) {
            return sizeFailureDetail()
          }
          return 'problem composing assert failure message in aframeAssertions'
        }
        const inverseFailureDetail = () => ` - at ${expectedPosition} and size ${expectedSize}`
      })


      
      self.assert(positionMatch && sizeMatch,
                 'expected entity to occupy same space as comparison entity' + failureMessageDetail(),
                 'expected entity not to occupy same space as comparison entity' + inverseFailureDetail())
    })
  }
}
