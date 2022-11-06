/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplayBuilder = function(loader) {
  const self = this
  const api = {}

  function createNode(rootEl, nodeId, i) {
    const length = 0.1
    rootEl.insertAdjacentHTML('beforeend',
      `<a-box id="${nodeId}" balloon-label="label: ${nodeId}"`
      + ` position="0 0 -${i * 2 * length}"`
      + ` width="${length}" height="${length}" depth="${length}" ></a-box>`)
  }

  api.build = rootEl => {
    const graph = loader()
    graph.nodes.forEach((nodeId, i) => {
      createNode(rootEl, nodeId, i);
    });
  }

  return api
}