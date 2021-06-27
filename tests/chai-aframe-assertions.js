/* global AFRAME */
var aframeAssertions = function () {
  return function (chai, utils) {
    let Assertion = chai.Assertion;
    let flag = utils.flag

    const getPosition = (el) => {
      return AFRAME.utils.coordinates.stringify(el.object3D.position)
    }

    Assertion.addMethod('occupy', function(val, msg) {
      let self = this
      let obj = self._obj
      
      let actualPosition = getPosition(obj)
      let expectedPosition = getPosition(val)
      
      self.assert(actualPosition === expectedPosition,
                 `expected entity to occupy same space as comparison entity - actual position ${actualPosition} did not match expected position ${expectedPosition}`,
                 `expected entity not to occupy same space as comparison entity - actual position ${actualPosition} did not match expected position ${expectedPosition}`)
    })
  }
}
