var aframeAssertions = function () {
  return function (chai, utils) {
    let Assertion = chai.Assertion;
    let flag = utils.flag

    Assertion.addMethod('occupy', (val, msg) => {
      let self = this
      let obj = self._obj
      self.assert(obj.getAttribute('po'))
    })
  }
}
