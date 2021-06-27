/* global chai aframeTestScene aframeAssertions */
var chai = chai || {}
var expect = chai.expect

// chai.use(aframeAssertions);

describe('chai aframe assertions', () => {
  it('should run a test at all', () => {
    expect(true).to.be.true
  })
  
  describe('in a scene', () => {
    let scene = aframeTestScene()
    beforeEach(() => scene.reset())
    
    describe('occupying', () => {
      it('should pass if two boxes occupy the same space', () => {
        
      })
    })
  })
})
