/* global AFRAME */
AFRAME.registerComponent('move-handles', {
  schema: {
    extent: {type: 'number', default: 5 },
    gap: {type: 'number', default: 1 },
    height: {type: 'number', default: 1 },
    size: {type: 'number', default: 0.2 },
    grabSize: {type: 'number', default: 0.12 }
  },
  init: function() {
    let self = this
    let host = self.el

    let handleCount
    let extent
    let gap
    let offset
    let height
    let size
    let grabSize

    self.update = () => {
      extent = self.data.extent
      gap = self.data.gap
      height = self.data.height
      size = self.data.size
      grabSize = self.data.grabSize
      offset = -Math.floor(extent / 2) * gap

      // todo: move some of this to move-handle
      handleCount = extent * extent
      for (let i = 0; i < handleCount; i++) {
        $(`<a-box opacity="0" user-move-handle width="${grabSize}" height="${grabSize}" depth="${grabSize}">`
          + `<a-image opacity="0.3" rotation="90 0 0" width="${size}" height="${size}" src="#four-way-arrow"></a-image>`
          + `</a-box>`).appendTo(host)
      }
      host.setAttribute('layout', `type: box; columns: ${extent}; margin: ${gap}; plane: xz`)
      host.setAttribute('position', `${offset} ${height} ${offset}`)
    }
  },
})