/* global chai aframeTestScene aframeAssertions */
var chai = chai || {}
var expect = chai.expect

chai.use(aframeAssertions());

describe('chai aframe assertions', () => {
  describe('basic mocha and chai understanding', () => {
    it('allows a passing test to be green', () => {
      expect(true).to.be.true
    })

    it('allows for only a failing test being green if we are testing for failing assertion', () => {
      expect(() => {
        expect(true).to.be.true
      }).to.throw(Error)
    })

  })
  
  describe('in scene', () => {
    let scene, root
    beforeEach(() => scene = aframeTestScene())
    beforeEach(() => scene.reset())
    
    describe('occupying', () => {
      it('should pass if two boxes occupy the same space', () => {
        root = scene.addRoot()
        
        let aBox = root.entity('a-box')
        let anotherBox = root.entity('a-box')
        
        expect(aBox).to.occupy(anotherBox)
      })

    })
  })
})
