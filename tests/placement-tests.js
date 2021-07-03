/* global AFRAME THREE au aframeTestScene aframeAssertions */
var chai = chai || {}
var expect = chai.expect

chai.use(aframeAssertions());

var TOLERANCE = 0.001

describe('placement component', () => {
  const scene = aframeTestScene()
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom
  const width = au.world.width
  const pos = el => el.object3D.position

  let base, host, root

  beforeEach(() => scene.reset())

  beforeEach(function() {
    root = scene.addRoot(this)
  })

  afterEach(() => root.makeViewable())

  it('should place its host entity directly on top of its on base', (done) => {
    base = root.testBox('base', { color: 'darkgray' })
    host = root.testBox('placed', { placement: {on: '#' + base.id }})
    
    host.addEventListener('placed', () => {
      expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
      expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
      expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
      done()
    })
  })
  
  describe('being placed upon a non-default space base', () => {
    it('should place the host entity on top of the base', done => {
      let scaledParent = root.entity('a-entity', {
        position: '1 1 1', 
        scale: '2 2 2'
      })

      base = root.testBoxIn(scaledParent, 'a-box', {
        position: '1 1 -1',
        color: 'darkgray',
        height: 1
      })

      let placed = root.entity('a-box', { placement: { on: '#' + base.id }})

      placed.addEventListener('placed', () => {
        expect(pos(placed).x).to.be.closeTo(3, TOLERANCE)
        expect(pos(placed).y).to.be.closeTo(4.5, TOLERANCE)
        expect(pos(placed).z).to.be.closeTo(-1, TOLERANCE)
        done()
      })
    })
  })
  
  describe('when thing being placed on is already loaded', () => {
    it('should place its host entity directly on top of its on base', (done) => {
      base = root.testBox('base')
      host = root.entity('a-box', { placement: { on: '#' + base.id }})

      host.addEventListener('placed', () => {
        expect(bottom(host)).to.be.closeTo(top(base), TOLERANCE)
        expect(pos(host).x).to.be.closeTo(pos(base).x, TOLERANCE)
        expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE)
        done()
      })
    })    
  })
  
  describe('placing multiple entities on a square base', () => {
    it('should position two placed entities along x axis of base in centre of equal halves', done => {
      base = root.testBox('base')
      host = root.entity('a-box', {
        color: 'blue', 
        placement: { on: '#' + base.id }
      })
      let host2 = root.entity('a-box', {
        color: 'yellow', 
        placement: { on: '#' + base.id }
      })
      
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
      base = root.testBox('base', {
        color: "brown", 
        position: '-2 0 -1'
      })
      
      au.onceLoaded(base, () => {
        host = root.entity('a-box', {
          color: 'blue', 
          placement: { on: '#' + base.id, constrain: true }
        })
        let host2 = root.entity('a-box', {
          color: 'yellow', 
          placement: { on: '#' + base.id, constrain: true }
        })

        host2.addEventListener('placed', () => {
          expect(pos(host).z).to.be.closeTo(pos(base).z, TOLERANCE, 'host 1 z')
          expect(pos(host2).z).to.be.closeTo(pos(base).z, TOLERANCE, 'host 2 z')

          expect(Math.min(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base).x - width(base) / 4, TOLERANCE, 'host 1 x')
          expect(Math.max(pos(host).x, pos(host2).x)).to.be.closeTo(pos(base).x  + width(base) / 4, TOLERANCE, 'host 2 x')

          expect(au.getEntitySize(host).x).to.equal(0.5)
          expect(au.getEntitySize(host2).x).to.equal(0.5)
          done()
        })
      })
    })

    it('should position and size four entities evenly over the four quarters of their base', done => {
      base = root.testBox('quarters', { 
        color: 'pink',
        position: '0.5 0 0.5'
      })
      let targets = [
        root.markBox({ position: '0.25 0.75 0.25', scale: '0.5 0.5 0.5' }),
        root.markBox({ position: '0.75 0.75 0.25', scale: '0.5 0.5 0.5' }),
        root.markBox({ position: '0.25 0.75 0.75', scale: '0.5 0.5 0.5' }),
        root.markBox({ position: '0.75 0.75 0.75', scale: '0.5 0.5 0.5' }),
      ]
      au.onceLoaded(base, () => {
        host =      root.entity('a-box', { color: 'blue',   placement: { on: '#' + base.id, constrain: true }})
        let host2 = root.entity('a-box', { color: 'yellow', placement: { on: '#' + base.id, constrain: true }})
        let host3 = root.entity('a-box', { color: 'red',    placement: { on: '#' + base.id, constrain: true }})
        let host4 = root.entity('a-box', { color: 'green',  placement: { on: '#' + base.id, constrain: true }})

        host4.addEventListener('placed', () => {
          expect([ host, host2, host3, host4 ]).to.occupy(targets)
          done()
        })
      })
    })
  })
})