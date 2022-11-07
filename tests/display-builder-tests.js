/* global aframeTestScene DisplayBuilder */
var chai = chai || {}
var expect = chai.expect

describe('display builder', () => {

  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
    scene.setActionDelay(50)
  })

  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  let display, displayBuilder, graphJson
  const jsonLoader = () => graphJson

  beforeEach(() => {
    display = root.addHtml('<a-entity></a-entity>')
    displayBuilder = tiltviz.DisplayBuilder(jsonLoader)
  })

  it('loads an entity from json', function (done) {
    root.testing(this)

    graphJson = {
      nodes: ['abox']
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let addedBox = root.select('#abox')
      expect(getLabel(addedBox)).to.eql('abox')
      done()
    })
  })

  it('loads two entities from json', function (done) {
    root.testing(this)

    graphJson = {
      nodes: ['bbox', 'cbox']
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let box1 = root.select('#bbox')
      let box2 = root.select('#cbox')
      expect(getLabel(box1)).to.eql('bbox')
      expect(getLabel(box2)).to.eql('cbox')
      done()
    })
  })

  it('loads multiple edges from an entity from json', function (done) {
    root.testing(this)

    graphJson = {
      nodes: ['source-node', 'to1', 'to2'],
      edges: [{
        from: 'source-node',
        to: 'to1'
      }, {
        from: 'source-node',
        to: 'to2'
      }]
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let sourceNode = root.select('#source-node')
      let to1 = root.select('#to1')
      let to2 = root.select('#to2')
      expect(sourceNode.getAttribute('edge').to).to.eql(to1)
      expect(sourceNode.getAttribute('edge__1').to).to.eql(to2)
    }, done)
  })

})

function getLabel(addedBox) {
  return addedBox.getAttribute('balloon-label').label;
}
