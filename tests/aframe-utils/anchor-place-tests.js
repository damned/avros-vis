/* global AFRAME THREE boxes au aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('aframe utils a.k.a. au', () => {
  let select = selector => document.querySelector(selector)    
  
  describe('aframe scene related', () => {
    const scene = aframeTestScene()

    beforeEach(scene.reset)
    
    let vec3 = (x, y, z) => new THREE.Vector3(x, y, z)
    let subject

    describe('anchorPoint()', () => {
      let anchorTestRoot

      beforeEach(() => anchorTestRoot = scene.addRoot('anchor'))

      // after(() => anchorTestRoot.makeViewable())

      let withMark = vector3 => anchorTestRoot.withMark(vector3)

      let addWorldBox = (name, pos, color, options = {boxSize: 0.5}, extraAttributes = {}) => {
        return anchorTestRoot.addTestBox(name, pos, color, options, extraAttributes)
      }


      describe('getting the centre anchor point of `objects by using 50 percent for each anchor point axis', () => {

        let centreAnchor = {
          x: 50,
          y: 50,
          z: 50
        }

        it('should find anchor point on a simple positioned box', (done) => {
          scene.within(() => {
            subject = addWorldBox('simple-centre', '3 2 -1', 'orange')
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(centreAnchor, subject))
              expect(anchor).to.eql(vec3(3, 2, -1))
              done()
            })
          })
        })

      })

      describe('getting the top middle anchor point of objects by using 50 percent for xz and 100 percent for y denoting top limit', () => {

        let topMiddleAnchor = {
          x: 50,
          y: 100,
          z: 50
        }

        it('should find point on a simple positioned box', (done) => {
          scene.within(() => {
            subject = addWorldBox('simple-top-middle', '2 2 -1', 'yellow', { boxSize: 0.4 })
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(topMiddleAnchor, subject))
              expect(anchor.x).to.eql(2)
              expect(anchor.y).to.be.closeTo(2.2, TOLERANCE)
              expect(anchor.z).to.eql(-1)
              done()
            })
          })
        })

      })

      describe('getting the bottom middle anchor point of objects by using 50 percent for xz and 0 percent for y denoting bottom limit', () => {

        let bottomMiddleAnchor = {
          x: 50,
          y: 0,
          z: 50
        }

        it('should find point on a simple positioned box', (done) => {
          scene.within(() => {
            subject = addWorldBox('simple-bottom-middle', '2 1 -1', 'green', { boxSize: 0.6 })
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(bottomMiddleAnchor, subject))
              expect(anchor.x).to.eql(2)
              expect(anchor.y).to.be.closeTo(0.7, TOLERANCE)
              expect(anchor.z).to.eql(-1)
              done()
            })
          })
        })
      })


      describe('getting the bottom far left anchor point by using 0 percent anchors on each axis', () => {

        let bottomLeftFarAnchor = {
          x: 0,
          y: 0,
          z: 0
        }

        it('should find the point on a simple positioned box', (done) => {
          scene.within(() => {
            subject = addWorldBox('simple-bottom-left-far', '1 2 -1', 'blue', { boxSize: 0.5 })
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(bottomLeftFarAnchor, subject))
              expect(anchor.x).to.be.closeTo(0.75, TOLERANCE)
              expect(anchor.y).to.be.closeTo(1.75, TOLERANCE)
              expect(anchor.z).to.be.closeTo(-1.25, TOLERANCE)
              done()
            })
          })
        })


        it('should find the anchor point on a scaled box', (done) => {
          scene.within(() => {
            subject = addWorldBox('scaled-bottom-left-far', '0 2 -1', 'lightblue', { boxSize: 1 }, { scale: '0.4 0.4 0.4' })
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(bottomLeftFarAnchor, subject))
              expect(anchor.x).to.be.closeTo(-0.2, TOLERANCE)
              expect(anchor.y).to.be.closeTo(1.8, TOLERANCE)
              expect(anchor.z).to.be.closeTo(-1.2, TOLERANCE)
              done()
            })
          })
        })

        it('should find the anchor point on an un-scaled box in a scaled entity', (done) => {
          scene.within(() => {

            // reify -> testroot.addEntity(id, pos, scale) ...
            let scaledParent = anchorTestRoot.addHtml('<a-entity id="scaled-blf-parent" position="-1 1 -1" scale="0.4 0.4 0.4">', '#scaled-blf-parent')
            scaledParent.addEventListener('loaded', () => {
              // scaledParent.addtextbox(...)
              subject = anchorTestRoot.addTestBoxTo(scaledParent, 'scaled-blf-child', '-1 1 -1', 'turqouise', { boxSize: 1 }, {})
              subject.addEventListener('loaded', () => {
                let anchor = withMark(au.world.anchorPoint(bottomLeftFarAnchor, subject))
                expect(anchor.x).to.be.closeTo(-1.6, TOLERANCE)
                expect(anchor.y).to.be.closeTo(1.2, TOLERANCE)
                expect(anchor.z).to.be.closeTo(-1.6, TOLERANCE)
                done()
              })
            })
          })
        })          

      })

      describe('getting the anchor point on top face and half way from middle to left edge', () => {

        let bottomLeftFarAnchor = {
          x: 25,
          y: 100,
          z: 50
        }

        it('should find point on a simple positioned box', (done) => {
          scene.within(() => {
            subject = addWorldBox('simple-top-half-left', '1 1 -1', 'maroon', { boxSize: 0.4 })
            subject.addEventListener('loaded', () => {
              let anchor = withMark(au.world.anchorPoint(bottomLeftFarAnchor, subject))
              expect(anchor.x).to.be.closeTo(0.9, TOLERANCE)
              expect(anchor.y).to.be.closeTo(1.2, TOLERANCE)
              expect(anchor.z).to.be.closeTo(-1, TOLERANCE)
              done()
            })
          })
        })
      })

    })

    describe('placeByAnchor()', () => {
      it('should define central bottom anchor as 50% in xz and 0% in y', () => {
        expect(au.ANCHOR_BOTTOM_MIDDLE).to.eql({x: 50, y: 0, z: 50})
      })

      it('should not yet support placement by anchor points not in horizontal middle', () => {
        expect(() => au.world.placeByAnchor({x: 0, y: 0, z: 50})).to.throw(Error, /only support ANCHOR_BOTTOM_MIDDLE/)
        expect(() => au.world.placeByAnchor({x: 50, y: 0, z: 49})).to.throw(Error, /only support ANCHOR_BOTTOM_MIDDLE/)
      })

      it('should not yet support placement by anchor points other than on bottom', () => {
        expect(() => au.world.placeByAnchor({x: 50, y: 100, z: 50})).to.throw(Error, /only support ANCHOR_BOTTOM_MIDDLE/)
      })

      describe('needing a scene', () => {
        let anchorPlacementRoot

        beforeEach(() => anchorPlacementRoot = scene.addRoot('anchor-placement'))

        after(() => anchorPlacementRoot.makeViewable())

        let withMark = vector3 => anchorPlacementRoot.withMark(vector3)

        let addWorldBox = (name, pos, color, options = {boxSize: 0.5}, extraAttributes = {}) => {
          return anchorPlacementRoot.addTestBox(name, pos, color, options, extraAttributes)
        }

        it('should place simple box so that its bottom-middle anchor point matches a given world point', (done) => {
          scene.within(() => {
            let target = withMark(vec3(1, 1, 1))
            subject = addWorldBox('simple-anchor-placement', '0 0 0', 'lightgreen', { boxSize: 0.4 })
            subject.addEventListener('loaded', () => {
              au.world.placeByAnchor(au.ANCHOR_BOTTOM_MIDDLE, subject, target)
              let position = subject.object3D.position
              expect(position.x).to.be.closeTo(1, TOLERANCE)
              expect(position.y).to.be.closeTo(1.2, TOLERANCE)
              expect(position.z).to.be.closeTo(1, TOLERANCE)
              done()
            })
          })
        })

        it('should place box within a scaled parent by bottom-middle anchor', done => {
          scene.within(() => {
            let target = withMark(vec3(2, 1, -1))
            
            let scaledParent = anchorPlacementRoot.addHtml('<a-entity id="scaled-place-parent" position="2 2 2" scale="0.4 0.4 0.4">', '#scaled-place-parent')
            scaledParent.addEventListener('loaded', () => {
              subject = anchorPlacementRoot.addTestBoxTo(scaledParent, 'scaled-place-child', '-2 1 -1', 'yellow', { boxSize: 1 }, {})
              subject.addEventListener('loaded', () => {
                au.world.placeByAnchor(au.ANCHOR_BOTTOM_MIDDLE, subject, target)
                let position = subject.object3D.getWorldPosition(new THREE.Vector3())
                expect(position.x).to.be.closeTo(2, TOLERANCE)
                expect(position.y).to.be.closeTo(1.2, TOLERANCE)
                expect(position.z).to.be.closeTo(-1, TOLERANCE)
                done()
              })              
            })
          })
        })
      })          
    })
  })
})