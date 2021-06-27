/* global AFRAME */
var aframeAssertions = function () {
  return function (chai, utils) {
    let Assertion = chai.Assertion;
    let flag = utils.flag

    const getPosition = (el) => {
      return AFRAME.utils.coordinates.stringify(el.object3D.position)
    }

    const getSize = (el) => {
      
      return AFRAME.utils.coordinates.stringify(size)
    }

    Assertion.addMethod('occupy', function(val, msg) {
      let self = this
      let obj = self._obj
      
      let actualPosition = getPosition(obj)
      let expectedPosition = getPosition(val)
      
      const positionFailureMessage = () => ` - actual position ${actualPosition} did not match expected position ${expectedPosition}`
      const inversePositionFailureMessage = () => ` - at ${expectedPosition}`
      
      const positionMatch = actualPosition === expectedPosition
      const sizeMatch = actualSize === expectedSize
      
      self.assert(positionMatch,
                 'expected entity to occupy same space as comparison entity' + positionFailureMessage(),
                 'expected entity not to occupy same space as comparison entity' + inversePositionFailureMessage())
    })
  }
}
