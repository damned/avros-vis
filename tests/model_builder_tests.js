/* global AFRAME ModelBuilder */
var chai = chai || {}
var expect = chai.expect

describe('model builder', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let table, builder

  beforeEach(() => {
    table = document.querySelector('#table')
    table.innerHTML = ''
  })
    
  it('should add a rectangular board onto tabletop', (done) => {
    builder = ModelBuilder(table).addBoard('first-board').build()
    
    let board = document.querySelector('#first-board')

    expect(board.getAttribute('height')).to.equal('0.1')
    expect(board.object3D.parent.el) == table
  })
})