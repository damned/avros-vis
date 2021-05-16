/* global THREE */
var aframeUtils = aframeUtils || {}

aframeUtils.tick = fn => {
  setTimeout(() => {
    fn()
  }, 0)  
}
aframeUtils.doubleTick = handler => aframeUtils.tick(() => {
  aframeUtils.tick(() => {
    handler()
  })
})
aframeUtils.afterCreation = aframeUtils.tick

aframeUtils.world = {}
aframeUtils.world.bounds = el => {
  // let mesh = el.getObject3D('mesh')
  // let bbox = new THREE.Box3().setFromObject(mesh)  

  el.object3D.updateMatrix(); 
  el.object3D.geometry.applyMatrix(el.object3D.matrix);
  bbox = new THREE.Box3().setFromObject(el.object3D);

  
  return bbox
}
aframeUtils.world.height = el => {
  let bbox = aframeUtils.world.bounds(el)
  return bbox.max.y - bbox.min.y
}
aframeUtils.world.top = el => aframeUtils.world.bounds(el).max.y
aframeUtils.world.bottom = el => aframeUtils.world.bounds(el).min.y
