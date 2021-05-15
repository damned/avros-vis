
var Panel = function(name, base) {
  let self = {}
  
  let halfHeight = 0.05
  let height = halfHeight * 2
  
  self.render = () => {
    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('color', 'pink')
    el.setAttribute('height', height)
    let basePos = base.position()
    el.setAttribute('position', `${basePos.x} ${base.top() + halfHeight} ${basePos.z}`)
    self.el = el
    return el
  }
  
  return self
}

var Board = function(name, parent) {
  let self = {}

  let halfHeight = 0.05
  let height = halfHeight * 2

  let el = document.createElement('a-box')
  el.setAttribute('id', name)
  el.setAttribute('color', 'blue')
  el.setAttribute('height', height)
  
  self.panel = (panelName) => {
    let panel = Panel(panelName, self)
    parent.appendChild(panel.el)
    return panel
  }
  
  self.render = (parent) => {
    
  }
  
  self.el = el
  self.position = () => el.object3D.position
  self.top = () => self.position().y + halfHeight
  
  return self
}

var Model = function(baseEl) {
  let self = {}
  
  self.board = function(name) {
    let board = Board(name, baseEl)
    baseEl.appendChild(board.el)
    return board
  }
  
  return self
}