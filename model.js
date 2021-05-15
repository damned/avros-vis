
const propertyValueForClass = (styles, classname, propertyname) => {
  let match = styles.find(style => style.selector.class == classname)
  if (match !== undefined) {
    let value = match.declaration[propertyname]
    console.log('property value', value)
    return value
  }
  return null
}

var Panel = function(name, base) {
  let self = {}
  
  
  self.render = (styles) => {
    let height = propertyValueForClass(styles, 'panel', 'height') || 0.1
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

  let children = []
  
  self.panel = (panelName) => {
    let panel = Panel(panelName, self)
    children.push(panel)
    return panel
  }
  
  const renderSelf = (styles) => {
    let height = propertyValueForClass(styles, 'board', 'height') || 0.1
    let halfHeight = height / 2
    self.halfHeight = halfHeight

    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', 'board')
    el.setAttribute('color', 'blue')
    el.setAttribute('height', '' + height)
    return el    
  }
  
  self.render = (parent, styles) => {
    self.el = renderSelf(styles)
    children.forEach(child => {
      parent.appendChild(child.render(styles))
    })
    return self.el
  }
  
  self.position = () => self.el.object3D.position
  self.top = () => self.position().y + self.halfHeight
  
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