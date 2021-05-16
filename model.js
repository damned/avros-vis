/* global THREE */
const propertyValueForClass = (styles, classname, propertyname) => {
  let match = styles.find(style => style.selector.class == classname)
  if (match !== undefined) {
    let value = match.declaration[propertyname]
    console.log('property value', value)
    return value
  }
  return null
}

const boundsOfEl = el => {
  let mesh = el.getObject3D('mesh')
  let bbox =new THREE.Box3().setFromObject(mesh)
  console.log(JSON.stringify(bbox))
  return bbox
}
const heightOfEl = el => {
  let bbox = boundsOfEl(el)
  return bbox.max.y - bbox.min.y
}
const topOfEl = el => boundsOfEl(el).max.y
const bottomOfEl = el => boundsOfEl(el).min.y
function afterCreation(fn) {
  setTimeout(() => {
    fn()
  }, 0)  
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

var Board = function(name, type) {
  const self = {}

  let children = []
  
  self.panel = (panelName) => {
    let panel = Panel(panelName, self)
    children.push(panel)
    return panel
  }
  
  const renderSelf = (parent, styles) => {
    let height = propertyValueForClass(styles, type, 'height') || 0.1
    let halfHeight = height / 2
    self.halfHeight = halfHeight
    let parentPos = parent.object3D.position

    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', type)
    el.setAttribute('color', 'blue')
    el.setAttribute('height', '' + height)
    
    el.setAttribute('position', `0 ${heightOfEl(parent) / 2 + halfHeight} 0`)
    return el    
  }
  
  self.render = (parent, styles) => {
    self.el = renderSelf(parent, styles)
    afterCreation(() => {
      children.forEach(child => {
        parent.appendChild(child.render(styles))
      })
    })
    return self.el
  }
  
  self.position = () => self.el.object3D.position
  self.top = () => topOfEl(self.el)
  
  return self
}

var Model = function() {
  let self = {}
  
  let board
  
  self.board = (name) => {
    board = Board(name, 'board')
    return board
  }
  
  self.render = (baseEl, styles) => {
    baseEl.appendChild(board.render(baseEl, styles))
  }
  
  return self
}