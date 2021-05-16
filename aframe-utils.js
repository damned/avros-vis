/* global THREE */
var aframeUtils = aframeUtils || {}

aframeUtils.tick = fn => {
  setTimeout(() => {
    fn()
  }, 0)  
}
aframeUtils.afterCreation = aframeUtils.tick

aframeUtils.world = {}
aframeUtils.world.bounds = el => {
  let mesh = el.getObject3D('mesh')
  let bbox =new THREE.Box3().setFromObject(mesh)
  console.log(JSON.stringify(bbox))
  return bbox
}
aframeUtils.world.height = el => {
  let bbox = aframeUtils.world.bounds(el)
  return bbox.max.y - bbox.min.y
}
aframeUtils.world.top = el => aframeUtils.world.bounds(el).max.y
aframeUtils.world.bottom = el => aframeUtils.world.bounds(el).min.y
