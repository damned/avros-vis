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

  let base, host, placed, root

  beforeEach(() => scene.reset())

  beforeEach(() => root = scene.addRoot())

  afterEach(() => root.makeViewable())

  it('should place its entity directly on top of its on base', function(done) {
    root.testing(this)
    base = root.testBox('base', { color: 'darkgray' })
    placed = root.testBox('placed', { placement: {on: '#' + base.id }})
    
    placed.addEventListener('placed', () => {
      expect(bottom(placed)).to.be.closeTo(top(base), TOLERANCE)
      expect(pos(placed).x).to.be.closeTo(pos(base).x, TOLERANCE)
      expect(pos(placed).z).to.be.closeTo(pos(base).z, TOLERANCE)
      done()
    })
  })
  
  it('should place its entity on its base but narrowed on each side by a percent margin', function(done) {
    root.testing(this)
    base = root.testBox('base', { color: 'darkblue' })
    placed = root.testBox('placed', { placement: { on: '#' + base.id, constrain: true, margin: 10 }})
    
    placed.addEventListener('placed', () => {
      expect(bottom(placed)).to.be.closeTo(top(base), TOLERANCE)
      expect(pos(placed).x).to.be.closeTo(pos(base).x, TOLERANCE)
      expect(pos(placed).z).to.be.closeTo(pos(base).z, TOLERANCE)
      expect(au.world.width(placed)).to.be.closeTo(au.world.width(base) * 0.8, TOLERANCE)
      expect(au.world.depth(placed)).to.be.closeTo(au.world.depth(base) * 0.8, TOLERANCE)
      done()
    })
  })
  
  describe('being placed upon a non-default space base', () => {
    it('should place the host entity on top of the base', function(done) {
      root.testing(this)
      let scaledParent = root.entity('a-entity', {
        position: '0.1 0.1 0.1', 
        scale: '2 2 2'
      })

      base = root.testBoxIn(scaledParent, 'a-box', {
        position: '0.1 0.1 -0.2',
        color: 'darkgray',
        height: 1
      })

      let placed = root.entity('a-box', { placement: { on: '#' + base.id }})

      placed.addEventListener('placed', () => {
        expect(pos(placed).x).to.be.closeTo(0.3, TOLERANCE)
        expect(pos(placed).y).to.be.closeTo(1.8, TOLERANCE)
        expect(pos(placed).z).to.be.closeTo(-0.3, TOLERANCE)
        done()
      })
    })
  })
  
  describe('when thing being placed on is already loaded', () => {
    it('should place its host entity directly on top of its on base', function(done) {
      root.testing(this)
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
    it('should position two placed entities along x axis of base in centre of equal halves', function(done) {
      root.testing(this)
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
    it('should position and size two placed entities along x axis of base in centre of equal halves', function(done) {
      root.testing(this)
      base = root.testBox('base', {
        color: "brown", 
        position: '-0.2 0.2 -0.3'
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

          expect(au.getEntitySize(host).x).to.be.closeTo(0.5, TOLERANCE)
          expect(au.getEntitySize(host2).x).to.be.closeTo(0.5, TOLERANCE)
          done()
        })
      })
    })

    it('should position and size four entities evenly over the four quarters of their base', function(done) {
      root.testing(this)
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
    
    it('should size an entity appropriately over a non-unit-sized square base', function(done) {
      root.testing(this)
      base = root.testBox('base', { 
        color: 'green',
        width: 0.4,
        depth: 0.4,
        height: 1
      })
      let target = root.markBox({ position: '0 0.7 0', scale: '0.4 0.4 0.4' })      
      au.onceLoaded(base, () => {
        let placed = root.entity('a-box', { color: 'red', placement: { on: '#' + base.id, constrain: true }})
        placed.addEventListener('placed', () => {
          expect(placed).to.occupy(target)
          done()
        })
      })
    })
    
  })
  
  describe('placing and sizing on a non-square base', () => {
    it('should size and place entities appropriately over a rectangular base', function(done) {
      root.testing(this)
      base = root.testBox('small-sixths', { 
        color: 'blue',
        position: '0.2 0.2 0.3',
        width: 0.4,
        depth: 0.6,
        height: 0.4
      })
      let targets = [
        root.markBox({ position: '0.1 0.5 0.1', scale: '0.2 0.2 0.2' }),
        root.markBox({ position: '0.3 0.5 0.3', scale: '0.2 0.2 0.2' }),
        root.markBox({ position: '0.1 0.5 0.3', scale: '0.2 0.2 0.2' }),
        root.markBox({ position: '0.3 0.5 0.1', scale: '0.2 0.2 0.2' }),
        root.markBox({ position: '0.1 0.5 0.5', scale: '0.2 0.2 0.2' }),
        root.markBox({ position: '0.3 0.5 0.5', scale: '0.2 0.2 0.2' })
      ]
      let placed =  root.entity('a-box', { color: 'blue',   placement: { on: '#' + base.id, constrain: true }})
      let placed2 = root.entity('a-box', { color: 'yellow', placement: { on: '#' + base.id, constrain: true }})
      let placed3 = root.entity('a-box', { color: 'red',    placement: { on: '#' + base.id, constrain: true }})
      let placed4 = root.entity('a-box', { color: 'green',  placement: { on: '#' + base.id, constrain: true }})
      let placed5 = root.entity('a-box', { color: 'grey',   placement: { on: '#' + base.id, constrain: true }})
      let placed6 = root.entity('a-box', { color: 'white',  placement: { on: '#' + base.id, constrain: true }})

      au.onceLoaded(base, () => {
        placed4.addEventListener('placed', () => {
          expect([ placed, placed2, placed3, placed4, placed5, placed6 ]).to.occupy(targets)
          done()
        })
      })      
    })
  })
})