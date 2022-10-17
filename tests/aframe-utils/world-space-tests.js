/* global AFRAME THREE boxes au aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('aframe utils space functions', () => {
  let select = selector => document.querySelector(selector)    
  
  describe('aframe scene related', () => {
    const scene = aframeTestScene({ sceneName: 'aframe utils space functions'})

    beforeEach(scene.reset)
    
    describe('world-space utils', () => {
      
      // NB don't think have validated world deep ancestors and scale at this point...
      
      let vec3 = (x, y, z) => new THREE.Vector3(x, y, z)
      let subject
      let root
      
      beforeEach(() => root = scene.addRoot())
      
      describe('top()', () => {
        it('should get the world y position of the top of a unit box at origin', (done) => {
          
          subject = root.addHtml('<a-box id="top-origin"></a-box>', '#top-origin')
          subject.addEventListener('loaded', () => {
            expect(au.world.top(subject)).to.equal(0.5)
            done()
          })
        })

        it('should get the top of a unit box at some height', (done) => {
          subject = root.addHtml('<a-box id="top-high" position="0 2 0"><a-box>', '#top-high')
          au.tick(() => {
            expect(au.world.top(subject)).to.equal(2.5)
            done()
          })
        })

        it('should get the top of a unit box at origin within an entity at some height', (done) => {
          root.addHtml('<a-entity position="0 3 -3"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.top(root.select('a-box'))).to.equal(3.5)
            done()
          })
        })

        it('should get the top of a half height box at origin within an entity at some height', (done) => {
          root.addHtml('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
          au.tick(() => {
            expect(au.world.top(root.select('a-box'))).to.equal(3.25)
            done()
          })
        })

        it('should get the top of a unit box at origin within a scaled entity at some height', (done) => {
          root.addHtml('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.top(root.select('a-box'))).to.equal(4)
            done()
          })
        })

        it('should get the top of a unit box at a non-zero height within an entity at some height', (done) => {
          root.addHtml('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
          au.tick(() => {
            expect(au.world.top(root.select('a-box'))).to.equal(5.5)
            done()
          })
        })
      })

      describe('bottom()', () => {
        it('should get the world y position of the bottom of a unit box at origin', (done) => {
          scene.within(() => {
            scene.addHtml('<a-box>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(-0.5)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at some height', (done) => {
          scene.within(() => {
            scene.addHtml('<a-box position="0 2 0">')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(1.5)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at origin within an entity at some height', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity position="0 3 -3"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2.5)
              done()
            })
          })
        })

        it('should get the bottom of a half height box at origin within an entity at some height', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2.75)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at origin within a scaled entity at some height', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at a non-zero height within an entity at some height', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(4.5)
              done()
            })
          })
        })
      })

      describe('height()', () => {
        it('should get the height of a unit box', (done) => {
          scene.within(() => {
            scene.addHtml('<a-box>')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.equal(1)
              done()
            })
          })
        })

        it('should get the height of a custom-height box', (done) => {
          scene.within(() => {
            scene.addHtml('<a-box height="0.6">')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(0.6, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a scaled custom-height box', (done) => {
          scene.within(() => {
            scene.addHtml('<a-box height="0.6" scale="1 3 1">')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(1.8, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a unit box in a scaled entity', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity scale="1 3 1"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(3, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a custom height box in a scaled entity', (done) => {
          scene.within(() => {
            scene.addHtml('<a-entity scale="1 4 1"><a-box height="0.5"></a-entity>')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(2, TOLERANCE)
              done()
            })
          })
        })

      })
    })
  })
})