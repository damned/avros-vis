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
    
    describe('occupy', () => {
      beforeEach(() => root = scene.addRoot())
      
      describe('for single entities', () => {
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

        it('should pass if two boxes occupy the same space within a small float tolerance', done => {
          scene.within(() => {
            let aBox = root.entity('a-box', {position: {x:1,y:1,z:0.99997}, scale: {x:1,y:1.0002,z:1}})
            let anotherBox = root.entity('a-box', {position: {x:1.0001,y:1.0001,z:1}, scale: {x:0.99998,y:1,z:1.0000011}})

            au.onceLoaded(anotherBox, () => {
              expect(aBox).to.occupy(anotherBox)
              done()
            })
          })
        })

        it('should fail if two boxes are at different positions', done => {
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

        it('should fail if two boxes are at the same position but have different sizes due to scale', done => {
          scene.within(() => {
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
      })
      describe('for multiple entities', () => {
        it('should pass if two boxes occupy the same space', done => {
          scene.within(() => {
            let aBox = root.entity('a-box')
            let anotherBox = root.entity('a-box')

            au.onceLoaded(anotherBox, () => {
              expect([aBox]).to.occupy([anotherBox])
              done()
            })
          })
        })
        
        it('should pass if two boxes occupy the same space as two other boxes in same order', done => {
          scene.within(() => {
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
        })

        it('should pass if two boxes occupy the same space as two other boxes in a different order', done => {
          scene.within(() => {
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
        })

        it('should fail if one of two boxes does not occupy the same space as two other boxes', done => {
          scene.within(() => {
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
        })
        
        it('check that counts match')
        it('better error messages for multiple entities')
      })
    })
  })
})
