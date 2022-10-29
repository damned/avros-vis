/* global AFRAME THREE boxes au aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

let createFakeLog = function() {
  let calls = []
  let logFn = (...args) => {
    calls.push(args)
  }
  logFn.getCalls = () => calls
  return logFn
}

const lineNumberFromStack = stack => {
  return stack.split('\n').find(line => line.includes('log-tests.js'))
}

describe('aframe utils logging', () => {
  let select = selector => document.querySelector(selector)    
  
  describe('log()', () => {

    let priorLogActiveState, priorLogActiveImpl
    before(() => {
      priorLogActiveState = au.log.active
      priorLogActiveImpl = au.log.logImpl
    })
    after(() => {
      au.log.active = priorLogActiveState
      au.log.logImpl = priorLogActiveImpl
    })

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
        au.log.prefixWithCallSite = false
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
      it('should prefix logging with call site information if turned on', () => {
        au.log.prefixWithCallSite = true
        au.log('boo')
        expect(fakeLog.getCalls()[0]).to.startsWith('log-tests.js:' +    lineNumberFromStack(new Error().stack))
      })
    })
  })
})