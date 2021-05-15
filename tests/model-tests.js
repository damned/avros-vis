/* global AFRAME Model */
var chai = chai || {}
var expect = chai.expect

describe('model', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive

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
      let boardEl = document.querySelector('#first-board')

      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(boardEl.parentNode) == table
      done()
    })
  })

  it('should add a rectangular panel directly onto a board', (done) => {
    let board = Model(table).board('board')
    let panel = board.panel('the-panel')
    
    afterTick(() => {
      let boardEl = document.querySelector('#board')
      let panelEl = document.querySelector('#the-panel')

      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(boardEl.parentNode) == table
      done()
    })
  })
})