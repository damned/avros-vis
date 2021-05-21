/* global AFRAME THREE aframeUtils */
var chai = chai || {}
var expect = chai.expect
var au = aframeUtils

var TOLERANCE = 0.001

describe('placement component', () => {
  const aframeContainer = document.getElementById('aframe-container')
  const shape = el => el.components['geometry'].data.primitive
  const bounds = au.world.bounds
  const height = au.world.height
  const select = selector => document.querySelector(selector)
  const top = au.world.top
  const bottom = au.world.bottom

  let entity, table

  beforeEach(() => {
    aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;">' + 
                                  '<a-box id="table" position="0 0.6 -1.2" color="darkgray" height="1">' + 
                                '</a-scene>'

    table = document.querySelector('#table')
    table.innerHTML = ''
  })
      
  let afterTick = au.tick
  let afterDoubleTick = au.doubleTick
  
  it('should place its host entity', (done) => {
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
})