
const propertyForClass = (styles, classname, propertyname) => {
  styles.forEach(style => {
    if (style.selector == '.' + classname) {
      return style.declaration[propertyname]
    }
  })
  return null
}

var Panel = function(name, base) {
  let self = {}
  
  
  self.render = (styles) => {
    let height = propertyForClass(styles, 'panel', 'height') || 0.1
    let halfHeight = height / 2
    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', 'panel')
    el.setAttribute('color', 'pink')
    el.setAttribute('height', height)
    let basePos = base.position()
    el.setAttribute('position', `${basePos.x} ${base.top() + halfHeight} ${basePos.z}`)
    self.el = el
    return el
  }
  
  return self
}

var Board = function(name) {
  const self = {}

  let halfHeight = 0.05
  let height = halfHeight * 2
  
  let children = []
  
  self.panel = (panelName) => {
    let panel = Panel(panelName, self)
    children.push(panel)
    return panel
  }
  
  const renderSelf = () => {
    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', 'board')
    el.setAttribute('color', 'blue')
    el.setAttribute('height', height)
    return el    
  }
  
  self.render = (parent, styles) => {
    self.el = renderSelf()
    children.forEach(child => {
      parent.appendChild(child.render(styles))
    })
    return self.el
  }
  
  self.position = () => self.el.object3D.position
  self.top = () => self.position().y + halfHeight
  
  return self
}

var Model = function() {
  let self = {}
  
  let board
  
  self.board = (name) => {
    board = Board(name)
    return board
  }
  
  self.render = (baseEl, styles) => {
    baseEl.appendChild(board.render(baseEl, styles))
  }
  
  return self
}