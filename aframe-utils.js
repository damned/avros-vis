/* global THREE arguments */
var aframeUtils = aframeUtils || {}

aframeUtils.tick = fn => {
  setTimeout(() => {
    fn()
  }, 50)  
}
aframeUtils.afterCreation = aframeUtils.tick

aframeUtils.doubleTick = handler => aframeUtils.tick(() => {
  aframeUtils.tick(() => {
    handler()
  })
})


aframeUtils.world = {}

aframeUtils.world.bounds = el => {
  let log = aframeUtils.log
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

aframeUtils.world.height = el => {
  let bbox = aframeUtils.world.bounds(el)
  return bbox.max.y - bbox.min.y
}
aframeUtils.world.width = el => {
  let bbox = aframeUtils.world.bounds(el)
  return bbox.max.x - bbox.min.x
}

aframeUtils.world.top = el => aframeUtils.world.bounds(el).max.y

aframeUtils.world.bottom = el => aframeUtils.world.bounds(el).min.y

aframeUtils.ANCHOR_BOTTOM_MIDDLE = {x:50, y:0, z:50}

aframeUtils.world.placeByAnchor = (anchorSpec, el, position) => {
  if (anchorSpec != aframeUtils.ANCHOR_BOTTOM_MIDDLE) {
    throw new Error('Currently only support ANCHOR_BOTTOM_MIDDLE ({x: 50, y: 0, z: 50})')
  }
  el.object3D.
}

aframeUtils.world.anchorPoint = (anchorSpec, el) => {
  let position = el.object3D.getWorldPosition(new THREE.Vector3())

  let box = new THREE.Box3()
  let size = box.setFromObject(el.object3D).getSize(new THREE.Vector3())

  let axisOffset = axis => (anchorSpec[axis] - 50) * size[axis] / 100
  
  let anchor = new THREE.Vector3(position.x + axisOffset('x'),
                                 position.y + axisOffset('y'),
                                 position.z + axisOffset('z'))
  return anchor
}

aframeUtils.xyzTriplet = xyz => `${xyz.x} ${xyz.y} ${xyz.z}`


aframeUtils.catching = (fn) => {
  try {
    fn();
  } catch (e) {
    console.log("caught exception in catching", e);
  }
}


aframeUtils.log = function() {
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
aframeUtils.log.logImpl = console.log
aframeUtils.log.active = true

aframeUtils.earliestAncestor = (el) => {
  let earliest = el
  while (earliest.parentNode && earliest.parentNode.tagName !== 'A-SCENE') {
    earliest = earliest.parentNode
  }
  return earliest
}