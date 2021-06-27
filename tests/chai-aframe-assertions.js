var aframeAssertions = function () {
  return function (chai, utils) {
    let Assertion = chai.Assertion;
    let flag = utils.flag

    Assertion.addMethod('occupy', function(val, msg) {
      let self = this
      let obj = self._obj
      
      let actualPosition = obj.getAttribute('position')
      let expectedPosition = val.getAttribute('position')
      
      self.assert(actualPosition === expectedPosition,
                 "expected entity to occupy same space as comparison entity - position did not match #{actualPosition} 1 0 0",
                 "aframe assertions - negative message not yet implemented")
    })
  }
}
