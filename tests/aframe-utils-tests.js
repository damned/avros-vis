/* global AFRAME boxes aframeUtils */
var chai = chai || {}
var expect = chai.expect
let au = aframeUtils

describe('aframe utils', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  let scene
  let inScene = (handler) => scene.addEventListener('renderstart', () => {
    handler(scene)
    aframeContainer.removeChild(scene)
  })
  
  let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)
  let select = selector => document.querySelector(selector)
  
  beforeEach(() => {
    aframeContainer.insertAdjacentHTML('afterbegin', '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>')
    scene = getScene()
  })

  describe('world-space utils', () => {

    describe('top()', () => {
      it('should get the world y position of the top of a unit box at origin', (done) => {
        inScene(scene => {
          addToScene('<a-box></a-box>')
          au.tick(() => {
            expect(top(select('a-box'))).to.equal(0.5)
            done()
          })
        })
      })
    
    })

  })
})