/* global AFRAME THREE Model aframeUtils */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('model', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive
  const bounds = au.world.bounds
  const height = au.world.height
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom

  let model, table, builder

  beforeEach(() => {
    aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;">' + 
                                  '<a-box id="table" position="0 0.6 -1.2" color="darkgray" height="1">' + 
                                '</a-scene>'

    table = document.querySelector('#table')
    table.innerHTML = ''
    model = Model()
  })
      
  let afterTick = au.tick
  let afterDoubleTick = au.doubleTick
  
  xit('should add a rectangular board onto tabletop object', (done) => {
    table.addEventListener('loaded', () => {
      let board = model.board('first-board')
      model.render(table, [])
    })
    
    afterDoubleTick(() => {
      let boardEl = select('#first-board')
      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(height(boardEl)).to.be.closeTo(0.1, 0.01)
      expect(boardEl.parentNode).to.equal(table)
      expect(bottom(boardEl)).to.be.closeTo(top(table), TOLERANCE)
      done()
    })
  })

  it('should add a rectangular panel directly onto a board', (done) => {
    table.addEventListener('loaded', () => {
      let board = model.board('board')
      let panel = board.panel('the-panel')
      model.render(table, [])
    })
    
    afterDoubleTick(() => {
      let boardEl = select('#board')
      let panelEl = select('#the-panel')

      expect(shape(panelEl)).to.equal('box')
      console.log(bounds(panelEl))      
      expect(height(panelEl)).to.be.closeTo(0.1, TOLERANCE)
      expect(panelEl.parentNode).to.equal(table)
      console.log(bounds(boardEl))
      console.log(bounds(panelEl))
      // expect(bottom(panelEl)).to.be.closeTo(top(boardEl), TOLERANCE)
      done()
    })
  })
  
  xdescribe('rendering with style', () => {
    xit('should add a rectangular panel directly onto a board', (done) => {
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
      model.render(table, styles)

      afterTick(() => {
        let boardEl = select('.board')
        let panelEl = select('.panel')

        expect(height(boardEl)).to.equal(0.2)
        expect(height(panelEl)).to.equal(0.3)
        expect(top(panelEl)).to.equal(top(boardEl) + height(panelEl))
        done()
      })
    })
    
  })
})