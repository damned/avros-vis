/* global AFRAME THREE aframeUtils aframeTestScene */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('balloon-label component', () => {
  const scene = aframeTestScene({recreateOnReset: true})
  let root

  const select = selector => document.querySelector(selector)
//   const top = au.world.top
//   const bottom = au.world.bottom
//   const width = au.world.width
  const pos = el => el.object3D.position

  let host

  beforeEach(() => scene.reset())
  beforeEach(() => {
    root = scene.addRoot('balloon-label')
  })
      
  it('should place the label directly above the host entity, by default 0.5 above origin', (done) => {
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
    host = root.addHtml('<a-box id="host" height="0.1" balloon-label="label: oof; y-offset: 0.7">', '#host')    
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
//     addToScene('<a-box id="host" placement="on: #base">')
//     host = select('#host')
    
//     host.addEventListener('placed', () => {
//       expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
//       expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
//       expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
//       done()
//     })
  })

})