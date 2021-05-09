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
    builder = ModelBuilder().addBoard('base').buildOnto(table)
    
    let baseBoard = document.querySelector('#base')

    expect(baseBoard.getAttribute('height')).to.equal('0.1')
    expect(baseBoard.el.parent) == table
  })
})