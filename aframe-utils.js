var aframeUtils = aframeUtils || {}

aframeUtils.afterCreation = fn => {
  setTimeout(() => {
    fn()
  }, 0)  
}
