/* global AFRAME THREE au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('node legend component', () => {
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

  it('should lay out examples of the different node styles against type names', function (done) {
    root.testing(this)

    legend = root.addHtml('<a-entity id="node-ledge" position="0 1 -1" node-legend >')

    let nodeTypes;

    scene.actions(() => {
        nodeTypes = Object.keys(scene.systems().node.typesToAttributes);
      },
      () => {
        let legendDescriptions = legend.querySelectorAll('a-text');
        expect(legendDescriptions.length).to.eql(nodeTypes.length)
        expect(legendDescriptions[0].getAttribute('value')).to.be.oneOf(nodeTypes)
        done()
      })
  })
})