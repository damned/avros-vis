/* global AFRAME Model */
var chai = chai || {}
var expect = chai.expect

describe('model', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive
  const height = el => parseFloat(el.getAttribute('height'))
  const select = selector => document.querySelector(selector)
  const top = el => {
    return parseFloat(el.object3D.position.y) + height(el)/ 2 
  }

  let table, builder

  beforeEach(() => {
    table = document.querySelector('#table')
    table.innerHTML = ''
  })
    
  let afterTick = handler => {
    setTimeout(handler, 0)
  }
  
  it('should add a rectangular board onto tabletop', (done) => {
    let board = Model(table).board('first-board')
    
    afterTick(() => {
      let boardEl = select('#first-board')

      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(boardEl.parentNode).to.equal(table)
      
      done()
    })
  })

  it('should add a rectangular panel directly onto a board', (done) => {
    let board = Model(table).board('board')
    let panel = board.panel('the-panel')
    
    afterTick(() => {
      let boardEl = select('#board')
      let panelEl = select('#the-panel')

      expect(shape(panelEl)).to.equal('box')
      expect(height(panelEl)).to.equal(0.1)
      expect(top(panelEl)).to.equal(top(boardEl) + height(panelEl))
      done()
    })
  })
})