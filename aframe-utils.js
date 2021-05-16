var aframeUtils = aframeUtils || {}

aframeUtils.tick = fn => {
  setTimeout(() => {
    fn()
  }, 0)  
}
aframeUtils.afterCreation = aframeUtils.tick

aframeUtils.world = {}
aframeUtils.world.top = 