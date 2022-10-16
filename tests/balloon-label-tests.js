/* global AFRAME THREE au aframeTestScene */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001


describe('balloon-label component', () => {
  const scene = aframeTestScene({recreateOnReset: false})
  let root

  const select = selector => document.querySelector(selector)
  const pos = el => el.object3D.position

  let host

  beforeEach(scene.reset)
  afterEach(() => root.makeViewable())
      
  it('should place the label directly above the host entity, by default 0.5 above origin', function(done) {
    root = scene.addRoot('static-label')
    root.testing(this)
    
    host = root.entity('a-box', { height: 0.1, 'balloon-label': 'label: oof'})
    
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        expect(pos(label).x).to.be.closeTo(pos(host).x, TOLERANCE)
        expect(pos(label).z).to.be.closeTo(pos(host).z, TOLERANCE)
        expect(pos(label).y).to.be.closeTo(pos(host).y + 0.5, TOLERANCE)
        done()
      })
    })
  })
  
  it('should place the label directly above the host entity, by specified offset above origin plus 0.5', function(done) {
    root = scene.addRoot('static-offset-label')
    root.testing(this)

    host = root.entity('a-box', { 
      height: 0.1, 
      'balloon-label': 'label: ouch; y-offset: 0.7'
    })
    
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        expect(pos(label).x).to.be.closeTo(pos(host).x, TOLERANCE)
        expect(pos(label).z).to.be.closeTo(pos(host).z, TOLERANCE)
        expect(pos(label).y).to.be.closeTo(pos(host).y + 0.7 + 0.5, TOLERANCE)
        done()
      })
    })
  })
  
  it('should move the label directly over the host entity when it moves', function(done) {
    root = scene.addRoot('dynamic-label')
    root.testing(this)
    
    host = root.entity('a-box', { height: 0.1, 'balloon-label': 'label: boff'})
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        host.addEventListener('balloonlabel.moved', () => {
          expect(pos(label).x).to.be.closeTo(0.1, TOLERANCE)
          expect(pos(label).z).to.be.closeTo(0.3, TOLERANCE)
          expect(pos(label).y).to.be.closeTo(0.2 + 0.5, TOLERANCE)
          done()
        })        
        pos(host).set(0.1, 0.2, 0.3)
      })
    })
  })

})