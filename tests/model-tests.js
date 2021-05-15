/* global AFRAME Model */
var chai = chai || {}
var expect = chai.expect

describe('model', () => {
  const aframeContainer = document.getElementById('aframe-container')

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

      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(boardEl.parentNode) == table
      done()
    })
  })
})