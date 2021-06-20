/* global AFRAME THREE aframeUtils aframeTestScene */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('balloon-label component', () => {
  const scene = aframeTestScene({recreateOnReset: false})
  let root

  const select = selector => document.querySelector(selector)
  const pos = el => el.object3D.position

  let host

  beforeEach(() => scene.reset())
      
  it('should place the label directly above the host entity, by default 0.5 above origin', (done) => {
    root = scene.addRoot('static-label')
    
    host = root.addHtml('<a-box id="host" height="0.1" balloon-label="label: oof">', '#host')    
    
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        expect(pos(label).x).to.be.closeTo(pos(host).x, TOLERANCE)
        expect(pos(label).z).to.be.closeTo(pos(host).z, TOLERANCE)
        expect(pos(label).y).to.be.closeTo(pos(host).y + 0.5, TOLERANCE)
        done()
      })
    })
  })
  
  it('should place the label directly above the host entity, by specified offset above origin plus 0.5', (done) => {
    root = scene.addRoot('static-offset-label')

    host = root.addHtml('<a-box id="host" height="0.1" balloon-label="label: ouch; y-offset: 0.7">', '#host')    
    
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        expect(pos(label).x).to.be.closeTo(pos(host).x, TOLERANCE)
        expect(pos(label).z).to.be.closeTo(pos(host).z, TOLERANCE)
        expect(pos(label).y).to.be.closeTo(pos(host).y + 0.7 + 0.5, TOLERANCE)
        done()
      })
    })
  })
  
  it('should move the label directly over the host entity when it moves', (done) => {
    root = scene.addRoot('dynamic-label')
    
    host = root.addHtml('<a-box id="host" height="0.1" balloon-label="label: boff">', '#host')    
    au.onceLoaded(host, () => {
      au.onceLoaded(root.select('a-text'), label => {
        
        pos(host).set(1, 2, 3)
        label.addEventListener('balloonlabel.moved', () => {
          expect(pos(label).x).to.be.closeTo(1, TOLERANCE)
          expect(pos(label).z).to.be.closeTo(3, TOLERANCE)
          expect(pos(label).y).to.be.closeTo(2 + 0.5, TOLERANCE)
          done()
        })        
      })
    })
  })

})