/* global AFRAME THREE boxes aframeUtils */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

let createFakeLog = function() {
  let calls = []
  let logFn = (...args) => {
    calls.push(args)
  }
  logFn.getCalls = () => calls
  return logFn
}

describe('aframe utils', () => {
  let priorLogActiveState, priorLogActiveImpl
  before(() => {
    priorLogActiveState = au.log.active
    priorLogActiveImpl = au.log.logImpl
  })
  after(() => {
    au.log.active = priorLogActiveState
    au.log.logImpl = priorLogActiveImpl
  })

  describe('general utils', () => {
    describe('log()', () => {
      describe('logging implementation defaults', () => {
        it('should use console.log by default as the actual logger', () => {
          expect(au.log.logImpl).to.equal(console.log)        
        })
      })
      describe('what logging is done', () => {
        let fakeLog
        beforeEach(() => {
          fakeLog = createFakeLog()
          au.log.logImpl = fakeLog
          au.log.active = true
        })
        it('should actually log for a single non-function argument', () => {
          au.log('some string')
          expect(fakeLog.getCalls()).to.eql([['some string']])
        })
        it('should actually log for multiple string arguments', () => {
          au.log('a string', 'another string', 'third')
          expect(fakeLog.getCalls()[0]).to.eql(['a string', 'another string', 'third'])
        })
        it('should not log static arguments if log not active', () => {
          au.log.active = false
          au.log('one', 'two')
          expect(fakeLog.getCalls().length).to.eql(0)
        })
        it('should log if log is set active', () => {
          au.log.active = true
          au.log('one', 'two')
          expect(fakeLog.getCalls().length).to.eql(1)
        })
        it('should log the single return value of passed log function', () => {
          au.log(() => 'the thing actually logged')
          expect(fakeLog.getCalls()).to.eql([['the thing actually logged']])
        })
        it('should log the items of the array return value of passed log function as individual log parameters', () => {
          au.log(() => ['one', 'two'])
          expect(fakeLog.getCalls()).to.eql([['one', 'two']])
        })
        it('should not log from the log function if logging is not active', () => {
          au.log.active = false
          au.log(() => 'should not be logged')
          expect(fakeLog.getCalls().length).to.eql(0)
        })
        it('should not call the log function if logging is not active', () => {
          let called = false
          let logFn = () => {
            called = true
          }
          au.log.active = false
          au.log(logFn)
          expect(called).to.be.false
        })
      })
    })
  })
  describe('aframe scene related', () => {
    const aframeContainer = document.getElementById('aframe-container')

    let scene
    let inScene = (handler) => {
      if (scene.renderStarted) {
        handler(scene)
      }
      else {
        scene.addEventListener('renderstart', () => {
          handler(scene)
        })
      }
    }
    
    let resetSceneBeforeEach = false

    let select = selector => document.querySelector(selector)
    let addHtmlTo = (root, html, selector) => {
      root.insertAdjacentHTML('afterbegin', html)
      if (selector) {
        return select(selector)
      }
      return undefined
    }
    let addToScene = (html, selector) => addHtmlTo(scene, html, selector)
    
    let recreateScene = () => {
      if (resetSceneBeforeEach || aframeContainer.querySelector('a-scene') === null) {
        aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
      }
      scene = select('a-scene')
    }

    beforeEach(recreateScene)
    
    let ensureTestRootExists = (testRoot, name) => {      
      if (!testRoot) {
        testRoot = addToScene(`<a-entity id="anchor-test-${name}">`, `#anchor-test-${name}`)
        testRoot.makeViewable = () => {
          testRoot.setAttribute('position', '0 1 0')
          testRoot.setAttribute('scale', '0.2 0.2 0.2')
        }
        testRoot.withMark = vector3 => {
          let markPos = au.xyzTriplet(vector3)
          console.log('mark pos', markPos)
          addHtmlTo(testRoot, `<a-sphere radius="0.02" color="red" position="${markPos}"></a-sphere>`)
          return vector3
        }

      }
      return testRoot
    }

    describe('earliestAncestor()', () => {
      it('should return itself if no scene parent', done => {
        inScene(scene => {
          let target = addToScene('<a-box id="target">', '#target')
          expect(au.earliestAncestor(target)).to.equal(target)
          done()
        })
      })
      it('should return parent if one ancestor', done => {
        inScene(scene => {
          addToScene('<a-box id="parent">'
                   +   '<a-box id="target"></a-box>'
                   + '</a-box>')
          expect(au.earliestAncestor(select('#target'))).to.equal(select('#parent'))
          done()
        })
      })
    })
    
    describe('world-space utils', () => {
      
      // NB don't think have validated world deep ancestors and scale at this point...
      
      let vec3 = (x, y, z) => new THREE.Vector3(x, y, z)
      let subject
      
      describe('anchorPoint()', () => {
        let anchorTestRoot
        
        beforeEach(() => anchorTestRoot = ensureTestRootExists(anchorTestRoot, 'anchor'))
        
        after(() => anchorTestRoot.makeViewable())
        let withMark = vector3 => anchorTestRoot.withMark(vector3)
        
        let addTestBoxTo = (root, name, pos, color, options, attributes) => {
          let extraAttributes = Object.keys(attributes).map(key => `${key}="${attributes[key]}"`).join(' ')
          return addHtmlTo(root, `<a-box id="anchor-${name}"` 
                                       + ` width="${options.boxSize}" height="${options.boxSize}" depth="${options.boxSize}"` 
                                       + ` balloon-label="label: ${name}; y-offset: ${options.boxSize - 0.5}" position="${pos}"`
                                       + extraAttributes
                                       + ` material="color: ${color}; transparent: true; opacity: 0.3"></a-box>`, `#anchor-${name}`)
        }
        
        let addWorldBox = (name, pos, color, options = {boxSize: 0.5}, attributes = {}) => {
          return addTestBoxTo(anchorTestRoot, name, pos, color, options, attributes)
        }
        
        
        describe('getting the centre anchor point of `objects by using 50 percent for each anchor point axis', () => {
                    
          let centreAnchor = {
            x: 50,
            y: 50,
            z: 50
          }
          
          it('should find anchor point on a simple positioned box', (done) => {
            inScene(scene => {
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
            inScene(scene => {
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
            inScene(scene => {
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
            inScene(scene => {
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
            inScene(scene => {
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
            inScene(scene => {
              let scaledParent = addHtmlTo(anchorTestRoot, '<a-entity id="scaled-blf-parent" position="-1 1 -1" scale="0.4 0.4 0.4">',
                                           '#scaled-blf-parent')
              scaledParent.addEventListener('loaded', () => {
                subject = addTestBoxTo(scaledParent, 'scaled-blf-child', '-1 1 -1', 'turqouise', { boxSize: 1 }, {})
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
            inScene(scene => {
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
        it('should define central bottom anchor as 50% in xz and 0% in y', (done) => {
          expect(au.ANCHOR_BOTTOM_MIDDLE).to.eql({x: 50, y: 0, z: 50})
        })
        
        it('should not yet support placement by non-central anchor points', (done) => {
          expect(() => au.world.placeByAnchor({x: 0, y: 0, z: 50})).to.throw(Error, /Only support central-bottom anchor/)
          expect(() => au.world.placeByAnchor({x: 50, y: 0, z: 49})).to.throw(Error, /Only support central-bottom anchor/)
        })

        it('should not yet support placement by anchor points other than on bottom', (done) => {

        })

        // it('should find point on a simple positioned box', (done) => {
        //   inScene(scene => {
        //     subject = addWorldBox('simple-top-half-left', '1 1 -1', 'maroon', { boxSize: 0.4 })
        //     subject.addEventListener('loaded', () => {
        //       let anchor = withMark(au.world.anchorPoint(bottomLeftFarAnchor, subject))
        //       expect(anchor.x).to.be.closeTo(0.9, TOLERANCE)
        //       expect(anchor.y).to.be.closeTo(1.2, TOLERANCE)
        //       expect(anchor.z).to.be.closeTo(-1, TOLERANCE)
        //       done()
        //     })
        //   })
        // })
      })
      
      describe('top()', () => {
        it('should get the world y position of the top of a unit box at origin', (done) => {
          inScene(scene => {
            subject = addToScene('<a-box id="top-origin"></a-box>', '#top-origin')
            subject.addEventListener('loaded', () => {
              expect(au.world.top(subject)).to.equal(0.5)
              done()
            })
          })
        })

        it('should get the top of a unit box at some height', (done) => {
          inScene(scene => {
            subject = addToScene('<a-box id="top-high" position="0 2 0"><a-box>', '#top-high')
            au.tick(() => {
              expect(au.world.top(subject)).to.equal(2.5)
              done()
            })
          })
        })

        it('should get the top of a unit box at origin within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(3.5)
              done()
            })
          })
        })

        it('should get the top of a half height box at origin within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(3.25)
              done()
            })
          })
        })

        it('should get the top of a unit box at origin within a scaled entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(4)
              done()
            })
          })
        })

        it('should get the top of a unit box at a non-zero height within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(5.5)
              done()
            })
          })
        })
      })

      describe('bottom()', () => {
        it('should get the world y position of the bottom of a unit box at origin', (done) => {
          inScene(scene => {
            addToScene('<a-box>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(-0.5)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at some height', (done) => {
          inScene(scene => {
            addToScene('<a-box position="0 2 0">')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(1.5)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at origin within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2.5)
              done()
            })
          })
        })

        it('should get the bottom of a half height box at origin within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2.75)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at origin within a scaled entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(2)
              done()
            })
          })
        })

        it('should get the bottom of a unit box at a non-zero height within an entity at some height', (done) => {
          inScene(scene => {
            addToScene('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
            au.tick(() => {
              expect(au.world.bottom(select('a-box'))).to.equal(4.5)
              done()
            })
          })
        })
      })

      describe('height()', () => {
        it('should get the height of a unit box', (done) => {
          inScene(scene => {
            addToScene('<a-box>')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.equal(1)
              done()
            })
          })
        })

        it('should get the height of a custom-height box', (done) => {
          inScene(scene => {
            addToScene('<a-box height="0.6">')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(0.6, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a scaled custom-height box', (done) => {
          inScene(scene => {
            addToScene('<a-box height="0.6" scale="1 3 1">')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(1.8, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a unit box in a scaled entity', (done) => {
          inScene(scene => {
            addToScene('<a-entity scale="1 3 1"><a-box></a-entity>')
            au.tick(() => {
              expect(au.world.height(select('a-box'))).to.closeTo(3, TOLERANCE)
              done()
            })
          })
        })

        it('should get the height of a custom height box in a scaled entity', (done) => {
          inScene(scene => {
            addToScene('<a-entity scale="1 4 1"><a-box height="0.5"></a-entity>')
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