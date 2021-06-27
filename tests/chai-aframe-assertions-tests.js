/* global chai aframeTestScene aframeAssertions aframeUtils */
var chai = chai || {}
var expect = chai.expect

chai.use(aframeAssertions());

describe('chai aframe assertions', () => {
  const au = aframeUtils
  describe('basic mocha and chai understanding', () => {
    it('allows a passing test to be green', () => {
      expect(true).to.be.true
    })

    it('allows for only a failing test being green if we are testing for failing assertion', () => {
      expect(() => {
        expect(false).to.be.true
      }).to.throw(Error, /expected false to be true/)
    })

  })
  
  describe('in scene', () => {
    let scene, root
    beforeEach(() => scene = aframeTestScene())
    beforeEach(() => scene.reset())
    
    describe('occupying', () => {
      beforeEach(() => root = scene.addRoot())
      it('should pass if two boxes occupy the same space', done => {
        scene.within(() => {
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box')

          au.onceLoaded(anotherBox, () => {
            expect(aBox).to.occupy(anotherBox)
            done()
          })
        })
      })

      it('should fail if two boxes do not occupy the same space as they are at different positions', done => {
        scene.within(() => {
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box', { position: '1 0 0' })

          au.onceLoaded(anotherBox, () => {
            expect(() => {
              expect(aBox).to.occupy(anotherBox)
            }).to.throw(Error, /expected entity to occupy same space as comparison entity.*position.*0 0 0.*1 0 0/)
            done()
          })
        })
      })

      it('should fail if two boxes occupy the same space when they are NOT expected to', done => {
        scene.within(() => {
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box')

          au.onceLoaded(anotherBox, () => {
            expect(() => {
              expect(aBox).not.to.occupy(anotherBox)
            }).to.throw(Error, /expected entity not to occupy same space as comparison entity/)
            done()
          })
        })
      })
    })
  })
})
