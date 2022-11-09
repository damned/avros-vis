/* global aframeTestScene */
var chai = chai || {}
var expect = chai.expect

describe('grabber component', () => {

  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
  })
  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  it('should allow grab to move an object', function(done) {
    let mover = root.addHtml('<a-box id="mover" grabber="#mover" position="0 0 0" scale="0.1 0.1 0.1" ></a-box>', '#mover')
    let moveable = root.addHtml('<a-sphere id="moveable" class="touchable" position="-1 1 -1" color="red" opacity="0.2" radius="0.2"></a-sphere>', '#moveable')

    let finalPos = {x: 2, y: 2, z: -2}

    scene.setActionDelay(100)
    scene.actions(() => {
        mover.moveTo(moveable.position)
      },
      () => {
        mover.components.grabber.grasp({})
      },
      () => {
        mover.moveTo(finalPos)
      },
      () => {
        expect(mover.components.grabber.grabbed).to.not.be.null
        expect(moveable.position).to.shallowDeepEqual(finalPos)
        done()
      })
  })
})
