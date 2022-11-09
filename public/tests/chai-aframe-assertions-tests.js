/* global chai aframeTestScene aframeAssertions aframeUtils */
var chai = chai || {}
var expect = chai.expect

chai.use(aframeAssertions());

describe('chai aframe assertions', () => {
  const au = aframeUtils
  let scene

  before(() => scene = aframeTestScene({sceneName: 'chai asserts'}))
  
  describe('in scene', () => {
    let root
    
    beforeEach(() => {
      scene.reset()
      root = scene.addRoot()
    })
    
    afterEach(() => root.makeViewable())
    
    describe('occupy', () => {
      
      describe('for single entities', () => {
        it('should pass if two boxes occupy the same space', function(done) {
          root.testing(this)
          let aBox = root.testBox('first', { color: 'blue' })
          let anotherBox = root.testBox('second', { color: 'darkblue' })

          au.onceLoaded(anotherBox, () => {
            expect(aBox).to.occupy(anotherBox)
            done()
          })
        })

        it('should pass if two boxes occupy the same space within a small float tolerance', function(done) {
          root.testing(this)
          let aBox = root.entity('a-box', { color: 'white', position: '0.21 0.1 0.19997', scale: '1 1.0002 1'})
          let anotherBox = root.entity('a-box', { position: '0.2001 0.1001 0.2', scale: '0.99998 1 1.0000011'})

          au.onceLoaded(anotherBox, () => {
            expect(aBox).to.occupy(anotherBox)
            done()
          })
        })

        it('should fail if two boxes are at different positions', function(done) {
          root.testing(this)
          let aBox = root.entity('a-box', { color: 'red' })
          let anotherBox = root.entity('a-box', { position: '1 0 0' })

          au.onceLoaded(anotherBox, () => {
            expect(() => {
              expect(aBox).to.occupy(anotherBox)
            }).to.throw(Error, /expected entity to occupy same space as comparison entity.*position.*0 0 0.*1 0 0/)
            done()
          })
        })

        it('should fail if two boxes occupy the same space when they are NOT expected to', function(done) {
          root.testing(this)
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box')

          au.onceLoaded(anotherBox, () => {
            expect(() => {
              expect(aBox).not.to.occupy(anotherBox)
            }).to.throw(Error, /expected entity not to occupy same space as comparison entity/)
            done()
          })
        })

        it('should fail if two boxes are at the same position but have different sizes due to scale', function(done) {
          root.testing(this)
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box', { scale: '2 2 2' })

          au.onceLoaded(anotherBox, () => {
            expect(() => {
              expect(aBox).to.occupy(anotherBox)
            }).to.throw(Error, /expected entity to occupy same space as comparison entity.*size.*1 1 1.*2 2 2/)
            done()
          })
        })
      })
      describe('for multiple entities', () => {
        it('should pass if two boxes occupy the same space', function(done) {
          root.testing(this)
          let aBox = root.entity('a-box')
          let anotherBox = root.entity('a-box')

          au.onceLoaded(anotherBox, () => {
            expect([aBox]).to.occupy([anotherBox])
            done()
          })
        })
        
        it('should pass if two boxes occupy the same space as two other boxes in same order', function(done) {
          root.testing(this)
          let boxes = [
            root.entity('a-box', {position: '0 1 0'}),
            root.entity('a-box')
          ]
          let expectedBoxes = [
            root.entity('a-box', {position: '0 1 0'}),
            root.entity('a-box')
          ]

          au.onceLoaded(expectedBoxes[1], () => {
            expect(boxes).to.occupy(expectedBoxes)
            done()
          })
        })

        it('should pass if two boxes occupy the same space as two other boxes in a different order', function(done) {
          root.testing(this)
          let boxes = [
            root.entity('a-box', {position: '0 1 0'}),
            root.entity('a-box')
          ]
          let expectedBoxes = [
            root.entity('a-box'),
            root.entity('a-box', {position: '0 1 0'}),
          ]

          au.onceLoaded(expectedBoxes[1], () => {
            expect(boxes).to.occupy(expectedBoxes)
            done()
          })
        })

        it('should fail if one of two boxes does not occupy the same space as two other boxes', function(done) {
          root.testing(this)
          let boxes = [
            root.entity('a-box', {position: '0 1 0'}),
            root.entity('a-box')
          ]
          let expectedBoxes = [
            root.entity('a-box'),
            root.entity('a-box', {position: '0 0 1'}),
          ]

          au.onceLoaded(expectedBoxes[1], () => {
            expect(() => {
              expect(boxes).to.occupy(expectedBoxes)
            }).to.throw(Error, /expected entity to occupy same space as comparison entity/)
            done()
          })
        })
        
        it('check that counts match')
        it('better error messages for multiple entities')
      })
    })
  })
})
