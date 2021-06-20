/* global AFRAME THREE aframeUtils aframeTestScene */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('balloon-label component', () => {
  const scene = aframeTestScene()

//   const select = selector => document.querySelector(selector)
//   const top = au.world.top
//   const bottom = au.world.bottom
//   const width = au.world.width
  const pos = el => el.object3D.position

  let host
  
  beforeEach(() => scene.reset())

      
  it('should place the label directly above the host entity', (done) => {
    host = scene.addHtml('<a-box id="host" balloon-label="label: oof">', '#host')
    
    scene.within(() => {
      host.addEventListener('loaded', () => {
        let 
        expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
        expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
        expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
      })
      done()
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