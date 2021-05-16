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

  let model, table, builder

  beforeEach(() => {
    table = document.querySelector('#table')
    table.innerHTML = ''
    model = Model()
  })
    
  let afterTick = handler => {
    setTimeout(handler, 0)
  }
  
  it('should add a rectangular board onto tabletop', (done) => {
    let board = model.board('first-board')
    model.render(table, [])
    
    afterTick(() => {
      let boardEl = select('#first-board')

      expect(shape(boardEl)).to.equal('box')
      expect(boardEl.getAttribute('height')).to.equal('0.1')
      expect(boardEl.parentNode).to.equal(table)
      expect(top(boardEl)).to.equal(top(table) + height(boardEl))
      
      done()
    })
  })

  it('should add a rectangular panel directly onto a board', (done) => {
    let board = model.board('board')
    let panel = board.panel('the-panel')
    model.render(table, [])
    
    afterTick(() => {
      let boardEl = select('#board')
      let panelEl = select('#the-panel')

      expect(shape(panelEl)).to.equal('box')
      expect(height(panelEl)).to.equal(0.1)
      expect(panelEl.parentNode).to.equal(table)
      expect(top(panelEl)).to.equal(top(boardEl) + height(panelEl))
      done()
    })
  })
  
  describe('rendering with style', () => {
    it('should add a rectangular panel directly onto a board', (done) => {
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