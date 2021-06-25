/* global AFRAME THREE Model au */
var chai = chai || {}
var expect = chai.expect

var TOLERANCE = 0.001

describe('model', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive
  const bounds = au.world.bounds
  const height = au.world.height
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom

  let model, table, scene

  let resetSceneBeforeEach = false

  let recreateScene = () => {
    if (resetSceneBeforeEach || aframeContainer.querySelector('a-scene') === null) {
      aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
    }
    scene = select('a-scene')
  }
  
  beforeEach(recreateScene)

  beforeEach(() => {
    scene.innerHTML = '<a-box id="table" position="0 0.6 -1.2" color="darkgray" height="1"></a-box>'

    table = document.querySelector('#table')
    table.innerHTML = ''
    model = Model()
  })
      
  let afterTick = au.tick
  let afterDoubleTick = au.doubleTick
  
  it('should add a rectangular board onto tabletop object', (done) => {
    table.addEventListener('loaded', () => {
      let board = model.board('first-board')
      model.render(scene, table, [])
    })
    
    afterDoubleTick(() => {
      let boardEl = select('#first-board')
      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(height(boardEl)).to.be.closeTo(0.1, 0.01)
      expect(boardEl.parentNode).to.equal(scene)
      expect(bottom(boardEl)).to.be.closeTo(top(table), TOLERANCE)
      done()
    })
  })

  it('should add a rectangular panel directly onto a board', (done) => {
    table.addEventListener('loaded', () => {
      let board = model.board('board')
      let panel = board.panel('the-panel')
      model.render(scene, table, [])
    })
    
    afterDoubleTick(() => {
      let boardEl = select('#board')
      let panelEl = select('#the-panel')

      expect(shape(panelEl)).to.equal('box')
      expect(height(panelEl)).to.be.closeTo(0.1, TOLERANCE)
      expect(panelEl.parentNode).to.equal(scene)
      expect(bottom(panelEl)).to.be.closeTo(top(boardEl), TOLERANCE)
      done()
    })
  })
  
  let xOf = el => el.object3D.position.x
  let widthOf = au.world.width
    
  it('should add two panels onto a square board by even split left and right i.e. vary in x', (done) => {
    
    // overarching test for sharing placement on something
    
    table.addEventListener('loaded', () => {
      let board = model.board('board')
      let panel = board.panel('panel1')
      let panel2 = board.panel('panel2')
      model.render(scene, table, [])
    })
    
    afterDoubleTick(() => {
      let boardEl = select('#board')
      let panelEl = select('#panel1')
      let panel2El = select('#panel2')

      expect(shape(panelEl)).to.equal('box')
      expect(height(panelEl)).to.be.closeTo(0.1, TOLERANCE)
      expect(panelEl.parentNode).to.equal(scene)
      expect(bottom(panelEl)).to.be.closeTo(top(boardEl), TOLERANCE)

      expect(xOf(panelEl)).to.be.closeTo(xOf(table) - widthOf(table) / 4, TOLERANCE)
      expect(xOf(panel2El)).to.be.closeTo(xOf(table) + widthOf(table) / 4, TOLERANCE)
      done()
    })
  })

  
  describe('rendering with style', () => {
    it('should add a rectangular panel directly onto a board', (done) => {
      table.addEventListener('loaded', () => {
        let board = model.board('board')
        let panel = board.panel('the-panel')
        let styles = [
          {
            selector: { class: 'board' },
            declaration: { height: 0.2 }
          },
          {
            selector: { class: 'panel' },
            declaration: { height: 0.3 }
          }
        ]
        model.render(scene, table, styles)
      })
      
      afterDoubleTick(() => {
        let boardEl = select('.board')
        let panelEl = select('.panel')

        expect(height(boardEl)).to.be.closeTo(0.2, TOLERANCE)
        expect(height(panelEl)).to.be.closeTo(0.3, TOLERANCE)
        expect(bottom(panelEl)).to.be.closeTo(top(boardEl), TOLERANCE)
        done()
      })
    })    
  })
})