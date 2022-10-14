/* global THREE arguments _ */
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
au.world.depth = el => {
  let bbox = au.world.bounds(el)
  return bbox.max.z - bbox.min.z
}

au.world.top = el => au.world.bounds(el).max.y

au.world.bottom = el => au.world.bounds(el).min.y

au.getEntitySize = el => { // world space if world transforms up to date
  let box = new THREE.Box3()
  return box.setFromObject(el.object3D).getSize(new THREE.Vector3())
}

au.ANCHOR_BOTTOM_MIDDLE = {x:50, y:0, z:50}
au.ANCHOR_BOTTOM_MIDDLE_SERIALIZED = JSON.stringify(au.ANCHOR_BOTTOM_MIDDLE)

const _au_resizeToConstraints = (object3d, sizeConstraints, marginPercent, worldSize, worldScale) => {
  if (sizeConstraints) {
    let xConstraintWithMargin = sizeConstraints.x * (1 - 2 * marginPercent / 100)
    if (worldSize.x != xConstraintWithMargin) {
      let scaleChangeFactor = xConstraintWithMargin / worldSize.x //((100 - marginPercent - marginPercent) * sizeConstraints.x) / (worldSize.x * 100)
      au.log('updating local scale for x constraint, scale factor: ', scaleChangeFactor)
      au.log('before scale change, worldScale: ', JSON.stringify(worldScale))
      object3d.scale.multiplyScalar(scaleChangeFactor)
      object3d.getWorldScale(worldScale) // implicit world matrix update
      au.log('updated scale for x constraint, updated worldScale: ', JSON.stringify(worldScale))
    }
  }
}

au.world.placeByAnchor = (anchorSpec, el, position, sizeConstraints, marginPercent = 0) => {
  if (JSON.stringify(anchorSpec) != au.ANCHOR_BOTTOM_MIDDLE_SERIALIZED) {
    throw new Error('Currently only support ANCHOR_BOTTOM_MIDDLE ({x: 50, y: 0, z: 50})')
  }
  
  if (sizeConstraints) {
    if (!_.isEqual(_.keys(sizeConstraints), ['x'])) {
      throw Error('sizeConstraints not supported - only supported in x')      
    }
  }
  
  let object3d = el.object3D
  let worldScale = object3d.getWorldScale(new THREE.Vector3()) // implicit world matrix update
  let worldSize = au.getEntitySize(el)
  au.log('world size', worldSize)
  
  _au_resizeToConstraints(object3d, sizeConstraints, marginPercent, worldSize, worldScale) 
  
  worldSize = au.getEntitySize(el)
  
  let targetPos = new THREE.Vector3(position.x, 
                                    position.y + worldSize.y / 2, 
                                    position.z)
    
  au.log('targetPos world', targetPos)
  object3d.parent.worldToLocal(targetPos)  
  au.log('targetPos local', targetPos)
  
  object3d.position.copy(targetPos)
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

au.xyzTriplet = xyz => xyz ? `${xyz.x} ${xyz.y} ${xyz.z}` : '-undefined-'


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
  if (self.includeCaller) {
    const callerStackOffset = 2
    let caller = new Error().stack.split('\n')[callerStackOffset]
    args.push('\n...' + caller)
  }
  self.logImpl.apply(this, args)
}
au.log.logImpl = console.log
au.log.active = true
au.log.includeCaller = false

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

au.addEntityTo = (parent, entity, attributes = {}) => {
  parent.insertAdjacentHTML('beforeend', au.entityHtml(entity, attributes))
  return parent.children[parent.children.length - 1]
}
au.entity = au.addEntityTo