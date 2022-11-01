/* global AFRAME au */

function hasTouchEventsSuppressedAsWorkaroundForCollisionAfterRemoval(touched) {
  return touched.hasAttribute('touch-event-suppression')
}

// TODO this thing is separate to toucher because of the hand-model-parent-child thing
// should really merge back together
AFRAME.registerComponent('touch-source', {
  init: function() {
    let self = this
    let host = self.el
    let side = host.getAttribute('hand-side')
    let touchStartHandlers = []
    self.touchStart = function(touched) {
      if (hasTouchEventsSuppressedAsWorkaroundForCollisionAfterRemoval(touched)) {
        return
      }
      
      // au.log('touch', 'i am a toucher and i touched a: ' + touched.tagName)
      touchStartHandlers.forEach((handler) => {
        handler(touched)
      })
    }
    self.onTouchStart = function(handler) {
      touchStartHandlers.push(handler)
    }
  }
});
