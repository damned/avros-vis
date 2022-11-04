/* global aframeTestScene */
var chai = chai || {}
var expect = chai.expect

describe('toucher component', () => {

  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
    scene.setActionDelay(30)
  })
  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  let toucher, touchable

  context('for initially separate objects', () => {

    beforeEach(() => {
      toucher = root.addHtml('<a-sphere class="a-toucher" toucher position="0 2.2 0" color="lightblue"></a-sphere>', '.a-toucher')
      touchable = root.addHtml('<a-sphere class="a-touchable touchable" position="0 0 0" color="lightgreen" opacity="0.5"></a-sphere>', '.a-touchable')
    })

    it('returns that toucher is touching if it is moved to overlap, with closest correctly set', function (done) {
      root.testing(this)

      scene.actions(() => {
        toucher.moveTo({x: 0, y: 1.9, z: 0})
      }, () => {
        expect(toucher.components.toucher.isTouching()).to.be.true
        expect(toucher.components.toucher.closest()).to.eql(touchable)
        done()
      })
    })

    it('returns that toucher is not touching if it is moved somewhere else not overlapping', function (done) {
      root.testing(this)

      scene.actions(() => {
        toucher.moveTo({x: 0, y: 2.2, z: -1})
      }, () => {
        expect(toucher.components.toucher.isTouching()).to.be.false
        expect(toucher.components.toucher.closest()).to.be.null
        done()
      })
    })
  })

  context('for initially overlapping objects', () => {

    beforeEach(() => {
      toucher = root.addHtml('<a-sphere class="a-toucher" toucher position="0 0 0" color="lightblue"></a-sphere>', '.a-toucher')
      touchable = root.addHtml('<a-sphere class="b-touchable touchable" position="0 0.5 0" color="lightgreen" opacity="0.5"></a-sphere>', '.b-touchable')
    })

    it('returns that toucher is not touching', function(done) {
      root.testing(this)

      scene.actions(() => {
        expect(toucher.components.toucher.isTouching()).to.be.false
        done()
      })
    })
  })

})
