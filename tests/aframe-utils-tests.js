/* global AFRAME boxes aframeUtils */
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
  xdescribe('aframe scene related', () => {
    const aframeContainer = document.getElementById('aframe-container')

    let getScene = () => aframeContainer.querySelector('a-scene')
    let scene
    let inScene = (handler) => scene.addEventListener('renderstart', () => {
      handler(scene)
    })

    let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)
    let select = selector => document.querySelector(selector)

    beforeEach(() => {
      aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
      scene = getScene()
    })

    describe('world-space utils', () => {

      describe('top()', () => {
        it('should get the world y position of the top of a unit box at origin', (done) => {
          inScene(scene => {
            addToScene('<a-box>')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(0.5)
              done()
            })
          })
        })

        it('should get the top of a unit box at some height', (done) => {
          inScene(scene => {
            addToScene('<a-box position="0 2 0">')
            au.tick(() => {
              expect(au.world.top(select('a-box'))).to.equal(2.5)
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