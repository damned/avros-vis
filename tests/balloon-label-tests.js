/* global AFRAME THREE aframeUtils aframeTestScene */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('balloon-label component', () => {
  const scene = aframeTestScene()

//   const aframeContainer = document.getElementById('aframe-container')
//   const select = selector => document.querySelector(selector)
//   const top = au.world.top
//   const bottom = au.world.bottom
//   const width = au.world.width
//   const pos = el => el.object3D.position

//   let scene, base, host

//   let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)  
  
//   let resetSceneBeforeEach = true

//   let recreateScene = () => {
//     if (resetSceneBeforeEach || aframeContainer.querySelector('a-scene') === null) {
//       aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
//     }
//     scene = select('a-scene')
//   }
  
//   beforeEach(recreateScene)


//   beforeEach(() => {
//     scene.innerHTML = '<a-box id="base" position="0 0.6 -1.2" color="darkgray" height="1">'
    
//     base = document.querySelector('#base')
//     base.innerHTML = ''
//   })
      
  it('should place the label directly above the host entity', (done) => {
//     addToScene('<a-box id="host" placement="on: #base">')
//     host = select('#host')
    
//     host.addEventListener('placed', () => {
//       expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
//       expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
//       expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
//       done()
//     })
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