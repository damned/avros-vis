/* global THREE arguments */
var aframeUtils = aframeUtils || {}
var au = aframeUtils

au.tick = fn => {
  setTimeout(() => {
    fn()
  }, 50)  
}
au.afterCreation = au.tick

au.doubleTick = handler => au.tick(() => {
  au.tick(() => {
    handler()
  })
})


au.world = {}

au.world.bounds = el => {
  let log = au.log
  let mesh = el.getObject3D('mesh')
  log(() => 'el loaded ' + el.hasLoaded)
  log(() => 'el position ' + JSON.stringify(el.getAttribute('position')))
  log(() => 'el object3d matrix ' + JSON.stringify(el.object3D.matrix))
  log(() => 'el object3d world matrix ' + JSON.stringify(el.object3D.matrixWorld))
  log(() => 'mesh matrix' + JSON.stringify(mesh.matrix))
  log(() => 'mesh world matrix' + JSON.stringify(mesh.matrixWorld))
  mesh.updateMatrix();
  mesh.geometry.applyMatrix4(mesh.matrix);
  let bbox = new THREE.Box3().setFromObject(mesh);
  return bbox
}

au.world.height = el => {
  let bbox = au.world.bounds(el)
  return bbox.max.y - bbox.min.y
}
au.world.width = el => {
  let bbox = au.world.bounds(el)
  return bbox.max.x - bbox.min.x
}

au.world.top = el => au.world.bounds(el).max.y

au.world.bottom = el => au.world.bounds(el).min.y

au.ANCHOR_BOTTOM_MIDDLE = {x:50, y:0, z:50}

au.world.placeByAnchor = (anchorSpec, el, position) => {
  if (anchorSpec != au.ANCHOR_BOTTOM_MIDDLE) {
    throw new Error('Currently only support ANCHOR_BOTTOM_MIDDLE ({x: 50, y: 0, z: 50})')
  }
  let y = position.y + au.getEntitySize(el).y / 2
  el.object3D.position.set(position.x, 
                           y, 
                           position.z)
}

au.getEntitySize = el => {
  let box = new THREE.Box3()
  return box.setFromObject(el.object3D).getSize(new THREE.Vector3())
}

au.world.anchorPoint = (anchorSpec, el) => {
  let position = el.object3D.getWorldPosition(new THREE.Vector3())

  let size = au.getEntitySize(el)

  let axisOffset = axis => (anchorSpec[axis] - 50) * size[axis] / 100
  
  let anchor = new THREE.Vector3(position.x + axisOffset('x'),
                                 position.y + axisOffset('y'),
                                 position.z + axisOffset('z'))
  return anchor
}

au.xyzTriplet = xyz => `${xyz.x} ${xyz.y} ${xyz.z}`


au.catching = (fn) => {
  try {
    fn();
  } catch (e) {
    console.log("caught exception in catching", e);
  }
}


au.log = function() {
  let self = arguments.callee
  if (self.active == false) {
    return;
  }
  let args = [...arguments]
  if (args.length == 1) {
    let singleArgType = typeof(args[0])
    if (singleArgType === 'function') {
      let lazyLogItems = args[0]()
      args = Array.isArray(lazyLogItems) ? [...lazyLogItems] : [lazyLogItems]
    }
  }
  self.logImpl.apply(this, args)
}
au.log.logImpl = console.log
au.log.active = true

au.earliestAncestor = (el) => {
  let earliest = el
  while (earliest.parentNode && earliest.parentNode.tagName !== 'A-SCENE') {
    earliest = earliest.parentNode
  }
  return earliest
}

au.onceLoaded = (entity, handler) => {
  if (entity.hasLoaded) {
    handler(entity)
  }
  else {
    entity.addEventListener('loaded', () => {
      handler(entity) 
    })
  }
}

au.attributeHtml = (properties) => {
  return Object.keys(properties).map(key => `${key}: ${properties[key]}`).join('; ')
}

au.attributeValue = (value) => {
  if (typeof(value) == 'object') {
    return au.attributeHtml(value)
  }
  return value
}

au.entityHtml = (entity, attributes) => {
  let attribString = Object.keys(attributes).map(key => {
    return `${key}="${au.attributeValue(attributes[key])}"`
  }).join(' ')
  return '<' + entity + ' ' + attribString + '></' + entity + '>'
}

au.addHtmlTo = (parent, tag) => {
  parent.insertAdjacentHTML(au.entityHtml(tag))
  return parent.children
}
