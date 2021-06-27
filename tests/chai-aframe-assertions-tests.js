/* global chai aframeTestScene aframeAssertions */
var chai = chai || {}
var expect = chai.expect

// chai.use(aframeAssertions);

describe('chai aframe assertions', () => {
  it('should run a test at all', () => {
    expect(true).to.be.true
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
        
        expect(aBox).to.be.occupying(anotherBox)
      })
    })
  })
})
