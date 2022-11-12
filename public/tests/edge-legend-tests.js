/* global AFRAME THREE au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('edge legend component', () => {
  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(() => {
    scene.reset()
    root = scene.addRoot()
  })
  afterEach(() => root.makeViewable())

  let legend

  it('should lay out examples of the different line styles against type names', function (done) {
    root.testing(this)

    legend = root.addHtml('<a-entity id="edge-ledge" position="0 1 -1" edge-legend >')

    let edgeTypes;

    scene.actions(() => {
        edgeTypes = Object.keys(scene.systems().edge.typesToAttributes);
      },
      () => {
        let legendDescriptions = legend.querySelectorAll('a-text.legend-label');
        expect(legendDescriptions.length).to.eql(edgeTypes.length)
        expect(legendDescriptions[0].getAttribute('value')).to.be.oneOf(edgeTypes)
        done()
      })
  })

})