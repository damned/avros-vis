/* global aframeTestScene */
var chai = chai || {}
var expect = chai.expect

describe('hand', () => {

  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  it('should be able to grab and move an object', function(done) {
    let hand = Hand(root.addHtml('<a-entity id="moving-hand" hand-side="right"></a-entity>'))
    let moveable = root.addHtml('<a-sphere id="moveable" class="touchable" position="-1 1 -1" color="red" opacity="0.2" radius="0.2"></a-sphere>', '#moveable')

    let finalPos = {x: 2, y: 2, z: -2}

    scene.setActionDelay(100)
    scene.actions(() => {
        hand.moveTo(moveable.position)
      },
      () => {
        hand.emit('triggerdown', {})
      },
      () => {
        hand.moveTo(finalPos)
      },
      () => {
        hand.emit('triggerup', {})
      },
      () => {
        expect(moveable.position).to.shallowDeepEqual(finalPos)
        done()
      })
  })
})
