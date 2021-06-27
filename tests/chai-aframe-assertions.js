var aframeAssertions = function () {
  return function (chai, utils) {
    var Assertion = chai.Assertion;

    Assertion.addMethod('occupy', () => {
      alert('bob')
    })
  }
}
