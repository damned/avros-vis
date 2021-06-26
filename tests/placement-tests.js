/* global AFRAME THREE au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('placement component', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom
  const width = au.world.width
  const pos = el => el.object3D.position

  let scene, base, host

  let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)  
  
  let resetSceneBeforeEach = true

  let recreateScene = () => {
    if (resetSceneBeforeEach || aframeContainer.querySelector('a-scene') === null) {
      aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
    }
    scene = select('a-scene')
  }
  
  beforeEach(recreateScene)


  beforeEach(() => {
    scene.innerHTML = '<a-box id="base" position="0 0.6 -1.2" color="darkgray" height="1">'
    
    base = document.querySelector('#base')
    base.innerHTML = ''
  })
      
  it('should place its host entity directly on top of its on base', (done) => {
    addToScene('<a-box id="host" placement="on: #base">')
    host = select('#host')
    
    host.addEventListener('placed', () => {
      expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
      expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
      expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
      done()
    })
  })
  
  describe('being placed upon a non-default space base', () => {
    it('should place the host entity on top of the base', done => {
      scene.innerHTML = '<a-entity position="1 1 1" scale="2 2 2">' + 
                          '<a-box id="trans-base" position="3 3 -3" color="darkgray" height="1">' +
                        '</a-entity>'

      base = document.querySelector('#trans-base')

      addToScene('<a-box id="placed" placement="on: #trans-base">')
      let placed = select('#placed')

      placed.addEventListener('placed', () => {
        expect(pos(placed).x).to.be.closeTo(7, TOLERANCE)
        expect(pos(placed).y).to.be.closeTo(8.5, TOLERANCE)
        expect(pos(placed).z).to.be.closeTo(-5, TOLERANCE)
        done()
      })
    })
  })
  
  describe('when thing being placed on is already loaded', () => {
    it('should place its host entity directly on top of its on base', (done) => {
      base.addEventListener('loaded', () => {
        addToScene('<a-box id="host" placement="on: #base">')
        host = select('#host')

        host.addEventListener('placed', () => {
          expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
          expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
          expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
          done()
        })
      })
    })    
  })
  
  describe('placing multiple entities on a square base', () => {
    it('should position two placed entities along x axis of base in centre of equal halves', done => {
      addToScene('<a-box id="host1" color="blue" placement="on: #base">')
      addToScene('<a-box id="host2" color="yellow" placement="on: #base">')
      host = select('#host1')      
      let host2 = select('#host2')      
      
      host2.addEventListener('placed', () => {
        expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE, 'host 1 z')
        expect(pos(host2).z).to.be.closeTo(pos(base).z, TOLERANCE, 'host 2 z')

        expect(Math.min(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base).x - width(base) / 4, TOLERANCE, 'host 1 x')
        expect(Math.max(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base).x  + width(base) / 4, TOLERANCE, 'host 2 x')

        done()
      })
    })
  })

  describe('placing and sizing multiple entities on a square base', () => {
    it('should position and size two placed entities along x axis of base in centre of equal halves', done => {
      let base2 = au.entity(scene, 'a-box', { id: "base2", color: "brown", position: '-2 0 -1' })
      au.onceLoaded(base2, () => {
        addToScene('<a-box id="host1" color="blue" placement="on: #base2; constrain: true">')
        addToScene('<a-box id="host2" color="yellow" placement="on: #base2; constrain: true">')
        host = select('#host1')      
        let host2 = select('#host2')      

        host2.addEventListener('placed', () => {
          expect(pos(host).z).to.be.closeTo(pos(base2).z, TOLERANCE, 'host 1 z')
          expect(pos(host2).z).to.be.closeTo(pos(base2).z, TOLERANCE, 'host 2 z')

          expect(Math.min(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base2).x - width(base) / 4, TOLERANCE, 'host 1 x')
          expect(Math.max(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base2).x  + width(base) / 4, TOLERANCE, 'host 2 x')

          expect(au.getEntitySize(host).x).to.equal(0.5)
          expect(au.getEntitySize(host2).x).to.equal(0.5)
          done()
        })
      })
    })
    it('should position and size four entities evenly over the four quarters of their base', done => {
      let base3 = au.entity(scene, 'a-box', { id: 'base3', color: 'pink', position: '-2 0 -2' })
      au.onceLoaded(base3, () => {
        host = au.entity(scene, 'a-box', { color: 'blue', placement: {on: '#base3', constrain: true}})
        let host2 = au.entity(scene, 'a-box', { color: 'yellow', placement: {on: '#base3', constrain: true}})
        let host3 = au.entity(scene, 'a-box', { color: 'red', placement: {on: '#base3', constrain: true}})
        let host4 = au.entity(scene, 'a-box', { color: 'green', placement: {on: '#base3', constrain: true}})

        host2.addEventListener('placed', () => {
          
          
          /// pfff .... this is getting harder to write, i want some sort of visual language for these asserts i think...
          //  z
          // 3\CCDD   
          //   BBBB   
          //   BBBB   
          //   BBBB   
          //  O    \4x
          //
          //  or even better, just some static a-frame elements that the actors should match?
          //
          //  these can then be placed in for comparison in the test root when failure, for comparison:
          //   'looks like this, but should look like this:'
          //
          expect(pos(host).z).to.be.closeTo(pos(base3).z, TOLERANCE, 'host 1 z')
          expect(pos(host2).z).to.be.closeTo(pos(base3).z, TOLERANCE, 'host 2 z')

          expect(Math.min(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base3).x - width(base) / 4, TOLERANCE, 'host 1 x')
          expect(Math.max(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base3).x  + width(base) / 4, TOLERANCE, 'host 2 x')

          expect(au.getEntitySize(host).x).to.equal(0.5)
          expect(au.getEntitySize(host2).x).to.equal(0.5)
          done()
        })
      })
    })
  })
})